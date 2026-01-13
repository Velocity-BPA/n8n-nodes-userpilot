/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function createModule(this: IExecuteFunctions, index: number): Promise<any> {
  const name = this.getNodeParameter('moduleName', index) as string;
  const type = this.getNodeParameter('moduleType', index) as string;
  const content = this.getNodeParameter('moduleContent', index) as string;

  const body: IDataObject = { name, type, content: JSON.parse(content) };
  return userPilotApiRequest.call(this, 'POST', '/v1/resource-center/modules', body);
}
