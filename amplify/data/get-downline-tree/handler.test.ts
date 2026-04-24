import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDdbSend } = vi.hoisted(() => ({
  mockDdbSend: vi.fn(),
}));

vi.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: class { send = mockDdbSend; },
    GetItemCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'GetItem' }); } },
    ScanCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'Scan' }); } },
  };
});

vi.mock('@aws-sdk/util-dynamodb', () => ({
  marshall: vi.fn((obj) => obj),
  unmarshall: vi.fn((obj) => obj),
}));

process.env.USER_TABLE_NAME = 'test-users';

import { handler } from './handler';

describe('getDownlineTree handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---- Security ----

  it('rejects non-admin caller querying another user tree', async () => {
    await expect(
      handler({
        arguments: { rootEmail: 'other@test.com' },
        identity: {
          claims: { email: 'me@test.com', 'cognito:groups': ['DISTRIBUTOR'] },
        },
      })
    ).rejects.toThrow('You can only view your own downline tree');
  });

  it('allows admin to query any user tree', async () => {
    // Root user found
    mockDdbSend.mockResolvedValueOnce({
      Item: { email: 'other@test.com', distributorId: 'dist1' },
    });
    // All users in network
    mockDdbSend.mockResolvedValueOnce({ Items: [] });

    const result = await handler({
      arguments: { rootEmail: 'other@test.com' },
      identity: {
        claims: { email: 'admin@test.com', 'cognito:groups': ['ADMIN'] },
      },
    });

    expect(result).toEqual([]);
  });

  it('allows owner to query own tree', async () => {
    mockDdbSend.mockResolvedValueOnce({
      Item: { email: 'me@test.com', distributorId: 'dist1' },
    });
    mockDdbSend.mockResolvedValueOnce({ Items: [] });

    const result = await handler({
      arguments: { rootEmail: 'me@test.com' },
      identity: {
        claims: { email: 'me@test.com', 'cognito:groups': ['DISTRIBUTOR'] },
      },
    });

    expect(result).toEqual([]);
  });

  // ---- Tree traversal ----

  it('returns empty array for user with no children', async () => {
    mockDdbSend.mockResolvedValueOnce({
      Item: { email: 'root@test.com', distributorId: 'dist1' },
    });
    mockDdbSend.mockResolvedValueOnce({
      Items: [{ email: 'root@test.com', distributorId: 'dist1', parentEmail: null }],
    });

    const result = await handler({
      arguments: { rootEmail: 'root@test.com' },
      identity: { claims: { email: 'root@test.com' } },
    });

    expect(result).toEqual([]);
  });

  it('returns correct descendants for multi-level tree', async () => {
    const rootUser = {
      email: 'root@test.com',
      distributorId: 'dist1',
      parentEmail: null,
      depth: 0,
      role: 'DISTRIBUTOR',
    };
    const child1 = {
      email: 'child1@test.com',
      distributorId: 'dist1',
      parentEmail: 'root@test.com',
      depth: 1,
      firstName: 'Child',
      lastName: 'One',
      inviteCode: 'code1',
      countries: ['TH'],
      role: 'AFFILIATE',
    };
    const child2 = {
      email: 'child2@test.com',
      distributorId: 'dist1',
      parentEmail: 'root@test.com',
      depth: 1,
      firstName: 'Child',
      lastName: 'Two',
      inviteCode: 'code2',
      countries: ['SG'],
      role: 'AFFILIATE',
    };
    const grandchild = {
      email: 'grandchild@test.com',
      distributorId: 'dist1',
      parentEmail: 'child1@test.com',
      depth: 2,
      firstName: 'Grand',
      lastName: 'Child',
      inviteCode: 'code3',
      countries: ['US'],
      role: 'AFFILIATE',
    };

    mockDdbSend.mockResolvedValueOnce({ Item: rootUser });
    mockDdbSend.mockResolvedValueOnce({
      Items: [rootUser, child1, child2, grandchild],
    });

    const result = await handler({
      arguments: { rootEmail: 'root@test.com' },
      identity: { claims: { email: 'root@test.com' } },
    });

    expect(result).toHaveLength(3);
    expect(result.map((n: { email: string }) => n.email)).toEqual([
      'child1@test.com',
      'child2@test.com',
      'grandchild@test.com',
    ]);
    // Root is excluded
    expect(result.find((n: { email: string }) => n.email === 'root@test.com')).toBeUndefined();
  });

  it('scopes tree to affiliate subtree only', async () => {
    const child1 = {
      email: 'child1@test.com',
      distributorId: 'dist1',
      parentEmail: 'root@test.com',
      depth: 1,
      role: 'AFFILIATE',
    };
    const grandchild = {
      email: 'grandchild@test.com',
      distributorId: 'dist1',
      parentEmail: 'child1@test.com',
      depth: 2,
      firstName: 'G',
      lastName: 'C',
      inviteCode: 'gc',
      countries: ['TH'],
      role: 'AFFILIATE',
    };
    const sibling = {
      email: 'sibling@test.com',
      distributorId: 'dist1',
      parentEmail: 'root@test.com',
      depth: 1,
      role: 'AFFILIATE',
    };

    // Query from child1's perspective
    mockDdbSend.mockResolvedValueOnce({ Item: child1 });
    mockDdbSend.mockResolvedValueOnce({
      Items: [child1, grandchild, sibling],
    });

    const result = await handler({
      arguments: { rootEmail: 'child1@test.com' },
      identity: { claims: { email: 'child1@test.com' } },
    });

    // Should only include grandchild, NOT sibling
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('grandchild@test.com');
  });

  it('rejects non-existent root user', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined });

    await expect(
      handler({
        arguments: { rootEmail: 'nobody@test.com' },
        identity: { claims: { email: 'nobody@test.com' } },
      })
    ).rejects.toThrow('User not found');
  });
});
