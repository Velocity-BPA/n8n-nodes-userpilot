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
describe('User Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
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
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createUser')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce('test@example.com')
				.mockReturnValueOnce('John Doe')
				.mockReturnValueOnce('{"role": "admin"}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'user123', email: 'test@example.com' });

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ id: 'user123', email: 'test@example.com' });
		});

		it('should handle createUser error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createUser')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce('test@example.com')
				.mockReturnValueOnce('John Doe')
				.mockReturnValueOnce('{}');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getUser', () => {
		it('should get a user successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUser')
				.mockReturnValueOnce('user123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'user123', email: 'test@example.com' });

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ id: 'user123', email: 'test@example.com' });
		});

		it('should handle getUser error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUser')
				.mockReturnValueOnce('user123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('User not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('User not found');
		});
	});

	describe('getUsers', () => {
		it('should get users successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUsers')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('{"status": "active"}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ users: [{ id: 'user123' }], total: 1 });

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ users: [{ id: 'user123' }], total: 1 });
		});

		it('should handle getUsers error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUsers')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('{}');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('updateUser', () => {
		it('should update a user successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateUser')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce('{"name": "Jane Doe"}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'user123', name: 'Jane Doe' });

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ id: 'user123', name: 'Jane Doe' });
		});

		it('should handle updateUser error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateUser')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce('{}');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Update failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Update failed');
		});
	});

	describe('deleteUser', () => {
		it('should delete a user successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteUser')
				.mockReturnValueOnce('user123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ success: true });
		});

		it('should handle deleteUser error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteUser')
				.mockReturnValueOnce('user123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Delete failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Delete failed');
		});
	});
});

describe('Event Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.userpilot.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('createEvent operation', () => {
    it('should create an event successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createEvent')
        .mockReturnValueOnce('user123')
        .mockReturnValueOnce('page_view')
        .mockReturnValueOnce('{"page": "/dashboard"}')
        .mockReturnValueOnce('2023-01-01T00:00:00Z');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
        success: true, 
        event_id: 'evt_123' 
      });

      const result = await executeEventOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ success: true, event_id: 'evt_123' });
    });

    it('should handle createEvent error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createEvent');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeEventOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getEvents operation', () => {
    it('should get events successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getEvents')
        .mockReturnValueOnce('user123')
        .mockReturnValueOnce('page_view')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        events: [{ id: 'evt_1', name: 'page_view' }],
        total: 1
      });

      const result = await executeEventOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.events).toHaveLength(1);
    });
  });

  describe('createEventsBatch operation', () => {
    it('should create events batch successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createEventsBatch')
        .mockReturnValueOnce('[{"user_id": "user123", "event_name": "click"}]');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        created_count: 1
      });

      const result = await executeEventOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.created_count).toBe(1);
    });

    it('should handle invalid JSON in events', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createEventsBatch')
        .mockReturnValueOnce('invalid json');

      await expect(executeEventOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      )).rejects.toThrow('Invalid JSON in events field');
    });
  });
});

describe('Flow Resource', () => {
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

	test('should get flows successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getFlows')
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce('active');

		const mockResponse = { flows: [{ id: 1, name: 'Test Flow' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.userpilot.com/v1/flows?limit=10&offset=0&status=active',
			headers: {
				'Authorization': 'Bearer test-api-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('should get flow by ID successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getFlow')
			.mockReturnValueOnce('flow123');

		const mockResponse = { id: 'flow123', name: 'Test Flow' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
	});

	test('should trigger flow successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('triggerFlow')
			.mockReturnValueOnce('flow123')
			.mockReturnValueOnce('user456');

		const mockResponse = { success: true, message: 'Flow triggered' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.userpilot.com/v1/flows/flow123/trigger',
			headers: {
				'Authorization': 'Bearer test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				user_id: 'user456',
			},
			json: true,
		});
	});

	test('should get flow stats successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getFlowStats')
			.mockReturnValueOnce('flow123')
			.mockReturnValueOnce('2023-01-01')
			.mockReturnValueOnce('2023-12-31');

		const mockResponse = { views: 100, completions: 80 };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
	});

	test('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFlows');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 },
		}]);
	});

	test('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFlows');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]))
			.rejects.toThrow('API Error');
	});
});

