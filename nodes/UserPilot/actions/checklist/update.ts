/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function update(this: IExecuteFunctions, index: number): Promise<any> {
  const checklistId = this.getNodeParameter('checklistId', index) as string;
  const additionalFields = this.getNodeParameter('checklistAdditionalFields', index, {}) as IDataObject;
  const targeting = this.getNodeParameter('checklistTargeting', index, '{}') as string;

  const body: IDataObject = {};
  if (Object.keys(additionalFields).length > 0) {
    if (additionalFields.items) additionalFields.items = JSON.parse(additionalFields.items as string);
    Object.assign(body, additionalFields);
  }
  if (targeting && targeting !== '{}') body.targeting = JSON.parse(targeting);

  return userPilotApiRequest.call(this, 'PUT', `/v1/checklists/${checklistId}`, body);
}
