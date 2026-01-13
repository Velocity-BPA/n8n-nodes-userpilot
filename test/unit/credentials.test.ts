/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { UserPilotApi } from '../../credentials/UserPilotApi.credentials';

describe('UserPilotApi Credentials', () => {
  let credentials: UserPilotApi;

  beforeEach(() => {
    credentials = new UserPilotApi();
  });

  describe('Basic Properties', () => {
    it('should have correct name', () => {
      expect(credentials.name).toBe('userPilotApi');
    });

    it('should have correct display name', () => {
      expect(credentials.displayName).toBe('UserPilot API');
    });

    it('should have documentation URL', () => {
      expect(credentials.documentationUrl).toBe('https://docs.userpilot.com/');
    });
  });

  describe('Properties Configuration', () => {
    it('should have apiToken property', () => {
      const apiTokenProp = credentials.properties.find((p) => p.name === 'apiToken');
      expect(apiTokenProp).toBeDefined();
      expect(apiTokenProp?.type).toBe('string');
      expect(apiTokenProp?.required).toBe(true);
      expect(apiTokenProp?.typeOptions?.password).toBe(true);
    });

    it('should have endpoint property', () => {
      const endpointProp = credentials.properties.find((p) => p.name === 'endpoint');
      expect(endpointProp).toBeDefined();
      expect(endpointProp?.type).toBe('string');
      expect(endpointProp?.default).toBe('');
    });
  });

  describe('Authentication Configuration', () => {
    it('should use generic authentication', () => {
      expect(credentials.authenticate.type).toBe('generic');
    });

    it('should set Authorization header', () => {
      expect(credentials.authenticate.properties.headers).toHaveProperty('Authorization');
    });
  });

  describe('Test Request Configuration', () => {
    it('should have test request configured', () => {
      expect(credentials.test).toBeDefined();
      expect(credentials.test.request.method).toBe('GET');
      expect(credentials.test.request.url).toBe('/v1/users');
    });
  });
});
