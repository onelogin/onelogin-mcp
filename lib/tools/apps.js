/**
 * OneLogin App Management Tools
 * API Reference: /api/2/apps
 */

/**
 * List OneLogin apps
 * Reference: GET /api/2/apps
 * Supports wildcard search with * (e.g., name=AWS*)
 * @param {OneLoginApi} api
 * @param {Object} args - Filters and pagination
 * @returns {Promise<Object>}
 */
export async function listApps(api, args = {}) {
  // Build query parameters from args
  const params = {};

  // Filter parameters
  if (args.name) params.name = args.name;
  if (args.connector_id) params.connector_id = args.connector_id;
  if (args.auth_method !== undefined) params.auth_method = args.auth_method;
  if (args.updated_since) params.updated_since = args.updated_since;

  // Display and sorting parameters
  if (args.fields) params.fields = args.fields;
  if (args.sort) params.sort = args.sort;
  if (args.limit) params.limit = args.limit;

  // Pagination: support both page numbers and cursors
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/apps', params);
}

/**
 * Get a specific app by ID
 * Reference: GET /api/2/apps/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function getApp(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.get(`/api/2/apps/${args.app_id}`);
}

/**
 * Update an existing app
 * Reference: PUT /api/2/apps/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateApp(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  const appId = args.app_id;
  const updateData = { ...args };
  delete updateData.app_id;

  return await api.put(`/api/2/apps/${appId}`, updateData);
}

/**
 * Create a new app
 * POST /api/2/apps
 * @param {OneLoginApi} api
 * @param {Object} args - App configuration data
 * @returns {Promise<Object>}
 */
export async function createApp(api, args) {
  return await api.post('/api/2/apps', args);
}

/**
 * Delete an app
 * DELETE /api/2/apps/{app_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteApp(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.delete(`/api/2/apps/${args.app_id}`);
}

/**
 * Delete an app parameter
 * DELETE /api/2/apps/{app_id}/parameters/{param_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, param_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteAppParameter(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.param_id) {
    throw new Error('param_id is required');
  }

  return await api.delete(`/api/2/apps/${args.app_id}/parameters/${args.param_id}`);
}

/**
 * Get users assigned to an app
 * GET /api/2/apps/{app_id}/users
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function getAppUsers(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.get(`/api/2/apps/${args.app_id}/users`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_apps',
    description: 'Get a list of all apps in a OneLogin account with pagination support (max 1000 per page). Can filter by connector_id or auth_method (0=Password, 1=OpenId, 2=SAML, 3=API, 4=Google, 6=Forms, 7=WSFED, 8=OpenId Connect). Use name parameter with wildcard (*) for partial name search (e.g., name=workday*). Returns app data and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by app name' },
        connector_id: { type: 'number', description: 'Filter by connector ID' },
        auth_method: { type: 'number', description: 'Filter by authentication method' },
        limit: { type: 'number', description: 'Number of results to return (default 50)' },
        page: { type: 'number', description: 'Page number for pagination' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_app',
    description: 'Get configuration settings of an app. Useful for backing up app configuration or cloning apps - take the response and POST it to create_app to clone. Response payload is broken into sections (parameters, sso settings, configuration) that vary based on app type (SAML, OpenId Connect, etc.). Returns complete app configuration and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  },
  {
    name: 'update_app',
    description: 'Update an existing OneLogin app. Returns updated app data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID to update' },
        name: { type: 'string', description: 'New app name' },
        description: { type: 'string', description: 'New app description' },
        notes: { type: 'string', description: 'New app notes' }
      },
      required: ['app_id'],
      additionalProperties: true
    }
  },
  {
    name: 'create_app',
    description: 'Create a new app based on a OneLogin connector. Minimum required: connector_id and name. If connector allows (check allows_new_parameters via List Connectors), custom parameters can be added during creation - any parameter not matching existing parameters will be auto-created. For complete app configuration options, do a get_app request on an app with the same connector. For OpenId Connect apps: response includes client_id and client_secret. Returns created app data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        connector_id: { type: 'number', description: 'Connector ID for the app type' },
        name: { type: 'string', description: 'App name' },
        description: { type: 'string', description: 'App description' }
      },
      additionalProperties: true
    }
  },
  {
    name: 'delete_app',
    description: 'Delete an app from OneLogin. WARNING: This operation is final and cannot be undone. If you don\'t know the app ID, use list_apps to find it. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID to delete' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  },
  {
    name: 'delete_app_parameter',
    description: 'Delete a custom parameter from an app. WARNING: This operation is final and cannot be undone. You cannot delete connector-level parameters (defined on underlying connector) - only custom app-specific parameters can be deleted. If you don\'t know the parameter ID, use get_app to retrieve app configuration with parameter IDs. Returns 204 No Content on success or 403 Forbidden if attempting to delete connector parameter. Returns x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' },
        param_id: { type: 'number', description: 'The parameter ID to delete' }
      },
      required: ['app_id', 'param_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_app_users',
    description: 'Get a list of users assigned to an app (max 1000 users per page). Supports standard pagination. Returns user list with ID, firstname, lastname, username, and email for each user. Use to audit app access or find users to remove. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_apps: listApps,
  get_app: getApp,
  update_app: updateApp,
  create_app: createApp,
  delete_app: deleteApp,
  delete_app_parameter: deleteAppParameter,
  get_app_users: getAppUsers
};
