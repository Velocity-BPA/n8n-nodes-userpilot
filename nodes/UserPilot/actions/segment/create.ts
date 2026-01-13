/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function create(this: IExecuteFunctions, index: number): Promise<any> {
  const name = this.getNodeParameter('segmentName', index) as string;
  const conditions = this.getNodeParameter('segmentConditions', index) as string;
  const additionalFields = this.getNodeParameter('segmentAdditionalFields', index, {}) as IDataObject;

  const body: IDataObject = { name, conditions: JSON.parse(conditions) };
  if (additionalFields.type) body.type = additionalFields.type;

  return userPilotApiRequest.call(this, 'POST', '/v1/segments', body);
}
