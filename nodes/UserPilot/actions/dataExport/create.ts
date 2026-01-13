/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const exportType = this.getNodeParameter('exportType', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    export_type: exportType,
  };

  if (additionalFields.dateFrom) {
    body.date_from = additionalFields.dateFrom;
  }
  if (additionalFields.dateTo) {
    body.date_to = additionalFields.dateTo;
  }
  if (additionalFields.format) {
    body.format = additionalFields.format;
  }
  if (additionalFields.fields) {
    body.fields = additionalFields.fields;
  }

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/exports', body);

  return [
    {
      json: {
        success: true,
        export_type: exportType,
        ...response,
      },
    },
  ];
}
