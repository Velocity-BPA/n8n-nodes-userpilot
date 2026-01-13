/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function deleteChecklist(this: IExecuteFunctions, index: number): Promise<any> {
  const checklistId = this.getNodeParameter('checklistId', index) as string;
  await userPilotApiRequest.call(this, 'DELETE', `/v1/checklists/${checklistId}`);
  return { success: true, deleted: checklistId };
}
