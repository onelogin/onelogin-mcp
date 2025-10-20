/**
 * OneLogin Account Settings Tools
 * API Reference: /api/2/account
 *
 * Account settings control global OneLogin account configurations including
 * security policies, branding defaults, session timeouts, and feature flags.
 * These settings apply to the entire OneLogin account (all users and apps).
 */

/**
 * Get account settings
 * GET /api/2/account
 * @param {OneLoginApi} api
 * @param {Object} args - Optional parameters
 * @returns {Promise<Object>}
 */
export async function getAccountSettings(api, args = {}) {
  return await api.get('/api/2/account');
}

/**
 * Update account settings
 * PUT /api/2/account
 * @param {OneLoginApi} api
 * @param {Object} args - Settings to update
 * @returns {Promise<Object>}
 */
export async function updateAccountSettings(api, args) {
  return await api.put('/api/2/account', args);
}

/**
 * Get account features
 * GET /api/2/account/features
 * @param {OneLoginApi} api
 * @param {Object} args - Optional parameters
 * @returns {Promise<Object>}
 */
export async function getAccountFeatures(api, args = {}) {
  return await api.get('/api/2/account/features');
}

/**
 * Get account usage statistics
 * GET /api/2/account/usage
 * @param {OneLoginApi} api
 * @param {Object} args - Optional date range filters
 * @returns {Promise<Object>}
 */
export async function getAccountUsage(api, args = {}) {
  const params = {};

  if (args.start_date) params.start_date = args.start_date;
  if (args.end_date) params.end_date = args.end_date;

  return await api.get('/api/2/account/usage', params);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'get_account_settings',
    description: 'Get global OneLogin account settings and configuration. Returns comprehensive account settings including account_id, subdomain, name, plan (enterprise, business, etc.), region (us, eu), default_locale, default_timezone, session_timeout (idle timeout in minutes), absolute_session_timeout (max session duration), password_policy_id (default policy for new users), mfa_required (global MFA enforcement), allowed_ip_ranges (IP whitelist for admin access), allowed_countries (country whitelist), security_mode (strict, moderate, relaxed), login_page_customization, and feature_flags. Use to audit account-level security and configuration. Returns settings and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'update_account_settings',
    description: 'Update global OneLogin account settings. Can modify default_locale, default_timezone, session_timeout (1-480 minutes), absolute_session_timeout (1-10080 minutes), password_policy_id, mfa_required (true/false), allowed_ip_ranges (array of CIDR blocks), allowed_countries (array of country codes), and security_mode. Partial updates supported - only provide fields to change. IMPORTANT: Changes affect entire account immediately. Stricter security settings (shorter timeouts, required MFA) may impact all users. Test changes in lower environments first. Returns updated settings and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        default_locale: { type: 'string', description: 'Default locale (en-US, fr-FR, de-DE, etc.)' },
        default_timezone: { type: 'string', description: 'Default timezone (America/New_York, Europe/London, etc.)' },
        session_timeout: { type: 'number', description: 'Idle session timeout in minutes (1-480)' },
        absolute_session_timeout: { type: 'number', description: 'Maximum session duration in minutes (1-10080)' },
        mfa_required: { type: 'boolean', description: 'Require MFA for all users' },
        allowed_ip_ranges: { type: 'array', items: { type: 'string' }, description: 'IP whitelist for admin access (CIDR notation)' },
        allowed_countries: { type: 'array', items: { type: 'string' }, description: 'Country whitelist (ISO country codes)' }
      },
      additionalProperties: true
    }
  },
  {
    name: 'get_account_features',
    description: 'Get list of enabled features and capabilities for your OneLogin account. Features vary by plan (Enterprise, Business, etc.) and may include advanced_mfa (biometric, FIDO2), adaptive_authentication (risk-based policies), directory_sync (AD/LDAP integration), custom_login_pages, api_access, webhooks, advanced_reporting, siem_integration, desktop_sso, mobile_app_sso, and more. Returns features array with feature_name, enabled (true/false), plan_requirement (which plan includes this feature), and usage_count (how many times feature is used). Use to understand account capabilities. Returns features and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'get_account_usage',
    description: 'Get account usage statistics and metrics. Optionally filter by date range (start_date, end_date in ISO 8601). Returns usage data including active_users_count, total_users_count, authentication_count (successful logins), app_launch_count (app accesses), mfa_verification_count, failed_login_count, api_calls_count, storage_used (for file storage features), and billing_period. Includes breakdown by app (which apps are most used), by user_type (employees vs contractors), by authentication_method (SAML, OIDC, password), and by region. Use for capacity planning, billing reconciliation, and usage analytics. Returns usage statistics and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: { type: 'string', description: 'Start date for usage period (ISO 8601)' },
        end_date: { type: 'string', description: 'End date for usage period (ISO 8601)' }
      },
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  get_account_settings: getAccountSettings,
  update_account_settings: updateAccountSettings,
  get_account_features: getAccountFeatures,
  get_account_usage: getAccountUsage
};
