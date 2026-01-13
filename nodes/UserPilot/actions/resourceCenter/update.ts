/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function update(this: IExecuteFunctions, index: number): Promise<any> {
  const settings = this.getNodeParameter('resourceCenterSettings', index, '{}') as string;
  return userPilotApiRequest.call(this, 'PUT', '/v1/resource-center', JSON.parse(settings));
}
