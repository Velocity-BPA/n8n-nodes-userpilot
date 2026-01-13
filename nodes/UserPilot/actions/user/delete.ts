/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function deleteUser(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;

  const response = await userPilotApiRequest.call(
    this,
    'DELETE',
    `/v1/users/${encodeURIComponent(userId)}`,
  );

  return [
    {
      json: {
        success: true,
        user_id: userId,
        deleted: true,
        ...response,
      },
    },
  ];
}
