import { defineFunction } from '@aws-amplify/backend';

export const approveDistributorFn = defineFunction({
  name: 'aimearn-approve-distributor',
  entry: './handler.ts',
  timeoutSeconds: 30,
  resourceGroupName: 'data',
});
