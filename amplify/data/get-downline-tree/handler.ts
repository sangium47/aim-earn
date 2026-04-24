import { DynamoDBClient, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
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

/**
 * Query all users in a distributor's network using the distributorId GSI.
 * Handles pagination for large networks (>1MB results).
 */
async function queryAllUsersByDistributorId(
  distributorId: string
): Promise<Record<string, unknown>[]> {
  const allUsers: Record<string, unknown>[] = [];
  let lastKey: Record<string, unknown> | undefined;

  do {
    const result = await ddb.send(
      new QueryCommand({
        TableName: USER_TABLE,
        IndexName: 'distributorId',
        KeyConditionExpression: 'distributorId = :did',
        ExpressionAttributeValues: marshall({ ':did': distributorId }),
        ExclusiveStartKey: lastKey as any,
      })
    );

    const items = (result.Items ?? []).map((item) => unmarshall(item));
    allUsers.push(...items);
    lastKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  return allUsers;
}

export const handler = async (event: {
  arguments: { rootEmail: string };
  identity?: {
    claims?: { email?: string; 'cognito:groups'?: string[] };
  };
}) => {
  const { rootEmail } = event.arguments;

  // Security: require authenticated caller
  const callerEmail = event.identity?.claims?.email;
  if (!callerEmail) {
    throw new Error('Authentication required.');
  }

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

  // Query all users in this distributor's network via GSI (paginated)
  const allUsers = await queryAllUsersByDistributorId(
    rootUser.distributorId as string
  );

  // Build parent→children index for O(n) BFS instead of O(n²) filter
  const childrenByParent = new Map<string, typeof allUsers>();
  for (const user of allUsers) {
    const parent = (user.parentEmail as string) || '';
    if (!childrenByParent.has(parent)) childrenByParent.set(parent, []);
    childrenByParent.get(parent)!.push(user);
  }

  // BFS from rootEmail, collect descendants only
  const descendants: DownlineNode[] = [];
  const queue = [rootEmail];
  const visited = new Set<string>([rootEmail]);

  while (queue.length > 0) {
    const currentEmail = queue.shift()!;
    const children = childrenByParent.get(currentEmail) ?? [];

    for (const child of children) {
      const childEmail = child.email as string;
      if (visited.has(childEmail)) continue;

      visited.add(childEmail);
      descendants.push({
        email: childEmail,
        firstName: (child.firstName as string) ?? null,
        lastName: (child.lastName as string) ?? null,
        depth: (child.depth as number) ?? 0,
        parentEmail: (child.parentEmail as string) ?? null,
        inviteCode: (child.inviteCode as string) ?? null,
        countries: (child.countries as string[]) ?? null,
        role: child.role as string,
      });
      queue.push(childEmail);
    }
  }

  return descendants;
};
