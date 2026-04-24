import {
  DynamoDBClient,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { generateUniqueInviteCode } from '../lib/code-generator';

const ddb = new DynamoDBClient();

const USER_TABLE = process.env.USER_TABLE_NAME!;
const DISTRIBUTOR_TABLE = process.env.DISTRIBUTOR_TABLE_NAME!;

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
  const inviteCode = await generateUniqueInviteCode(ddb, USER_TABLE);

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
