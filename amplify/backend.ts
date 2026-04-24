import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createUserFn } from './data/create-user/resource';
import { getDownlineTreeFn } from './data/get-downline-tree/resource';
import { approveDistributorFn } from './data/approve-distributor/resource';
import { preSignUp } from './auth/pre-sign-up/resource';
import { customEmailSender } from './auth/custom-email-sender/resource';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';

const backend = defineBackend({
  auth,
  data,
  createUserFn,
  getDownlineTreeFn,
  approveDistributorFn,
  preSignUp,
  customEmailSender,
});

// ---- Resolve CDK resources ----

const userPool = backend.auth.resources.userPool;
const userPoolId = userPool.userPoolId;

const userTable = backend.data.resources.tables['User'];
const distributorTable = backend.data.resources.tables['Distributor'];

// Cast IFunction to Function for addEnvironment access
const createUserLambda = backend.createUserFn.resources.lambda as LambdaFunction;
const approveDistributorLambda = backend.approveDistributorFn.resources.lambda as LambdaFunction;
const getDownlineTreeLambda = backend.getDownlineTreeFn.resources.lambda as LambdaFunction;
const preSignUpLambda = backend.preSignUp.resources.lambda as LambdaFunction;
const customEmailSenderLambda = backend.customEmailSender.resources.lambda as LambdaFunction;

// ---- Environment variables ----

// createUser Lambda (data stack)
createUserLambda.addEnvironment('USER_TABLE_NAME', userTable.tableName);
createUserLambda.addEnvironment('DISTRIBUTOR_TABLE_NAME', distributorTable.tableName);
createUserLambda.addEnvironment('USER_POOL_ID', userPoolId);

// approveDistributor Lambda (data stack)
approveDistributorLambda.addEnvironment('USER_TABLE_NAME', userTable.tableName);
approveDistributorLambda.addEnvironment('DISTRIBUTOR_TABLE_NAME', distributorTable.tableName);

// getDownlineTree Lambda (data stack)
getDownlineTreeLambda.addEnvironment('USER_TABLE_NAME', userTable.tableName);

// preSignUp Lambda (auth stack) — gets USER_POOL_ID from event.userPoolId

// customEmailSender Lambda (auth stack)
customEmailSenderLambda.addEnvironment('SENDER_EMAIL', 'noreply@aimearn.com');

// ---- IAM Permissions ----

// createUser: DynamoDB read/write + Cognito AdminAddUserToGroup
userTable.grantReadWriteData(createUserLambda);
distributorTable.grantReadWriteData(createUserLambda);
createUserLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['cognito-idp:AdminAddUserToGroup'],
    resources: [userPool.userPoolArn],
  })
);

// approveDistributor: DynamoDB read/write
userTable.grantReadWriteData(approveDistributorLambda);
distributorTable.grantReadWriteData(approveDistributorLambda);

// getDownlineTree: DynamoDB read
userTable.grantReadData(getDownlineTreeLambda);

// preSignUp: Cognito ListUsers + AdminLinkProviderForUser
// Use wildcard resource to avoid circular ref within auth stack
preSignUpLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'cognito-idp:ListUsers',
      'cognito-idp:AdminLinkProviderForUser',
    ],
    resources: ['*'],
  })
);

// ---- CDK: Enable USER_AUTH flow for passwordless Email OTP ----

const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;

// Enable EMAIL_OTP as an allowed first auth factor
cfnUserPool.addPropertyOverride('Policies.SignInPolicy', {
  AllowedFirstAuthFactors: ['EMAIL_OTP', 'PASSWORD'],
});

// Add USER_AUTH to explicit auth flows on the UserPoolClient
const cfnUserPoolClient =
  backend.auth.resources.cfnResources.cfnUserPoolClient;
cfnUserPoolClient.explicitAuthFlows = [
  'ALLOW_USER_AUTH',
  'ALLOW_CUSTOM_AUTH',
  'ALLOW_USER_SRP_AUTH',
  'ALLOW_REFRESH_TOKEN_AUTH',
];
