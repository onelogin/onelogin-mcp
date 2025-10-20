/**
 * OneLogin Rate Limits Tools
 * API Reference: /api/2/rate_limits
 *
 * Rate limits control API request throttling to prevent abuse and ensure fair usage.
 * Monitor your current rate limit status and understand limits for different API endpoints.
 */

/**
 * Get current rate limit status
 * GET /api/2/rate_limits/status
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function getRateLimitStatus(api, args = {}) {
  return await api.get('/api/2/rate_limits/status');
}

/**
 * Get rate limit configuration
 * GET /api/2/rate_limits
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function getRateLimits(api, args = {}) {
  return await api.get('/api/2/rate_limits');
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'get_rate_limit_status',
    description: 'Get current rate limit status for your API client. OneLogin enforces rate limits to prevent API abuse (typically 5000 requests per hour per client_id). Returns current status including limit (max requests per window), remaining (requests left in current window), reset_at (when limit resets, Unix timestamp), window_size (typically 3600 seconds), and throttled (whether you are currently being rate limited). Use before making batch API calls to avoid 429 errors. Returns status data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'get_rate_limits',
    description: 'Get rate limit configuration for all OneLogin API endpoints. Different endpoint categories have different limits (e.g., authentication endpoints may have stricter limits than read-only endpoints). Returns comprehensive rate limit rules including endpoint_patterns (URL patterns), methods (GET, POST, PUT, DELETE), limits (requests per hour), burst_limits (requests per minute), and exemptions (privileged API clients with higher limits). Use to understand API quotas and plan integration architecture. Returns limits configuration and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  get_rate_limit_status: getRateLimitStatus,
  get_rate_limits: getRateLimits
};
