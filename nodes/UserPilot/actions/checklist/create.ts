/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function create(this: IExecuteFunctions, index: number): Promise<any> {
  const name = this.getNodeParameter('checklistName', index) as string;
  const items = this.getNodeParameter('checklistItems', index) as string;
  const additionalFields = this.getNodeParameter('checklistAdditionalFields', index, {}) as IDataObject;
  const targeting = this.getNodeParameter('checklistTargeting', index, '{}') as string;

  const body: IDataObject = { name, items: JSON.parse(items) };
  if (Object.keys(additionalFields).length > 0) Object.assign(body, additionalFields);
  if (targeting && targeting !== '{}') body.targeting = JSON.parse(targeting);

  return userPilotApiRequest.call(this, 'POST', '/v1/checklists', body);
}
