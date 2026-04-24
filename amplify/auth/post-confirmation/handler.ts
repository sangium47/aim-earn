import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambda = new LambdaClient();
const CREATE_USER_FUNCTION_NAME = process.env.CREATE_USER_FUNCTION_NAME!;

export const handler: PostConfirmationTriggerHandler = async (event) => {
  // Only handle sign-up confirmation, not other post-confirmation events
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    return event;
  }

  const { email, given_name, family_name } = event.request.userAttributes;
  const role = event.request.userAttributes['custom:role'];
  const inviteCode = event.request.userAttributes['custom:inviteCode'] || null;
  const countriesRaw = event.request.userAttributes['custom:countries'];

  if (!email || !role) {
    console.error('Missing email or custom:role in user attributes');
    return event;
  }

  // Distributors: skip — frontend calls createUser after country selection
  if (role === 'DISTRIBUTOR') {
    return event;
  }

  const countries = countriesRaw ? JSON.parse(countriesRaw) : [];

  // Affiliates: invoke createUser Lambda directly (all data available at sign-up)
  const response = await lambda.send(
    new InvokeCommand({
      FunctionName: CREATE_USER_FUNCTION_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        arguments: {
          email,
          role,
          firstName: given_name || '',
          lastName: family_name || '',
          countries,
          inviteCode,
        },
        // No identity — skips caller verification in createUser handler
      }),
    })
  );

  if (response.FunctionError) {
    const errorPayload = response.Payload
      ? JSON.parse(new TextDecoder().decode(response.Payload))
      : {};
    console.error('createUser Lambda error:', errorPayload);
    throw new Error(
      `createUser failed: ${errorPayload.errorMessage || 'Unknown error'}`
    );
  }

  return event;
};
