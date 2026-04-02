/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-userpilot/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class UserPilot implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'UserPilot',
    name: 'userpilot',
    icon: 'file:userpilot.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the UserPilot API',
    defaults: {
      name: 'UserPilot',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'userpilotApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'User',
            value: 'user',
          },
          {
            name: 'Event',
            value: 'event',
          },
          {
            name: 'Flow',
            value: 'flow',
          },
          {
            name: 'Segment',
            value: 'segment',
          },
          {
            name: 'Checklist',
            value: 'checklist',
          },
          {
            name: 'Survey',
            value: 'survey',
          }
        ],
        default: 'user',
      },
      // Operation dropdowns per resource
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['user'],
		},
	},
	options: [
		{
			name: 'Create User',
			value: 'createUser',
			description: 'Create a new user',
			action: 'Create user',
		},
		{
			name: 'Get User',
			value: 'getUser',
			description: 'Get user by ID',
			action: 'Get user',
		},
		{
			name: 'Get Users',
			value: 'getUsers',
			description: 'List all users with filtering',
			action: 'Get users',
		},
		{
			name: 'Update User',
			value: 'updateUser',
			description: 'Update user properties',
			action: 'Update user',
		},
		{
			name: 'Delete User',
			value: 'deleteUser',
			description: 'Delete a user',
			action: 'Delete user',
		},
	],
	default: 'createUser',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['event'] } },
  options: [
    { name: 'Create Event', value: 'createEvent', description: 'Track a custom event for a user', action: 'Create event' },
    { name: 'Get Events', value: 'getEvents', description: 'Retrieve events with filtering', action: 'Get events' },
    { name: 'Create Events Batch', value: 'createEventsBatch', description: 'Track multiple events in a single request', action: 'Create events batch' }
  ],
  default: 'createEvent',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['flow'],
		},
	},
	options: [
		{
			name: 'Get Flow',
			value: 'getFlow',
			description: 'Get flow details by ID',
			action: 'Get a flow',
		},
		{
			name: 'Get Flow Stats',
			value: 'getFlowStats',
			description: 'Get flow performance statistics',
			action: 'Get flow statistics',
		},
		{
			name: 'Get Flows',
			value: 'getFlows',
			description: 'List all flows',
			action: 'Get all flows',
		},
		{
			name: 'Trigger Flow',
			value: 'triggerFlow',
			description: 'Manually trigger a flow for a user',
			action: 'Trigger a flow',
		},
		{
			name: 'Get Flow Analytics',
			value: 'getFlowAnalytics',
			description: 'Get flow performance metrics',
			action: 'Get flow analytics',
		},
		{
			name: 'Update Flow Status',
			value: 'updateFlowStatus',
			description: 'Enable or disable a flow',
			action: 'Update flow status',
		},
	],
	default: 'getFlows',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['segment'],
		},
	},
	options: [
		{
			name: 'Get Segments',
			value: 'getSegments',
			description: 'List all segments',
			action: 'Get segments',
		},
		{
			name: 'Get Segment',
			value: 'getSegment',
			description: 'Get segment details by ID',
			action: 'Get a segment',
		},
		{
			name: 'Create Segment',
			value: 'createSegment',
			description: 'Create a new user segment',
			action: 'Create a segment',
		},
		{
			name: 'Update Segment',
			value: 'updateSegment',
			description: 'Update segment conditions',
			action: 'Update a segment',
		},
		{
			name: 'Delete Segment',
			value: 'deleteSegment',
			description: 'Delete a segment',
			action: 'Delete a segment',
		},
		{
			name: 'Get Segment Users',
			value: 'getSegmentUsers',
			description: 'Get users in a segment',
			action: 'Get segment users',
		},
	],
	default: 'getSegments',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['checklist'] } },
	options: [
		{ name: 'Get Checklists', value: 'getChecklists', description: 'List all checklists', action: 'Get checklists' },
		{ name: 'Get Checklist', value: 'getChecklist', description: 'Get checklist details by ID', action: 'Get a checklist' },
		{ name: 'Create Checklist', value: 'createChecklist', description: 'Create a new checklist', action: 'Create a checklist' },
		{ name: 'Update Checklist', value: 'updateChecklist', description: 'Update checklist tasks', action: 'Update a checklist' },
		{ name: 'Delete Checklist', value: 'deleteChecklist', description: 'Delete a checklist', action: 'Delete a checklist' },
		{ name: 'Complete Checklist Task', value: 'completeChecklistTask', description: 'Mark a checklist task as complete for a user', action: 'Complete checklist task' },
		{
			name: 'Complete Checklist Item',
			value: 'completeChecklistItem',
			description: 'Mark checklist item as complete for user',
			action: 'Complete checklist item',
		},
		{
			name: 'Get Checklist Progress',
			value: 'getChecklistProgress',
			description: 'Get user progress on checklist',
			action: 'Get checklist progress',
		},
		{
			name: 'Update Checklist Status',
			value: 'updateChecklistStatus',
			description: 'Enable or disable checklist',
			action: 'Update checklist status',
		},
	],
	default: 'getChecklists',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['survey'],
		},
	},
	options: [
		{
			name: 'Get Surveys',
			value: 'getSurveys',
			description: 'List all surveys including NPS',
			action: 'Get surveys',
		},
		{
			name: 'Get Survey',
			value: 'getSurvey',
			description: 'Get survey details by ID',
			action: 'Get survey',
		},
		{
			name: 'Create Survey',
			value: 'createSurvey',
			description: 'Create a new survey or NPS',
			action: 'Create survey',
		},
		{
			name: 'Update Survey',
			value: 'updateSurvey',
			description: 'Update survey configuration',
			action: 'Update survey',
		},
		{
			name: 'Delete Survey',
			value: 'deleteSurvey',
			description: 'Delete a survey',
			action: 'Delete survey',
		},
		{
			name: 'Get Survey Responses',
			value: 'getSurveyResponses',
			description: 'Get survey responses and analytics',
			action: 'Get survey responses',
		},
		{
			name: 'Trigger Survey',
			value: 'triggerSurvey',
			description: 'Manually trigger a survey for a user',
			action: 'Trigger survey',
		},
		{
			name: 'Create Survey Response',
			value: 'createSurveyResponse',
			description: 'Submit a survey response',
			action: 'Create survey response',
		},
		{
			name: 'Get Survey Analytics',
			value: 'getSurveyAnalytics',
			description: 'Get survey analytics including NPS scores',
			action: 'Get survey analytics',
		},
		{
			name: 'Update Survey Status',
			value: 'updateSurveyStatus',
			description: 'Enable or disable survey',
			action: 'Update survey status',
		},
	],
	default: 'getSurveys',
},
      // Parameter definitions
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'The unique identifier for the user',
},
{
	displayName: 'Email',
	name: 'email',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'The email address of the user',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'The name of the user',
},
{
	displayName: 'Properties',
	name: 'properties',
	type: 'json',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser', 'updateUser'],
		},
	},
	default: '{}',
	description: 'Additional properties for the user as JSON object',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUser', 'updateUser', 'deleteUser'],
		},
	},
	default: '',
	description: 'The unique identifier for the user',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUsers'],
		},
	},
	default: 50,
	description: 'Maximum number of users to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUsers'],
		},
	},
	default: 0,
	description: 'Number of users to skip',
},
{
	displayName: 'Filters',
	name: 'filters',
	type: 'json',
	required: false,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUsers'],
		},
	},
	default: '{}',
	description: 'Filters to apply when listing users as JSON object',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['event'], operation: ['createEvent'] } },
  default: '',
  description: 'The unique identifier of the user',
},
{
  displayName: 'Event Name',
  name: 'eventName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['event'], operation: ['createEvent'] } },
  default: '',
  description: 'The name of the event to track',
},
{
  displayName: 'Properties',
  name: 'properties',
  type: 'json',
  displayOptions: { show: { resource: ['event'], operation: ['createEvent'] } },
  default: '{}',
  description: 'Additional properties for the event as JSON object',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'dateTime',
  displayOptions: { show: { resource: ['event'], operation: ['createEvent'] } },
  default: '',
  description: 'The timestamp when the event occurred',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  displayOptions: { show: { resource: ['event'], operation: ['getEvents'] } },
  default: '',
  description: 'Filter events by user ID',
},
{
  displayName: 'Event Name',
  name: 'eventName',
  type: 'string',
  displayOptions: { show: { resource: ['event'], operation: ['getEvents'] } },
  default: '',
  description: 'Filter events by event name',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['event'], operation: ['getEvents'] } },
  default: '',
  description: 'Filter events from this date',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['event'], operation: ['getEvents'] } },
  default: '',
  description: 'Filter events until this date',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['event'], operation: ['getEvents'] } },
  default: 100,
  description: 'Maximum number of events to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['event'], operation: ['getEvents'] } },
  default: 0,
  description: 'Number of events to skip',
},
{
  displayName: 'Events',
  name: 'events',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['event'], operation: ['createEventsBatch'] } },
  default: '[]',
  description: 'Array of events to create in batch as JSON',
},
{
	displayName: 'Flow ID',
	name: 'flowId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['getFlow'],
		},
	},
	default: '',
	description: 'The ID of the flow to retrieve',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['getFlows'],
		},
	},
	default: 50,
	description: 'Number of flows to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['getFlows'],
		},
	},
	default: 0,
	description: 'Number of flows to skip',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['getFlows'],
		},
	},
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Inactive',
			value: 'inactive',
		},
		{
			name: 'Draft',
			value: 'draft',
		},
	],
	default: '',
	description: 'Filter flows by status',
},
{
	displayName: 'Flow ID',
	name: 'flowId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['triggerFlow'],
		},
	},
	default: '',
	description: 'The ID of the flow to trigger',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['triggerFlow'],
		},
	},
	default: '',
	description: 'The ID of the user to trigger the flow for',
},
{
	displayName: 'Flow ID',
	name: 'flowId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['getFlowStats'],
		},
	},
	default: '',
	description: 'The ID of the flow to get statistics for',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['getFlowStats'],
		},
	},
	default: '',
	description: 'Start date for statistics period',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['getFlowStats'],
		},
	},
	default: '',
	description: 'End date for statistics period',
},
{
  displayName: 'Flow ID',
  name: 'flowId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flow'],
      operation: ['getFlowAnalytics'],
    },
  },
  default: '',
  description: 'The ID of the flow to get analytics for',
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['flow'],
      operation: ['getFlowAnalytics'],
    },
  },
  options: [
    {
      name: 'Last 7 Days',
      value: '7d',
    },
    {
      name: 'Last 30 Days',
      value: '30d',
    },
    {
      name: 'Last 90 Days',
      value: '90d',
    },
    {
      name: 'Last Year',
      value: '1y',
    },
  ],
  default: '30d',
  description: 'Date range for analytics data',
},
{
  displayName: 'Flow ID',
  name: 'flowId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flow'],
      operation: ['updateFlowStatus'],
    },
  },
  default: '',
  description: 'The ID of the flow to update',
},
{
  displayName: 'Status',
  name: 'newStatus',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['flow'],
      operation: ['updateFlowStatus'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: 'active',
  description: 'The new status for the flow',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getSegments'],
		},
	},
	default: 50,
	description: 'Maximum number of segments to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getSegments'],
		},
	},
	default: 0,
	description: 'Number of segments to skip',
},
{
	displayName: 'Segment ID',
	name: 'segmentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getSegment', 'updateSegment', 'deleteSegment', 'getSegmentUsers'],
		},
	},
	default: '',
	description: 'ID of the segment',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment'],
		},
	},
	default: '',
	description: 'Name of the segment',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['updateSegment'],
		},
	},
	default: '',
	description: 'Name of the segment',
},
{
	displayName: 'Conditions',
	name: 'conditions',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment'],
		},
	},
	default: '{}',
	description: 'Segment conditions as JSON object',
},
{
	displayName: 'Conditions',
	name: 'conditions',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['updateSegment'],
		},
	},
	default: '{}',
	description: 'Segment conditions as JSON object',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['createSegment'],
		},
	},
	default: '',
	description: 'Description of the segment',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getSegmentUsers'],
		},
	},
	default: 50,
	description: 'Maximum number of users to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['segment'],
			operation: ['getSegmentUsers'],
		},
	},
	default: 0,
	description: 'Number of users to skip',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: { show: { resource: ['checklist'], operation: ['getChecklists'] } },
	default: 50,
	description: 'Maximum number of checklists to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: { show: { resource: ['checklist'], operation: ['getChecklists'] } },
	default: 0,
	description: 'Number of checklists to skip',
},
{
	displayName: 'Checklist ID',
	name: 'checklistId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['checklist'], operation: ['getChecklist', 'updateChecklist', 'deleteChecklist', 'completeChecklistTask'] } },
	default: '',
	description: 'ID of the checklist',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['checklist'], operation: ['createChecklist'] } },
	default: '',
	description: 'Name of the checklist',
},
{
	displayName: 'Tasks',
	name: 'tasks',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['checklist'], operation: ['createChecklist', 'updateChecklist'] } },
	default: '[]',
	description: 'Array of tasks for the checklist',
},
{
	displayName: 'Target Segment',
	name: 'targetSegment',
	type: 'string',
	displayOptions: { show: { resource: ['checklist'], operation: ['createChecklist'] } },
	default: '',
	description: 'Target segment for the checklist',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['checklist'], operation: ['completeChecklistTask'] } },
	default: '',
	description: 'ID of the user completing the task',
},
{
	displayName: 'Task ID',
	name: 'taskId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['checklist'], operation: ['completeChecklistTask'] } },
	default: '',
	description: 'ID of the task to mark as complete',
},
{
  displayName: 'Checklist ID',
  name: 'checklistId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['completeChecklistItem'],
    },
  },
  default: '',
  description: 'The ID of the checklist containing the item',
},
{
  displayName: 'Item ID',
  name: 'itemId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['completeChecklistItem'],
    },
  },
  default: '',
  description: 'The ID of the checklist item to complete',
},
{
  displayName: 'User Identification',
  name: 'userIdentification',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['completeChecklistItem'],
    },
  },
  options: [
    {
      name: 'User ID',
      value: 'userId',
    },
    {
      name: 'Email',
      value: 'email',
    },
  ],
  default: 'userId',
  description: 'How to identify the user',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['completeChecklistItem'],
      userIdentification: ['userId'],
    },
  },
  default: '',
  description: 'The ID of the user completing the item',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['completeChecklistItem'],
      userIdentification: ['email'],
    },
  },
  default: '',
  description: 'The email of the user completing the item',
},
{
  displayName: 'Checklist ID',
  name: 'checklistId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['getChecklistProgress'],
    },
  },
  default: '',
  description: 'The ID of the checklist to get progress for',
},
{
  displayName: 'User Identification',
  name: 'userIdentification',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['getChecklistProgress'],
    },
  },
  options: [
    {
      name: 'User ID',
      value: 'userId',
    },
    {
      name: 'Email',
      value: 'email',
    },
  ],
  default: 'userId',
  description: 'How to identify the user',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['getChecklistProgress'],
      userIdentification: ['userId'],
    },
  },
  default: '',
  description: 'The ID of the user to get progress for',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['getChecklistProgress'],
      userIdentification: ['email'],
    },
  },
  default: '',
  description: 'The email of the user to get progress for',
},
{
  displayName: 'Checklist ID',
  name: 'checklistId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['updateChecklistStatus'],
    },
  },
  default: '',
  description: 'The ID of the checklist to update',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklist'],
      operation: ['updateChecklistStatus'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: 'active',
  description: 'The new status for the checklist',
},
{
	displayName: 'Survey ID',
	name: 'surveyId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['getSurvey', 'updateSurvey', 'deleteSurvey', 'getSurveyResponses', 'triggerSurvey'],
		},
	},
	default: '',
	description: 'The ID of the survey',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['getSurveys', 'getSurveyResponses'],
		},
	},
	default: 20,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['getSurveys', 'getSurveyResponses'],
		},
	},
	default: 0,
	description: 'Number of results to skip',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['getSurveys'],
		},
	},
	options: [
		{
			name: 'NPS',
			value: 'nps',
		},
		{
			name: 'Feedback',
			value: 'feedback',
		},
		{
			name: 'Rating',
			value: 'rating',
		},
	],
	default: '',
	description: 'Filter surveys by type',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['createSurvey'],
		},
	},
	default: '',
	description: 'The name of the survey',
},
{
	displayName: 'Survey Type',
	name: 'surveyType',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['createSurvey'],
		},
	},
	options: [
		{
			name: 'NPS',
			value: 'nps',
		},
		{
			name: 'Feedback',
			value: 'feedback',
		},
		{
			name: 'Rating',
			value: 'rating',
		},
	],
	default: 'nps',
	description: 'The type of survey to create',
},
{
	displayName: 'Questions',
	name: 'questions',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['createSurvey', 'updateSurvey'],
		},
	},
	default: '[]',
	description: 'Array of survey questions with their configuration',
},
{
	displayName: 'Target Segment',
	name: 'targetSegment',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['createSurvey'],
		},
	},
	default: '',
	description: 'The user segment to target for this survey',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['getSurveyResponses'],
		},
	},
	default: '',
	description: 'Start date for filtering responses',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['getSurveyResponses'],
		},
	},
	default: '',
	description: 'End date for filtering responses',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['survey'],
			operation: ['triggerSurvey'],
		},
	},
	default: '',
	description: 'The ID of the user to trigger the survey for',
},
{
  displayName: 'Survey ID',
  name: 'surveyId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['survey'],
      operation: ['createSurveyResponse'],
    },
  },
  default: '',
  description: 'The ID of the survey to respond to',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['survey'],
      operation: ['createSurveyResponse'],
    },
  },
  default: '',
  description: 'The ID of the user submitting the response',
},
{
  displayName: 'Answers',
  name: 'answers',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['survey'],
      operation: ['createSurveyResponse'],
    },
  },
  default: '{}',
  description: 'The survey answers in JSON format',
},
{
  displayName: 'Survey ID',
  name: 'surveyId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['survey'],
      operation: ['getSurveyAnalytics'],
    },
  },
  default: '',
  description: 'The ID of the survey to get analytics for',
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'fixedCollection',
  displayOptions: {
    show: {
      resource: ['survey'],
      operation: ['getSurveyAnalytics'],
    },
  },
  default: {},
  placeholder: 'Add Date Range',
  typeOptions: {
    multipleValues: false,
  },
  options: [
    {
      name: 'range',
      displayName: 'Date Range',
      values: [
        {
          displayName: 'Start Date',
          name: 'startDate',
          type: 'dateTime',
          default: '',
          description: 'Start date for analytics data',
        },
        {
          displayName: 'End Date',
          name: 'endDate',
          type: 'dateTime',
          default: '',
          description: 'End date for analytics data',
        },
      ],
    },
  ],
  description: 'Date range for analytics data',
},
{
  displayName: 'Survey ID',
  name: 'surveyId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['survey'],
      operation: ['updateSurveyStatus'],
    },
  },
  default: '',
  description: 'The ID of the survey to update',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['survey'],
      operation: ['updateSurveyStatus'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: 'active',
  description: 'The new status for the survey',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'user':
        return [await executeUserOperations.call(this, items)];
      case 'event':
        return [await executeEventOperations.call(this, items)];
      case 'flow':
        return [await executeFlowOperations.call(this, items)];
      case 'segment':
        return [await executeSegmentOperations.call(this, items)];
      case 'checklist':
        return [await executeChecklistOperations.call(this, items)];
      case 'survey':
        return [await executeSurveyOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeUserOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('userpilotApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createUser': {
					const userId = this.getNodeParameter('userId', i) as string;
					const email = this.getNodeParameter('email', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const properties = this.getNodeParameter('properties', i) as string;

					const body: any = {
						user_id: userId,
						email: email,
					};

					if (name) {
						body.name = name;
					}

					if (properties) {
						try {
							body.properties = JSON.parse(properties);
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in properties field');
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/users`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUser': {
					const userId = this.getNodeParameter('userId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUsers': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const filters = this.getNodeParameter('filters', i) as string;

					const qs: any = {
						limit: limit,
						offset: offset,
					};

					if (filters) {
						try {
							const parsedFilters = JSON.parse(filters);
							Object.assign(qs, parsedFilters);
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in filters field');
						}
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateUser': {
					const userId = this.getNodeParameter('userId', i) as string;
					const properties = this.getNodeParameter('properties', i) as string;

					const body: any = {};

					if (properties) {
						try {
							body.properties = JSON.parse(properties);
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in properties field');
						}
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/users/${userId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteUser': {
					const userId = this.getNodeParameter('userId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/users/${userId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				if (error.httpCode === 401) {
					throw new NodeApiError(this.getNode(), error, {
						message: 'Invalid API credentials',
						description: 'Please check your UserPilot API key',
					});
				}
				if (error.httpCode === 404) {
					throw new NodeApiError(this.getNode(), error, {
						message: 'User not found',
						description: 'The specified user does not exist',
					});
				}
				throw error;
			}
		}
	}

	return returnData;
}

async function executeEventOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('userpilotApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createEvent': {
          const userId = this.getNodeParameter('userId', i) as string;
          const eventName = this.getNodeParameter('eventName', i) as string;
          const properties = this.getNodeParameter('properties', i) as string;
          const timestamp = this.getNodeParameter('timestamp', i) as string;

          const body: any = {
            user_id: userId,
            event_name: eventName,
          };

          if (properties) {
            try {
              body.properties = JSON.parse(properties);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), 'Invalid JSON in properties field');
            }
          }

          if (timestamp) {
            body.timestamp = timestamp;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/events`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEvents': {
          const userId = this.getNodeParameter('userId', i) as string;
          const eventName = this.getNodeParameter('eventName', i) as string;
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: any = {};
          if (userId) queryParams.user_id = userId;
          if (eventName) queryParams.event_name = eventName;
          if (startDate) queryParams.start_date = startDate;
          if (endDate) queryParams.end_date = endDate;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/events${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createEventsBatch': {
          const events = this.getNodeParameter('events', i) as string;
          let eventsArray: any[];

          try {
            eventsArray = JSON.parse(events);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in events field');
          }

          if (!Array.isArray(eventsArray)) {
            throw new NodeOperationError(this.getNode(), 'Events must be an array');
          }

          const body: any = {
            events: eventsArray,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/events/batch`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeFlowOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('userpilotApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getFlows': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const status = this.getNodeParameter('status', i) as string;

					const queryParams = new URLSearchParams();
					if (limit) queryParams.append('limit', limit.toString());
					if (offset) queryParams.append('offset', offset.toString());
					if (status) queryParams.append('status', status);

					const url = `${credentials.baseUrl}/flows${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getFlow': {
					const flowId = this.getNodeParameter('flowId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/flows/${flowId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'triggerFlow': {
					const flowId = this.getNodeParameter('flowId', i) as string;
					const userId = this.getNodeParameter('userId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/flows/${flowId}/trigger`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							user_id: userId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getFlowStats': {
					const flowId = this.getNodeParameter('flowId', i) as string;
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;

					const queryParams = new URLSearchParams();
					if (startDate) queryParams.append('start_date', startDate);
					if (endDate) queryParams.append('end_date', endDate);

					const url = `${credentials.baseUrl}/flows/${flowId}/stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

        case 'getFlowAnalytics': {
          const flowId = this.getNodeParameter('flowId', i) as string;
          const dateRange = this.getNodeParameter('dateRange', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/flows/${flowId}/analytics?date_range=${dateRange}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateFlowStatus': {
          const flowId = this.getNodeParameter('flowId', i) as string;
          const newStatus = this.getNodeParameter('newStatus', i) as string;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/flows/${flowId}/status`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              status: newStatus,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
			}
		}
	}

	return returnData;
}

async function executeSegmentOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('userpilotApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getSegments': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/segments`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							limit,
							offset,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createSegment': {
					const name = this.getNodeParameter('name', i) as string;
					const conditions = this.getNodeParameter('conditions', i) as object;
					const description = this.getNodeParameter('description', i) as string;

					const body: any = {
						name,
						conditions,
					};

					if (description) {
						body.description = description;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/segments`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const conditions = this.getNodeParameter('conditions', i) as object;

					const body: any = {};

					if (name) {
						body.name = name;
					}

					if (conditions && Object.keys(conditions).length > 0) {
						body.conditions = conditions;
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteSegment': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/segments/${segmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSegmentUsers': {
					const segmentId = this.getNodeParameter('segmentId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/segments/${segmentId}/users`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							limit,
							offset,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.