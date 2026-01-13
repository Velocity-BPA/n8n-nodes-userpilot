/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function unpublish(this: IExecuteFunctions, index: number): Promise<any> {
  const bannerId = this.getNodeParameter('bannerId', index) as string;
  return userPilotApiRequest.call(this, 'POST', `/v1/banners/${bannerId}/unpublish`);
}
