/**
 * OneLogin SAML Assertion Tools
 * API Reference: /api/2/saml_assertion
 */

/**
 * Generate a SAML assertion
 * POST /api/2/saml_assertion
 * @param {OneLoginApi} api
 * @param {Object} args - {username_or_email: string, password: string, app_id: string, subdomain: string, ip_address?: string}
 * @returns {Promise<Object>}
 */
export async function generateSAMLAssertion(api, args) {
  if (!args.username_or_email) {
    throw new Error('username_or_email is required');
  }

  if (!args.password) {
    throw new Error('password is required');
  }

  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.subdomain) {
    throw new Error('subdomain is required');
  }

  return await api.post('/api/2/saml_assertion', args);
}

/**
 * Verify a factor when generating SAML assertion
 * POST /api/2/saml_assertion/verify_factor
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: string, device_id: string, state_token: string, otp_token?: string, do_not_notify?: boolean}
 * @returns {Promise<Object>}
 */
export async function verifySAMLAssertionFactor(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.device_id) {
    throw new Error('device_id is required');
  }

  if (!args.state_token) {
    throw new Error('state_token is required');
  }

  return await api.post('/api/2/saml_assertion/verify_factor', args);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'generate_saml_assertion',
    description: 'Generate a SAML assertion for user authentication to an app. If MFA is not required: returns SAML assertion data immediately. If MFA is required: returns state_token, devices (with device_id for each factor), callback_url, and user info - must then call verify_saml_assertion_factor. Works with ip_address parameter to honor MFA IP allow-listing. Returns assertion data or MFA challenge and x-request-id (API v2).',
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
        app_id: {
          type: 'string',
          description: 'App ID to generate assertion for'
        },
        subdomain: {
          type: 'string',
          description: 'Account subdomain'
        },
        ip_address: {
          type: 'string',
          description: 'IP address (optional)'
        }
      },
      required: ['username_or_email', 'password', 'app_id', 'subdomain'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_saml_assertion_factor',
    description: 'Verify OTP for second factor when MFA is required for SAML authentication. Use in conjunction with generate_saml_assertion. For some factors (SMS): OTP not immediately required, returns pending status. For others (Google Authenticator): OTP required immediately. For OneLogin Protect: first call triggers push notification, subsequent calls poll with do_not_notify=true to check status. Returns SAML assertion on success or error and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: {
          type: 'string',
          description: 'App ID'
        },
        device_id: {
          type: 'string',
          description: 'Device ID for MFA'
        },
        state_token: {
          type: 'string',
          description: 'State token from initial assertion'
        },
        otp_token: {
          type: 'string',
          description: 'One-time password token (optional)'
        },
        do_not_notify: {
          type: 'boolean',
          description: 'Whether to skip notification (optional)'
        }
      },
      required: ['app_id', 'device_id', 'state_token'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  generate_saml_assertion: generateSAMLAssertion,
  verify_saml_assertion_factor: verifySAMLAssertionFactor
};
