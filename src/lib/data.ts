import type { ApiCallLog, ApiDef } from './types';

export const apis: ApiDef[] = [
  {
    id: 'user-api',
    name: 'User Management API',
    version: '1.2.0',
    description: 'Provides endpoints for creating, reading, updating, and deleting user accounts and profiles.',
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the user.', example: 'usr_123' },
          email: { type: 'string', description: 'User\'s email address.', example: 'john.doe@example.com' },
          name: { type: 'string', description: 'Full name of the user.', example: 'John Doe' },
          createdAt: { type: 'string', description: 'ISO 8601 date string of when the user was created.' },
        },
        required: ['id', 'email', 'createdAt'],
      },
      Error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
    endpoints: [
      {
        path: '/users',
        method: 'GET',
        summary: 'List all users',
        description: 'Retrieves a list of all user accounts, with pagination support.',
        parameters: [
          { name: 'limit', in: 'query', description: 'Number of users to return.', required: false, schema: { type: 'integer', example: 20 } },
          { name: 'offset', in: 'query', description: 'Offset for pagination.', required: false, schema: { type: 'integer', example: 0 } },
        ],
        responses: {
          '200': {
            description: 'A list of users.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } },
          },
        },
      },
      {
        path: '/users/{userId}',
        method: 'GET',
        summary: 'Get a single user',
        description: 'Fetches the details of a specific user by their ID.',
        parameters: [
          { name: 'userId', in: 'path', description: 'The ID of the user to retrieve.', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'The user object.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          '404': {
            description: 'User not found.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    ],
  },
  {
    id: 'payments-api',
    name: 'Payments API',
    version: '2.0.1',
    description: 'A secure API for processing payments, managing subscriptions, and handling refunds.',
    schemas: {
      PaymentIntent: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'pi_abc123' },
          amount: { type: 'integer', example: 2000 },
          currency: { type: 'string', example: 'usd' },
          status: { type: 'string', example: 'succeeded' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
    endpoints: [
      {
        path: '/payment_intents',
        method: 'POST',
        summary: 'Create a payment intent',
        description: 'Creates a PaymentIntent to start a new payment.',
        parameters: [],
        requestBody: {
          required: true,
          description: 'Payment details.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'integer', example: 2000 },
                  currency: { type: 'string', example: 'usd' },
                },
                required: ['amount', 'currency'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'PaymentIntent created.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaymentIntent' } } },
          },
          '400': {
            description: 'Bad request.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    ],
  },
  {
    id: 'inventory-api',
    name: 'Inventory API',
    version: '0.8.0-beta',
    description: 'Manages product stock levels across multiple warehouses. Internal use only.',
    schemas: {
      StockLevel: {
        type: 'object',
        properties: {
          productId: { type: 'string', example: 'prod_xyz' },
          warehouseId: { type: 'string', example: 'wh_1' },
          quantity: { type: 'integer', example: 150 },
        },
      },
    },
    endpoints: [
      {
        path: '/inventory/{productId}',
        method: 'GET',
        summary: 'Get stock level',
        description: 'Retrieves the current stock level for a given product across all warehouses.',
        parameters: [
          { name: 'productId', in: 'path', description: 'ID of the product.', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Stock levels for the product.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/StockLevel' } } } },
          },
        },
      },
    ],
  },
];

export const initialApiLogs: ApiCallLog[] = [
  {
    id: 'log_1',
    apiId: 'user-api',
    endpointPath: '/users',
    endpointMethod: 'GET',
    userId: 'user-john-doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: 'log_2',
    apiId: 'payments-api',
    endpointPath: '/payment_intents',
    endpointMethod: 'POST',
    userId: 'user-jane-smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
    {
    id: 'log_3',
    apiId: 'user-api',
    endpointPath: '/users/{userId}',
    endpointMethod: 'GET',
    userId: 'user-john-doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 minutes ago
  },
   {
    id: 'log_4',
    apiId: 'inventory-api',
    endpointPath: '/inventory/{productId}',
    endpointMethod: 'GET',
    userId: 'service-account-internal',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
];
