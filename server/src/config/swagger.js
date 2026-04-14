const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'PurpleMerit User Management API',
    description: 'Enterprise-grade User Management System with RBAC, JWT authentication, and full user lifecycle management.',
    version: '1.0.0',
    contact: { name: 'PurpleMerit', email: 'admin@purplemerit.com' },
  },
  servers: [
    { url: 'http://localhost:5000/api', description: 'Development' },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Activity', description: 'Activity log endpoints' },
  ],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login', operationId: 'login',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email', example: 'admin@purplemerit.com' }, password: { type: 'string', example: 'admin' } } } } } },
        responses: { 200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'], summary: 'Refresh access token', operationId: 'refresh',
        responses: { 200: { description: 'Token refreshed' }, 401: { description: 'Invalid refresh token' } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'], summary: 'Logout', operationId: 'logout', security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Logged out' } },
      },
    },
    '/users': {
      get: {
        tags: ['Users'], summary: 'List users (paginated)', operationId: 'getUsers', security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'manager', 'user'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive'] } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'createdAt' } },
          { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
        ],
        responses: { 200: { description: 'Users list with pagination' }, 401: { description: 'Not authenticated' }, 403: { description: 'Not authorized' } },
      },
      post: {
        tags: ['Users'], summary: 'Create user (Admin only)', operationId: 'createUser', security: [{ BearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUser' } } } },
        responses: { 201: { description: 'User created' }, 400: { description: 'Validation error' }, 409: { description: 'Email already exists' } },
      },
    },
    '/users/me': {
      get: { tags: ['Users'], summary: 'Get own profile', operationId: 'getProfile', security: [{ BearerAuth: [] }], responses: { 200: { description: 'Profile data' } } },
      put: {
        tags: ['Users'], summary: 'Update own profile', operationId: 'updateProfile', security: [{ BearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfile' } } } },
        responses: { 200: { description: 'Profile updated' } },
      },
    },
    '/users/stats': {
      get: { tags: ['Users'], summary: 'Get user statistics', operationId: 'getStats', security: [{ BearerAuth: [] }], responses: { 200: { description: 'User statistics' } } },
    },
    '/users/{id}': {
      get: { tags: ['Users'], summary: 'Get user by ID', operationId: 'getUserById', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'User data' }, 404: { description: 'Not found' } } },
      put: { tags: ['Users'], summary: 'Update user', operationId: 'updateUser', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUser' } } } }, responses: { 200: { description: 'User updated' } } },
      delete: { tags: ['Users'], summary: 'Deactivate user (Admin only)', operationId: 'deleteUser', security: [{ BearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'User deactivated' } } },
    },
    '/activity': {
      get: {
        tags: ['Activity'], summary: 'Get activity logs', operationId: 'getLogs', security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'action', in: 'query', schema: { type: 'string', enum: ['USER_LOGIN', 'USER_LOGOUT', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'PROFILE_UPDATED', 'PASSWORD_CHANGED'] } },
        ],
        responses: { 200: { description: 'Activity logs with pagination' } },
      },
    },
  },
  components: {
    securitySchemes: { BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      AuthResponse: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' }, accessToken: { type: 'string' } } } } },
      User: { type: 'object', properties: { _id: { type: 'string' }, firstName: { type: 'string' }, lastName: { type: 'string' }, email: { type: 'string' }, role: { type: 'string', enum: ['admin', 'manager', 'user'] }, status: { type: 'string', enum: ['active', 'inactive'] }, lastLogin: { type: 'string', format: 'date-time' }, createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } } },
      CreateUser: { type: 'object', required: ['firstName', 'lastName', 'email', 'password'], properties: { firstName: { type: 'string', example: 'John' }, lastName: { type: 'string', example: 'Doe' }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 4 }, role: { type: 'string', enum: ['admin', 'manager', 'user'], default: 'user' }, status: { type: 'string', enum: ['active', 'inactive'], default: 'active' } } },
      UpdateUser: { type: 'object', properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, email: { type: 'string' }, role: { type: 'string' }, status: { type: 'string' }, password: { type: 'string' } } },
      UpdateProfile: { type: 'object', properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, currentPassword: { type: 'string' }, newPassword: { type: 'string' } } },
    },
  },
};

module.exports = swaggerDocument;
