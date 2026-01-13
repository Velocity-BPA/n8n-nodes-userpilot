/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  processAdditionalFields,
  processCustomProperties,
  buildUserObject,
  buildCompanyObject,
  buildEventObject,
  parseCSVData,
  validateBulkLimits,
  chunkArray,
  cleanEmptyValues,
  parseJsonInput,
} from '../../nodes/UserPilot/utils/helpers';

describe('Helper Functions', () => {
  describe('processAdditionalFields', () => {
    it('should filter out empty values', () => {
      const input = {
        name: 'John',
        email: '',
        age: null,
        city: 'NYC',
      };
      const result = processAdditionalFields(input);
      expect(result).toEqual({ name: 'John', city: 'NYC' });
    });

    it('should return empty object for empty input', () => {
      const result = processAdditionalFields({});
      expect(result).toEqual({});
    });
  });

  describe('processCustomProperties', () => {
    it('should convert key-value pairs to object', () => {
      const input = {
        property: [
          { key: 'plan', value: 'premium' },
          { key: 'role', value: 'admin' },
        ],
      };
      const result = processCustomProperties(input);
      expect(result).toEqual({ plan: 'premium', role: 'admin' });
    });

    it('should handle undefined input', () => {
      const result = processCustomProperties(undefined);
      expect(result).toEqual({});
    });

    it('should skip empty keys', () => {
      const input = {
        property: [
          { key: '', value: 'test' },
          { key: 'valid', value: 'value' },
        ],
      };
      const result = processCustomProperties(input);
      expect(result).toEqual({ valid: 'value' });
    });
  });

  describe('buildUserObject', () => {
    it('should build user object with all properties', () => {
      const result = buildUserObject(
        'user123',
        { name: 'John', email: 'john@test.com' },
        { plan: 'premium' },
        'company456',
      );
      expect(result).toEqual({
        user_id: 'user123',
        name: 'John',
        email: 'john@test.com',
        plan: 'premium',
        company: { id: 'company456' },
      });
    });

    it('should build minimal user object', () => {
      const result = buildUserObject('user123');
      expect(result).toEqual({ user_id: 'user123' });
    });
  });

  describe('buildCompanyObject', () => {
    it('should build company object with properties', () => {
      const result = buildCompanyObject(
        'company123',
        { name: 'Acme Inc' },
        { industry: 'tech' },
      );
      expect(result).toEqual({
        company_id: 'company123',
        name: 'Acme Inc',
        industry: 'tech',
      });
    });

    it('should build minimal company object', () => {
      const result = buildCompanyObject('company123');
      expect(result).toEqual({ company_id: 'company123' });
    });
  });

  describe('buildEventObject', () => {
    it('should build event object with metadata', () => {
      const result = buildEventObject(
        'user123',
        'button_clicked',
        { button_id: 'submit' },
        '2024-01-01T00:00:00Z',
      );
      expect(result).toEqual({
        user_id: 'user123',
        event_name: 'button_clicked',
        metadata: { button_id: 'submit' },
        created_at: '2024-01-01T00:00:00Z',
      });
    });

    it('should use current time if no timestamp provided', () => {
      const before = new Date().toISOString();
      const result = buildEventObject('user123', 'test_event');
      const after = new Date().toISOString();
      
      expect(result.user_id).toBe('user123');
      expect(result.event_name).toBe('test_event');
      expect(result.metadata).toEqual({});
      expect(result.created_at >= before).toBe(true);
      expect(result.created_at <= after).toBe(true);
    });
  });

  describe('parseCSVData', () => {
    it('should parse CSV string to array of objects', () => {
      const csv = 'user_id,name,email\nuser1,John,john@test.com\nuser2,Jane,jane@test.com';
      const result = parseCSVData(csv);
      expect(result).toEqual([
        { user_id: 'user1', name: 'John', email: 'john@test.com' },
        { user_id: 'user2', name: 'Jane', email: 'jane@test.com' },
      ]);
    });

    it('should throw error for CSV with only headers', () => {
      const csv = 'user_id,name,email';
      expect(() => parseCSVData(csv)).toThrow('CSV must contain at least a header row and one data row');
    });

    it('should handle quoted values', () => {
      const csv = '"user_id","name"\n"user1","John Doe"';
      const result = parseCSVData(csv);
      expect(result).toEqual([{ user_id: 'user1', name: 'John Doe' }]);
    });
  });

  describe('validateBulkLimits', () => {
    it('should not throw for items within limit', () => {
      expect(() => validateBulkLimits([1, 2, 3], 10)).not.toThrow();
    });

    it('should throw for items exceeding limit', () => {
      expect(() => validateBulkLimits([1, 2, 3, 4, 5], 3)).toThrow(
        'Bulk operation exceeds maximum limit of 3 rows. Current: 5 rows.',
      );
    });
  });

  describe('chunkArray', () => {
    it('should chunk array into specified size', () => {
      const result = chunkArray([1, 2, 3, 4, 5], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle empty array', () => {
      const result = chunkArray([], 2);
      expect(result).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
      const result = chunkArray([1, 2], 5);
      expect(result).toEqual([[1, 2]]);
    });
  });

  describe('cleanEmptyValues', () => {
    it('should remove empty strings, null, and undefined', () => {
      const input = {
        name: 'John',
        email: '',
        age: null,
        city: undefined,
        country: 'US',
      };
      const result = cleanEmptyValues(input);
      expect(result).toEqual({ name: 'John', country: 'US' });
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: 'John',
          email: '',
        },
        empty: {},
      };
      const result = cleanEmptyValues(input);
      expect(result).toEqual({ user: { name: 'John' } });
    });

    it('should preserve arrays', () => {
      const input = {
        tags: ['a', 'b'],
        items: [],
      };
      const result = cleanEmptyValues(input);
      expect(result).toEqual({ tags: ['a', 'b'], items: [] });
    });
  });

  describe('parseJsonInput', () => {
    it('should parse valid JSON object', () => {
      const input = '{"name": "John", "age": 30}';
      const result = parseJsonInput(input);
      expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should parse valid JSON array', () => {
      const input = '[{"id": 1}, {"id": 2}]';
      const result = parseJsonInput(input);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should throw error for invalid JSON', () => {
      const input = '{ invalid json }';
      expect(() => parseJsonInput(input)).toThrow('Invalid JSON input');
    });
  });
});
