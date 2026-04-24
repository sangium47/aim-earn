import { defineFunction } from '@aws-amplify/backend';

export const customEmailSender = defineFunction({
  name: 'aimearn-custom-email-sender',
  entry: './handler.ts',
  timeoutSeconds: 15,
  resourceGroupName: 'auth',
});
