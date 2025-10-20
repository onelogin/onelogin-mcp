/**
 * OneLogin Password Policies Tools
 * API Reference: /api/2/password_policies
 *
 * Password policies define password strength requirements, expiration rules,
 * and lockout settings. Configure different policies for different user segments
 * (employees, contractors, customers) to balance security and usability.
 */

/**
 * List all password policies
 * GET /api/2/password_policies
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listPasswordPolicies(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/password_policies', params);
}

/**
 * Get a specific password policy by ID
 * GET /api/2/password_policies/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {policy_id: number}
 * @returns {Promise<Object>}
 */
export async function getPasswordPolicy(api, args) {
  if (!args.policy_id) {
    throw new Error('policy_id is required');
  }

  return await api.get(`/api/2/password_policies/${args.policy_id}`);
}

/**
 * Create a new password policy
 * POST /api/2/password_policies
 * @param {OneLoginApi} api
 * @param {Object} args - Policy configuration
 * @returns {Promise<Object>}
 */
export async function createPasswordPolicy(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  return await api.post('/api/2/password_policies', args);
}

/**
 * Update an existing password policy
 * PUT /api/2/password_policies/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {policy_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updatePasswordPolicy(api, args) {
  if (!args.policy_id) {
    throw new Error('policy_id is required');
  }

  const policyId = args.policy_id;
  const updateData = { ...args };
  delete updateData.policy_id;

  return await api.put(`/api/2/password_policies/${policyId}`, updateData);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_password_policies',
    description: 'Get a list of all password policies configured in OneLogin. Password policies define strength requirements, expiration rules, and lockout settings. Returns policy list with IDs, names, default flag (whether this is the default policy for new users), and usage count (number of users assigned). Use to audit password security configurations. Returns policies array and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of results to return' },
        page: { type: 'number', description: 'Page number for pagination' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_password_policy',
    description: 'Get detailed configuration of a specific password policy by ID. Returns complete policy settings including name, min_length (8-256 characters), require_uppercase, require_lowercase, require_numbers, require_special_chars, special_chars_allowed (custom character set), password_history (prevent reuse of last N passwords, 0-24), expiration_days (0=never expires, 1-999), min_age_days (prevent frequent changes), max_failed_attempts (account lockout threshold, 0=disabled, 1-20), lockout_duration_minutes (how long account is locked), and password_strength_indicator (show strength meter on password change). Returns policy data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        policy_id: { type: 'number', description: 'The password policy ID' }
      },
      required: ['policy_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_password_policy',
    description: 'Create a new password policy with custom security requirements. Required: name. Configure min_length (default 8), require_uppercase (default true), require_lowercase (default true), require_numbers (default true), require_special_chars (default false), password_history (default 0), expiration_days (default 0=never), max_failed_attempts (default 5), lockout_duration_minutes (default 30). Balance security with usability - stricter policies may lead to password resets and help desk calls. Returns created policy with ID and x-request-id. IMPORTANT: Assign policy to users via role or user settings.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Policy name' },
        min_length: { type: 'number', description: 'Minimum password length (8-256, default 8)' },
        require_uppercase: { type: 'boolean', description: 'Require uppercase letters (default true)' },
        require_lowercase: { type: 'boolean', description: 'Require lowercase letters (default true)' },
        require_numbers: { type: 'boolean', description: 'Require numbers (default true)' },
        require_special_chars: { type: 'boolean', description: 'Require special characters (default false)' },
        password_history: { type: 'number', description: 'Prevent reuse of last N passwords (0-24, default 0)' },
        expiration_days: { type: 'number', description: 'Password expires after N days (0=never, 1-999, default 0)' },
        max_failed_attempts: { type: 'number', description: 'Lockout after N failed attempts (0=disabled, 1-20, default 5)' },
        lockout_duration_minutes: { type: 'number', description: 'Lockout duration in minutes (default 30)' }
      },
      required: ['name'],
      additionalProperties: true
    }
  },
  {
    name: 'update_password_policy',
    description: 'Update an existing password policy. Can modify all settings including name, complexity requirements, expiration, and lockout rules. Partial updates supported - only provide fields to change. IMPORTANT: Changes affect all users assigned to this policy. Stricter requirements may force users to reset passwords on next login. Consider notifying users before enforcing stricter policies. Returns updated policy data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        policy_id: { type: 'number', description: 'The password policy ID to update' },
        name: { type: 'string', description: 'New policy name' },
        min_length: { type: 'number', description: 'New minimum length' },
        require_uppercase: { type: 'boolean', description: 'New uppercase requirement' },
        require_special_chars: { type: 'boolean', description: 'New special character requirement' },
        expiration_days: { type: 'number', description: 'New expiration period' },
        max_failed_attempts: { type: 'number', description: 'New lockout threshold' }
      },
      required: ['policy_id'],
      additionalProperties: true
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_password_policies: listPasswordPolicies,
  get_password_policy: getPasswordPolicy,
  create_password_policy: createPasswordPolicy,
  update_password_policy: updatePasswordPolicy
};
