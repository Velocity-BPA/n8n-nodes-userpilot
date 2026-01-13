/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';
import { buildEventObject, processCustomProperties } from '../../utils';

export async function track(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;
  const eventName = this.getNodeParameter('eventName', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const metadata = processCustomProperties(
    additionalFields.metadataUi as { property: Array<{ key: string; value: string }> },
  );

  const timestamp = additionalFields.timestamp as string | undefined;

  const body = buildEventObject(userId, eventName, metadata, timestamp);

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/track', body);

  return [
    {
      json: {
        success: true,
        user_id: userId,
        event_name: eventName,
        ...response,
      },
    },
  ];
}