describe('Segment Resource', () => {
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

	describe('getSegments operation', () => {
		it('should get segments successfully', async () => {
			const mockResponse = { segments: [{ id: '123', name: 'Test Segment' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getSegments')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getSegments error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSegments');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getSegment operation', () => {
		it('should get segment successfully', async () => {
			const mockResponse = { id: '123', name: 'Test Segment' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getSegment')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('createSegment operation', () => {
		it('should create segment successfully', async () => {
			const mockResponse = { id: '123', name: 'New Segment' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createSegment')
				.mockReturnValueOnce('New Segment')
				.mockReturnValueOnce({ filter: 'active' })
				.mockReturnValueOnce('Test description');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateSegment operation', () => {
		it('should update segment successfully', async () => {
			const mockResponse = { id: '123', name: 'Updated Segment' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateSegment')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('Updated Segment')
				.mockReturnValueOnce({ filter: 'inactive' });
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteSegment operation', () => {
		it('should delete segment successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteSegment')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getSegmentUsers operation', () => {
		it('should get segment users successfully', async () => {
			const mockResponse = { users: [{ id: 'user1', email: 'test@example.com' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getSegmentUsers')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Checklist Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
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

	describe('getChecklists operation', () => {
		it('should get checklists successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				const params: { [key: string]: any } = {
					operation: 'getChecklists',
					limit: 50,
					offset: 0,
				};
				return params[param];
			});

			const mockResponse = {
				checklists: [
					{ id: '1', name: 'Onboarding Checklist' },
					{ id: '2', name: 'Feature Adoption Checklist' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeChecklistOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getChecklists errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getChecklists');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeChecklistOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getChecklist operation', () => {
		it('should get checklist by ID successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				const params: { [key: string]: any } = {
					operation: 'getChecklist',
					checklistId: 'checklist-123',
				};
				return params[param];
			});

			const mockResponse = {
				id: 'checklist-123',
				name: 'Onboarding Checklist',
				tasks: [
					{ id: '1', name: 'Complete Profile', completed: false },
					{ id: '2', name: 'Upload Avatar', completed: true },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeChecklistOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('createChecklist operation', () => {
		it('should create checklist successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				const params: { [key: string]: any } = {
					operation: 'createChecklist',
					name: 'New Checklist',
					tasks: '[{"name": "Task 1"}, {"name": "Task 2"}]',
					targetSegment: 'new-users',
				};
				return params[param];
			});

			const mockResponse = {
				id: 'checklist-456',
				name: 'New Checklist',
				target_segment: 'new-users',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeChecklistOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateChecklist operation', () => {
		it('should update checklist successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				const params: { [key: string]: any } = {
					operation: 'updateChecklist',
					checklistId: 'checklist-123',
					tasks: '[{"name": "Updated Task 1"}, {"name": "Updated Task 2"}]',
				};
				return params[param];
			});

			const mockResponse = {
				id: 'checklist-123',
				name: 'Updated Checklist',
				tasks: [
					{ name: 'Updated Task 1' },
					{ name: 'Updated Task 2' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeChecklistOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteChecklist operation', () => {
		it('should delete checklist successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				const params: { [key: string]: any } = {
					operation: 'deleteChecklist',
					checklistId: 'checklist-123',
				};
				return params[param];
			});

			const mockResponse = { success: true };

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeChecklistOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('completeChecklistTask operation', () => {
		it('should complete checklist task successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				const params: { [key: string]: any } = {
					operation: 'completeChecklistTask',
					checklistId: 'checklist-123',
					userId: 'user-456',
					taskId: 'task-789',
				};
				return params[param];
			});

			const mockResponse = {
				success: true,
				task_id: 'task-789',
				completed: true,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeChecklistOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Survey Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.userpilot.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('getSurveys operation should retrieve surveys list', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getSurveys')
			.mockReturnValueOnce(20)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce('nps');

		const mockResponse = {
			surveys: [
				{ id: '1', name: 'NPS Survey', type: 'nps' },
				{ id: '2', name: 'Feedback Survey', type: 'feedback' },
			],
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.userpilot.com/v1/surveys?limit=20&offset=0&type=nps',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result[0].json).toEqual(mockResponse);
	});

	test('createSurvey operation should create a new survey', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createSurvey')
			.mockReturnValueOnce('Test Survey')
			.mockReturnValueOnce('nps')
			.mockReturnValueOnce('[{"question": "How likely are you to recommend us?"}]')
			.mockReturnValueOnce('premium_users');

		const mockResponse = { id: '123', name: 'Test Survey', type: 'nps' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.userpilot.com/v1/surveys',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'Test Survey',
				type: 'nps',
				questions: [{ question: 'How likely are you to recommend us?' }],
				target_segment: 'premium_users',
			},
			json: true,
		});
		expect(result[0].json).toEqual(mockResponse);
	});

	test('should handle errors appropriately', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSurveys');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('API Error');
	});

	test('should continue on fail when configured', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSurveys');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeSurveyOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json).toEqual({ error: 'API Error' });
	});
});
});
