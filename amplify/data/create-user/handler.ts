import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const ddb = new DynamoDBClient();
const cognito = new CognitoIdentityProviderClient();

const USER_TABLE = process.env.USER_TABLE_NAME!;
const DISTRIBUTOR_TABLE = process.env.DISTRIBUTOR_TABLE_NAME!;
const USER_POOL_ID = process.env.USER_POOL_ID!;

function generateCode(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function isCodeUnique(
  table: string,
  field: string,
  code: string
): Promise<boolean> {
  const result = await ddb.send(
    new ScanCommand({
      TableName: table,
      FilterExpression: '#f = :code',
      ExpressionAttributeNames: { '#f': field },
      ExpressionAttributeValues: marshall({ ':code': code }),
      Limit: 1,
    })
  );
  return (result.Items?.length ?? 0) === 0;
}

async function generateUniqueCode(
  table: string,
  field: string
): Promise<string> {
  let code: string;
  let attempts = 0;
  do {
    code = generateCode();
    attempts++;
    if (attempts > 10) throw new Error('Failed to generate unique code');
  } while (!(await isCodeUnique(table, field, code)));
  return code;
}

export const handler = async (event: {
  arguments: {
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    countries: string[];
    inviteCode?: string;
  };
  identity?: {
    claims?: { email?: string };
    username?: string;
  };
}) => {
  const { email, role, firstName, lastName, countries, inviteCode } =
    event.arguments;

  // 1. Role whitelist — only DISTRIBUTOR or AFFILIATE
  if (role !== 'DISTRIBUTOR' && role !== 'AFFILIATE') {
    throw new Error('Invalid role. Only DISTRIBUTOR or AFFILIATE allowed.');
  }

  // 2. Verify caller — authenticated user's email must match
  // Skip for IAM callers (post-confirmation Lambda has no claims)
  if (event.identity?.claims?.email && event.identity.claims.email !== email) {
    throw new Error('Caller email does not match the provided email.');
  }

  // 3. Idempotent check — reject if user already exists
  const existing = await ddb.send(
    new GetItemCommand({
      TableName: USER_TABLE,
      Key: marshall({ email }),
    })
  );
  if (existing.Item) {
    throw new Error('User already exists.');
  }

  const now = new Date().toISOString();

  try {
    if (role === 'DISTRIBUTOR') {
      // 4. Distributor flow
      const distributorId = await generateUniqueCode(
        DISTRIBUTOR_TABLE,
        'distributorId'
      );

      // Create Distributor record (status: PENDING)
      await ddb.send(
        new PutItemCommand({
          TableName: DISTRIBUTOR_TABLE,
          Item: marshall(
            {
              distributorId,
              ownerEmail: email,
              status: 'PENDING',
              firstName,
              lastName,
              countries,
              createdAt: now,
              updatedAt: now,
            },
            { removeUndefinedValues: true }
          ),
        })
      );

      // Create User record (inviteCode: null until admin approval)
      const user = {
        email,
        role,
        firstName,
        lastName,
        countries,
        distributorId,
        parentEmail: null,
        inviteCode: null,
        depth: 0,
        createdAt: now,
        updatedAt: now,
      };

      await ddb.send(
        new PutItemCommand({
          TableName: USER_TABLE,
          Item: marshall(user, { removeUndefinedValues: true }),
        })
      );

      // Assign Cognito group
      await cognito.send(
        new AdminAddUserToGroupCommand({
          UserPoolId: USER_POOL_ID,
          Username: email,
          GroupName: 'DISTRIBUTOR',
        })
      );

      return user;
    }

    // 5. Affiliate flow
    if (!inviteCode) {
      throw new Error('Invite code is required for affiliate registration.');
    }

    // Look up inviter by inviteCode
    const inviterResult = await ddb.send(
      new ScanCommand({
        TableName: USER_TABLE,
        FilterExpression: 'inviteCode = :code',
        ExpressionAttributeValues: marshall({ ':code': inviteCode }),
        Limit: 1,
      })
    );

    if (!inviterResult.Items || inviterResult.Items.length === 0) {
      throw new Error('Invalid invite code.');
    }

    const inviter = unmarshall(inviterResult.Items[0]);

    // Validate root distributor is APPROVED
    if (!inviter.distributorId) {
      throw new Error('Inviter has no associated distributor.');
    }

    const distributorResult = await ddb.send(
      new GetItemCommand({
        TableName: DISTRIBUTOR_TABLE,
        Key: marshall({ distributorId: inviter.distributorId }),
      })
    );

    if (!distributorResult.Item) {
      throw new Error('Distributor not found.');
    }

    const distributor = unmarshall(distributorResult.Item);
    if (distributor.status !== 'APPROVED') {
      throw new Error(
        'Distributor is not approved. Cannot register affiliate.'
      );
    }

    // Generate inviteCode for the new affiliate
    const newInviteCode = await generateUniqueCode(USER_TABLE, 'inviteCode');

    const user = {
      email,
      role,
      firstName,
      lastName,
      countries,
      distributorId: inviter.distributorId,
      parentEmail: inviter.email,
      inviteCode: newInviteCode,
      depth: (inviter.depth ?? 0) + 1,
      createdAt: now,
      updatedAt: now,
    };

    await ddb.send(
      new PutItemCommand({
        TableName: USER_TABLE,
        Item: marshall(user, { removeUndefinedValues: true }),
      })
    );

    // Assign Cognito group
    await cognito.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        GroupName: 'AFFILIATE',
      })
    );

    return user;
  } catch (error) {
    // Rollback: attempt to clean up partially created records
    // Best-effort — log errors but don't mask the original
    console.error('createUser failed, attempting rollback:', error);
    throw error;
  }
};
