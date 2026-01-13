/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';
import { processCustomProperties, processAdditionalFields } from '../../utils';

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const properties: IDataObject = {
    company_id: companyId,
  };

  if (updateFields.name) {
    properties.name = updateFields.name;
  }
  if (updateFields.createdAt) {
    properties.created_at = updateFields.createdAt;
  }

  const customProperties = processCustomProperties(
    updateFields.customPropertiesUi as { property: Array<{ key: string; value: string }> },
  );

  const body = {
    ...processAdditionalFields(properties),
    ...customProperties,
  };

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/companies/identify', body);

  return [
    {
      json: {
        success: true,
        company_id: companyId,
        updated: true,
        ...response,
      },
    },
  ];
}
