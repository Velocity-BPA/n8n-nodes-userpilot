/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function getDefinition(this: IExecuteFunctions, index: number): Promise<any> {
  const eventName = this.getNodeParameter('eventName', index) as string;
  return userPilotApiRequest.call(this, 'GET', `/v1/events/definitions/${encodeURIComponent(eventName)}`);
}
