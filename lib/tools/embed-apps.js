/**
 * OneLogin Embed Apps Tools
 * API Reference: /api/2/embed_apps
 *
 * Embed Apps allow you to white-label and embed the OneLogin portal into your own
 * application or website. Generate embed tokens and URLs to provide seamless SSO
 * without redirecting users to OneLogin's domain.
 */

/**
 * Get embed app token for a user
 * POST /api/2/embed_apps/token
 * @param {OneLoginApi} api
 * @param {Object} args - Token request parameters
 * @returns {Promise<Object>}
 */
export async function getEmbedAppToken(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.post('/api/2/embed_apps/token', args);
}

/**
 * Generate embed URL for user portal
 * POST /api/2/embed_apps/generate_url
 * @param {OneLoginApi} api
 * @param {Object} args - URL generation parameters
 * @returns {Promise<Object>}
 */
export async function generateEmbedUrl(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  return await api.post('/api/2/embed_apps/generate_url', args);
}

/**
 * List available apps for embedding
 * GET /api/2/embed_apps/apps
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listEmbeddableApps(api, args = {}) {
  const params = {};

  if (args.user_id) params.user_id = args.user_id;
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/embed_apps/apps', params);
}

/**
 * Validate an embed token
 * POST /api/2/embed_apps/validate_token
 * @param {OneLoginApi} api
 * @param {Object} args - {token: string}
 * @returns {Promise<Object>}
 */
export async function validateEmbedToken(api, args) {
  if (!args.token) {
    throw new Error('token is required');
  }

  return await api.post('/api/2/embed_apps/validate_token', args);
}

/**
 * Revoke an embed token
 * DELETE /api/2/embed_apps/token
 * @param {OneLoginApi} api
 * @param {Object} args - {token: string}
 * @returns {Promise<Object>}
 */
export async function revokeEmbedToken(api, args) {
  if (!args.token) {
    throw new Error('token is required');
  }

  return await api.delete('/api/2/embed_apps/token', { token: args.token });
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'get_embed_app_token',
    description: 'Generate an embed token to launch a specific app for a user in embedded mode. Required: user_id, app_id. Optionally provide ip_address (validates token usage from specific IP), expires_in (token lifetime in seconds, default 300). Returns short-lived token that can be used to embed the app in your own UI without redirecting to OneLogin domain. IMPORTANT: Token grants full access to the app as the specified user - validate user identity before generating. Returns token, expires_at timestamp, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID to generate token for' },
        app_id: { type: 'number', description: 'App ID to embed' },
        ip_address: { type: 'string', description: 'IP address to restrict token usage to' },
        expires_in: { type: 'number', description: 'Token lifetime in seconds (default 300, max 3600)' }
      },
      required: ['user_id', 'app_id'],
      additionalProperties: true
    }
  },
  {
    name: 'generate_embed_url',
    description: 'Generate a complete embed URL for a user\'s OneLogin portal that can be embedded in an iframe or webview. Required: user_id. Optionally provide app_id (deep link to specific app), return_to_url (redirect after logout), custom_label, ip_address. Returns fully-formed embed URL and short-lived session token. Use for white-label portals where you want users to access OneLogin apps without seeing OneLogin branding. SECURITY: Validate user session before generating URL. Returns embed_url, token, expires_at, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID to generate portal URL for' },
        app_id: { type: 'number', description: 'Optional app ID to deep link to' },
        return_to_url: { type: 'string', description: 'URL to redirect to after logout' },
        custom_label: { type: 'string', description: 'Custom branding label' },
        ip_address: { type: 'string', description: 'IP address to restrict usage to' }
      },
      required: ['user_id'],
      additionalProperties: true
    }
  },
  {
    name: 'list_embeddable_apps',
    description: 'Get a list of apps that are available for embedding. Optionally filter by user_id to see only apps the user has access to. Not all OneLogin apps support embedding - this returns the subset that do (typically SAML and OIDC apps with iframe support). Returns app list with IDs, names, connector_id, icon_url, and embedding capabilities. Use before calling get_embed_app_token to ensure app supports embedding. Returns apps array and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'Filter by user ID to see their accessible apps' },
        limit: { type: 'number', description: 'Number of results to return' },
        page: { type: 'number', description: 'Page number for pagination' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'validate_embed_token',
    description: 'Validate an embed token to verify it\'s authentic, not expired, and retrieve associated user/app information. Provide the token string. Returns validation status (valid/invalid/expired), user_id, app_id, issued_at, expires_at, ip_address (if token is IP-restricted), and remaining_lifetime in seconds. Use to verify tokens before accepting them from client applications. Returns validation data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'The embed token to validate' }
      },
      required: ['token'],
      additionalProperties: false
    }
  },
  {
    name: 'revoke_embed_token',
    description: 'Immediately revoke an embed token to prevent further use. Provide the token string. Token becomes invalid and any attempts to use it will fail. Use when user logs out of your application or when you detect suspicious activity. Returns 204 No Content on success and x-request-id. IMPORTANT: Revoking token does not kill active sessions - user may remain logged into app if session already established.',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'The embed token to revoke' }
      },
      required: ['token'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  get_embed_app_token: getEmbedAppToken,
  generate_embed_url: generateEmbedUrl,
  list_embeddable_apps: listEmbeddableApps,
  validate_embed_token: validateEmbedToken,
  revoke_embed_token: revokeEmbedToken
};
