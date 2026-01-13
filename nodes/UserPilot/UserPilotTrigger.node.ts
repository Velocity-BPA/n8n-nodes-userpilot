/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from 'n8n-workflow';

export class UserPilotTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'UserPilot Trigger',
    name: 'userPilotTrigger',
    icon: 'file:userpilot.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Starts workflow when UserPilot events occur',
    defaults: {
      name: 'UserPilot Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'userPilotApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        default: 'user.identified',
        options: [
          {
            name: 'User Identified',
            value: 'user.identified',
            description: 'Triggered when a new user is identified',
          },
          {
            name: 'User Updated',
            value: 'user.updated',
            description: 'Triggered when user properties change',
          },
          {
            name: 'Event Tracked',
            value: 'event.tracked',
            description: 'Triggered when a custom event is tracked',
          },
          {
            name: 'Flow Started',
            value: 'flow.started',
            description: 'Triggered when a user starts a flow',
          },
          {
            name: 'Flow Completed',
            value: 'flow.completed',
            description: 'Triggered when a user completes a flow',
          },
          {
            name: 'Flow Dismissed',
            value: 'flow.dismissed',
            description: 'Triggered when a user dismisses a flow',
          },
          {
            name: 'NPS Submitted',
            value: 'nps.submitted',
            description: 'Triggered when an NPS response is received',
          },
          {
            name: 'Checklist Completed',
            value: 'checklist.completed',
            description: 'Triggered when a checklist is completed',
          },
          {
            name: 'Checklist Item Completed',
            value: 'checklist.item.completed',
            description: 'Triggered when a checklist item is completed',
          },
          {
            name: 'Segment Entered',
            value: 'segment.entered',
            description: 'Triggered when a user enters a segment',
          },
          {
            name: 'Segment Exited',
            value: 'segment.exited',
            description: 'Triggered when a user exits a segment',
          },
          {
            name: 'All Events',
            value: '*',
            description: 'Triggered for all UserPilot events',
          },
        ],
        description: 'The event to listen for',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Flow ID Filter',
            name: 'flowId',
            type: 'string',
            default: '',
            description: 'Only trigger for specific flow ID (for flow events)',
          },
          {
            displayName: 'Segment ID Filter',
            name: 'segmentId',
            type: 'string',
            default: '',
            description: 'Only trigger for specific segment ID (for segment events)',
          },
          {
            displayName: 'Event Name Filter',
            name: 'eventName',
            type: 'string',
            default: '',
            description: 'Only trigger for specific event name (for event.tracked)',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        // Webhook management is done manually in UserPilot dashboard
        // This always returns false to show the webhook URL
        return false;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        // UserPilot webhooks must be configured manually in the dashboard
        // Return true to indicate setup instructions should be shown
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        // Webhook deletion is done manually in UserPilot dashboard
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const event = this.getNodeParameter('event') as string;
    const options = this.getNodeParameter('options', {}) as {
      flowId?: string;
      segmentId?: string;
      eventName?: string;
    };

    const body = req.body;

    // Validate event type if not listening to all events
    if (event !== '*' && body.event !== event) {
      return {
        noWebhookResponse: true,
      };
    }

    // Apply filters
    if (options.flowId && body.flow_id !== options.flowId) {
      return { noWebhookResponse: true };
    }

    if (options.segmentId && body.segment_id !== options.segmentId) {
      return { noWebhookResponse: true };
    }

    if (options.eventName && body.event_name !== options.eventName) {
      return { noWebhookResponse: true };
    }

    return {
      workflowData: [
        this.helpers.returnJsonArray(body),
      ],
    };
  }
}
