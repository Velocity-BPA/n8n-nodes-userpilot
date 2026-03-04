/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { UserPilot } from '../nodes/UserPilot/UserPilot.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('UserPilot Node', () => {
  let node: UserPilot;

  beforeAll(() => {
    node = new UserPilot();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('UserPilot');
      expect(node.description.name).toBe('userpilot');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Users Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.userpilot.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const expectedResponse = { id: 'user123', email: 'test@example.com', created: true };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createUser';
          case 'userId': return 'user123';
          case 'email': return 'test@example.com';
          case 'properties': return '{"name": "John Doe"}';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResponse);

      const items = [{ json: {} }];
      const result = await executeUsersOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: expectedResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.userpilot.com/v1/users',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          user_id: 'user123',
          email: 'test@example.com',
          properties: { name: 'John Doe' },
        },
        json: true,
      });
    });

    it('should handle invalid JSON in properties', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createUser';
          case 'userId': return 'user123';
          case 'properties': return 'invalid json';
          default: return undefined;
        }
      });

      const items = [{ json: {} }];
      
      await expect(executeUsersOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Invalid JSON in properties');
    });
  });

  describe('getUser', () => {
    it('should retrieve a user successfully', async () => {
      const expectedResponse = { id: 'user123', email: 'test@example.com', properties: {} };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getUser';
          case 'userId': return 'user123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResponse);

      const items = [{ json: {} }];
      const result = await executeUsersOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: expectedResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.userpilot.com/v1/users/user123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve all users with pagination', async () => {
      const expectedResponse = { users: [], total: 0, page: 1, limit: 50 };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAllUsers';
          case 'page': return 1;
          case 'limit': return 50;
          case 'filters': return '{}';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResponse);

      const items = [{ json: {} }];
      const result = await executeUsersOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: expectedResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.userpilot.com/v1/users?page=1&limit=50',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const expectedResponse = { id: 'user123', updated: true };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'updateUser';
          case 'userId': return 'user123';
          case 'properties': return '{"name": "Jane Doe"}';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResponse);

      const items = [{ json: {} }];
      const result = await executeUsersOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: expectedResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.userpilot.com/v1/users/user123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          properties: { name: 'Jane Doe' },
        },
        json: true,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const expectedResponse = { success: true };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'deleteUser';
          case 'userId': return 'user123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResponse);

      const items = [{ json: {} }];
      const result = await executeUsersOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: expectedResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.userpilot.com/v1/users/user123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle 401 unauthorized error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getUser';
          case 'userId': return 'user123';
          default: return undefined;
        }
      });

      const error = new Error('Unauthorized');
      (error as any).httpCode = 401;
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const items = [{ json: {} }];
      
      await expect(executeUsersOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Unauthorized');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getUser';
          case 'userId': return 'user123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];
      const result = await executeUsersOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Flows Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.userpilot.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllFlows', () => {
    it('should retrieve all flows successfully', async () => {
      const mockResponse = {
        flows: [
          { id: 'flow1', name: 'Onboarding Flow', status: 'active' },
          { id: 'flow2', name: 'Feature Tour', status: 'inactive' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'getAllFlows';
          case 'status': return 'active';
          case 'type': return '';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlowsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.userpilot.com/v1/flows?status=active',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors when retrieving flows', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAllFlows';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFlowsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getFlow', () => {
    it('should retrieve a specific flow successfully', async () => {
      const mockResponse = {
        id: 'flow123',
        name: 'Test Flow',
        status: 'active',
        configuration: {}
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getFlow';
          case 'flowId': return 'flow123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlowsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.userpilot.com/v1/flows/flow123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('triggerFlow', () => {
    it('should trigger a flow for a user successfully', async () => {
      const mockResponse = { success: true, message: 'Flow triggered' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'triggerFlow';
          case 'flowId': return 'flow123';
          case 'userId': return 'user456';
          case 'userEmail': return '';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlowsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.userpilot.com/v1/flows/flow123/trigger',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: { user_id: 'user456' },
        json: true,
      });
    });

    it('should throw error when no user identifier provided', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'triggerFlow';
          case 'flowId': return 'flow123';
          case 'userId': return '';
          case 'userEmail': return '';
          default: return '';
        }
      });

      await expect(executeFlowsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Either User ID or User Email must be provided');
    });
  });

  describe('getFlowAnalytics', () => {
    it('should retrieve flow analytics successfully', async () => {
      const mockResponse = {
        views: 100,
        completions: 75,
        completion_rate: 0.75,
        metrics: {}
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getFlowAnalytics';
          case 'flowId': return 'flow123';
          case 'dateRange': return '30d';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlowsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.userpilot.com/v1/flows/flow123/analytics?date_range=30d',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('updateFlowStatus', () => {
    it('should update flow status successfully', async () => {
      const mockResponse = { success: true, status: 'active' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'updateFlowStatus';
          case 'flowId': return 'flow123';
          case 'newStatus': return 'active';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlowsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.userpilot.com/v1/flows/flow123/status',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: { status: 'active' },
        json: true,
      });
    });
  });
});

describe('Checklists Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.userpilot.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllChecklists', () => {
    it('should get all checklists successfully', async () => {
      const mockResponse = {
        checklists: [
          { id: 'checklist1', name: 'Onboarding', status: 'active' },
          { id: 'checklist2', name: 'Setup', status: 'active' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllChecklists';
        if (paramName === 'status') return '';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChecklistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.userpilot.com/v1/checklists',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {},
        json: true,
      });
    });

    it('should handle getAllChecklists error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllChecklists';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeChecklistsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow();
    });
  });

  describe('getChecklist', () => {
    it('should get a specific checklist successfully', async () => {
      const mockResponse = {
        id: 'checklist1',
        name: 'Onboarding',
        items: [
          { id: 'item1', title: 'Complete profile', completed: false }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChecklist';
        if (paramName === 'checklistId') return 'checklist1';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChecklistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.userpilot.com/v1/checklists/checklist1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('completeChecklistItem', () => {
    it('should complete checklist item successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'completeChecklistItem';
        if (paramName === 'checklistId') return 'checklist1';
        if (paramName === 'itemId') return 'item1';
        if (paramName === 'userIdentification') return 'userId';
        if (paramName === 'userId') return 'user123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChecklistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.userpilot.com/v1/checklists/checklist1/items/item1/complete',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          user_id: 'user123',
        },
        json: true,
      });
    });
  });

  describe('getChecklistProgress', () => {
    it('should get checklist progress successfully', async () => {
      const mockResponse = {
        checklist_id: 'checklist1',
        user_id: 'user123',
        progress: 50,
        completed_items: 2,
        total_items: 4
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChecklistProgress';
        if (paramName === 'checklistId') return 'checklist1';
        if (paramName === 'userIdentification') return 'userId';
        if (paramName === 'userId') return 'user123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChecklistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.userpilot.com/v1/checklists/checklist1/progress',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          user_id: 'user123',
        },
        json: true,
      });
    });
  });

  describe('updateChecklistStatus', () => {
    it('should update checklist status successfully', async () => {
      const mockResponse = { success: true, status: 'inactive' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'updateChecklistStatus';
        if (paramName === 'checklistId') return 'checklist1';
        if (paramName === 'status') return 'inactive';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChecklistsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.userpilot.com/v1/checklists/checklist1/status',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          status: 'inactive',
        },
        json: true,
      });
    });
  });
});

