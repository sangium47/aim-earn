import { defineFunction, secret } from '@aws-amplify/backend';

export const customEmailSender = defineFunction({
  name: 'aimearn-custom-email-sender',
  entry: './handler.ts',
  timeoutSeconds: 15,
  resourceGroupName: 'auth',
  environment: {
    SENDGRID_API_KEY: secret('SENDGRID_API_KEY'),
  },
});
