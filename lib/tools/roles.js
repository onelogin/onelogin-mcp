/**
 * OneLogin Role Management Tools
 * API Reference: /api/2/roles and /api/1/users/{user_id}/add_roles|remove_roles
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
 * Reference: PUT /api/1/users/{user_id}/add_roles
 * Note: Role assignment lives in api/1, not api/2
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

  return await api.put(`/api/1/users/${args.user_id}/add_roles`, {
    role_id_array: args.role_ids
  });
}

/**
 * Remove roles from a user
 * Reference: PUT /api/1/users/{user_id}/remove_roles
 * Note: Role assignment lives in api/1, not api/2
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

  return await api.put(`/api/1/users/${args.user_id}/remove_roles`, {
    role_id_array: args.role_ids
  });
}

/**
 * Create a new role
 * POST /api/2/roles
 * @param {OneLoginApi} api
 * @param {Object} args - Role data (name, apps, users, admins, etc.)
 * @returns {Promise<Object>}
 */
export async function createRole(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  return await api.post('/api/2/roles', args);
}

/**
 * Update an existing role
 * PUT /api/2/roles/{role_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateRole(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  const roleId = args.role_id;
  const updateData = { ...args };
  delete updateData.role_id;

  return await api.put(`/api/2/roles/${roleId}`, updateData);
}

/**
 * Delete a role
 * DELETE /api/2/roles/{role_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteRole(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  return await api.delete(`/api/2/roles/${args.role_id}`);
}

/**
 * Get apps assigned to a role
 * GET /api/2/roles/{role_id}/apps
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number}
 * @returns {Promise<Object>}
 */
export async function getRoleApps(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  return await api.get(`/api/2/roles/${args.role_id}/apps`);
}

/**
 * Set apps for a role
 * PUT /api/2/roles/{role_id}/apps
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number, app_ids: number[]}
 * @returns {Promise<Object>}
 */
export async function setRoleApps(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  if (!args.app_ids || !Array.isArray(args.app_ids)) {
    throw new Error('app_ids array is required');
  }

  return await api.put(`/api/2/roles/${args.role_id}/apps`, {
    app_id_array: args.app_ids
  });
}

/**
 * Get users assigned to a role
 * GET /api/2/roles/{role_id}/users
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number}
 * @returns {Promise<Object>}
 */
export async function getRoleUsers(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  return await api.get(`/api/2/roles/${args.role_id}/users`);
}

/**
 * Get admins assigned to a role
 * GET /api/2/roles/{role_id}/admins
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number}
 * @returns {Promise<Object>}
 */
export async function getRoleAdmins(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  return await api.get(`/api/2/roles/${args.role_id}/admins`);
}

/**
 * Add admins to a role
 * POST /api/2/roles/{role_id}/admins
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number, admin_ids: number[]}
 * @returns {Promise<Object>}
 */
export async function addRoleAdmins(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  if (!args.admin_ids || !Array.isArray(args.admin_ids)) {
    throw new Error('admin_ids array is required');
  }

  return await api.post(`/api/2/roles/${args.role_id}/admins`, {
    admin_id_array: args.admin_ids
  });
}

/**
 * Remove an admin from a role
 * DELETE /api/2/roles/{role_id}/admins/{admin_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {role_id: number, admin_id: number}
 * @returns {Promise<Object>}
 */
