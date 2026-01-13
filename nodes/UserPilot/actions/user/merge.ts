/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function merge(this: IExecuteFunctions, index: number): Promise<any> {
  const sourceUserId = this.getNodeParameter('sourceUserId', index) as string;
  const targetUserId = this.getNodeParameter('targetUserId', index) as string;
  return userPilotApiRequest.call(this, 'POST', '/v1/users/merge', {
    source_user_id: sourceUserId,
    target_user_id: targetUserId,
  });
}
