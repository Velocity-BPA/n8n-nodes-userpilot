/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class UserPilotApi implements ICredentialType {
  name = 'userPilotApi';
  displayName = 'UserPilot API';
  documentationUrl = 'https://docs.userpilot.com/';

  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your UserPilot API Token. Found in Environment Page in your UserPilot application.',
    },
    {
      displayName: 'Custom Endpoint (Optional)',
      name: 'endpoint',
      type: 'string',
      default: '',
      placeholder: 'https://analytex.userpilot.io',
      description: 'Custom endpoint URL for Enterprise/EU deployments. Leave empty to use the default endpoint.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Token {{$credentials.apiToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.endpoint || "https://analytex.userpilot.io"}}',
      url: '/v1/users',
      method: 'GET',
    },
  };
}
