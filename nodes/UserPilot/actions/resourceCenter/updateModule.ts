/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function updateModule(this: IExecuteFunctions, index: number): Promise<any> {
  const moduleId = this.getNodeParameter('moduleId', index) as string;
  const updateFields = this.getNodeParameter('moduleUpdateFields', index, {}) as IDataObject;

  const body: IDataObject = {};
  if (updateFields.name) body.name = updateFields.name;
  if (updateFields.content) body.content = JSON.parse(updateFields.content as string);
  if (updateFields.order !== undefined) body.order = updateFields.order;

  return userPilotApiRequest.call(this, 'PUT', `/v1/resource-center/modules/${moduleId}`, body);
}
