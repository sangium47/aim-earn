import type { PreSignUpTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminLinkProviderForUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const cognito = new CognitoIdentityProviderClient();

export const handler: PreSignUpTriggerHandler = async (event) => {
  const USER_POOL_ID = event.userPoolId;
  // Only handle federated (social) sign-up events
  if (event.triggerSource !== 'PreSignUp_ExternalProvider') {
    return event;
  }

  const email = event.request.userAttributes.email;
  const emailVerified = event.request.userAttributes.email_verified;

  // Security: reject unverified social emails
  if (emailVerified !== 'true') {
    throw new Error(
      'Email not verified by social provider. Cannot link account.'
    );
  }

  if (!email) {
    throw new Error('No email provided by social provider.');
  }

  // Escape double quotes in email to prevent filter injection
  const safeEmail = email.replace(/"/g, '\\"');

  // Check if a user with this email already exists (native sign-up)
  const existingUsers = await cognito.send(
    new ListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Filter: `email = "${safeEmail}"`,
      Limit: 1,
    })
  );

  if (existingUsers.Users && existingUsers.Users.length > 0) {
    const existingUser = existingUsers.Users[0];

    // event.userName format for social: "Google_1234567890" or "SignInWithApple_..."
    const underscoreIndex = event.userName.indexOf('_');
    if (underscoreIndex === -1) {
      throw new Error(
        `Invalid provider user name format: ${event.userName}`
      );
    }

    const providerName = event.userName.substring(0, underscoreIndex);
    const providerUserId = event.userName.substring(underscoreIndex + 1);

    const providerMap: Record<string, string> = {
      Google: 'Google',
      SignInWithApple: 'SignInWithApple',
      Facebook: 'Facebook',
    };

    const mappedProvider = providerMap[providerName];
    if (!mappedProvider) {
      throw new Error(`Unknown provider: ${providerName}`);
    }

    await cognito.send(
      new AdminLinkProviderForUserCommand({
        UserPoolId: USER_POOL_ID,
        DestinationUser: {
          ProviderName: 'Cognito',
          ProviderAttributeValue: existingUser.Username,
        },
        SourceUser: {
          ProviderName: mappedProvider,
          ProviderAttributeName: 'Cognito_Subject',
          ProviderAttributeValue: providerUserId,
        },
      })
    );
  }

  // Auto-confirm and auto-verify for social sign-ups
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  return event;
};
