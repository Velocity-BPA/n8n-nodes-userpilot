/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import * as user from './actions/user';
import * as company from './actions/company';
import * as event from './actions/event';
import * as flow from './actions/flow';
import * as nps from './actions/nps';
import * as checklist from './actions/checklist';
import * as resourceCenter from './actions/resourceCenter';
import * as segment from './actions/segment';
import * as dataExport from './actions/dataExport';
import * as job from './actions/job';
import * as spotlight from './actions/spotlight';
import * as banner from './actions/banner';

export class UserPilot implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'UserPilot',
    name: 'userPilot',
    icon: 'file:userpilot.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with UserPilot API for user onboarding and product growth',
    defaults: {
      name: 'UserPilot',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'userPilotApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Banner', value: 'banner' },
          { name: 'Checklist', value: 'checklist' },
          { name: 'Company', value: 'company' },
          { name: 'Data Export', value: 'dataExport' },
          { name: 'Event', value: 'event' },
          { name: 'Flow', value: 'flow' },
          { name: 'Job', value: 'job' },
          { name: 'NPS Survey', value: 'nps' },
          { name: 'Resource Center', value: 'resourceCenter' },
          { name: 'Segment', value: 'segment' },
          { name: 'Spotlight', value: 'spotlight' },
          { name: 'User', value: 'user' },
        ],
        default: 'user',
      },

      // ==================== USER OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['user'] } },
        options: [
          { name: 'Bulk Import', value: 'bulkImport', description: 'Bulk import users from CSV file', action: 'Bulk import users' },
          { name: 'Bulk Update', value: 'bulkUpdate', description: 'Batch update multiple users', action: 'Bulk update users' },
          { name: 'Delete', value: 'delete', description: 'Delete a user', action: 'Delete a user' },
          { name: 'Get', value: 'get', description: 'Get user details', action: 'Get a user' },
          { name: 'Get Events', value: 'getEvents', description: 'Get user event history', action: 'Get user events' },
          { name: 'Get Flows', value: 'getFlows', description: 'Get user flow interactions', action: 'Get user flows' },
          { name: 'Identify', value: 'identify', description: 'Identify or create a user', action: 'Identify a user' },
          { name: 'List', value: 'list', description: 'List all users', action: 'List users' },
          { name: 'Merge', value: 'merge', description: 'Merge duplicate users', action: 'Merge users' },
          { name: 'Search', value: 'search', description: 'Search users by property', action: 'Search users' },
          { name: 'Update', value: 'update', description: 'Update user properties', action: 'Update a user' },
        ],
        default: 'identify',
      },

      // ==================== COMPANY OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['company'] } },
        options: [
          { name: 'Bulk Update', value: 'bulkUpdate', description: 'Batch update multiple companies', action: 'Bulk update companies' },
          { name: 'Delete', value: 'delete', description: 'Delete a company', action: 'Delete a company' },
          { name: 'Get', value: 'get', description: 'Get company details', action: 'Get a company' },
          { name: 'Get Analytics', value: 'getAnalytics', description: 'Get company engagement data', action: 'Get company analytics' },
          { name: 'Get Users', value: 'getUsers', description: 'Get users in company', action: 'Get company users' },
          { name: 'Identify', value: 'identify', description: 'Identify or create a company', action: 'Identify a company' },
          { name: 'List', value: 'list', description: 'List all companies', action: 'List companies' },
          { name: 'Search', value: 'search', description: 'Search companies by property', action: 'Search companies' },
          { name: 'Update', value: 'update', description: 'Update company properties', action: 'Update a company' },
        ],
        default: 'identify',
      },

      // ==================== EVENT OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['event'] } },
        options: [
          { name: 'Bulk Import', value: 'bulkImport', description: 'Bulk import events from CSV', action: 'Bulk import events' },
          { name: 'Bulk Track', value: 'bulkTrack', description: 'Batch track multiple events', action: 'Bulk track events' },
          { name: 'Create Definition', value: 'createDefinition', description: 'Define a new event type', action: 'Create event definition' },
          { name: 'Get Analytics', value: 'getAnalytics', description: 'Get event metrics', action: 'Get event analytics' },
          { name: 'Get Definition', value: 'getDefinition', description: 'Get event type details', action: 'Get event definition' },
          { name: 'List Definitions', value: 'listDefinitions', description: 'List all tracked event types', action: 'List event definitions' },
          { name: 'Track', value: 'track', description: 'Track a custom event', action: 'Track an event' },
        ],
        default: 'track',
      },

      // ==================== FLOW OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['flow'] } },
        options: [
          { name: 'Create', value: 'create', description: 'Create a new flow', action: 'Create a flow' },
          { name: 'Delete', value: 'delete', description: 'Delete a flow', action: 'Delete a flow' },
          { name: 'Duplicate', value: 'duplicate', description: 'Clone a flow', action: 'Duplicate a flow' },
          { name: 'Get', value: 'get', description: 'Get flow details', action: 'Get a flow' },
          { name: 'Get Analytics', value: 'getAnalytics', description: 'Get flow metrics', action: 'Get flow analytics' },
          { name: 'List', value: 'list', description: 'List all flows', action: 'List flows' },
          { name: 'Publish', value: 'publish', description: 'Publish a flow', action: 'Publish a flow' },
          { name: 'Trigger', value: 'trigger', description: 'Trigger a flow for a user', action: 'Trigger a flow' },
          { name: 'Unpublish', value: 'unpublish', description: 'Unpublish a flow', action: 'Unpublish a flow' },
          { name: 'Update', value: 'update', description: 'Update flow settings', action: 'Update a flow' },
        ],
        default: 'list',
      },

      // ==================== NPS OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['nps'] } },
        options: [
          { name: 'Create', value: 'create', description: 'Create an NPS survey', action: 'Create NPS survey' },
          { name: 'Delete', value: 'delete', description: 'Delete an NPS survey', action: 'Delete NPS survey' },
          { name: 'Export Data', value: 'exportData', description: 'Export NPS data', action: 'Export NPS data' },
          { name: 'Get', value: 'get', description: 'Get NPS survey details', action: 'Get NPS survey' },
          { name: 'Get Analytics', value: 'getAnalytics', description: 'Get NPS trends', action: 'Get NPS analytics' },
          { name: 'Get Responses', value: 'getResponses', description: 'Get NPS responses', action: 'Get NPS responses' },
          { name: 'List', value: 'list', description: 'List all NPS surveys', action: 'List NPS surveys' },
          { name: 'Publish', value: 'publish', description: 'Publish an NPS survey', action: 'Publish NPS survey' },
          { name: 'Unpublish', value: 'unpublish', description: 'Unpublish an NPS survey', action: 'Unpublish NPS survey' },
          { name: 'Update', value: 'update', description: 'Update NPS settings', action: 'Update NPS survey' },
        ],
        default: 'list',
      },

      // ==================== CHECKLIST OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['checklist'] } },
        options: [
          { name: 'Create', value: 'create', description: 'Create a checklist', action: 'Create a checklist' },
          { name: 'Delete', value: 'delete', description: 'Delete a checklist', action: 'Delete a checklist' },
          { name: 'Get', value: 'get', description: 'Get checklist details', action: 'Get a checklist' },
          { name: 'Get Analytics', value: 'getAnalytics', description: 'Get completion metrics', action: 'Get checklist analytics' },
          { name: 'Get User Progress', value: 'getUserProgress', description: 'Get user checklist progress', action: 'Get user progress' },
          { name: 'List', value: 'list', description: 'List all checklists', action: 'List checklists' },
          { name: 'Publish', value: 'publish', description: 'Publish a checklist', action: 'Publish a checklist' },
          { name: 'Unpublish', value: 'unpublish', description: 'Unpublish a checklist', action: 'Unpublish a checklist' },
          { name: 'Update', value: 'update', description: 'Update a checklist', action: 'Update a checklist' },
        ],
        default: 'list',
      },

      // ==================== RESOURCE CENTER OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['resourceCenter'] } },
        options: [
          { name: 'Create Module', value: 'createModule', description: 'Create a module', action: 'Create module' },
          { name: 'Delete Module', value: 'deleteModule', description: 'Delete a module', action: 'Delete module' },
          { name: 'Get', value: 'get', description: 'Get resource center config', action: 'Get resource center' },
          { name: 'Get Module Analytics', value: 'getModuleAnalytics', description: 'Get module engagement', action: 'Get module analytics' },
          { name: 'List Modules', value: 'listModules', description: 'List modules', action: 'List modules' },
          { name: 'Reorder Modules', value: 'reorderModules', description: 'Reorder modules', action: 'Reorder modules' },
          { name: 'Update', value: 'update', description: 'Update resource center', action: 'Update resource center' },
          { name: 'Update Module', value: 'updateModule', description: 'Update a module', action: 'Update module' },
        ],
        default: 'get',
      },

      // ==================== SEGMENT OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['segment'] } },
        options: [
          { name: 'Create', value: 'create', description: 'Create a segment', action: 'Create a segment' },
          { name: 'Delete', value: 'delete', description: 'Delete a segment', action: 'Delete a segment' },
          { name: 'Get', value: 'get', description: 'Get segment details', action: 'Get a segment' },
          { name: 'Get Size', value: 'getSize', description: 'Get segment member count', action: 'Get segment size' },
          { name: 'Get Users', value: 'getUsers', description: 'Get users in segment', action: 'Get segment users' },
          { name: 'List', value: 'list', description: 'List all segments', action: 'List segments' },
          { name: 'Update', value: 'update', description: 'Update a segment', action: 'Update a segment' },
        ],
        default: 'list',
      },

      // ==================== DATA EXPORT OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['dataExport'] } },
        options: [
          { name: 'Cancel', value: 'cancel', description: 'Cancel pending export', action: 'Cancel export' },
          { name: 'Create', value: 'create', description: 'Create an export job', action: 'Create export' },
          { name: 'Download', value: 'download', description: 'Download export file', action: 'Download export' },
          { name: 'Get Status', value: 'getStatus', description: 'Check export status', action: 'Get export status' },
          { name: 'List', value: 'list', description: 'List export jobs', action: 'List exports' },
        ],
        default: 'create',
      },

      // ==================== JOB OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['job'] } },
        options: [
          { name: 'Cancel', value: 'cancel', description: 'Cancel pending job', action: 'Cancel job' },
          { name: 'Get Errors', value: 'getErrors', description: 'Get job error details', action: 'Get job errors' },
          { name: 'Get Status', value: 'getStatus', description: 'Get job status', action: 'Get job status' },
          { name: 'List', value: 'list', description: 'List recent jobs', action: 'List jobs' },
          { name: 'Retry', value: 'retry', description: 'Retry failed job', action: 'Retry job' },
        ],
        default: 'list',
      },

      // ==================== SPOTLIGHT OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['spotlight'] } },
        options: [
          { name: 'Create', value: 'create', description: 'Create a spotlight', action: 'Create a spotlight' },
          { name: 'Delete', value: 'delete', description: 'Delete a spotlight', action: 'Delete a spotlight' },
          { name: 'Get', value: 'get', description: 'Get spotlight details', action: 'Get a spotlight' },
          { name: 'Get Analytics', value: 'getAnalytics', description: 'Get spotlight metrics', action: 'Get spotlight analytics' },
          { name: 'List', value: 'list', description: 'List all spotlights', action: 'List spotlights' },
          { name: 'Publish', value: 'publish', description: 'Publish a spotlight', action: 'Publish a spotlight' },
          { name: 'Unpublish', value: 'unpublish', description: 'Unpublish a spotlight', action: 'Unpublish a spotlight' },
          { name: 'Update', value: 'update', description: 'Update a spotlight', action: 'Update a spotlight' },
        ],
        default: 'list',
      },

      // ==================== BANNER OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['banner'] } },
        options: [
          { name: 'Create', value: 'create', description: 'Create a banner', action: 'Create a banner' },
          { name: 'Delete', value: 'delete', description: 'Delete a banner', action: 'Delete a banner' },
          { name: 'Get', value: 'get', description: 'Get banner details', action: 'Get a banner' },
          { name: 'Get Analytics', value: 'getAnalytics', description: 'Get banner metrics', action: 'Get banner analytics' },
          { name: 'List', value: 'list', description: 'List all banners', action: 'List banners' },
          { name: 'Publish', value: 'publish', description: 'Publish a banner', action: 'Publish a banner' },
          { name: 'Unpublish', value: 'unpublish', description: 'Unpublish a banner', action: 'Unpublish a banner' },
          { name: 'Update', value: 'update', description: 'Update a banner', action: 'Update a banner' },
        ],
        default: 'list',
      },

      // ==================== USER FIELDS ====================
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        required: true,
        default: '',
        description: 'Unique identifier for the user',
        displayOptions: { show: { resource: ['user'], operation: ['identify', 'update', 'get', 'delete', 'getEvents', 'getFlows'] } },
      },
      {
        displayName: 'Source User ID',
        name: 'sourceUserId',
        type: 'string',
        required: true,
        default: '',
        description: 'User ID to merge from',
        displayOptions: { show: { resource: ['user'], operation: ['merge'] } },
      },
      {
        displayName: 'Target User ID',
        name: 'targetUserId',
        type: 'string',
        required: true,
        default: '',
        description: 'User ID to merge into',
        displayOptions: { show: { resource: ['user'], operation: ['merge'] } },
      },
      {
        displayName: 'Search Property',
        name: 'searchProperty',
        type: 'string',
        required: true,
        default: '',
        description: 'Property name to search by',
        displayOptions: { show: { resource: ['user'], operation: ['search'] } },
      },
      {
        displayName: 'Search Value',
        name: 'searchValue',
        type: 'string',
        required: true,
        default: '',
        description: 'Value to search for',
        displayOptions: { show: { resource: ['user'], operation: ['search'] } },
      },
      {
        displayName: 'Users JSON',
        name: 'users',
        type: 'json',
        required: true,
        default: '[]',
        description: 'Array of user objects to update',
        displayOptions: { show: { resource: ['user'], operation: ['bulkUpdate'] } },
      },
      {
        displayName: 'CSV File',
        name: 'csvFile',
        type: 'string',
        required: true,
        default: 'data',
        description: 'Binary property containing CSV file',
        displayOptions: { show: { resource: ['user'], operation: ['bulkImport'] } },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['user'], operation: ['identify', 'update'] } },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '', description: 'User display name' },
          { displayName: 'Email', name: 'email', type: 'string', default: '', description: 'User email address' },
          { displayName: 'Created At', name: 'created_at', type: 'dateTime', default: '', description: 'User creation date' },
          { displayName: 'Company ID', name: 'companyId', type: 'string', default: '', description: 'Associated company ID' },
        ],
      },
      {
        displayName: 'Custom Properties',
        name: 'customProperties',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Property',
        default: {},
        displayOptions: { show: { resource: ['user'], operation: ['identify', 'update'] } },
        options: [
          {
            displayName: 'Property',
            name: 'property',
            values: [
              { displayName: 'Key', name: 'key', type: 'string', default: '' },
              { displayName: 'Value', name: 'value', type: 'string', default: '' },
            ],
          },
        ],
      },

      // ==================== COMPANY FIELDS ====================
      {
        displayName: 'Company ID',
        name: 'companyId',
        type: 'string',
        required: true,
        default: '',
        description: 'Unique identifier for the company',
        displayOptions: { show: { resource: ['company'], operation: ['identify', 'update', 'get', 'delete', 'getUsers', 'getAnalytics'] } },
      },
      {
        displayName: 'Company Search Property',
        name: 'companySearchProperty',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['company'], operation: ['search'] } },
      },
      {
        displayName: 'Company Search Value',
        name: 'companySearchValue',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['company'], operation: ['search'] } },
      },
      {
        displayName: 'Companies JSON',
        name: 'companies',
        type: 'json',
        required: true,
        default: '[]',
        displayOptions: { show: { resource: ['company'], operation: ['bulkUpdate'] } },
      },
      {
        displayName: 'Company Additional Fields',
        name: 'companyAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['company'], operation: ['identify', 'update'] } },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Created At', name: 'created_at', type: 'dateTime', default: '' },
        ],
      },
      {
        displayName: 'Company Custom Properties',
        name: 'companyCustomProperties',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Property',
        default: {},
        displayOptions: { show: { resource: ['company'], operation: ['identify', 'update'] } },
        options: [
          {
            displayName: 'Property',
            name: 'property',
            values: [
              { displayName: 'Key', name: 'key', type: 'string', default: '' },
              { displayName: 'Value', name: 'value', type: 'string', default: '' },
            ],
          },
        ],
      },

      // ==================== EVENT FIELDS ====================
      {
        displayName: 'Event User ID',
        name: 'eventUserId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['event'], operation: ['track'] } },
      },
      {
        displayName: 'Event Name',
        name: 'eventName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['event'], operation: ['track', 'createDefinition', 'getDefinition', 'getAnalytics'] } },
      },
      {
        displayName: 'Events JSON',
        name: 'events',
        type: 'json',
        required: true,
        default: '[]',
        displayOptions: { show: { resource: ['event'], operation: ['bulkTrack'] } },
      },
      {
        displayName: 'Events CSV File',
        name: 'eventsCsvFile',
        type: 'string',
        required: true,
        default: 'data',
        displayOptions: { show: { resource: ['event'], operation: ['bulkImport'] } },
      },
      {
        displayName: 'Event Additional Fields',
        name: 'eventAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['event'], operation: ['track'] } },
        options: [
          { displayName: 'Timestamp', name: 'timestamp', type: 'dateTime', default: '' },
          { displayName: 'Session ID', name: 'sessionId', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Event Metadata',
        name: 'eventMetadata',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Metadata',
        default: {},
        displayOptions: { show: { resource: ['event'], operation: ['track'] } },
        options: [
          {
            displayName: 'Property',
            name: 'property',
            values: [
              { displayName: 'Key', name: 'key', type: 'string', default: '' },
              { displayName: 'Value', name: 'value', type: 'string', default: '' },
            ],
          },
        ],
      },
      {
        displayName: 'Event Definition Description',
        name: 'eventDefinitionDescription',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['event'], operation: ['createDefinition'] } },
      },

      // ==================== FLOW FIELDS ====================
      {
        displayName: 'Flow ID',
        name: 'flowId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['flow'], operation: ['get', 'update', 'delete', 'trigger', 'publish', 'unpublish', 'getAnalytics', 'duplicate'] } },
      },
      {
        displayName: 'Flow User ID',
        name: 'flowUserId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['flow'], operation: ['trigger'] } },
      },
      {
        displayName: 'Flow Name',
        name: 'flowName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['flow'], operation: ['create'] } },
      },
      {
        displayName: 'Flow Additional Fields',
        name: 'flowAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['flow'], operation: ['create', 'update'] } },
        options: [
          { displayName: 'Target URL', name: 'targetUrl', type: 'string', default: '' },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Flow Targeting',
        name: 'flowTargeting',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['flow'], operation: ['create', 'update'] } },
      },

      // ==================== NPS FIELDS ====================
      {
        displayName: 'NPS Survey ID',
        name: 'surveyId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['nps'], operation: ['get', 'update', 'delete', 'getResponses', 'publish', 'unpublish', 'getAnalytics', 'exportData'] } },
      },
      {
        displayName: 'NPS Survey Name',
        name: 'npsName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['nps'], operation: ['create'] } },
      },
      {
        displayName: 'NPS Additional Fields',
        name: 'npsAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['nps'], operation: ['create', 'update'] } },
        options: [
          { displayName: 'Question', name: 'question', type: 'string', default: '' },
          { displayName: 'Follow-Up Enabled', name: 'followUpEnabled', type: 'boolean', default: false },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'NPS Targeting',
        name: 'npsTargeting',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['nps'], operation: ['create', 'update'] } },
      },

      // ==================== CHECKLIST FIELDS ====================
      {
        displayName: 'Checklist ID',
        name: 'checklistId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['checklist'], operation: ['get', 'update', 'delete', 'publish', 'unpublish', 'getAnalytics'] } },
      },
      {
        displayName: 'Checklist User ID',
        name: 'checklistUserId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['checklist'], operation: ['getUserProgress'] } },
      },
      {
        displayName: 'Checklist Name',
        name: 'checklistName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['checklist'], operation: ['create'] } },
      },
      {
        displayName: 'Checklist Items',
        name: 'checklistItems',
        type: 'json',
        required: true,
        default: '[]',
        displayOptions: { show: { resource: ['checklist'], operation: ['create'] } },
      },
      {
        displayName: 'Checklist Additional Fields',
        name: 'checklistAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['checklist'], operation: ['create', 'update'] } },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Items', name: 'items', type: 'json', default: '[]' },
        ],
      },
      {
        displayName: 'Checklist Targeting',
        name: 'checklistTargeting',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['checklist'], operation: ['create', 'update'] } },
      },

      // ==================== RESOURCE CENTER FIELDS ====================
      {
        displayName: 'Module ID',
        name: 'moduleId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['resourceCenter'], operation: ['updateModule', 'deleteModule', 'getModuleAnalytics'] } },
      },
      {
        displayName: 'Module Name',
        name: 'moduleName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['resourceCenter'], operation: ['createModule'] } },
      },
      {
        displayName: 'Module Type',
        name: 'moduleType',
        type: 'options',
        required: true,
        default: 'article',
        options: [
          { name: 'Article', value: 'article' },
          { name: 'Video', value: 'video' },
          { name: 'Link', value: 'link' },
          { name: 'Checklist', value: 'checklist' },
        ],
        displayOptions: { show: { resource: ['resourceCenter'], operation: ['createModule'] } },
      },
      {
        displayName: 'Module Content',
        name: 'moduleContent',
        type: 'json',
        required: true,
        default: '{}',
        displayOptions: { show: { resource: ['resourceCenter'], operation: ['createModule'] } },
      },
      {
        displayName: 'Module Order',
        name: 'moduleOrder',
        type: 'json',
        required: true,
        default: '[]',
        displayOptions: { show: { resource: ['resourceCenter'], operation: ['reorderModules'] } },
      },
      {
        displayName: 'Resource Center Settings',
        name: 'resourceCenterSettings',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['resourceCenter'], operation: ['update'] } },
      },
      {
        displayName: 'Module Update Fields',
        name: 'moduleUpdateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['resourceCenter'], operation: ['updateModule'] } },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Content', name: 'content', type: 'json', default: '{}' },
          { displayName: 'Order', name: 'order', type: 'number', default: 0 },
        ],
      },

      // ==================== SEGMENT FIELDS ====================
      {
        displayName: 'Segment ID',
        name: 'segmentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['segment'], operation: ['get', 'update', 'delete', 'getUsers', 'getSize'] } },
      },
      {
        displayName: 'Segment Name',
        name: 'segmentName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['segment'], operation: ['create'] } },
      },
      {
        displayName: 'Segment Conditions',
        name: 'segmentConditions',
        type: 'json',
        required: true,
        default: '[]',
        displayOptions: { show: { resource: ['segment'], operation: ['create'] } },
      },
      {
        displayName: 'Segment Additional Fields',
        name: 'segmentAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['segment'], operation: ['create', 'update'] } },
        options: [
          { displayName: 'Type', name: 'type', type: 'options', default: 'user', options: [{ name: 'User', value: 'user' }, { name: 'Company', value: 'company' }] },
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Conditions', name: 'conditions', type: 'json', default: '[]' },
        ],
      },

      // ==================== DATA EXPORT FIELDS ====================
      {
        displayName: 'Export ID',
        name: 'exportId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['dataExport'], operation: ['getStatus', 'download', 'cancel'] } },
      },
      {
        displayName: 'Export Type',
        name: 'exportType',
        type: 'options',
        required: true,
        default: 'users',
        options: [
          { name: 'Users', value: 'users' },
          { name: 'Events', value: 'events' },
          { name: 'Companies', value: 'companies' },
        ],
        displayOptions: { show: { resource: ['dataExport'], operation: ['create'] } },
      },
      {
        displayName: 'Export Additional Fields',
        name: 'exportAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['dataExport'], operation: ['create'] } },
        options: [
          { displayName: 'Date From', name: 'dateFrom', type: 'dateTime', default: '' },
          { displayName: 'Date To', name: 'dateTo', type: 'dateTime', default: '' },
          { displayName: 'Format', name: 'format', type: 'options', default: 'csv', options: [{ name: 'CSV', value: 'csv' }, { name: 'JSON', value: 'json' }] },
        ],
      },
      {
        displayName: 'Export Filters',
        name: 'exportFilters',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['dataExport'], operation: ['create'] } },
      },

      // ==================== JOB FIELDS ====================
      {
        displayName: 'Job ID',
        name: 'jobId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['job'], operation: ['getStatus', 'cancel', 'retry', 'getErrors'] } },
      },
      {
        displayName: 'Job Type Filter',
        name: 'jobTypeFilter',
        type: 'options',
        default: '',
        options: [
          { name: 'All', value: '' },
          { name: 'Bulk Import', value: 'bulk_import' },
          { name: 'Bulk Update', value: 'bulk_update' },
          { name: 'Export', value: 'export' },
        ],
        displayOptions: { show: { resource: ['job'], operation: ['list'] } },
      },

      // ==================== SPOTLIGHT FIELDS ====================
      {
        displayName: 'Spotlight ID',
        name: 'spotlightId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['spotlight'], operation: ['get', 'update', 'delete', 'publish', 'unpublish', 'getAnalytics'] } },
      },
      {
        displayName: 'Spotlight Name',
        name: 'spotlightName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['spotlight'], operation: ['create'] } },
      },
      {
        displayName: 'Spotlight Selector',
        name: 'spotlightSelector',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['spotlight'], operation: ['create'] } },
      },
      {
        displayName: 'Spotlight Content',
        name: 'spotlightContent',
        type: 'json',
        required: true,
        default: '{}',
        displayOptions: { show: { resource: ['spotlight'], operation: ['create'] } },
      },
      {
        displayName: 'Spotlight Additional Fields',
        name: 'spotlightAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['spotlight'], operation: ['create', 'update'] } },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Selector', name: 'selector', type: 'string', default: '' },
          { displayName: 'Content', name: 'content', type: 'json', default: '{}' },
        ],
      },
      {
        displayName: 'Spotlight Targeting',
        name: 'spotlightTargeting',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['spotlight'], operation: ['create', 'update'] } },
      },

      // ==================== BANNER FIELDS ====================
      {
        displayName: 'Banner ID',
        name: 'bannerId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['banner'], operation: ['get', 'update', 'delete', 'publish', 'unpublish', 'getAnalytics'] } },
      },
      {
        displayName: 'Banner Name',
        name: 'bannerName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['banner'], operation: ['create'] } },
      },
      {
        displayName: 'Banner Content',
        name: 'bannerContent',
        type: 'json',
        required: true,
        default: '{}',
        displayOptions: { show: { resource: ['banner'], operation: ['create'] } },
      },
      {
        displayName: 'Banner Additional Fields',
        name: 'bannerAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['banner'], operation: ['create', 'update'] } },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Position', name: 'position', type: 'options', default: 'top', options: [{ name: 'Top', value: 'top' }, { name: 'Bottom', value: 'bottom' }] },
          { displayName: 'Content', name: 'content', type: 'json', default: '{}' },
        ],
      },
      {
        displayName: 'Banner Targeting',
        name: 'bannerTargeting',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['banner'], operation: ['create', 'update'] } },
      },

      // ==================== PAGINATION OPTIONS ====================
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
          show: {
            resource: ['user', 'company', 'event', 'flow', 'nps', 'checklist', 'segment', 'dataExport', 'job', 'spotlight', 'banner', 'resourceCenter'],
            operation: ['list', 'search', 'getResponses', 'getUsers', 'listModules', 'listDefinitions'],
          },
        },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: { minValue: 1, maxValue: 100 },
        displayOptions: {
          show: {
            resource: ['user', 'company', 'event', 'flow', 'nps', 'checklist', 'segment', 'dataExport', 'job', 'spotlight', 'banner', 'resourceCenter'],
            operation: ['list', 'search', 'getResponses', 'getUsers', 'listModules', 'listDefinitions'],
            returnAll: [false],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: any;

        switch (resource) {
          case 'user':
            responseData = await handleUserOperations.call(this, operation, i);
            break;
          case 'company':
            responseData = await handleCompanyOperations.call(this, operation, i);
            break;
          case 'event':
            responseData = await handleEventOperations.call(this, operation, i);
            break;
          case 'flow':
            responseData = await handleFlowOperations.call(this, operation, i);
            break;
          case 'nps':
            responseData = await handleNpsOperations.call(this, operation, i);
            break;
          case 'checklist':
            responseData = await handleChecklistOperations.call(this, operation, i);
            break;
          case 'resourceCenter':
            responseData = await handleResourceCenterOperations.call(this, operation, i);
            break;
          case 'segment':
            responseData = await handleSegmentOperations.call(this, operation, i);
            break;
          case 'dataExport':
            responseData = await handleDataExportOperations.call(this, operation, i);
            break;
          case 'job':
            responseData = await handleJobOperations.call(this, operation, i);
            break;
          case 'spotlight':
            responseData = await handleSpotlightOperations.call(this, operation, i);
            break;
          case 'banner':
            responseData = await handleBannerOperations.call(this, operation, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        if (Array.isArray(responseData)) {
          returnData.push(...responseData.map((item) => ({ json: item })));
        } else {
          returnData.push({ json: responseData });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

async function handleUserOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'identify': return user.identify.call(this, index);
    case 'update': return user.update.call(this, index);
    case 'get': return user.get.call(this, index);
    case 'delete': return user.deleteUser.call(this, index);
    case 'list': return user.list.call(this, index);
    case 'search': return user.search.call(this, index);
    case 'bulkUpdate': return user.bulkUpdate.call(this, index);
    case 'bulkImport': return user.bulkImport.call(this, index);
    case 'getEvents': return user.getEvents.call(this, index);
    case 'getFlows': return user.getFlows.call(this, index);
    case 'merge': return user.merge.call(this, index);
    default: throw new Error(`Unknown user operation: ${operation}`);
  }
}

async function handleCompanyOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'identify': return company.identify.call(this, index);
    case 'update': return company.update.call(this, index);
    case 'get': return company.get.call(this, index);
    case 'delete': return company.deleteCompany.call(this, index);
    case 'list': return company.list.call(this, index);
    case 'search': return company.search.call(this, index);
    case 'bulkUpdate': return company.bulkUpdate.call(this, index);
    case 'getUsers': return company.getUsers.call(this, index);
    case 'getAnalytics': return company.getAnalytics.call(this, index);
    default: throw new Error(`Unknown company operation: ${operation}`);
  }
}

async function handleEventOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'track': return event.track.call(this, index);
    case 'bulkTrack': return event.bulkTrack.call(this, index);
    case 'bulkImport': return event.bulkImport.call(this, index);
    case 'listDefinitions': return event.listDefinitions.call(this, index);
    case 'getDefinition': return event.getDefinition.call(this, index);
    case 'createDefinition': return event.createDefinition.call(this, index);
    case 'getAnalytics': return event.getAnalytics.call(this, index);
    default: throw new Error(`Unknown event operation: ${operation}`);
  }
}

