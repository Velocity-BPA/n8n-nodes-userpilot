/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function deleteNps(this: IExecuteFunctions, index: number): Promise<any> {
  const surveyId = this.getNodeParameter('surveyId', index) as string;
  await userPilotApiRequest.call(this, 'DELETE', `/v1/nps/${surveyId}`);
  return { success: true, deleted: surveyId };
}
