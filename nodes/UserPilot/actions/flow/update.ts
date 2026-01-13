/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function update(this: IExecuteFunctions, index: number): Promise<any> {
  const flowId = this.getNodeParameter('flowId', index) as string;
  const additionalFields = this.getNodeParameter('flowAdditionalFields', index, {}) as IDataObject;
  const targeting = this.getNodeParameter('flowTargeting', index, '{}') as string;

  const body: IDataObject = {};
  if (additionalFields.name) body.name = additionalFields.name;
  if (additionalFields.targetUrl) body.target_url = additionalFields.targetUrl;
  if (targeting && targeting !== '{}') body.targeting = JSON.parse(targeting);

  return userPilotApiRequest.call(this, 'PUT', `/v1/flows/${flowId}`, body);
}
