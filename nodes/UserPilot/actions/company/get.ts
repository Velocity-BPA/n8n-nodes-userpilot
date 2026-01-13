/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;

  const response = await userPilotApiRequest.call(
    this,
    'GET',
    `/v1/companies/${encodeURIComponent(companyId)}`,
  );

  return [
    {
      json: response,
    },
  ];
}
