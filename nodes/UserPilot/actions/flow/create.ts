/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function create(this: IExecuteFunctions, index: number): Promise<any> {
  const name = this.getNodeParameter('flowName', index) as string;
  const additionalFields = this.getNodeParameter('flowAdditionalFields', index, {}) as IDataObject;
  const targeting = this.getNodeParameter('flowTargeting', index, '{}') as string;

  const body: IDataObject = { name };
  if (additionalFields.targetUrl) body.target_url = additionalFields.targetUrl;
  if (targeting && targeting !== '{}') body.targeting = JSON.parse(targeting);

  return userPilotApiRequest.call(this, 'POST', '/v1/flows', body);
}
