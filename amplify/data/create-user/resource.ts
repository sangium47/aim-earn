import { defineFunction } from '@aws-amplify/backend';

export const createUserFn = defineFunction({
  name: 'aimearn-create-user',
  entry: './handler.ts',
  timeoutSeconds: 30,
  resourceGroupName: 'data',
});
