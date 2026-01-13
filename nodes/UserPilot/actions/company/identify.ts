/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';
import { buildCompanyObject, processCustomProperties, processAdditionalFields } from '../../utils';

export async function identify(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const companyId = this.getNodeParameter('companyId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const properties: IDataObject = {};

  if (additionalFields.name) {
    properties.name = additionalFields.name;
  }
  if (additionalFields.createdAt) {
    properties.created_at = additionalFields.createdAt;
  }

  const customProperties = processCustomProperties(
    additionalFields.customPropertiesUi as { property: Array<{ key: string; value: string }> },
  );

  const body = buildCompanyObject(
    companyId,
    processAdditionalFields(properties),
    customProperties,
  );

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/companies/identify', body);

  return [
    {
      json: {
        success: true,
        company_id: companyId,
        ...response,
      },
    },
  ];
}
