/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest, userPilotApiRequestAllItems } from '../../transport';

export async function search(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const searchProperty = this.getNodeParameter('searchProperty', index) as string;
  const searchValue = this.getNodeParameter('searchValue', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  const query = { [searchProperty]: searchValue };

  if (returnAll) {
    const response = await userPilotApiRequestAllItems.call(this, 'GET', '/v1/users/search', query);
    return response.map((item: any) => ({ json: item }));
  }

  const response = await userPilotApiRequest.call(this, 'GET', '/v1/users/search', undefined, { ...query, limit });
  const items = response.results || response.data || response;
  return Array.isArray(items) ? items.map((item: any) => ({ json: item })) : [{ json: items }];
}
