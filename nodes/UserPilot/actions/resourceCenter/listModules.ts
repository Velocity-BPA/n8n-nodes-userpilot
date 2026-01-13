/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest, userPilotApiRequestAllItems } from '../../transport';

export async function listModules(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  if (returnAll) {
    const response = await userPilotApiRequestAllItems.call(this, 'GET', '/v1/resource-center/modules');
    return response.map((item: any) => ({ json: item }));
  }

  const response = await userPilotApiRequest.call(this, 'GET', '/v1/resource-center/modules', undefined, { limit });
  const items = response.results || response.data || response;
  return Array.isArray(items) ? items.map((item: any) => ({ json: item })) : [{ json: items }];
}
