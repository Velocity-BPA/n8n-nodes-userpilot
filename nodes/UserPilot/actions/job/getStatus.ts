/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function getStatus(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobId = this.getNodeParameter('jobId', index) as string;

  const response = await userPilotApiRequest.call(
    this,
    'GET',
    `/v1/jobs/${encodeURIComponent(jobId)}`,
  );

  return [
    {
      json: response,
    },
  ];
}
