/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function create(this: IExecuteFunctions, index: number): Promise<any> {
  const name = this.getNodeParameter('bannerName', index) as string;
  const content = this.getNodeParameter('bannerContent', index) as string;
  const additionalFields = this.getNodeParameter('bannerAdditionalFields', index, {}) as IDataObject;
  const targeting = this.getNodeParameter('bannerTargeting', index, '{}') as string;

  const body: IDataObject = { name, content: JSON.parse(content) };
  if (additionalFields.position) body.position = additionalFields.position;
  if (targeting && targeting !== '{}') body.targeting = JSON.parse(targeting);

  return userPilotApiRequest.call(this, 'POST', '/v1/banners', body);
}
