import { sharedBackendApiClient } from './shared-backend-api-client';

describe('sharedBackendApiClient', () => {
  it('should work', () => {
    expect(sharedBackendApiClient()).toEqual('shared-backend-api-client');
  });
});
