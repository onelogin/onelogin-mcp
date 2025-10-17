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