async function handleFlowOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'list': return flow.list.call(this, index);
    case 'get': return flow.get.call(this, index);
    case 'create': return flow.create.call(this, index);
    case 'update': return flow.update.call(this, index);
    case 'delete': return flow.deleteFlow.call(this, index);
    case 'trigger': return flow.trigger.call(this, index);
    case 'publish': return flow.publish.call(this, index);
    case 'unpublish': return flow.unpublish.call(this, index);
    case 'getAnalytics': return flow.getAnalytics.call(this, index);
    case 'duplicate': return flow.duplicate.call(this, index);
    default: throw new Error(`Unknown flow operation: ${operation}`);
  }
}

async function handleNpsOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'list': return nps.list.call(this, index);
    case 'get': return nps.get.call(this, index);
    case 'create': return nps.create.call(this, index);
    case 'update': return nps.update.call(this, index);
    case 'delete': return nps.deleteNps.call(this, index);
    case 'getResponses': return nps.getResponses.call(this, index);
    case 'publish': return nps.publish.call(this, index);
    case 'unpublish': return nps.unpublish.call(this, index);
    case 'getAnalytics': return nps.getAnalytics.call(this, index);
    case 'exportData': return nps.exportData.call(this, index);
    default: throw new Error(`Unknown NPS operation: ${operation}`);
  }
}

