/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';
import { parseJsonInput, validateBulkLimits } from '../../utils';

export async function bulkTrack(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const eventsInput = this.getNodeParameter('events', index) as string | IDataObject[];

  let events: IDataObject[];

  if (typeof eventsInput === 'string') {
    const parsed = parseJsonInput(eventsInput);
    events = Array.isArray(parsed) ? parsed : [parsed];
  } else {
    events = Array.isArray(eventsInput) ? eventsInput : [eventsInput];
  }

  validateBulkLimits(events);

  const body = {
    events: events.map((event) => ({
      user_id: event.user_id || event.userId,
      event_name: event.event_name || event.eventName,
      metadata: event.metadata || event.properties || {},
      created_at: event.created_at || event.timestamp || new Date().toISOString(),
    })),
  };

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/track/bulk', body);

  return [
    {
      json: {
        success: true,
        total_events: events.length,
        ...response,
      },
    },
  ];
}
