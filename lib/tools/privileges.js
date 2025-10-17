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
