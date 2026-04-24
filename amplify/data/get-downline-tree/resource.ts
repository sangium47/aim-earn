import { defineFunction } from '@aws-amplify/backend';

export const getDownlineTreeFn = defineFunction({
  name: 'aimearn-get-downline-tree',
  entry: './handler.ts',
  timeoutSeconds: 60,
  resourceGroupName: 'data',
});
