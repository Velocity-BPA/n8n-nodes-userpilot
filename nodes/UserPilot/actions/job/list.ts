/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function list(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (additionalFields.status) {
    query.status = additionalFields.status;
  }
  if (additionalFields.type) {
    query.type = additionalFields.type;
  }

  if (!returnAll) {
    const limit = this.getNodeParameter('limit', index, 50) as number;
    query.limit = limit;
  }

  const response = await userPilotApiRequest.call(this, 'GET', '/v1/jobs', undefined, query);

  const jobs = Array.isArray(response) ? response : response.data || response.jobs || [];

  return jobs.map((job: IDataObject) => ({ json: job }));
}
