/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHookFunctions,
  IDataObject,
  IHttpRequestMethods,
  IHttpRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const DEFAULT_ENDPOINT = 'https://analytex.userpilot.io';

/**
 * Emit licensing notice once per node load
 */
let licenseNoticeEmitted = false;

function emitLicenseNotice(context: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions): void {
  if (!licenseNoticeEmitted) {
    context.logger?.warn(
      '[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). ' +
      'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. ' +
      'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.'
    );
    licenseNoticeEmitted = true;
  }
}

/**
 * Get the base URL for UserPilot API
 */
export function getBaseUrl(credentials: IDataObject): string {
  const endpoint = credentials.endpoint as string;
  return endpoint && endpoint.trim() !== '' ? endpoint.trim() : DEFAULT_ENDPOINT;
}

/**
 * Make a request to the UserPilot API
 */
export async function userPilotApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<any> {
  emitLicenseNotice(this);

  const credentials = await this.getCredentials('userPilotApi');
  const baseUrl = getBaseUrl(credentials);

  const options: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    headers: {
      'Authorization': `Token ${credentials.apiToken}`,
      'Content-Type': 'application/json',
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  if (query && Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    const response = await this.helpers.httpRequest(options);
    return response;
  } catch (error: any) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: error.message,
      description: getErrorDescription(error),
    });
  }
}

/**
 * Make a paginated request to the UserPilot API
 */
export async function userPilotApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  dataKey = 'data',
): Promise<any[]> {
  const returnData: any[] = [];
  let responseData: any;

  query = query || {};
  query.limit = query.limit || 100;
  query.offset = 0;

  do {
    responseData = await userPilotApiRequest.call(this, method, endpoint, body, query);
    const items = responseData[dataKey] || responseData;
    
    if (Array.isArray(items)) {
      returnData.push(...items);
    }

    query.offset = (query.offset as number) + (query.limit as number);
  } while (
    responseData.has_more === true ||
    (Array.isArray(responseData[dataKey]) && responseData[dataKey].length === query.limit)
  );

  return returnData;
}

/**
 * Upload file to UserPilot API
 */
export async function userPilotApiFileUpload(
  this: IExecuteFunctions,
  endpoint: string,
  fileData: Buffer,
  fileName: string,
  additionalFields?: IDataObject,
): Promise<any> {
  emitLicenseNotice(this);

  const credentials = await this.getCredentials('userPilotApi');
  const baseUrl = getBaseUrl(credentials);

  const formData: IDataObject = {
    file: {
      value: fileData,
      options: {
        filename: fileName,
        contentType: 'text/csv',
      },
    },
    ...additionalFields,
  };

  const options: IHttpRequestOptions = {
    method: 'POST',
    url: `${baseUrl}${endpoint}`,
    headers: {
      'Authorization': `Token ${credentials.apiToken}`,
    },
    body: formData,
  };

  try {
    const response = await this.helpers.httpRequest(options);
    return response;
  } catch (error: any) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: error.message,
      description: getErrorDescription(error),
    });
  }
}

/**
 * Get human-readable error description
 */
function getErrorDescription(error: any): string {
  const statusCode = error.statusCode || error.status;

  switch (statusCode) {
    case 400:
      return 'Bad request. Please check your input parameters.';
    case 401:
      return 'Unauthorized. Please check your API token.';
    case 403:
      return 'Forbidden. You do not have permission to access this resource.';
    case 404:
      return 'Resource not found. Please check the ID or endpoint.';
    case 429:
      return 'Rate limit exceeded. Please wait before making more requests.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'Bad gateway. The server is temporarily unavailable.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return error.message || 'An unknown error occurred.';
  }
}

/**
 * Validate that required fields are present
 */
export function validateRequiredFields(
  data: IDataObject,
  requiredFields: string[],
): void {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

/**
 * Parse JSON string to object
 */
export function parseJsonInput(input: string | IDataObject): IDataObject {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch {
      throw new Error('Invalid JSON input. Please provide valid JSON.');
    }
  }
  return input;
}

/**
 * Format date to ISO 8601
 */
export function formatDateToISO(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date format: ${date}`);
  }
  
  return parsed.toISOString();
}
