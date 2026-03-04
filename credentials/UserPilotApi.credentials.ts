import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class UserPilotApi implements ICredentialType {
	name = 'userPilotApi';
	displayName = 'UserPilot API';
	documentationUrl = 'https://docs.userpilot.com/article/136-rest-api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
			description: 'The API key for UserPilot API authentication. Get your API key from Settings > Integrations > API in your UserPilot dashboard.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://api.userpilot.com/v1',
			description: 'The base URL for the UserPilot API',
		},
	];
}