describe('Segments Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.userpilot.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get all segments successfully', async () => {
    const mockSegments = {
      data: [
        { id: '1', name: 'Test Segment 1' },
        { id: '2', name: 'Test Segment 2' },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAllSegments';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSegments);

    const result = await executeSegmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockSegments);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.userpilot.com/v1/segments',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get a specific segment successfully', async () => {
    const mockSegment = {
      id: '123',
      name: 'Test Segment',
      criteria: { property: 'value' },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getSegment';
      if (param === 'segmentId') return '123';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSegment);

    const result = await executeSegmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockSegment);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.userpilot.com/v1/segments/123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should create a segment successfully', async () => {
    const mockCreatedSegment = {
      id: '456',
      name: 'New Segment',
      criteria: { event: 'signup' },
      description: 'Test description',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'createSegment';
      if (param === 'name') return 'New Segment';
      if (param === 'criteria') return '{"event":"signup"}';
      if (param === 'description') return 'Test description';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCreatedSegment);

    const result = await executeSegmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockCreatedSegment);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.userpilot.com/v1/segments',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'New Segment',
        criteria: { event: 'signup' },
        description: 'Test description',
      },
      json: true,
    });
  });

  it('should update a segment successfully', async () => {
    const mockUpdatedSegment = {
      id: '789',
      name: 'Updated Segment',
      criteria: { event: 'updated' },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'updateSegment';
      if (param === 'segmentId') return '789';
      if (param === 'criteria') return '{"event":"updated"}';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdatedSegment);

    const result = await executeSegmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockUpdatedSegment);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.userpilot.com/v1/segments/789',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        criteria: { event: 'updated' },
      },
      json: true,
    });
  });

  it('should get segment users successfully', async () => {
    const mockUsers = {
      data: [
        { id: 'user1', email: 'user1@example.com' },
        { id: 'user2', email: 'user2@example.com' },
      ],
      pagination: { page: 1, limit: 50, total: 2 },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getSegmentUsers';
      if (param === 'segmentId') return '123';
      if (param === 'page') return 1;
      if (param === 'limit') return 50;
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUsers);

    const result = await executeSegmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockUsers);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.userpilot.com/v1/segments/123/users',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: {
        page: 1,
        limit: 50,
      },
      json: true,
    });
  });

  it('should handle API errors properly', async () => {
    const mockError = new Error('API Error');

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAllSegments';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(
      executeSegmentsOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('API Error');
  });

  it('should continue on fail when configured', async () => {
    const mockError = new Error('API Error');

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAllSegments';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeSegmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Surveys Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.userpilot.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('getAllSurveys should retrieve all surveys', async () => {
    const mockSurveys = [
      { id: 'survey_1', name: 'NPS Survey', type: 'nps', status: 'active' },
      { id: 'survey_2', name: 'CSAT Survey', type: 'csat', status: 'active' },
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAllSurveys';
        case 'type': return 'nps';
        case 'status': return 'active';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSurveys);

    const items = [{ json: {} }];
    const result = await executeSurveysOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockSurveys);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.userpilot.com/v1/surveys',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: { type: 'nps', status: 'active' },
      json: true,
    });
  });

  test('getSurvey should retrieve specific survey', async () => {
    const mockSurvey = {
      id: 'survey_123',
      name: 'Customer Satisfaction Survey',
      type: 'csat',
      questions: [{ id: 'q1', text: 'How satisfied are you?' }],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getSurvey';
        case 'surveyId': return 'survey_123';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSurvey);

    const items = [{ json: {} }];
    const result = await executeSurveysOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockSurvey);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.userpilot.com/v1/surveys/survey_123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('createSurveyResponse should submit survey response', async () => {
    const mockResponse = {
      id: 'response_123',
      survey_id: 'survey_456',
      user_id: 'user_789',
      created_at: '2023-01-01T00:00:00Z',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'createSurveyResponse';
        case 'surveyId': return 'survey_456';
        case 'userId': return 'user_789';
        case 'answers': return '{"q1": 5, "q2": "Great service!"}';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeSurveysOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.userpilot.com/v1/surveys/survey_456/responses',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        user_id: 'user_789',
        answers: { q1: 5, q2: 'Great service!' },
      },
      json: true,
    });
  });

  test('getSurveyResponses should retrieve survey responses with date range', async () => {
    const mockResponses = [
      { id: 'response_1', answers: { q1: 8 }, created_at: '2023-01-01T00:00:00Z' },
      { id: 'response_2', answers: { q1: 9 }, created_at: '2023-01-02T00:00:00Z' },
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getSurveyResponses';
        case 'surveyId': return 'survey_123';
        case 'dateRange': return {
          range: {
            startDate: '2023-01-01T00:00:00.000Z',
            endDate: '2023-01-31T23:59:59.000Z',
          },
        };
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponses);

    const items = [{ json: {} }];
    const result = await executeSurveysOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponses);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.userpilot.com/v1/surveys/survey_123/responses',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: {
        start_date: '2023-01-01T00:00:00.000Z',
        end_date: '2023-01-31T23:59:59.000Z',
      },
      json: true,
    });
  });

  test('getSurveyAnalytics should retrieve survey analytics', async () => {
    const mockAnalytics = {
      total_responses: 100,
      nps_score: 75,
      response_rate: 0.25,
      distribution: { promoters: 60, passives: 30, detractors: 10 },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getSurveyAnalytics';
        case 'surveyId': return 'survey_nps';
        case 'dateRange': return {};
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockAnalytics);

    const items = [{ json: {} }];
    const result = await executeSurveysOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockAnalytics);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.userpilot.com/v1/surveys/survey_nps/analytics',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: {},
      json: true,
    });
  });

  test('updateSurveyStatus should update survey status', async () => {
    const mockUpdatedSurvey = {
      id: 'survey_123',
      name: 'Test Survey',
      status: 'inactive',
      updated_at: '2023-01-01T00:00:00Z',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'updateSurveyStatus';
        case 'surveyId': return 'survey_123';
        case 'status': return 'inactive';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdatedSurvey);

    const items = [{ json: {} }];
    const result = await executeSurveysOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockUpdatedSurvey);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.userpilot.com/v1/surveys/survey_123/status',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: { status: 'inactive' },
      json: true,
    });
  });

  test('should handle API errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getSurvey';
        case 'surveyId': return 'invalid_survey';
        default: return '';
      }
    });

    const apiError = new Error('Survey not found');
    (apiError as any).response = {
      statusCode: 404,
      body: { error: 'Survey not found', code: 'SURVEY_NOT_FOUND' },
    };

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];

    await expect(
      executeSurveysOperations.call(mockExecuteFunctions, items),
    ).rejects.toThrow();
  });

  test('should handle continue on fail', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getSurvey';
        case 'surveyId': return 'invalid_survey';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeSurveysOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});
});
