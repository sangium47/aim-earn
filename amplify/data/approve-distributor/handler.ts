import {
  DynamoDBClient,
  GetItemCommand,
  TransactWriteItemsCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const ddb = new DynamoDBClient();

const USER_TABLE = process.env.USER_TABLE_NAME!;
const DISTRIBUTOR_TABLE = process.env.DISTRIBUTOR_TABLE_NAME!;

function generateCode(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateUniqueInviteCode(): Promise<string> {
  let code: string;
  let attempts = 0;
  do {
    code = generateCode();
    attempts++;
    if (attempts > 10) throw new Error('Failed to generate unique invite code');
    const result = await ddb.send(
      new ScanCommand({
        TableName: USER_TABLE,
        FilterExpression: 'inviteCode = :code',
        ExpressionAttributeValues: marshall({ ':code': code }),
        Limit: 1,
      })
    );
    if (!result.Items || result.Items.length === 0) break;
  } while (true);
  return code;
}

export const handler = async (event: {
  arguments: { distributorId: string };
}) => {
  const { distributorId } = event.arguments;

  // Validate Distributor exists and is PENDING
  const distributorResult = await ddb.send(
    new GetItemCommand({
      TableName: DISTRIBUTOR_TABLE,
      Key: marshall({ distributorId }),
    })
  );

  if (!distributorResult.Item) {
    throw new Error('Distributor not found.');
  }

  const distributor = unmarshall(distributorResult.Item);

  if (distributor.status !== 'PENDING') {
    throw new Error(
      `Distributor status is ${distributor.status}, expected PENDING.`
    );
  }

  const now = new Date().toISOString();

  // Generate inviteCode for the distributor's User record
  const inviteCode = await generateUniqueInviteCode();

  // Atomic: update Distributor.status + User.inviteCode in one transaction
  await ddb.send(
    new TransactWriteItemsCommand({
      TransactItems: [
        {
          Update: {
            TableName: DISTRIBUTOR_TABLE,
            Key: marshall({ distributorId }),
            UpdateExpression: 'SET #status = :status, updatedAt = :now',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: marshall({
              ':status': 'APPROVED',
              ':now': now,
            }),
          },
        },
        {
          Update: {
            TableName: USER_TABLE,
            Key: marshall({ email: distributor.ownerEmail }),
            UpdateExpression: 'SET inviteCode = :code, updatedAt = :now',
            ExpressionAttributeValues: marshall({
              ':code': inviteCode,
              ':now': now,
            }),
          },
        },
      ],
    })
  );

  return {
    ...distributor,
    status: 'APPROVED',
    updatedAt: now,
  };
};
