/**
 * OneLogin Privileges Tools
 * API Reference: /api/1/privileges (API v1 - Rate Limited)
 */

/**
 * List OneLogin privileges
 * Reference: GET /api/1/privileges
 * @param {OneLoginApi} api
 * @param {Object} args - Pagination parameters
 * @returns {Promise<Object>}
 */
export async function listPrivileges(api, args = {}) {
  // Build query parameters from args
  const params = {};

  // Display and sorting parameters
  if (args.fields) params.fields = args.fields;
  if (args.sort) params.sort = args.sort;
  if (args.limit) params.limit = args.limit;

  // Pagination: support both page numbers and cursors
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/1/privileges', params);
}

/**
 * Get a specific privilege by ID
 * GET /api/1/privileges/:id
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number}
 * @returns {Promise<Object>}
 */
export async function getPrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  return await api.get(`/api/1/privileges/${args.privilege_id}`);
}

/**
 * Create a new privilege
 * POST /api/1/privileges
 * @param {OneLoginApi} api
 * @param {Object} args - Privilege data (name, version, statement, etc.)
 * @returns {Promise<Object>}
 */
export async function createPrivilege(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  return await api.post('/api/1/privileges', args);
}

/**
 * Update an existing privilege
 * PUT /api/1/privileges/:id
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updatePrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  const privilegeId = args.privilege_id;
  const updateData = { ...args };
  delete updateData.privilege_id;

  return await api.put(`/api/1/privileges/${privilegeId}`, updateData);
}

/**
 * Delete a privilege
 * DELETE /api/1/privileges/:id
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number}
 * @returns {Promise<Object>}
 */
export async function deletePrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  return await api.delete(`/api/1/privileges/${args.privilege_id}`);
}

/**
 * Get roles assigned to a privilege
 * GET /api/1/privileges/:id/roles
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number}
 * @returns {Promise<Object>}
 */
export async function getPrivilegeRoles(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  return await api.get(`/api/1/privileges/${args.privilege_id}/roles`);
}

/**
 * Assign a role to a privilege
 * POST /api/1/privileges/:id/roles/assign
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number, role_id: number}
 * @returns {Promise<Object>}
 */
export async function assignRoleToPrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  return await api.post(`/api/1/privileges/${args.privilege_id}/roles/assign`, {
    role_id: args.role_id
  });
}

/**
 * Remove a role from a privilege
 * DELETE /api/1/privileges/:id/roles/remove
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number, role_id: number}
 * @returns {Promise<Object>}
 */
export async function removeRoleFromPrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  return await api.delete(`/api/1/privileges/${args.privilege_id}/roles/remove`, {
    role_id: args.role_id
  });
}

/**
 * Get users assigned to a privilege
 * GET /api/1/privileges/:id/users
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number}
 * @returns {Promise<Object>}
 */
export async function getPrivilegeUsers(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  return await api.get(`/api/1/privileges/${args.privilege_id}/users`);
}

/**
 * Assign users to a privilege
 * POST /api/1/privileges/:id/users/assign
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number, user_id: number}
 * @returns {Promise<Object>}
 */
export async function assignUsersToPrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  return await api.post(`/api/1/privileges/${args.privilege_id}/users/assign`, {
    user_id: args.user_id
  });
}

/**
 * Remove a user from a privilege
 * DELETE /api/1/privileges/:id/users/remove
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number, user_id: number}
 * @returns {Promise<Object>}
 */
export async function removeUserFromPrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  return await api.delete(`/api/1/privileges/${args.privilege_id}/users/remove`, {
    user_id: args.user_id
  });
}
