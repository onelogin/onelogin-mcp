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
