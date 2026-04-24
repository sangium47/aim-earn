import { DynamoDBClient, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const ddb = new DynamoDBClient();

const USER_TABLE = process.env.USER_TABLE_NAME!;

interface DownlineNode {
  email: string;
  firstName: string | null;
  lastName: string | null;
  depth: number;
  parentEmail: string | null;
  inviteCode: string | null;
  countries: string[] | null;
  role: string;
}

export const handler = async (event: {
  arguments: { rootEmail: string };
  identity?: {
    claims?: { email?: string; 'cognito:groups'?: string[] };
  };
}) => {
  const { rootEmail } = event.arguments;

  // Security: caller must be the root user or an admin
  const callerEmail = event.identity?.claims?.email;
  const callerGroups = event.identity?.claims?.['cognito:groups'] ?? [];
  const isAdmin = callerGroups.includes('ADMIN');

  if (!isAdmin && callerEmail !== rootEmail) {
    throw new Error('You can only view your own downline tree.');
  }

  // Fetch root user to get distributorId
  const rootResult = await ddb.send(
    new GetItemCommand({
      TableName: USER_TABLE,
      Key: marshall({ email: rootEmail }),
    })
  );

  if (!rootResult.Item) {
    throw new Error('User not found.');
  }

  const rootUser = unmarshall(rootResult.Item);

  // Get all users in this distributor's network
  const allUsersResult = await ddb.send(
    new ScanCommand({
      TableName: USER_TABLE,
      FilterExpression: 'distributorId = :did',
      ExpressionAttributeValues: marshall({
        ':did': rootUser.distributorId,
      }),
    })
  );

  const allUsers = (allUsersResult.Items ?? []).map((item) => unmarshall(item));

  // Build tree: BFS from rootEmail, only include descendants
  const descendants: DownlineNode[] = [];
  const queue = [rootEmail];
  const visited = new Set<string>([rootEmail]);

  while (queue.length > 0) {
    const currentEmail = queue.shift()!;
    const children = allUsers.filter(
      (u) => u.parentEmail === currentEmail && !visited.has(u.email)
    );

    for (const child of children) {
      visited.add(child.email);
      descendants.push({
        email: child.email,
        firstName: child.firstName ?? null,
        lastName: child.lastName ?? null,
        depth: child.depth ?? 0,
        parentEmail: child.parentEmail ?? null,
        inviteCode: child.inviteCode ?? null,
        countries: child.countries ?? null,
        role: child.role,
      });
      queue.push(child.email);
    }
  }

  return descendants;
};
