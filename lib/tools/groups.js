/**
 * OneLogin Groups Tools
 * API Reference: /api/1/groups (API v1 - Rate Limited)
 */

/**
 * List OneLogin groups
 * Reference: GET /api/1/groups
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
  if (args.updated_since) params.updated_since = args.updated_since;

  // Display and sorting parameters
  if (args.fields) params.fields = args.fields;
  if (args.sort) params.sort = args.sort;
  if (args.limit) params.limit = args.limit;

  // Pagination: support both page numbers and cursors
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/1/groups', params);
}

/**
 * Get a specific group by ID
 * Reference: GET /api/1/groups/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {group_id: number}
 * @returns {Promise<Object>}
 */
export async function getGroup(api, args) {
  if (!args.group_id) {
    throw new Error('group_id is required');
  }

  return await api.get(`/api/1/groups/${args.group_id}`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_groups',
    description: 'Get a list of groups in a OneLogin account (50 groups per page). To find which group a user belongs to, use get_user. To add/remove users from groups, use update_user. Returns group data with ID, name, and reference (deprecated, always null). Returns x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by group name (supports wildcards)' },
        reference: { type: 'string', description: 'Filter by reference' },
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
    description: 'Get a single group by ID with group details. Returns group data with ID, name, and reference. Returns x-request-id (API v1 - Rate Limited).',
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
  get_group: getGroup
};
