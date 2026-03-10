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

  if (!args.privilege) {
    throw new Error('privilege object is required');
  }

  const body = { name: args.name, privilege: args.privilege };
  if (args.description) body.description = args.description;

  return await api.post('/api/1/privileges', body);
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

  const body = {};
  if (args.name) body.name = args.name;
  if (args.description !== undefined) body.description = args.description;
  if (args.privilege) body.privilege = args.privilege;

  return await api.put(`/api/1/privileges/${args.privilege_id}`, body);
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
 * POST /api/1/privileges/:id/roles
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number, role_ids: number[]}
 * @returns {Promise<Object>}
 */
export async function assignRoleToPrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  if (!args.role_ids || !Array.isArray(args.role_ids)) {
    throw new Error('role_ids array is required');
  }

  return await api.post(`/api/1/privileges/${args.privilege_id}/roles`, {
    roles: args.role_ids
  });
}

/**
 * Remove a role from a privilege
 * DELETE /api/1/privileges/:id/roles/:role_id
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

  return await api.delete(`/api/1/privileges/${args.privilege_id}/roles/${args.role_id}`);
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
 * POST /api/1/privileges/:id/users
 * @param {OneLoginApi} api
 * @param {Object} args - {privilege_id: number, user_ids: number[]}
 * @returns {Promise<Object>}
 */
export async function assignUsersToPrivilege(api, args) {
  if (!args.privilege_id) {
    throw new Error('privilege_id is required');
  }

  if (!args.user_ids || !Array.isArray(args.user_ids)) {
    throw new Error('user_ids array is required');
  }

  return await api.post(`/api/1/privileges/${args.privilege_id}/users`, {
    users: args.user_ids
  });
}

/**
 * Remove a user from a privilege
 * DELETE /api/1/privileges/:id/users/:user_id
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

  return await api.delete(`/api/1/privileges/${args.privilege_id}/users/${args.user_id}`);
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
    description: 'Create a new privilege that defines actions on OneLogin resources. Privileges don\'t grant access until assigned to a user or role. Use wildcard "*" for super user privileges. Don\'t mix resource classes in the Action array (e.g., don\'t combine users: and apps: actions in one statement). Requires Delegated Administration subscription. Returns created privilege ID and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Privilege name (e.g., "User Helpdesk")' },
        description: { type: 'string', description: 'Human-readable description of the privilege' },
        privilege: {
          type: 'object',
          description: 'The authorization policy definition',
          properties: {
            Version: { type: 'string', description: 'Policy version, must be "2018-05-18"', enum: ['2018-05-18'] },
            Statement: {
              type: 'array',
              description: 'Array of permission statements',
              items: {
                type: 'object',
                properties: {
                  Effect: { type: 'string', description: 'Must be "Allow"', enum: ['Allow'] },
                  Action: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Actions to allow (e.g., ["users:List", "users:Get", "users:Unlock"] or ["*"] for all)'
                  },
                  Scope: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Resource scope (e.g., ["*"] for all, or ["apps/1234"] for specific resources)'
                  }
                },
                required: ['Effect', 'Action', 'Scope'],
                additionalProperties: false
              }
            }
          },
          required: ['Version', 'Statement'],
          additionalProperties: false
        }
      },
      required: ['name', 'privilege'],
      additionalProperties: false
    }
  },
  {
    name: 'update_privilege',
    description: 'Update an existing privilege definition. Can update name, description, and/or the policy statement. Requires Delegated Administration subscription. Returns updated privilege data and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID to update' },
        name: { type: 'string', description: 'New privilege name' },
        description: { type: 'string', description: 'New description' },
        privilege: {
          type: 'object',
          description: 'Updated authorization policy definition',
          properties: {
            Version: { type: 'string', description: 'Policy version, must be "2018-05-18"', enum: ['2018-05-18'] },
            Statement: {
              type: 'array',
              description: 'Array of permission statements',
              items: {
                type: 'object',
                properties: {
                  Effect: { type: 'string', description: 'Must be "Allow"', enum: ['Allow'] },
                  Action: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Actions to allow (e.g., ["users:List", "users:Get"] or ["*"] for all)'
                  },
                  Scope: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Resource scope (e.g., ["*"] for all, or ["apps/1234"] for specific resources)'
                  }
                },
                required: ['Effect', 'Action', 'Scope'],
                additionalProperties: false
              }
            }
          },
          required: ['Version', 'Statement'],
          additionalProperties: false
        }
      },
      required: ['privilege_id'],
      additionalProperties: false
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
    description: 'Assign one or more roles to a privilege, granting the roles\' users the privilege\'s defined actions. IMPORTANT: Requires Delegated Administration subscription. Accepts array of role IDs to assign multiple roles at once. Returns success status and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' },
        role_ids: { 
          type: 'array', 
          items: { type: 'number' },
          description: 'Array of role IDs to assign to the privilege' 
        }
      },
      required: ['privilege_id', 'role_ids'],
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
    description: 'Assign one or more users directly to a privilege, granting them the privilege\'s defined actions. IMPORTANT: Requires Delegated Administration subscription. Accepts array of user IDs to assign multiple users at once. Returns success status and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        privilege_id: { type: 'string', description: 'The OneLogin privilege ID' },
        user_ids: { 
          type: 'array', 
          items: { type: 'number' },
          description: 'Array of user IDs to assign to the privilege' 
        }
      },
      required: ['privilege_id', 'user_ids'],
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
