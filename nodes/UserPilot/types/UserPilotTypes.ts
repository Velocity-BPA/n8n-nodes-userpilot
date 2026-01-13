/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IUserPilotCredentials {
  apiToken: string;
  endpoint?: string;
}

export interface IUserProperties {
  name?: string;
  email?: string;
  created_at?: string;
  company?: {
    id: string;
    name?: string;
  };
  [key: string]: any;
}

export interface ICompanyProperties {
  name?: string;
  created_at?: string;
  [key: string]: any;
}

export interface IEventProperties {
  [key: string]: any;
}

export interface IUser {
  user_id: string;
  properties?: IUserProperties;
}

export interface ICompany {
  company_id: string;
  properties?: ICompanyProperties;
}

export interface IEvent {
  user_id: string;
  event_name: string;
  metadata?: IEventProperties;
  created_at?: string;
}

export interface IBulkUser {
  user_id: string;
  [key: string]: any;
}

export interface IBulkEvent {
  user_id: string;
  event_name: string;
  metadata?: IEventProperties;
  created_at?: string;
}

export interface IBulkCompany {
  company_id: string;
  [key: string]: any;
}

export interface IFlow {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface INpsSurvey {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export interface INpsResponse {
  id: string;
  user_id: string;
  score: number;
  comment?: string;
  created_at: string;
}

export interface IExportJob {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  export_type: string;
  created_at: string;
  download_url?: string;
}

export interface IBulkJob {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_rows: number;
  processed_rows: number;
  failed_rows: number;
  created_at: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IPaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export type UserPilotResource =
  | 'user'
  | 'company'
  | 'event'
  | 'flow'
  | 'nps'
  | 'dataExport'
  | 'job';

export type UserOperation =
  | 'identify'
  | 'update'
  | 'get'
  | 'delete'
  | 'bulkUpdate'
  | 'bulkImport';

export type CompanyOperation =
  | 'identify'
  | 'update'
  | 'get'
  | 'delete'
  | 'bulkUpdate';

export type EventOperation = 'track' | 'bulkTrack' | 'bulkImport';

export type FlowOperation = 'list' | 'get' | 'trigger';

export type NpsOperation = 'listSurveys' | 'getResponses' | 'exportData';

export type DataExportOperation = 'create' | 'getStatus' | 'download';

export type JobOperation = 'getStatus' | 'list';
