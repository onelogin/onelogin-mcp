/**
 * OneLogin Session Management Tools
 * API Reference: /api/2/login/auth and /api/2/session
 *
 * Session management tools create and validate authentication tokens for custom login flows.
 * Use these to build custom SSO portals or integrate OneLogin authentication into your apps.
 */

/**
 * Create a session login token
 * POST /api/2/login/auth
 * @param {OneLoginApi} api
 * @param {Object} args - {username_or_email: string, password: string, subdomain: string}
 * @returns {Promise<Object>}
 */
export async function createSessionLoginToken(api, args) {
  if (!args.username_or_email) {
    throw new Error('username_or_email is required');
  }

  if (!args.password) {
    throw new Error('password is required');
  }

  if (!args.subdomain) {
    throw new Error('subdomain is required');
  }

  return await api.post('/api/2/login/auth', args);
}

/**
 * Verify MFA for session login
 * POST /api/2/login/verify_factor
 * @param {OneLoginApi} api
 * @param {Object} args - {device_id: string, state_token: string, otp_token?: string, do_not_notify?: boolean}
 * @returns {Promise<Object>}
 */
export async function verifySessionFactor(api, args) {
  if (!args.device_id) {
    throw new Error('device_id is required');
  }

  if (!args.state_token) {
    throw new Error('state_token is required');
  }

  return await api.post('/api/2/login/verify_factor', args);
}

/**
 * Get session token details
 * GET /api/2/session/{token}
 * @param {OneLoginApi} api
 * @param {Object} args - {session_token: string}
 * @returns {Promise<Object>}
 */
export async function getSessionToken(api, args) {
  if (!args.session_token) {
    throw new Error('session_token is required');
  }

  return await api.get(`/api/2/session/${args.session_token}`);
}

/**
 * Destroy a session token (logout)
 * DELETE /api/2/session/{token}
 * @param {OneLoginApi} api
 * @param {Object} args - {session_token: string}
 * @returns {Promise<Object>}
 */
export async function destroySessionToken(api, args) {
  if (!args.session_token) {
    throw new Error('session_token is required');
  }

  return await api.delete(`/api/2/session/${args.session_token}`);
}

/**
 * Get logout URL for session
 * GET /api/2/session/logout_url
 * @param {OneLoginApi} api
 * @param {Object} args - Optional parameters
 * @returns {Promise<Object>}
 */
export async function getLogoutUrl(api, args = {}) {
  return await api.get('/api/2/session/logout_url', args);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'create_session_login_token',
    description: 'Authenticate a user and create a session token for custom login flows. Provide username/email and password. If MFA not required: returns session_token immediately for SSO access. If MFA required: returns state_token, devices (available MFA factors with device_id), and user info - must then call verify_session_factor. Use subdomain parameter to specify OneLogin account. Returns authentication result with session data or MFA challenge and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        username_or_email: {
          type: 'string',
          description: 'Username or email address'
        },
        password: {
          type: 'string',
          description: 'User password'
        },
        subdomain: {
          type: 'string',
          description: 'OneLogin account subdomain'
        },
        ip_address: {
          type: 'string',
          description: 'User IP address (optional, for risk assessment)'
        }
      },
      required: ['username_or_email', 'password', 'subdomain'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_session_factor',
    description: 'Complete MFA verification during session login to obtain session token. Use in conjunction with create_session_login_token after MFA challenge. Provide device_id (from MFA challenge) and state_token. For OTP factors (SMS, Email, Authenticator): include otp_token. For OneLogin Protect: first call triggers push, subsequent calls poll with do_not_notify=true. Returns session_token on success or pending status for push factors. Returns session data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'string',
          description: 'MFA device ID from login challenge'
        },
        state_token: {
          type: 'string',
          description: 'State token from initial login'
        },
        otp_token: {
          type: 'string',
          description: 'One-time password (optional, for OTP factors)'
        },
        do_not_notify: {
          type: 'boolean',
          description: 'Skip push notification (optional, for polling)'
        }
      },
      required: ['device_id', 'state_token'],
      additionalProperties: false
    }
  },
  {
    name: 'get_session_token',
    description: 'Get detailed information about a session token including user data, expiration, and session metadata. Returns user object with ID, email, username, firstname, lastname, session status (active/expired), created_at timestamp, expires_at timestamp, and x-request-id. Use to validate sessions or check session status. Returns 401 if token invalid or expired.',
    inputSchema: {
      type: 'object',
      properties: {
        session_token: {
          type: 'string',
          description: 'The session token to query'
        }
      },
      required: ['session_token'],
      additionalProperties: false
    }
  },
  {
    name: 'destroy_session_token',
    description: 'Invalidate a session token (logout user). The token immediately becomes invalid and cannot be used for authentication. User must re-authenticate to get a new session. Use for explicit logout or to revoke compromised sessions. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        session_token: {
          type: 'string',
          description: 'The session token to destroy'
        }
      },
      required: ['session_token'],
      additionalProperties: false
    }
  },
  {
    name: 'get_logout_url',
    description: 'Generate a logout URL for OneLogin session termination. Returns logout_url that when visited will end the user\'s OneLogin session across all apps. Optionally provide redirect_uri parameter to send user to specific page after logout. Use in custom portals to provide logout functionality. Returns logout URL and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        redirect_uri: {
          type: 'string',
          description: 'URL to redirect to after logout (optional)'
        }
      },
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  create_session_login_token: createSessionLoginToken,
  verify_session_factor: verifySessionFactor,
  get_session_token: getSessionToken,
  destroy_session_token: destroySessionToken,
  get_logout_url: getLogoutUrl
};
