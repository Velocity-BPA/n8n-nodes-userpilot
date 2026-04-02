import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class UserPilotApi implements ICredentialType {
	name = 'userPilotApi';
	displayName = 'UserPilot API';
	documentationUrl = 'https://docs.userpilot.com/reference/api-authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API key for UserPilot API. You can generate API keys from the UserPilot dashboard under Settings > API Keys.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.userpilot.com/v1',
			required: true,
			description: 'The base URL for the UserPilot API',
		},
	];
}