import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDdbSend, mockCognitoSend } = vi.hoisted(() => ({
  mockDdbSend: vi.fn(),
  mockCognitoSend: vi.fn(),
}));

vi.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: class { send = mockDdbSend; },
    GetItemCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'GetItem' }); } },
    PutItemCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'PutItem' }); } },
    DeleteItemCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'DeleteItem' }); } },
    ScanCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'Scan' }); } },
    QueryCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'Query' }); } },
  };
});

vi.mock('@aws-sdk/client-cognito-identity-provider', () => {
  return {
    CognitoIdentityProviderClient: class { send = mockCognitoSend; },
    AdminAddUserToGroupCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'AdminAddUserToGroup' }); } },
  };
});

vi.mock('@aws-sdk/util-dynamodb', () => ({
  marshall: vi.fn((obj) => obj),
  unmarshall: vi.fn((obj) => obj),
}));

// Set env vars before import
process.env.USER_TABLE_NAME = 'test-users';
process.env.DISTRIBUTOR_TABLE_NAME = 'test-distributors';
process.env.USER_POOL_ID = 'test-pool-id';

import { handler } from './handler';

describe('createUser handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---- Role whitelist ----

  it('rejects ADMIN role', async () => {
    await expect(
      handler({
        arguments: {
          email: 'admin@test.com',
          role: 'ADMIN',
          firstName: 'A',
          lastName: 'B',
          countries: ['TH'],
        },
      })
    ).rejects.toThrow('Invalid role. Only DISTRIBUTOR or AFFILIATE allowed.');
  });

  it('rejects unknown role', async () => {
    await expect(
      handler({
        arguments: {
          email: 'x@test.com',
          role: 'SUPERUSER',
          firstName: 'A',
          lastName: 'B',
          countries: ['TH'],
        },
      })
    ).rejects.toThrow('Invalid role');
  });

  // ---- Caller verification ----

  it('rejects mismatched caller email', async () => {
    await expect(
      handler({
        arguments: {
          email: 'victim@test.com',
          role: 'DISTRIBUTOR',
          firstName: 'A',
          lastName: 'B',
          countries: ['TH'],
        },
        identity: { claims: { email: 'attacker@test.com' } },
      })
    ).rejects.toThrow('Caller email does not match');
  });

  it('allows when caller email matches', async () => {
    // User doesn't exist yet
    mockDdbSend.mockResolvedValueOnce({ Item: undefined });
    // Scan for unique distributorId
    mockDdbSend.mockResolvedValueOnce({ Items: [] });
    // Create Distributor
    mockDdbSend.mockResolvedValueOnce({});
    // Create User
    mockDdbSend.mockResolvedValueOnce({});
    // Cognito group
    mockCognitoSend.mockResolvedValueOnce({});

    const result = await handler({
      arguments: {
        email: 'match@test.com',
        role: 'DISTRIBUTOR',
        firstName: 'A',
        lastName: 'B',
        countries: ['TH'],
      },
      identity: { claims: { email: 'match@test.com' } },
    });

    expect(result.email).toBe('match@test.com');
    expect(result.role).toBe('DISTRIBUTOR');
  });

  it('skips caller verification for IAM callers (no identity)', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined }); // no existing user
    mockDdbSend.mockResolvedValueOnce({ Items: [] }); // unique code
    mockDdbSend.mockResolvedValueOnce({}); // create distributor
    mockDdbSend.mockResolvedValueOnce({}); // create user
    mockCognitoSend.mockResolvedValueOnce({}); // group

    const result = await handler({
      arguments: {
        email: 'iam@test.com',
        role: 'DISTRIBUTOR',
        firstName: 'A',
        lastName: 'B',
        countries: ['TH'],
      },
      // No identity — IAM caller
    });

    expect(result.email).toBe('iam@test.com');
  });

  // ---- Idempotent check ----

  it('rejects duplicate user', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: { email: 'dup@test.com' } });

    await expect(
      handler({
        arguments: {
          email: 'dup@test.com',
          role: 'DISTRIBUTOR',
          firstName: 'A',
          lastName: 'B',
          countries: ['TH'],
        },
      })
    ).rejects.toThrow('User already exists');
  });

  // ---- Distributor flow ----

  it('creates distributor with PENDING status and null inviteCode', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined }); // no existing
    mockDdbSend.mockResolvedValueOnce({ Items: [] }); // unique distributorId
    mockDdbSend.mockResolvedValueOnce({}); // create Distributor
    mockDdbSend.mockResolvedValueOnce({}); // create User
    mockCognitoSend.mockResolvedValueOnce({}); // group

    const result = await handler({
      arguments: {
        email: 'dist@test.com',
        role: 'DISTRIBUTOR',
        firstName: 'John',
        lastName: 'Doe',
        countries: ['TH', 'SG'],
      },
    });

    expect(result.role).toBe('DISTRIBUTOR');
    expect(result.inviteCode).toBeNull();
    expect(result.parentEmail).toBeNull();
    expect(result.depth).toBe(0);
    expect(result.distributorId).toBeTruthy();

    // Verify Cognito group assignment
    expect(mockCognitoSend).toHaveBeenCalledWith(
      expect.objectContaining({ GroupName: 'DISTRIBUTOR' })
    );
  });

  // ---- Affiliate flow ----

  it('rejects affiliate without inviteCode', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined }); // no existing

    await expect(
      handler({
        arguments: {
          email: 'aff@test.com',
          role: 'AFFILIATE',
          firstName: 'A',
          lastName: 'B',
          countries: ['TH'],
        },
      })
    ).rejects.toThrow('Invite code is required');
  });

  it('rejects affiliate with invalid inviteCode', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined }); // no existing
    mockDdbSend.mockResolvedValueOnce({ Items: [] }); // inviter not found

    await expect(
      handler({
        arguments: {
          email: 'aff@test.com',
          role: 'AFFILIATE',
          firstName: 'A',
          lastName: 'B',
          countries: ['TH'],
          inviteCode: 'badcode',
        },
      })
    ).rejects.toThrow('Invalid invite code');
  });

  it('rejects affiliate when distributor is not APPROVED', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined }); // no existing
    // Inviter found
    mockDdbSend.mockResolvedValueOnce({
      Items: [{ email: 'inviter@test.com', distributorId: 'dist123', depth: 0 }],
    });
    // Distributor is PENDING
    mockDdbSend.mockResolvedValueOnce({
      Item: { distributorId: 'dist123', status: 'PENDING' },
    });

    await expect(
      handler({
        arguments: {
          email: 'aff@test.com',
          role: 'AFFILIATE',
          firstName: 'A',
          lastName: 'B',
          countries: ['TH'],
          inviteCode: 'validcode',
        },
      })
    ).rejects.toThrow('Distributor is not approved');
  });

  it('creates affiliate with correct parentEmail, distributorId, depth', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined }); // no existing
    // Inviter found
    mockDdbSend.mockResolvedValueOnce({
      Items: [
        {
          email: 'inviter@test.com',
          distributorId: 'dist123',
          depth: 1,
          inviteCode: 'invitercode',
        },
      ],
    });
    // Distributor is APPROVED
    mockDdbSend.mockResolvedValueOnce({
      Item: { distributorId: 'dist123', status: 'APPROVED' },
    });
    // Unique inviteCode
    mockDdbSend.mockResolvedValueOnce({ Items: [] });
    // Create User
    mockDdbSend.mockResolvedValueOnce({});
    // Cognito group
    mockCognitoSend.mockResolvedValueOnce({});

    const result = await handler({
      arguments: {
        email: 'aff@test.com',
        role: 'AFFILIATE',
        firstName: 'Jane',
        lastName: 'Smith',
        countries: ['TH'],
        inviteCode: 'invitercode',
      },
    });

    expect(result.role).toBe('AFFILIATE');
    expect(result.parentEmail).toBe('inviter@test.com');
    expect(result.distributorId).toBe('dist123');
    expect(result.depth).toBe(2);
    expect(result.inviteCode).toBeTruthy();
    expect(result.inviteCode).not.toBeNull();

    expect(mockCognitoSend).toHaveBeenCalledWith(
      expect.objectContaining({ GroupName: 'AFFILIATE' })
    );
  });

  // ---- Rollback ----

  it('rolls back User and Distributor records on Cognito group failure', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined }); // no existing
    mockDdbSend.mockResolvedValueOnce({ Items: [] }); // unique distributorId
    mockDdbSend.mockResolvedValueOnce({}); // create Distributor
    mockDdbSend.mockResolvedValueOnce({}); // create User
    // Cognito group fails
    mockCognitoSend.mockRejectedValueOnce(new Error('Cognito error'));
    // Rollback deletes
    mockDdbSend.mockResolvedValueOnce({}); // delete User
    mockDdbSend.mockResolvedValueOnce({}); // delete Distributor

    await expect(
      handler({
        arguments: {
          email: 'fail@test.com',
          role: 'DISTRIBUTOR',
          firstName: 'A',
          lastName: 'B',
          countries: ['TH'],
        },
      })
    ).rejects.toThrow('Cognito error');

    // Verify DeleteItemCommand was called for rollback
    const deleteCalls = mockDdbSend.mock.calls.filter(
      (call) => call[0]._type === 'DeleteItem'
    );
    expect(deleteCalls.length).toBe(2);
  });
});
