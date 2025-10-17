/**
 * OneLogin Role Management Tools
 * API Reference: /api/2/roles and /api/2/users/{user_id}/add_roles
 */

/**
 * List OneLogin roles
 * Reference: GET /api/2/roles
 * Supports wildcard search with * (e.g., name=Admin*)
 * @param {OneLoginApi} api
 * @param {Object} args - Filters and pagination
 * @returns {Promise<Object>}
 */
export async function listRoles(api, args = {}) {
  // Build query parameters from args
  const params = {};

  // Filter parameters
  if (args.name) params.name = args.name;
  if (args.updated_since) params.updated_since = args.updated_since;

  // Display and sorting parameters
  if (args.fields) params.fields = args.fields;
  if (args.sort) params.sort = args.sort;
  if (args.limit) params.limit = args.limit;

  // Pagination: support both page numbers and cursors
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/roles', params);
}

/**
 * Get a specific role by ID
 * Reference: GET /api/2/roles/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number}
 * @returns {Promise<Object>}
 */
export async function getRole(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  return await api.get(`/api/2/roles/${args.role_id}`);
}

/**
 * Assign roles to a user
 * Reference: PUT /api/2/users/{user_id}/add_roles
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, role_ids: number[]}
 * @returns {Promise<Object>}
 */
export async function assignRoleToUser(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.role_ids || !Array.isArray(args.role_ids)) {
    throw new Error('role_ids array is required');
  }

  return await api.put(`/api/2/users/${args.user_id}/add_roles`, {
    role_id_array: args.role_ids
  });
}

/**
 * Remove roles from a user
 * Reference: PUT /api/2/users/{user_id}/remove_roles
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, role_ids: number[]}
 * @returns {Promise<Object>}
 */
export async function removeRoleFromUser(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.role_ids || !Array.isArray(args.role_ids)) {
    throw new Error('role_ids array is required');
  }

  return await api.put(`/api/2/users/${args.user_id}/remove_roles`, {
    role_id_array: args.role_ids
  });
}