async function handleChecklistOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'list': return checklist.list.call(this, index);
    case 'get': return checklist.get.call(this, index);
    case 'create': return checklist.create.call(this, index);
    case 'update': return checklist.update.call(this, index);
    case 'delete': return checklist.deleteChecklist.call(this, index);
    case 'publish': return checklist.publish.call(this, index);
    case 'unpublish': return checklist.unpublish.call(this, index);
    case 'getAnalytics': return checklist.getAnalytics.call(this, index);
    case 'getUserProgress': return checklist.getUserProgress.call(this, index);
    default: throw new Error(`Unknown checklist operation: ${operation}`);
  }
}

async function handleResourceCenterOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'get': return resourceCenter.get.call(this, index);
    case 'update': return resourceCenter.update.call(this, index);
    case 'listModules': return resourceCenter.listModules.call(this, index);
    case 'createModule': return resourceCenter.createModule.call(this, index);
    case 'updateModule': return resourceCenter.updateModule.call(this, index);
    case 'deleteModule': return resourceCenter.deleteModule.call(this, index);
    case 'reorderModules': return resourceCenter.reorderModules.call(this, index);
    case 'getModuleAnalytics': return resourceCenter.getModuleAnalytics.call(this, index);
    default: throw new Error(`Unknown resource center operation: ${operation}`);
  }
}

