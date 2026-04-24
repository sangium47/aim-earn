import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const MAX_ATTEMPTS = 10;

export function generateCode(length = 8): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

/**
 * Check if an inviteCode is unique using Query on the inviteCode GSI.
 * Much more efficient than Scan — reads only the matching index entry.
 */
async function isInviteCodeUnique(
  ddb: DynamoDBClient,
  tableName: string,
  indexName: string,
  code: string
): Promise<boolean> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: 'inviteCode = :code',
      ExpressionAttributeValues: marshall({ ':code': code }),
      Limit: 1,
    })
  );
  return (result.Items?.length ?? 0) === 0;
}

/**
 * Generate a unique invite code using GSI Query for uniqueness check.
 */
export async function generateUniqueInviteCode(
  ddb: DynamoDBClient,
  tableName: string,
  indexName: string = 'inviteCode'
): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateCode();
    if (await isInviteCodeUnique(ddb, tableName, indexName, code)) {
      return code;
    }
  }
  throw new Error('Failed to generate unique invite code');
}
