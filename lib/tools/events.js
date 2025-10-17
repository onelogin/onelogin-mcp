/**
 * OneLogin Events Tools
 * API Reference: /api/1/events (API v1 - Rate Limited)
 */

/**
 * List OneLogin events
 * Reference: GET /api/1/events
 * @param {OneLoginApi} api
 * @param {Object} args - Filters and pagination
 * @returns {Promise<Object>}
 */
export async function listEvents(api, args = {}) {
  // Build query parameters from args
  const params = {};

  // Filter parameters
  if (args.since) params.since = args.since;
  if (args.until) params.until = args.until;
  if (args.event_type_id) params.event_type_id = args.event_type_id;
  if (args.user_id) params.user_id = args.user_id;
  if (args.client_id) params.client_id = args.client_id;
  if (args.directory_id) params.directory_id = args.directory_id;
  if (args.resolution) params.resolution = args.resolution;
  if (args.user_name) params.user_name = args.user_name;

  // Display and sorting parameters
  if (args.fields) params.fields = args.fields;
  if (args.sort) params.sort = args.sort;
  if (args.limit) params.limit = args.limit;

  // Pagination: support both page numbers and cursors
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/1/events', params);
}

/**
 * Get a specific event by ID
 * Reference: GET /api/1/events/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {event_id: string}
 * @returns {Promise<Object>}
 */
export async function getEvent(api, args) {
  if (!args.event_id) {
    throw new Error('event_id is required');
  }

  return await api.get(`/api/1/events/${args.event_id}`);
}