export async function removeRoleAdmin(api, args) {
  if (!args.role_id) {
    throw new Error('role_id is required');
  }

  if (!args.admin_id) {
    throw new Error('admin_id is required');
  }

  return await api.delete(`/api/2/roles/${args.role_id}/admins/${args.admin_id}`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_roles',
    description: 'Get a list of roles with pagination and sorting support (max 650 per page). Can filter by name, app_id, or app_name. Use fields parameter to include related data (apps, users, admins) in response. Returns role data and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by role name' },
        limit: { type: 'number', description: 'Number of results to return (default 50)' },
        page: { type: 'number', description: 'Page number for pagination' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_role',
    description: 'Get the base role object by ID. Role users, apps, and administrators are returned using sub-endpoints (get_role_users, get_role_apps, get_role_admins). Returns role data with ID and name, plus x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID' }
      },
      required: ['role_id'],
      additionalProperties: false
    }
  },
  {
    name: 'assign_role_to_user',
    description: 'Assign one or more roles to a OneLogin user by providing an array of role IDs. This is the recommended way to manage user roles (rather than using update_user). Returns updated user data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'The OneLogin user ID' },
        role_ids: { type: 'array', items: { type: 'number' }, description: 'Array of role IDs to assign to the user' }
      },
      required: ['user_id', 'role_ids'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_role_from_user',
    description: 'Remove one or more roles from a OneLogin user. Returns updated user data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'The OneLogin user ID' },
        role_ids: { type: 'array', items: { type: 'number' }, description: 'Array of role IDs to remove from the user' }
      },
      required: ['user_id', 'role_ids'],
      additionalProperties: false
    }
  },
  {
    name: 'create_role',
    description: 'Create a new role with optional apps, users, and admins assigned during creation. Can assign multiple apps (array of app IDs) and users (array of user IDs) in a single call for efficient setup. Returns created role data with new role ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Role name' },
        apps: { type: 'array', items: { type: 'number' }, description: 'Array of app IDs to assign to the role' },
        users: { type: 'array', items: { type: 'number' }, description: 'Array of user IDs to assign to the role' }
      },
      required: ['name'],
      additionalProperties: true
    }
  },
  {
    name: 'update_role',
    description: 'Update an existing role. Partial role updates are supported - you only need to provide the fields you want to change. Returns updated role ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID to update' },
        name: { type: 'string', description: 'New role name' },
        apps: { type: 'array', items: { type: 'number' }, description: 'Array of app IDs to assign to the role' },
        users: { type: 'array', items: { type: 'number' }, description: 'Array of user IDs to assign to the role' }
      },
      required: ['role_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_role',
    description: 'Delete a role from OneLogin. WARNING: This operation is final and cannot be undone. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID to delete' }
      },
      required: ['role_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_role_apps',
    description: 'Get applications assigned to a role. Supports pagination. Use assigned=false parameter to return apps not yet assigned to the role. Returns app list with ID, name, and icon_url, plus x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID' }
      },
      required: ['role_id'],
      additionalProperties: false
    }
  },
  {
    name: 'set_role_apps',
    description: 'Assign applications to a role. IMPORTANT: Provide the complete list of app IDs to assign - this replaces all existing apps. To add or remove apps, you must submit the full desired app list, not a partial list. For example, if role has apps [123, 456] and you want to add 789, submit [123, 456, 789]. Returns array of assigned app IDs and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID' },
        app_ids: { type: 'array', items: { type: 'number' }, description: 'Array of app IDs to assign to the role' }
      },
      required: ['role_id', 'app_ids'],
      additionalProperties: false
    }
  },
  {
    name: 'get_role_users',
    description: 'Get users assigned to a role. Supports pagination. Can include users not currently assigned using include_unassigned parameter. Supports filtering on first name, last name, username, and email address via name parameter. Returns user list with ID, name, username, added_by info, added_at timestamp, and assigned status. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID' }
      },
      required: ['role_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_role_admins',
    description: 'Get role administrators (users who can manage this role). Supports pagination. Can include admins not currently assigned using include_unassigned parameter. Supports filtering on first name, last name, username, and email address via name parameter. Returns admin list with ID, name, username, added_by info, added_at timestamp, and assigned status. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID' }
      },
      required: ['role_id'],
      additionalProperties: false
    }
  },
  {
    name: 'add_role_admins',
    description: 'Assign users as administrators of a role. Role admins can manage the role and its assignments. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID' },
        admin_ids: { type: 'array', items: { type: 'number' }, description: 'Array of admin user IDs to add to the role' }
      },
      required: ['role_id', 'admin_ids'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_role_admin',
    description: 'Remove a user from role administrators. The user will no longer be able to manage this role. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        role_id: { type: 'number', description: 'The OneLogin role ID' },
        admin_id: { type: 'number', description: 'The admin user ID to remove from the role' }
      },
      required: ['role_id', 'admin_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_roles: listRoles,
  get_role: getRole,
  assign_role_to_user: assignRoleToUser,
  remove_role_from_user: removeRoleFromUser,
  create_role: createRole,
  update_role: updateRole,
  delete_role: deleteRole,
  get_role_apps: getRoleApps,
  set_role_apps: setRoleApps,
  get_role_users: getRoleUsers,
  get_role_admins: getRoleAdmins,
  add_role_admins: addRoleAdmins,
  remove_role_admin: removeRoleAdmin
};
