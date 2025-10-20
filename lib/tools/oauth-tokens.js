/**
 * OneLogin OAuth 2.0 Token Management Tools
 *
 * Administrative tools for managing OAuth tokens.
 * Note: Token generation is handled automatically by the MCP server.
 */

/**
 * Revoke an OAuth 2.0 token
 * POST /auth/oauth2/revoke
 */
async function revokeOAuthToken(api, access_token) {
  const config = await import('../config.js');
  const serverConfig = config.getActiveServer();

  const url = new URL(serverConfig.url);
  const subdomain = url.hostname.split('.')[0];
  const revokeUrl = `https://${subdomain}.onelogin.com/auth/oauth2/revoke`;

  const response = await fetch(revokeUrl, {
    method: 'POST',
    headers: {
      'Authorization': `client_id:${serverConfig.client_id}, client_secret:${serverConfig.client_secret}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      access_token: access_token
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token revocation failed: ${JSON.stringify(error)}`);
  }

  const data = await response.json();

  return {
    success: data.status?.error === false,
    request_id: response.headers.get('x-request-id'),
    status: response.status,
    data: data
  };
}

/**
 * Get current rate limit information
 * GET /auth/rate_limit
 */
async function getRateLimit(api) {
  const config = await import('../config.js');
  const serverConfig = config.getActiveServer();

  const url = new URL(serverConfig.url);
  const subdomain = url.hostname.split('.')[0];
  const rateLimitUrl = `https://${subdomain}.onelogin.com/auth/rate_limit`;

  // Get current access token from our API instance
  const token = await api.getAccessToken();

  const response = await fetch(rateLimitUrl, {
    method: 'GET',
    headers: {
      'Authorization': `bearer:${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Rate limit check failed: ${JSON.stringify(error)}`);
  }

  const result = await response.json();

  return {
    success: result.status?.error === false,
    request_id: response.headers.get('x-request-id'),
    status: response.status,
    data: result.data
  };
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'revoke_oauth_token',
    description: 'Revoke an OAuth 2.0 access token immediately. Use this to invalidate a token before its natural expiration (tokens normally expire after 10 hours). Once revoked, the token cannot be used for API requests. Requires the actual access_token value (not the client credentials). Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'The OAuth 2.0 access token to revoke'
        }
      },
      required: ['access_token'],
      additionalProperties: false
    }
  },
  {
    name: 'get_rate_limit',
    description: 'Get current rate limit information for the authenticated client. Shows remaining API calls and reset time for rate limiting. Useful for monitoring API usage and avoiding rate limit errors. Returns rate limit data including limit, remaining count, reset timestamp, and x-request-id.',
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
  revoke_oauth_token: revokeOAuthToken,
  get_rate_limit: getRateLimit
};
