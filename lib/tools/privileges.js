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

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_privileges',
    description: 'List privileges created in a OneLogin account. IMPORTANT: Requires Delegated Administration subscription. Privileges define actions that can be performed on resources but don\'t grant access until assigned to a user or role. Returns privilege data with ID, name, description, and policy statement (API v1 - Rate Limited). Returns x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Results per page' },
        page: { type: 'number', description: 'Page number' },
        after_cursor: { type: 'string', description: 'Cursor for next page' },
        before_cursor: { type: 'string', description: 'Cursor for previous page' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_privilege',
    description: 'Return a single privilege by ID. IMPORTANT: Requires Delegated Administration subscription. Returns privilege data with ID, name, description, and policy statement (Version, Statement with Effect/Action/Scope). If privilege not found, returns 404. Returns x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' }
      },
      required: ['privilege_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_privilege',
    description: 'Create a new privilege object that defines actions on OneLogin resources. IMPORTANT: Privileges don\'t grant user access - they describe what actions can be performed. Assign privilege to user/role to grant access. Requires policy statement with Version="2018-05-18", Statement array with Effect="Allow", Action (e.g., "users:List"), and Scope (e.g., "*" or "apps/1234"). Use wildcard "*" for super user privileges. Don\'t mix classes in Action array. IMPORTANT: Requires Delegated Administration subscription. Returns created privilege ID and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Privilege name' }
      },
      required: ['name'],
      additionalProperties: true
    }
  },
  {
    name: 'update_privilege',
    description: 'Update an existing privilege definition. IMPORTANT: Requires Delegated Administration subscription. Can update name, description, and policy statement. Returns updated privilege data and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID to update' },
        name: { type: 'string', description: 'New privilege name' }
      },
      required: ['privilege_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_privilege',
    description: 'Delete a privilege. IMPORTANT: Requires Delegated Administration subscription. This removes the privilege definition and unassigns it from all users/roles. Returns success status and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID to delete' }
      },
      required: ['privilege_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_privilege_roles',
    description: 'Get list of roles that have been assigned to a specific privilege. IMPORTANT: Requires Delegated Administration subscription. Returns role list with IDs and names and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' }
      },
      required: ['privilege_id'],
      additionalProperties: false
    }
  },
  {
    name: 'assign_role_to_privilege',
    description: 'Assign a role to a privilege, granting the role\'s users the privilege\'s defined actions. IMPORTANT: Requires Delegated Administration subscription. Returns success status and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' },
        role_id: { type: 'number', description: 'The role ID to assign' }
      },
      required: ['privilege_id', 'role_id'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_role_from_privilege',
    description: 'Remove a role assignment from a privilege, revoking the privilege\'s actions from the role\'s users. IMPORTANT: Requires Delegated Administration subscription. Returns success status and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' },
        role_id: { type: 'number', description: 'The role ID to remove' }
      },
      required: ['privilege_id', 'role_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_privilege_users',
    description: 'Get list of users that have been directly assigned to a specific privilege. IMPORTANT: Requires Delegated Administration subscription. Returns user list with IDs and names and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' }
      },
      required: ['privilege_id'],
      additionalProperties: false
    }
  },
  {
    name: 'assign_users_to_privilege',
    description: 'Assign users directly to a privilege, granting them the privilege\'s defined actions. IMPORTANT: Requires Delegated Administration subscription. Returns success status and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' },
        user_id: { type: 'number', description: 'The user ID to assign' }
      },
      required: ['privilege_id', 'user_id'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_user_from_privilege',
    description: 'Remove a user assignment from a privilege, revoking the privilege\'s actions from the user. IMPORTANT: Requires Delegated Administration subscription. Returns success status and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' },
        user_id: { type: 'number', description: 'The user ID to remove' }
      },
      required: ['privilege_id', 'user_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_privileges: listPrivileges,
  get_privilege: getPrivilege,
  create_privilege: createPrivilege,
  update_privilege: updatePrivilege,
  delete_privilege: deletePrivilege,
  get_privilege_roles: getPrivilegeRoles,
  assign_role_to_privilege: assignRoleToPrivilege,
  remove_role_from_privilege: removeRoleFromPrivilege,
  get_privilege_users: getPrivilegeUsers,
  assign_users_to_privilege: assignUsersToPrivilege,
  remove_user_from_privilege: removeUserFromPrivilege
};
