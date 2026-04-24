import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockCognitoSend } = vi.hoisted(() => ({
  mockCognitoSend: vi.fn(),
}));

vi.mock('@aws-sdk/client-cognito-identity-provider', () => {
  return {
    CognitoIdentityProviderClient: class { send = mockCognitoSend; },
    ListUsersCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'ListUsers' }); } },
    AdminLinkProviderForUserCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'AdminLinkProviderForUser' }); } },
  };
});

import { handler } from './handler';

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    version: '1',
    region: 'ap-southeast-1',
    userPoolId: 'test-pool',
    userName: 'Google_123456789',
    callerContext: {
      awsSdkVersion: '1',
      clientId: 'test-client',
    },
    triggerSource: 'PreSignUp_ExternalProvider' as const,
    request: {
      userAttributes: {
        email: 'test@example.com',
        email_verified: 'true',
      },
      validationData: {},
      clientMetadata: {},
    },
    response: {
      autoConfirmUser: false,
      autoVerifyPhone: false,
      autoVerifyEmail: false,
    },
    ...overrides,
  };
}

describe('preSignUp handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---- Pass through non-federated ----

  it('passes through non-federated sign-ups unchanged', async () => {
    const event = makeEvent({ triggerSource: 'PreSignUp_SignUp' });

    const result = await handler(event as any, {} as any, () => {});

    expect(result).toEqual(event);
    expect(mockCognitoSend).not.toHaveBeenCalled();
  });

  // ---- Email verification ----

  it('rejects unverified social email', async () => {
    const event = makeEvent({
      request: {
        userAttributes: { email: 'bad@test.com', email_verified: 'false' },
        validationData: {},
        clientMetadata: {},
      },
    });

    await expect(handler(event as any, {} as any, () => {})).rejects.toThrow(
      'Email not verified by social provider'
    );
  });

  it('rejects missing email', async () => {
    const event = makeEvent({
      request: {
        userAttributes: { email: '', email_verified: 'true' },
        validationData: {},
        clientMetadata: {},
      },
    });

    await expect(handler(event as any, {} as any, () => {})).rejects.toThrow(
      'No email provided'
    );
  });

  // ---- Account linking ----

  it('links social identity to existing user', async () => {
    mockCognitoSend.mockResolvedValueOnce({
      Users: [{ Username: 'existing-user-id' }],
    });
    mockCognitoSend.mockResolvedValueOnce({}); // link

    const event = makeEvent({
      userName: 'Google_abc123',
    });

    const result = await handler(event as any, {} as any, () => {});

    expect(result!.response.autoConfirmUser).toBe(true);
    expect(result!.response.autoVerifyEmail).toBe(true);

    // Verify AdminLinkProviderForUser was called
    expect(mockCognitoSend).toHaveBeenCalledTimes(2);
    const linkCall = mockCognitoSend.mock.calls[1][0];
    expect(linkCall._type).toBe('AdminLinkProviderForUser');
    expect(linkCall.SourceUser.ProviderName).toBe('Google');
    expect(linkCall.SourceUser.ProviderAttributeValue).toBe('abc123');
  });

  it('links Apple identity correctly', async () => {
    mockCognitoSend.mockResolvedValueOnce({
      Users: [{ Username: 'existing-user-id' }],
    });
    mockCognitoSend.mockResolvedValueOnce({}); // link

    const event = makeEvent({
      userName: 'SignInWithApple_apple123',
    });

    const result = await handler(event as any, {} as any, () => {});

    const linkCall = mockCognitoSend.mock.calls[1][0];
    expect(linkCall.SourceUser.ProviderName).toBe('SignInWithApple');
    expect(linkCall.SourceUser.ProviderAttributeValue).toBe('apple123');
  });

  it('rejects unknown provider', async () => {
    mockCognitoSend.mockResolvedValueOnce({
      Users: [{ Username: 'existing' }],
    });

    const event = makeEvent({
      userName: 'Unknown_xyz',
    });

    await expect(handler(event as any, {} as any, () => {})).rejects.toThrow(
      'Unknown provider: Unknown'
    );
  });

  // ---- New social user ----

  it('auto-confirms new social user without linking', async () => {
    mockCognitoSend.mockResolvedValueOnce({ Users: [] }); // no existing user

    const event = makeEvent();

    const result = await handler(event as any, {} as any, () => {});

    expect(result!.response.autoConfirmUser).toBe(true);
    expect(result!.response.autoVerifyEmail).toBe(true);
    // Only ListUsers called, no link
    expect(mockCognitoSend).toHaveBeenCalledTimes(1);
  });
});
