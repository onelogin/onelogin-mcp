/**
 * OneLogin Groups Tools
 * API Reference: /api/2/groups (API v2 - Modern, Full CRUD)
 */

/**
 * List OneLogin groups
 * Reference: GET /api/2/groups
 * Supports wildcard search with * (e.g., name=Engineering*)
 * @param {OneLoginApi} api
 * @param {Object} args - Filters and pagination
 * @returns {Promise<Object>}
 */
export async function listGroups(api, args = {}) {
  // Build query parameters from args
  const params = {};

  // Filter parameters
  if (args.name) params.name = args.name;
  if (args.reference) params.reference = args.reference;
  if (args.policy_id) params.policy_id = args.policy_id;
  if (args.updated_since) params.updated_since = args.updated_since;

  // Display and sorting parameters
  if (args.fields) params.fields = args.fields;
  if (args.sort) params.sort = args.sort;
  if (args.limit) params.limit = args.limit;

  // Pagination: support both page numbers and cursors
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/groups', params);
}

/**
 * Get a specific group by ID
 * Reference: GET /api/2/groups/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {group_id: number}
 * @returns {Promise<Object>}
 */
export async function getGroup(api, args) {
  if (!args.group_id) {
    throw new Error('group_id is required');
  }

  return await api.get(`/api/2/groups/${args.group_id}`);
}

/**
 * Create a new group
 * POST /api/2/groups
 * @param {OneLoginApi} api
 * @param {Object} args - Group data (name, reference, policy_id)
 * @returns {Promise<Object>}
 */
export async function createGroup(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  return await api.post('/api/2/groups', args);
}

/**
 * Update an existing group
 * PUT /api/2/groups/{group_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {group_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateGroup(api, args) {
  if (!args.group_id) {
    throw new Error('group_id is required');
  }

  const groupId = args.group_id;
  const updateData = { ...args };
  delete updateData.group_id;

  return await api.put(`/api/2/groups/${groupId}`, updateData);
}

/**
 * Delete a group
 * DELETE /api/2/groups/{group_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {group_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteGroup(api, args) {
  if (!args.group_id) {
    throw new Error('group_id is required');
  }

  return await api.delete(`/api/2/groups/${args.group_id}`);
}

/**
 * Get users assigned to a group
 * GET /api/2/groups/{group_id} (extracts users array from response)
 * @param {OneLoginApi} api
 * @param {Object} args - {group_id: number}
 * @returns {Promise<Object>}
 */
export async function getGroupUsers(api, args) {
  if (!args.group_id) {
    throw new Error('group_id is required');
  }

  const response = await api.get(`/api/2/groups/${args.group_id}`);

  // Extract users array from the group response
  return {
    ...response,
    data: response.data?.users || []
  };
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_groups',
    description: 'Get a list of groups in a OneLogin account with pagination and filtering support. Can filter by name (supports wildcards), reference, or policy_id. To find which group a user belongs to, use get_user. To add/remove users from groups, use update_user. Returns group data with ID, name, reference, and policy_id. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by group name (supports wildcards)' },
        reference: { type: 'string', description: 'Filter by reference' },
        policy_id: { type: 'number', description: 'Filter by policy ID' },
        updated_since: { type: 'string', description: 'Filter by update date (ISO 8601)' },
        limit: { type: 'number', description: 'Results per page' },
        page: { type: 'number', description: 'Page number' },
        after_cursor: { type: 'string', description: 'Cursor for next page' },
        before_cursor: { type: 'string', description: 'Cursor for previous page' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_group',
    description: 'Get a single group by ID with complete group details including users, admins, and policy information. Returns group data with ID, name, reference, policy_id, users array, admins array, and policy object. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'The OneLogin group ID' }
      },
      required: ['group_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_group',
    description: 'Create a new group with optional policy assignment. Groups are used to organize users and can have policies assigned for access control. Returns created group data with new group ID and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Group name (required, must be unique within account)' },
        reference: { type: 'string', description: 'External reference ID (optional, must be unique if provided)' },
        policy_id: { type: 'number', description: 'Policy ID to assign to the group (optional)' }
      },
      required: ['name'],
      additionalProperties: false
    }
  },
  {
    name: 'update_group',
    description: 'Update an existing group. Partial updates are supported - only provide the fields you want to change (name, reference, policy_id). Name and reference must remain unique within the account. Returns updated group data and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'The OneLogin group ID to update' },
        name: { type: 'string', description: 'New group name (must be unique)' },
        reference: { type: 'string', description: 'New external reference ID (must be unique if provided)' },
        policy_id: { type: 'number', description: 'Policy ID to assign to the group' }
      },
      required: ['group_id'],
      additionalProperties: false
    }
  },
  {
    name: 'delete_group',
    description: 'Delete a group from OneLogin. WARNING: This operation is final and cannot be undone. Users in the group will not be deleted, only the group membership is removed. The group itself is permanently deleted. Returns 204 No Content on success and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'The OneLogin group ID to delete' }
      },
      required: ['group_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_group_users',
    description: 'Get users assigned to a group. Returns a list of users who are members of the specified group with details including ID, email, firstname, lastname. Use this to see group membership. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'The OneLogin group ID' }
      },
      required: ['group_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_groups: listGroups,
  get_group: getGroup,
  create_group: createGroup,
  update_group: updateGroup,
  delete_group: deleteGroup,
  get_group_users: getGroupUsers
};
