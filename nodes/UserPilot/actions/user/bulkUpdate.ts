/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';
import { parseJsonInput, validateBulkLimits } from '../../utils';

export async function bulkUpdate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const usersInput = this.getNodeParameter('users', index) as string | IDataObject[];

  let users: IDataObject[];

  if (typeof usersInput === 'string') {
    const parsed = parseJsonInput(usersInput);
    users = Array.isArray(parsed) ? parsed : [parsed];
  } else {
    users = Array.isArray(usersInput) ? usersInput : [usersInput];
  }

  validateBulkLimits(users);

  const body = {
    users: users.map((user) => ({
      user_id: user.user_id || user.userId,
      ...user,
    })),
  };

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/users/bulk', body);

  return [
    {
      json: {
        success: true,
        total_users: users.length,
        ...response,
      },
    },
  ];
}
