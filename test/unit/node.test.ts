/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { UserPilot } from '../../nodes/UserPilot/UserPilot.node';

describe('UserPilot Node', () => {
  let node: UserPilot;

  beforeEach(() => {
    node = new UserPilot();
  });

  describe('Node Description', () => {
    it('should have correct name', () => {
      expect(node.description.name).toBe('userPilot');
    });

    it('should have correct display name', () => {
      expect(node.description.displayName).toBe('UserPilot');
    });

    it('should have credentials configured', () => {
      expect(node.description.credentials).toHaveLength(1);
      expect(node.description.credentials?.[0].name).toBe('userPilotApi');
      expect(node.description.credentials?.[0].required).toBe(true);
    });

    it('should have icon configured', () => {
      expect(node.description.icon).toBe('file:userpilot.svg');
    });
  });

  describe('Resources', () => {
    it('should have all 12 resources', () => {
      const resourceProperty = node.description.properties.find(
        (p) => p.name === 'resource',
      );
      expect(resourceProperty?.type).toBe('options');
      
      const options = resourceProperty?.options as Array<{ value: string }>;
      const resourceValues = options?.map((o) => o.value);
      
      expect(resourceValues).toContain('user');
      expect(resourceValues).toContain('company');
      expect(resourceValues).toContain('event');
      expect(resourceValues).toContain('flow');
      expect(resourceValues).toContain('nps');
      expect(resourceValues).toContain('checklist');
      expect(resourceValues).toContain('resourceCenter');
      expect(resourceValues).toContain('segment');
      expect(resourceValues).toContain('dataExport');
      expect(resourceValues).toContain('job');
      expect(resourceValues).toContain('spotlight');
      expect(resourceValues).toContain('banner');
    });
  });

  describe('User Operations', () => {
    it('should have correct user operations', () => {
      const operationProperty = node.description.properties.find(
        (p) => 
          p.name === 'operation' && 
          p.displayOptions?.show?.resource?.includes('user'),
      );
      
      const options = operationProperty?.options as Array<{ value: string }>;
      const operationValues = options?.map((o) => o.value);
      
      expect(operationValues).toContain('identify');
      expect(operationValues).toContain('update');
      expect(operationValues).toContain('get');
      expect(operationValues).toContain('delete');
      expect(operationValues).toContain('bulkUpdate');
      expect(operationValues).toContain('bulkImport');
    });
  });

  describe('Company Operations', () => {
    it('should have correct company operations', () => {
      const operationProperty = node.description.properties.find(
        (p) => 
          p.name === 'operation' && 
          p.displayOptions?.show?.resource?.includes('company'),
      );
      
      const options = operationProperty?.options as Array<{ value: string }>;
      const operationValues = options?.map((o) => o.value);
      
      expect(operationValues).toContain('identify');
      expect(operationValues).toContain('update');
      expect(operationValues).toContain('get');
      expect(operationValues).toContain('delete');
      expect(operationValues).toContain('bulkUpdate');
    });
  });

  describe('Event Operations', () => {
    it('should have correct event operations', () => {
      const operationProperty = node.description.properties.find(
        (p) => 
          p.name === 'operation' && 
          p.displayOptions?.show?.resource?.includes('event'),
      );
      
      const options = operationProperty?.options as Array<{ value: string }>;
      const operationValues = options?.map((o) => o.value);
      
      expect(operationValues).toContain('track');
      expect(operationValues).toContain('bulkTrack');
      expect(operationValues).toContain('bulkImport');
    });
  });

  describe('Flow Operations', () => {
    it('should have correct flow operations', () => {
      const operationProperty = node.description.properties.find(
        (p) => 
          p.name === 'operation' && 
          p.displayOptions?.show?.resource?.includes('flow'),
      );
      
      const options = operationProperty?.options as Array<{ value: string }>;
      const operationValues = options?.map((o) => o.value);
      
      expect(operationValues).toContain('list');
      expect(operationValues).toContain('get');
      expect(operationValues).toContain('trigger');
    });
  });

  describe('NPS Operations', () => {
    it('should have correct NPS operations', () => {
      const operationProperty = node.description.properties.find(
        (p) => 
          p.name === 'operation' && 
          p.displayOptions?.show?.resource?.includes('nps'),
      );
      
      const options = operationProperty?.options as Array<{ value: string }>;
      const operationValues = options?.map((o) => o.value);
      
      expect(operationValues).toContain('list');
      expect(operationValues).toContain('getResponses');
      expect(operationValues).toContain('exportData');
    });
  });

  describe('Data Export Operations', () => {
    it('should have correct data export operations', () => {
      const operationProperty = node.description.properties.find(
        (p) => 
          p.name === 'operation' && 
          p.displayOptions?.show?.resource?.includes('dataExport'),
      );
      
      const options = operationProperty?.options as Array<{ value: string }>;
      const operationValues = options?.map((o) => o.value);
      
      expect(operationValues).toContain('create');
      expect(operationValues).toContain('getStatus');
      expect(operationValues).toContain('download');
    });
  });

  describe('Job Operations', () => {
    it('should have correct job operations', () => {
      const operationProperty = node.description.properties.find(
        (p) => 
          p.name === 'operation' && 
          p.displayOptions?.show?.resource?.includes('job'),
      );
      
      const options = operationProperty?.options as Array<{ value: string }>;
      const operationValues = options?.map((o) => o.value);
      
      expect(operationValues).toContain('getStatus');
      expect(operationValues).toContain('list');
    });
  });

  describe('Execute Function', () => {
    it('should have execute function defined', () => {
      expect(typeof node.execute).toBe('function');
    });
  });
});
