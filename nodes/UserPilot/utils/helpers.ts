/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Convert execution data to array of objects for bulk operations
 */
export function prepareItemsForBulk(
  items: INodeExecutionData[],
  fields: string[],
): IDataObject[] {
  return items.map((item) => {
    const result: IDataObject = {};
    for (const field of fields) {
      if (item.json[field] !== undefined) {
        result[field] = item.json[field];
      }
    }
    return result;
  });
}

/**
 * Convert additional fields from n8n format to flat object
 */
export function processAdditionalFields(additionalFields: IDataObject): IDataObject {
  const result: IDataObject = {};

  for (const [key, value] of Object.entries(additionalFields)) {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Convert custom properties from key-value pairs to object
 */
export function processCustomProperties(
  customProperties: { property: Array<{ key: string; value: string }> } | undefined,
): IDataObject {
  const result: IDataObject = {};

  if (customProperties?.property) {
    for (const prop of customProperties.property) {
      if (prop.key && prop.value !== undefined) {
        result[prop.key] = prop.value;
      }
    }
  }

  return result;
}

/**
 * Build user object for identification
 */
export function buildUserObject(
  userId: string,
  properties?: IDataObject,
  customProperties?: IDataObject,
  companyId?: string,
): IDataObject {
  const user: IDataObject = {
    user_id: userId,
  };

  if (properties) {
    Object.assign(user, properties);
  }

  if (customProperties && Object.keys(customProperties).length > 0) {
    Object.assign(user, customProperties);
  }

  if (companyId) {
    user.company = {
      id: companyId,
    };
  }

  return user;
}

/**
 * Build company object for identification
 */
export function buildCompanyObject(
  companyId: string,
  properties?: IDataObject,
  customProperties?: IDataObject,
): IDataObject {
  const company: IDataObject = {
    company_id: companyId,
  };

  if (properties) {
    Object.assign(company, properties);
  }

  if (customProperties && Object.keys(customProperties).length > 0) {
    Object.assign(company, customProperties);
  }

  return company;
}

/**
 * Build event object for tracking
 */
export function buildEventObject(
  userId: string,
  eventName: string,
  metadata?: IDataObject,
  timestamp?: string,
): IDataObject {
  const event: IDataObject = {
    user_id: userId,
    event_name: eventName,
    metadata: metadata || {},
    created_at: timestamp || new Date().toISOString(),
  };

  return event;
}

/**
 * Parse CSV data for bulk import
 */
export function parseCSVData(csvContent: string): IDataObject[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const results: IDataObject[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: IDataObject = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || '';
    }

    results.push(row);
  }

  return results;
}

/**
 * Validate bulk data size limits
 */
export function validateBulkLimits(
  items: any[],
  maxRows: number = 10000,
): void {
  if (items.length > maxRows) {
    throw new Error(`Bulk operation exceeds maximum limit of ${maxRows} rows. Current: ${items.length} rows.`);
  }
}

/**
 * Sleep for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chunk array for batch processing
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Clean empty values from object
 */
export function cleanEmptyValues(obj: IDataObject): IDataObject {
  const result: IDataObject = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleaned = cleanEmptyValues(value as IDataObject);
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned;
        }
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Parse JSON input string to object or array
 */
export function parseJsonInput(input: string): IDataObject | IDataObject[] {
  try {
    return JSON.parse(input);
  } catch (error) {
    throw new Error(`Invalid JSON input: ${(error as Error).message}`);
  }
}
