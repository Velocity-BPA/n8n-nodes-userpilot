/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function update(this: IExecuteFunctions, index: number): Promise<any> {
  const surveyId = this.getNodeParameter('surveyId', index) as string;
  const additionalFields = this.getNodeParameter('npsAdditionalFields', index, {}) as IDataObject;
  const targeting = this.getNodeParameter('npsTargeting', index, '{}') as string;

  const body: IDataObject = {};
  if (additionalFields.name) body.name = additionalFields.name;
  if (additionalFields.question) body.question = additionalFields.question;
  if (additionalFields.followUpEnabled !== undefined) body.follow_up_enabled = additionalFields.followUpEnabled;
  if (targeting && targeting !== '{}') body.targeting = JSON.parse(targeting);

  return userPilotApiRequest.call(this, 'PUT', `/v1/nps/${surveyId}`, body);
}
