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
