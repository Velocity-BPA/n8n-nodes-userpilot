/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';
import { buildUserObject, processCustomProperties, processAdditionalFields } from '../../utils';

export async function identify(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const properties: IDataObject = {};

  if (additionalFields.name) {
    properties.name = additionalFields.name;
  }
  if (additionalFields.email) {
    properties.email = additionalFields.email;
  }
  if (additionalFields.createdAt) {
    properties.created_at = additionalFields.createdAt;
  }

  const customProperties = processCustomProperties(
    additionalFields.customPropertiesUi as { property: Array<{ key: string; value: string }> },
  );

  const companyId = additionalFields.companyId as string | undefined;

  const body = buildUserObject(
    userId,
    processAdditionalFields(properties),
    customProperties,
    companyId,
  );

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/users/identify', body);

  return [
    {
      json: {
        success: true,
        user_id: userId,
        ...response,
      },
    },
  ];
}
