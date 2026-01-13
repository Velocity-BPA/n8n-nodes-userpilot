/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function trigger(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const flowId = this.getNodeParameter('flowId', index) as string;
  const userId = this.getNodeParameter('userId', index) as string;

  const body = {
    flow_id: flowId,
    user_id: userId,
  };

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/flows/trigger', body);

  return [
    {
      json: {
        success: true,
        flow_id: flowId,
        user_id: userId,
        triggered: true,
        ...response,
      },
    },
  ];
}
