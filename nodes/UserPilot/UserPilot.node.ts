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
            name: 'Users',
            value: 'users',
          },
          {
            name: 'unknown',
            value: 'unknown',
          },
          {
            name: 'Flows',
            value: 'flows',
          },
          {
            name: 'Checklists',
            value: 'checklists',
          },
          {
            name: 'Segments',
            value: 'segments',
          },
          {
            name: 'Surveys',
            value: 'surveys',
          }
        ],
        default: 'users',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['users'],
    },
  },
  options: [
    {
      name: 'Create User',
      value: 'createUser',
      description: 'Create or update a user profile',
      action: 'Create user',
    },
    {
      name: 'Get User',
      value: 'getUser',
      description: 'Retrieve a specific user profile',
      action: 'Get user',
    },
    {
      name: 'Get All Users',
      value: 'getAllUsers',
      description: 'List all users with pagination',
      action: 'Get all users',
    },
    {
      name: 'Update User',
      value: 'updateUser',
      description: 'Update user properties and attributes',
      action: 'Update user',
    },
    {
      name: 'Delete User',
      value: 'deleteUser',
      description: 'Remove a user profile',
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
  displayOptions: {
    show: {
      resource: ['flows'],
    },
  },
  options: [
    {
      name: 'Get All Flows',
      value: 'getAllFlows',
      description: 'List all flows and their status',
      action: 'Get all flows',
    },
    {
      name: 'Get Flow',
      value: 'getFlow',
      description: 'Get specific flow details and configuration',
      action: 'Get a flow',
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
  default: 'getAllFlows',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['checklists'],
    },
  },
  options: [
    {
      name: 'Get All Checklists',
      value: 'getAllChecklists',
      description: 'List all checklists and their configuration',
      action: 'Get all checklists',
    },
    {
      name: 'Get Checklist',
      value: 'getChecklist',
      description: 'Get specific checklist details',
      action: 'Get a checklist',
    },
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
  default: 'getAllChecklists',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['segments'],
    },
  },
  options: [
    {
      name: 'Get All Segments',
      value: 'getAllSegments',
      description: 'List all user segments',
      action: 'Get all segments',
    },
    {
      name: 'Get Segment',
      value: 'getSegment',
      description: 'Get specific segment configuration and criteria',
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
      description: 'Update segment criteria and configuration',
      action: 'Update a segment',
    },
    {
      name: 'Get Segment Users',
      value: 'getSegmentUsers',
      description: 'List users belonging to a segment',
      action: 'Get segment users',
    },
  ],
  default: 'getAllSegments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['surveys'],
    },
  },
  options: [
    {
      name: 'Get All Surveys',
      value: 'getAllSurveys',
      description: 'List all surveys including NPS surveys',
      action: 'Get all surveys',
    },
    {
      name: 'Get Survey',
      value: 'getSurvey',
      description: 'Get specific survey configuration',
      action: 'Get a survey',
    },
    {
      name: 'Create Survey Response',
      value: 'createSurveyResponse',
      description: 'Submit a survey response',
      action: 'Create survey response',
    },
    {
      name: 'Get Survey Responses',
      value: 'getSurveyResponses',
      description: 'Get all responses for a survey',
      action: 'Get survey responses',
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
  default: 'getAllSurveys',
},
      // Parameter definitions
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
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
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser'],
    },
  },
  default: '',
  description: 'The user email address',
},
{
  displayName: 'Properties',
  name: 'properties',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser'],
    },
  },
  default: '{}',
  description: 'Custom properties for the user profile',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUser'],
    },
  },
  default: '',
  description: 'The unique identifier for the user to retrieve',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getAllUsers'],
    },
  },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getAllUsers'],
    },
  },
  default: 50,
  description: 'Number of users per page',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getAllUsers'],
    },
  },
  default: '{}',
  description: 'Filter criteria for user search',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '',
  description: 'The unique identifier for the user to update',
},
{
  displayName: 'Properties',
  name: 'properties',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '{}',
  description: 'Properties to update for the user',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['deleteUser'],
    },
  },
  default: '',
  description: 'The unique identifier for the user to delete',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['flows'],
      operation: ['getAllFlows'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
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
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['flows'],
      operation: ['getAllFlows'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Onboarding',
      value: 'onboarding',
    },
    {
      name: 'Feature Adoption',
      value: 'feature_adoption',
    },
    {
      name: 'Product Tour',
      value: 'product_tour',
    },
  ],
  default: '',
  description: 'Filter flows by type',
},
{
  displayName: 'Flow ID',
  name: 'flowId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flows'],
      operation: ['getFlow'],
    },
  },
  default: '',
  description: 'The ID of the flow to retrieve',
},
{
  displayName: 'Flow ID',
  name: 'flowId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flows'],
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
  displayOptions: {
    show: {
      resource: ['flows'],
      operation: ['triggerFlow'],
    },
  },
  default: '',
  description: 'The ID of the user to trigger the flow for (required if email not provided)',
},
{
  displayName: 'User Email',
  name: 'userEmail',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['flows'],
      operation: ['triggerFlow'],
    },
  },
  default: '',
  description: 'The email of the user to trigger the flow for (required if user ID not provided)',
},
{
  displayName: 'Flow ID',
  name: 'flowId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flows'],
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
      resource: ['flows'],
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
      resource: ['flows'],
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
      resource: ['flows'],
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
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['checklists'],
      operation: ['getAllChecklists'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: '',
  description: 'Filter checklists by status',
},
{
  displayName: 'Checklist ID',
  name: 'checklistId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklists'],
      operation: ['getChecklist'],
    },
  },
  default: '',
  description: 'The ID of the checklist to retrieve',
},
{
  displayName: 'Checklist ID',
  name: 'checklistId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
      resource: ['checklists'],
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
  displayName: 'Segment ID',
  name: 'segmentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['segments'],
      operation: ['getSegment'],
    },
  },
  default: '',
  description: 'The ID of the segment to retrieve',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['segments'],
      operation: ['createSegment'],
    },
  },
  default: '',
  description: 'The name of the segment',
},
{
  displayName: 'Criteria',
  name: 'criteria',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['segments'],
      operation: ['createSegment', 'updateSegment'],
    },
  },
  default: '{}',
  description: 'The criteria for the segment in JSON format',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['segments'],
      operation: ['createSegment'],
    },
  },
  default: '',
  description: 'The description of the segment',
},
{
  displayName: 'Segment ID',
  name: 'segmentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['segments'],
      operation: ['updateSegment'],
    },
  },
  default: '',
  description: 'The ID of the segment to update',
},
{
  displayName: 'Segment ID',
  name: 'segmentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['segments'],
      operation: ['getSegmentUsers'],
    },
  },
  default: '',
  description: 'The ID of the segment to get users for',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['segments'],
      operation: ['getSegmentUsers'],
    },
  },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['segments'],
      operation: ['getSegmentUsers'],
    },
  },
  default: 50,
  description: 'Number of users to return per page',
},
{
  displayName: 'Survey Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['surveys'],
      operation: ['getAllSurveys'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'NPS',
      value: 'nps',
    },
    {
      name: 'CSAT',
      value: 'csat',
    },
    {
      name: 'Custom',
      value: 'custom',
    },
  ],
  default: '',
  description: 'Filter surveys by type',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['surveys'],
      operation: ['getAllSurveys'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
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
  description: 'Filter surveys by status',
},
{
  displayName: 'Survey ID',
  name: 'surveyId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['surveys'],
      operation: ['getSurvey'],
    },
  },
  default: '',
  description: 'The ID of the survey to retrieve',
},
{
  displayName: 'Survey ID',
  name: 'surveyId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['surveys'],
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
      resource: ['surveys'],
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
      resource: ['surveys'],
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
      resource: ['surveys'],
      operation: ['getSurveyResponses'],
    },
  },
  default: '',
  description: 'The ID of the survey to get responses for',
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'fixedCollection',
  displayOptions: {
    show: {
      resource: ['surveys'],
      operation: ['getSurveyResponses'],
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
          description: 'Start date for filtering responses',
        },
        {
          displayName: 'End Date',
          name: 'endDate',
          type: 'dateTime',
          default: '',
          description: 'End date for filtering responses',
        },
      ],
    },
  ],
  description: 'Date range for filtering responses',
},
{
  displayName: 'Survey ID',
  name: 'surveyId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['surveys'],
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
      resource: ['surveys'],
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
      resource: ['surveys'],
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
      resource: ['surveys'],
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
      case 'users':
        return [await executeUsersOperations.call(this, items)];
      case 'unknown':
        return [await executeunknownOperations.call(this, items)];
      case 'flows':
        return [await executeFlowsOperations.call(this, items)];
      case 'checklists':
        return [await executeChecklistsOperations.call(this, items)];
      case 'segments':
        return [await executeSegmentsOperations.call(this, items)];
      case 'surveys':
        return [await executeSurveysOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeUsersOperations(
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
          const propertiesParam = this.getNodeParameter('properties', i) as string;
          
          let properties: any = {};
          if (propertiesParam) {
            try {
              properties = typeof propertiesParam === 'string' ? JSON.parse(propertiesParam) : propertiesParam;
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in properties: ${error.message}`);
            }
          }

          const body: any = {
            user_id: userId,
            properties: properties,
          };

          if (email) {
            body.email = email;
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
            url: `${credentials.baseUrl}/users/${encodeURIComponent(userId)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllUsers': {
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const filtersParam = this.getNodeParameter('filters', i) as string;

          let filters: any = {};
          if (filtersParam) {
            try {
              filters = typeof filtersParam === 'string' ? JSON.parse(filtersParam) : filtersParam;
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in filters: ${error.message}`);
            }
          }

          const queryParams: string[] = [];
          if (page) queryParams.push(`page=${page}`);
          if (limit) queryParams.push(`limit=${limit}`);

          Object.keys(filters).forEach((key: string) => {
            queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`);
          });

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/users${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateUser': {
          const userId = this.getNodeParameter('userId', i) as string;
          const propertiesParam = this.getNodeParameter('properties', i) as string;

          let properties: any = {};
          try {
            properties = typeof propertiesParam === 'string' ? JSON.parse(propertiesParam) : propertiesParam;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in properties: ${error.message}`);
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/users/${encodeURIComponent(userId)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              properties: properties,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteUser': {
          const userId = this.getNodeParameter('userId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/users/${encodeURIComponent(userId)}`,
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
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
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

// PARSE ERROR for unknown — manual fix needed
// Raw: // No additional imports

{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['events'],
    },
  },
  options: [
    {
      name: 'Create Event',
      value: 'createEvent',
      description: 'Track a cus

async function executeFlowsOperations(
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
        case 'getAllFlows': {
          const status = this.getNodeParameter('status', i) as string;
          const type = this.getNodeParameter('type', i) as string;

          const queryParams: string[] = [];
          if (status) queryParams.push(`status=${status}`);
          if (type) queryParams.push(`type=${type}`);
          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `https://api.userpilot.com/v1/flows${queryString}`,
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
            url: `https://api.userpilot.com/v1/flows/${flowId}`,
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
          const userEmail = this.getNodeParameter('userEmail', i) as string;

          if (!userId && !userEmail) {
            throw new NodeOperationError(
              this.getNode(),
              'Either User ID or User Email must be provided'
            );
          }

          const body: any = {};
          if (userId) body.user_id = userId;
          if (userEmail) body.email = userEmail;

          const options: any = {
            method: 'POST',
            url: `https://api.userpilot.com/v1/flows/${flowId}/trigger`,
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

        case 'getFlowAnalytics': {
          const flowId = this.getNodeParameter('flowId', i) as string;
          const dateRange = this.getNodeParameter('dateRange', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://api.userpilot.com/v1/flows/${flowId}/analytics?date_range=${dateRange}`,
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
            url: `https://api.userpilot.com/v1/flows/${flowId}/status`,
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

async function executeChecklistsOperations(
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
        case 'getAllChecklists': {
          const status = this.getNodeParameter('status', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/checklists`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {},
            json: true,
          };

          if (status) {
            options.qs.status = status;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getChecklist': {
          const checklistId = this.getNodeParameter('checklistId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/checklists/${checklistId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'completeChecklistItem': {
          const checklistId = this.getNodeParameter('checklistId', i) as string;
          const itemId = this.getNodeParameter('itemId', i) as string;
          const userIdentification = this.getNodeParameter('userIdentification', i) as string;
          
          const body: any = {};
          
          if (userIdentification === 'userId') {
            body.user_id = this.getNodeParameter('userId', i) as string;
          } else {
            body.email = this.getNodeParameter('email', i) as string;
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/checklists/${checklistId}/items/${itemId}/complete`,
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

        case 'getChecklistProgress': {
          const checklistId = this.getNodeParameter('checklistId', i) as string;
          const userIdentification = this.getNodeParameter('userIdentification', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/checklists/${checklistId}/progress`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {},
            json: true,
          };

          if (userIdentification === 'userId') {
            options.qs.user_id = this.getNodeParameter('userId', i) as string;
          } else {
            options.qs.email = this.getNodeParameter('email', i) as string;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateChecklistStatus': {
          const checklistId = this.getNodeParameter('checklistId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/checklists/${checklistId}/status`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              status,
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeSegmentsOperations(
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
        case 'getAllSegments': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/segments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/segments/${segmentId}`,
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
          const criteria = this.getNodeParameter('criteria', i) as any;
          const description = this.getNodeParameter('description', i) as string;

          const body: any = {
            name,
            criteria: typeof criteria === 'string' ? JSON.parse(criteria) : criteria,
          };

          if (description) {
            body.description = description;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/segments`,
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
          const criteria = this.getNodeParameter('criteria', i) as any;

          const body: any = {
            criteria: typeof criteria === 'string' ? JSON.parse(criteria) : criteria,
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/segments/${segmentId}`,
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

        case 'getSegmentUsers': {
          const segmentId = this.getNodeParameter('segmentId', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const qs: any = {};
          if (page) qs.page = page;
          if (limit) qs.limit = limit;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/segments/${segmentId}/users`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeSurveysOperations(
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
        case 'getAllSurveys': {
          const type = this.getNodeParameter('type', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const qs: any = {};
          if (type) qs.type = type;
          if (status) qs.status = status;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/surveys`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSurvey': {
          const surveyId = this.getNodeParameter('surveyId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/surveys/${surveyId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSurveyResponse': {
          const surveyId = this.getNodeParameter('surveyId', i) as string;
          const userId = this.getNodeParameter('userId', i) as string;
          const answersInput = this.getNodeParameter('answers', i) as string;

          let answers: any;
          try {
            answers = typeof answersInput === 'string' ? JSON.parse(answersInput) : answersInput;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON format for answers parameter');
          }

          const body: any = {
            user_id: userId,
            answers: answers,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/surveys/${surveyId}/responses`,
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

        case 'getSurveyResponses': {
          const surveyId = this.getNodeParameter('surveyId', i) as string;
          const dateRange = this.getNodeParameter('dateRange', i) as any;

          const qs: any = {};
          if (dateRange && dateRange.range) {
            if (dateRange.range.startDate) {
              qs.start_date = new Date(dateRange.range.startDate).toISOString();
            }
            if (dateRange.range.endDate) {
              qs.end_date = new Date(dateRange.range.endDate).toISOString();
            }
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/surveys/${surveyId}/responses`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSurveyAnalytics': {
          const surveyId = this.getNodeParameter('surveyId', i) as string;
          const dateRange = this.getNodeParameter('dateRange', i) as any;

          const qs: any = {};
          if (dateRange && dateRange.range) {
            if (dateRange.range.startDate) {
              qs.start_date = new Date(dateRange.range.startDate).toISOString();
            }
            if (dateRange.range.endDate) {
              qs.end_date = new Date(dateRange.range.endDate).toISOString();
            }
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/surveys/${surveyId}/analytics`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSurveyStatus': {
          const surveyId = this.getNodeParameter('surveyId', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const body: any = {
            status: status,
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://api.userpilot.com/v1'}/surveys/${surveyId}/status`,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response && error.response.body) {
          const errorMessage = error.response.body.message || error.response.body.error || error.message;
          throw new NodeApiError(this.getNode(), error.response.body, { 
            message: errorMessage,
            httpCode: error.response.statusCode?.toString() 
          });
        }
        throw error;
      }
    }
  }

  return returnData;
}
