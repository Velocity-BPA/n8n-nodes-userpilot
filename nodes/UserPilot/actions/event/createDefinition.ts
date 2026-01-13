/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function createDefinition(this: IExecuteFunctions, index: number): Promise<any> {
  const eventName = this.getNodeParameter('eventName', index) as string;
  const description = this.getNodeParameter('eventDefinitionDescription', index, '') as string;

  const body: IDataObject = { name: eventName };
  if (description) body.description = description;

  return userPilotApiRequest.call(this, 'POST', '/v1/events/definitions', body);
}