async function handleSegmentOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'list': return segment.list.call(this, index);
    case 'get': return segment.get.call(this, index);
    case 'create': return segment.create.call(this, index);
    case 'update': return segment.update.call(this, index);
    case 'delete': return segment.deleteSegment.call(this, index);
    case 'getUsers': return segment.getUsers.call(this, index);
    case 'getSize': return segment.getSize.call(this, index);
    default: throw new Error(`Unknown segment operation: ${operation}`);
  }
}

async function handleDataExportOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'create': return dataExport.create.call(this, index);
    case 'getStatus': return dataExport.getStatus.call(this, index);
    case 'download': return dataExport.download.call(this, index);
    case 'list': return dataExport.list.call(this, index);
    case 'cancel': return dataExport.cancel.call(this, index);
    default: throw new Error(`Unknown data export operation: ${operation}`);
  }
}

async function handleJobOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'getStatus': return job.getStatus.call(this, index);
    case 'list': return job.list.call(this, index);
    case 'cancel': return job.cancel.call(this, index);
    case 'retry': return job.retry.call(this, index);
    case 'getErrors': return job.getErrors.call(this, index);
    default: throw new Error(`Unknown job operation: ${operation}`);
  }
}

async function handleSpotlightOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'list': return spotlight.list.call(this, index);
    case 'get': return spotlight.get.call(this, index);
    case 'create': return spotlight.create.call(this, index);
    case 'update': return spotlight.update.call(this, index);
    case 'delete': return spotlight.deleteSpotlight.call(this, index);
    case 'publish': return spotlight.publish.call(this, index);
    case 'unpublish': return spotlight.unpublish.call(this, index);
    case 'getAnalytics': return spotlight.getAnalytics.call(this, index);
    default: throw new Error(`Unknown spotlight operation: ${operation}`);
  }
}

async function handleBannerOperations(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
  switch (operation) {
    case 'list': return banner.list.call(this, index);
    case 'get': return banner.get.call(this, index);
    case 'create': return banner.create.call(this, index);
    case 'update': return banner.update.call(this, index);
    case 'delete': return banner.deleteBanner.call(this, index);
    case 'publish': return banner.publish.call(this, index);
    case 'unpublish': return banner.unpublish.call(this, index);
    case 'getAnalytics': return banner.getAnalytics.call(this, index);
    default: throw new Error(`Unknown banner operation: ${operation}`);
  }
}
