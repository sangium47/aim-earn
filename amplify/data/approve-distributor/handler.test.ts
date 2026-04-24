import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDdbSend } = vi.hoisted(() => ({
  mockDdbSend: vi.fn(),
}));

vi.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: class { send = mockDdbSend; },
    GetItemCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'GetItem' }); } },
    TransactWriteItemsCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'TransactWrite' }); } },
    QueryCommand: class { constructor(public input: unknown) { Object.assign(this, input, { _type: 'Query' }); } },
  };
});

vi.mock('@aws-sdk/util-dynamodb', () => ({
  marshall: vi.fn((obj) => obj),
  unmarshall: vi.fn((obj) => obj),
}));

process.env.USER_TABLE_NAME = 'test-users';
process.env.DISTRIBUTOR_TABLE_NAME = 'test-distributors';

import { handler } from './handler';

describe('approveDistributor handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects non-existent distributor', async () => {
    mockDdbSend.mockResolvedValueOnce({ Item: undefined });

    await expect(
      handler({ arguments: { distributorId: 'nonexistent' } })
    ).rejects.toThrow('Distributor not found');
  });

  it('rejects distributor not in PENDING status', async () => {
    mockDdbSend.mockResolvedValueOnce({
      Item: { distributorId: 'dist1', status: 'APPROVED', ownerEmail: 'a@test.com' },
    });

    await expect(
      handler({ arguments: { distributorId: 'dist1' } })
    ).rejects.toThrow('expected PENDING');
  });

  it('rejects REJECTED distributor', async () => {
    mockDdbSend.mockResolvedValueOnce({
      Item: { distributorId: 'dist1', status: 'REJECTED', ownerEmail: 'a@test.com' },
    });

    await expect(
      handler({ arguments: { distributorId: 'dist1' } })
    ).rejects.toThrow('expected PENDING');
  });

  it('approves PENDING distributor atomically', async () => {
    // Get distributor
    mockDdbSend.mockResolvedValueOnce({
      Item: {
        distributorId: 'dist1',
        status: 'PENDING',
        ownerEmail: 'owner@test.com',
        firstName: 'John',
      },
    });
    // Scan for unique inviteCode
    mockDdbSend.mockResolvedValueOnce({ Items: [] });
    // TransactWriteItems
    mockDdbSend.mockResolvedValueOnce({});

    const result = await handler({ arguments: { distributorId: 'dist1' } }) as Record<string, unknown>;

    expect(result.status).toBe('APPROVED');
    expect(result.distributorId).toBe('dist1');

    // Verify TransactWriteItems was called
    const transactCalls = mockDdbSend.mock.calls.filter(
      (call) => call[0]._type === 'TransactWrite'
    );
    expect(transactCalls.length).toBe(1);
  });
});
