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
  // Pagination (API v1): limit plus after_cursor / before_cursor taken from
  // the response body's pagination object. `page` is NOT supported - the API
  // rejects it with 400 "page is not a valid attribute" - so it is accepted by
  // the schema for backwards compatibility but never forwarded.
  if (args.limit) params.limit = args.limit;
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

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_events',
    description: 'Get a paginated list of events in a OneLogin account (50 events per page). Can filter by event_type_id, user_id, client_id, directory_id, resolution, and date range (since/until with millisecond precision). Pagination is cursor-based: set limit, then pass the response\'s pagination.after_cursor (next page) or pagination.before_cursor (previous page) back in; there is no page parameter. Returns event data with user_name/actor_user_name (first+last name or email fallback), risk scores, IP addresses, and full event details. Returns x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        since: { type: 'string', description: 'Start date filter (ISO 8601)' },
        until: { type: 'string', description: 'End date filter (ISO 8601)' },
        event_type_id: { type: 'number', description: 'Filter by event type ID' },
        user_id: { type: 'number', description: 'Filter by user ID' },
        client_id: { type: 'string', description: 'Filter by client ID' },
        directory_id: { type: 'number', description: 'Filter by directory ID' },
        resolution: { type: 'string', description: 'Filter by resolution' },
        user_name: { type: 'string', description: 'Filter by username' },
        limit: { type: 'number', description: 'Results per page (default 50)' },
        page: { type: 'number', description: 'DEPRECATED: ignored; the v1 events API rejects page. Paginate with after_cursor / before_cursor instead' },
        after_cursor: { type: 'string', description: 'Next page: the after_cursor value from a previous response\'s pagination object' },
        before_cursor: { type: 'string', description: 'Previous page: the before_cursor value from a previous response\'s pagination object' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_event',
    description: 'Get a single event by ID with complete event details including user names, timestamps, IP addresses, risk scores, and resolution data. Returns event data and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        event_id: { type: 'string', description: 'The OneLogin event ID' }
      },
      required: ['event_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_events: listEvents,
  get_event: getEvent
};
