/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function update(this: IExecuteFunctions, index: number): Promise<any> {
  const segmentId = this.getNodeParameter('segmentId', index) as string;
  const additionalFields = this.getNodeParameter('segmentAdditionalFields', index, {}) as IDataObject;

  const body: IDataObject = {};
  if (additionalFields.name) body.name = additionalFields.name;
  if (additionalFields.conditions) body.conditions = JSON.parse(additionalFields.conditions as string);

  return userPilotApiRequest.call(this, 'PUT', `/v1/segments/${segmentId}`, body);
}
