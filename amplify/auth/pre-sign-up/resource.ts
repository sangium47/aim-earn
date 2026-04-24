import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: 'aimearn-pre-sign-up',
  entry: './handler.ts',
  resourceGroupName: 'auth',
});
