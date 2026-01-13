/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function update(this: IExecuteFunctions, index: number): Promise<any> {
  const bannerId = this.getNodeParameter('bannerId', index) as string;
  const additionalFields = this.getNodeParameter('bannerAdditionalFields', index, {}) as IDataObject;
  const targeting = this.getNodeParameter('bannerTargeting', index, '{}') as string;

  const body: IDataObject = {};
  if (additionalFields.name) body.name = additionalFields.name;
  if (additionalFields.position) body.position = additionalFields.position;
  if (additionalFields.content) body.content = JSON.parse(additionalFields.content as string);
  if (targeting && targeting !== '{}') body.targeting = JSON.parse(targeting);

  return userPilotApiRequest.call(this, 'PUT', `/v1/banners/${bannerId}`, body);
}
