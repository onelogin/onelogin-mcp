/**
 * OneLogin Security Policy Tools
 * API Reference: /api/2/policies
 *
 * User policies and app policies are the same resource, told apart by `kind`:
 *
 *   kind=user - assigned to users and groups. Covers passwords, lockout, session
 *               timeouts, MFA registration, account recovery, portal and social sign-in.
 *   kind=app  - assigned to apps (app.policy_id). A much smaller set of settings:
 *               force re-authentication, per-app MFA, IP restriction, device trust.
 *
 * A policy row holds the union of both field sets, but only its own kind's fields
 * mean anything. The API enforces that in both directions: writing a user-only field
 * to an app policy is a 422, and a GET on an app policy leaves those fields out of
 * the response entirely. The three field lists below mirror the server's split, so a
 * caller can be told which fields apply before spending a round trip finding out.
 */

import { applyV2Pagination } from '../pagination.js';

/**
 * Fields accepted on both kinds of policy.
 *
 * `kind` is deliberately not one of them. The server counts it as shared, but it is not an
 * ordinary writable field: createPolicy appends it after filtering, and updatePolicy never
 * sends it at all because the API refuses to change it.
 */
const SHARED_FIELDS = [
  'name',
  'ip_addr_restriction',
  'ignore_xff',
  'browser_cert_required',
  'third_party_device_trust',
  'enable_smart_access',
  'smart_access_risk_threshold',
  'otp_auth_enabled',
  'authentication_factor_ids'
];

/** Fields accepted only on app policies (kind=app). Rejected with 422 on user policies. */
const APP_ONLY_FIELDS = [
  'force_authn',
  'app_force_authn_offset',
  'app_otp_offset',
  'app_otp_offset_enabled',
  'gdt_required'
];

/** Fields accepted only on user policies (kind=user). Rejected with 422 on app policies. */
const USER_ONLY_FIELDS = [
  // Login flow
  'preferred_auth_state_machine',
  // Password
  'minimum_password_length',
  'password_expiration_days',
  'passwords_remembered',
  'password_complexity_requirements',
  'dynamic_blacklist_attributes',
  'enforce_account_password_blacklist',
  'enforce_compromised_credentials_check',
  'password_redirect_enabled',
  'password_redirect_url',
  'password_redirect_message',
  // Account recovery
  'enable_password_change',
  'enable_unlock_via_password_reset',
  'enable_email_password_reset',
  'enable_sms_password_reset',
  'enable_question_password_reset',
  'require_security_questions',
  'reset_password_authentication_factor_ids',
  // Invite links
  'invite_expiration_time_value',
  'invite_expiration_time_unit',
  // Lockout
  'maximum_invalid_login_attempts',
  'lock_effective_minutes',
  // Session
  'session_timeout_by_inactivity_value',
  'session_timeout_by_inactivity_unit',
  'session_timeout_by_fixed_time_value',
  'session_timeout_by_fixed_time_unit',
  'session_timeout_minutes',
  'session_timeout_type',
  'persistent_session_enabled',
  // MFA
  'otp_config',
  'otp_trigger_condition',
  'otp_security_token_expiration_days',
  'mfa_registration_enabled',
  'voluntary_mfa_registration_enabled',
  'user_phone_update_allowed',
  'disable_protect_push_notifications',
  'disable_protect_push_recovery',
  'enable_number_match',
  // Device trust
  'self_install_cert',
  'browser_pki_expiration',
  'trusted_device_login_enabled',
  'trusted_device_login_mfa_allowed',
  // Portal
  'new_portal_setting',
  'allow_add_company_app',
  'allow_add_personal_app',
  'enable_browser_extensions',
  'disable_browser_password_manager',
  'enable_email_hint',
  // Social sign-in
  'social_sign_in',
  'google',
  'facebook',
  'linkedin',
  'twitter',
  // Secure OneLogin areas (step-up)
  'secure_admin',
  'admin_policy_id',
  'secure_profile',
  'profile_policy_id',
  'secure_area_otp_timeout_minutes',
  // Advanced
  'euba_enabled',
  'euba_risk_threshold',
  'track_inactive_users',
  'enable_system_use_notification',
  'system_use_notification',
  'terms_and_conditions'
];

/** Every field the API will accept on a write, in the order the schema lists them. */
const WRITABLE_FIELDS = [...SHARED_FIELDS, ...APP_ONLY_FIELDS, ...USER_ONLY_FIELDS];

/**
 * Reduce caller args to the fields the API actually accepts.
 *
 * Anything else - policy_id, a typo, a field invented by the caller - is dropped rather
 * than posted. The API silently ignores attributes it does not recognise, so an unfiltered
 * body turns a typo into a change that appears to succeed and does nothing.
 *
 * @param {Object} args
 * @returns {Object} body containing only writable fields the caller supplied
 */
function buildPolicyBody(args) {
  const body = {};
  for (const field of WRITABLE_FIELDS) {
    if (args[field] !== undefined) body[field] = args[field];
  }
  return body;
}

/**
 * Name the supplied fields that do not apply to the given kind of policy.
 *
 * The API rejects these with a 422 naming each one; checking here turns that into a
 * message the caller can act on without spending the round trip. An explicit null is
 * not a write - the API ignores those too - so it is not reported.
 *
 * @param {string} kind - 'user' or 'app'
 * @param {Object} body - the filtered request body
 * @returns {string[]} offending field names, sorted
 */
function fieldsNotApplicableTo(kind, body) {
  const wrongKind = kind === 'app' ? USER_ONLY_FIELDS : APP_ONLY_FIELDS;
  return wrongKind.filter((field) => body[field] !== undefined && body[field] !== null).sort();
}

/**
 * List security policies
 * GET /api/2/policies
 * @param {OneLoginApi} api
 * @param {Object} args - Filters and pagination
 * @returns {Promise<Object>}
 */
export async function listPolicies(api, args = {}) {
  const params = {};

  // Filter parameters
  if (args.kind) params.kind = args.kind;
  if (args.name) params.name = args.name;

  // Pagination: limit/page, or a single cursor (see lib/pagination.js)
  applyV2Pagination(params, args);

  return await api.get('/api/2/policies', params);
}

/**
 * Get a single policy with its full settings
 * GET /api/2/policies/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {policy_id: number}
 * @returns {Promise<Object>}
 */
export async function getPolicy(api, args) {
  if (!args.policy_id) {
    throw new Error('policy_id is required');
  }

  return await api.get(`/api/2/policies/${args.policy_id}`);
}

/**
 * Create a security policy
 * POST /api/2/policies
 * @param {OneLoginApi} api
 * @param {Object} args - {name, kind, ...settings}
 * @returns {Promise<Object>}
 */
export async function createPolicy(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }
  if (args.kind !== 'user' && args.kind !== 'app') {
    throw new Error("kind is required and must be 'user' or 'app'");
  }

  const body = buildPolicyBody(args);

  const inapplicable = fieldsNotApplicableTo(args.kind, body);
  if (inapplicable.length > 0) {
    throw new Error(
      `These fields are not applicable to ${args.kind} policies: ${inapplicable.join(', ')}`
    );
  }

  body.kind = args.kind;

  return await api.post('/api/2/policies', body);
}

/**
 * Update a security policy
 * PUT /api/2/policies/{id}
 *
 * `kind` is deliberately not forwarded: the API rejects any attempt to change it, and a
 * caller PUTting back a body it fetched would otherwise fail on a field it never edited.
 *
 * @param {OneLoginApi} api
 * @param {Object} args - {policy_id, ...settings to change}
 * @returns {Promise<Object>}
 */
export async function updatePolicy(api, args) {
  if (!args.policy_id) {
    throw new Error('policy_id is required');
  }

  const body = buildPolicyBody(args);
  if (Object.keys(body).length === 0) {
    throw new Error('at least one policy field to update is required');
  }

  return await api.put(`/api/2/policies/${args.policy_id}`, body);
}

/**
 * Delete a security policy
 * DELETE /api/2/policies/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {policy_id: number}
 * @returns {Promise<Object>}
 */
export async function deletePolicy(api, args) {
  if (!args.policy_id) {
    throw new Error('policy_id is required');
  }

  return await api.delete(`/api/2/policies/${args.policy_id}`);
}

/**
 * Make a user policy the account default
 * PUT /api/2/policies/{id}/set_default
 * @param {OneLoginApi} api
 * @param {Object} args - {policy_id: number}
 * @returns {Promise<Object>}
 */
export async function setDefaultPolicy(api, args) {
  if (!args.policy_id) {
    throw new Error('policy_id is required');
  }

  return await api.put(`/api/2/policies/${args.policy_id}/set_default`, {});
}

/**
 * List the account's authentication factors
 * GET /api/2/authentication_factors
 *
 * The lookup for authentication_factor_ids and reset_password_authentication_factor_ids
 * on a policy, which take account-level factor IDs rather than a user's enrolled devices.
 *
 * @param {OneLoginApi} api
 * @returns {Promise<Object>}
 */
export async function listAuthenticationFactors(api) {
  return await api.get('/api/2/authentication_factors');
}

/**
 * Policy setting schema, shared by create_policy and update_policy.
 * Grouped the way the admin console groups them, so a caller can find a setting
 * by the tab it lives on.
 */
const POLICY_SETTING_PROPERTIES = {
  // --- Shared: both kinds ---
  name: { type: 'string', description: 'Policy name' },
  ip_addr_restriction: {
    type: 'string',
    description: 'Whitespace-separated allowlist of IPv4 addresses and ranges (e.g. "10.0.0.1 10.0.1.1-10.0.1.99"). Empty means no restriction. Both kinds'
  },
  ignore_xff: { type: 'boolean', description: 'Ignore X-Forwarded-For headers when evaluating IP restrictions. Both kinds' },
  browser_cert_required: { type: 'boolean', description: 'Require a device trust certificate. Both kinds' },
  third_party_device_trust: { type: 'boolean', description: 'Accept a third-party device trust signal. Both kinds' },
  enable_smart_access: { type: 'boolean', description: 'Enable Smart Access risk evaluation. Both kinds' },
  smart_access_risk_threshold: { type: 'number', description: 'Risk score (0-100) at or above which Smart Access acts. Both kinds' },
  otp_auth_enabled: { type: 'boolean', description: 'Require MFA. Both kinds' },
  authentication_factor_ids: {
    type: 'array',
    items: { type: 'number' },
    description: 'Account-level authentication factor IDs allowed for MFA - get them from list_authentication_factors, NOT from a user\'s enrolled devices. Replaces the whole set on update. Both kinds'
  },

  // --- App policies only ---
  force_authn: { type: 'boolean', description: 'Force re-authentication when the user launches the app. APP POLICIES ONLY' },
  app_force_authn_offset: { type: 'number', description: 'Seconds of grace before force_authn re-prompts (3, 15, 30 or 60). APP POLICIES ONLY' },
  app_otp_offset_enabled: { type: 'boolean', description: 'Skip the MFA prompt if the user completed MFA recently. APP POLICIES ONLY' },
  app_otp_offset: { type: 'number', description: 'Minutes of MFA grace when app_otp_offset_enabled is true (max 7200). APP POLICIES ONLY' },
  gdt_required: { type: 'boolean', description: 'Require OneLogin Desktop (global device trust). APP POLICIES ONLY' },

  // --- User policies only: login flow ---
  preferred_auth_state_machine: {
    type: 'number',
    description: 'Login flow: 1=password then MFA (standard), 2=MFA then password, 3=MFA only (passwordless), 4=password then MFA then PKI. USER POLICIES ONLY'
  },

  // --- User policies only: password ---
  minimum_password_length: { type: 'number', description: 'Minimum password length, 5-32. USER POLICIES ONLY' },
  password_expiration_days: { type: 'number', description: 'Days before a password expires, 0-99. 0 means never. USER POLICIES ONLY' },
  passwords_remembered: { type: 'number', description: 'How many previous passwords cannot be reused, 0-99. USER POLICIES ONLY' },
  password_complexity_requirements: {
    type: 'number',
    description: 'Complexity: 0=none, 1=letters and digits, 2=mixed case and digits, 3=mixed case, digits and special chars, 4=at least three of those four classes. USER POLICIES ONLY'
  },
  dynamic_blacklist_attributes: {
    type: 'array',
    items: { type: 'string' },
    description: 'User attribute names whose values may not appear in a password (e.g. ["firstname","lastname"]). USER POLICIES ONLY'
  },
  enforce_account_password_blacklist: { type: 'boolean', description: 'Reject passwords on the account blacklist. USER POLICIES ONLY' },
  enforce_compromised_credentials_check: { type: 'boolean', description: 'Check passwords against known-breached credentials. USER POLICIES ONLY' },
  password_redirect_enabled: { type: 'boolean', description: 'Send password changes to an external URL instead of OneLogin. USER POLICIES ONLY' },
  password_redirect_url: { type: 'string', description: 'Where to send users to change their password. USER POLICIES ONLY' },
  password_redirect_message: { type: 'string', description: 'Message shown alongside the password redirect link. USER POLICIES ONLY' },

  // --- User policies only: account recovery ---
  enable_password_change: { type: 'boolean', description: 'Let users change their own password. USER POLICIES ONLY' },
  enable_unlock_via_password_reset: { type: 'boolean', description: 'A successful password reset also unlocks a locked account. USER POLICIES ONLY' },
  enable_email_password_reset: { type: 'boolean', description: 'Allow self-service reset by email. USER POLICIES ONLY' },
  enable_sms_password_reset: { type: 'boolean', description: 'Allow self-service reset by SMS. Requires the Password Reset - SMS feature. USER POLICIES ONLY' },
  enable_question_password_reset: { type: 'boolean', description: 'Allow self-service reset via security questions. Requires the Password Reset - Questions feature. USER POLICIES ONLY' },
  require_security_questions: { type: 'boolean', description: 'Make users set security questions. USER POLICIES ONLY' },
  reset_password_authentication_factor_ids: {
    type: 'array',
    items: { type: 'number' },
    description: 'Authentication factor IDs usable to verify a password reset, from list_authentication_factors. Replaces the whole set on update. USER POLICIES ONLY'
  },

  // --- User policies only: invite links ---
  invite_expiration_time_value: { type: 'number', description: 'How long an invite/reset link stays valid (must be > 0). Pair with invite_expiration_time_unit. USER POLICIES ONLY' },
  invite_expiration_time_unit: { type: 'number', description: 'Unit for invite_expiration_time_value: 0=minutes, 1=hours. USER POLICIES ONLY' },

  // --- User policies only: lockout ---
  maximum_invalid_login_attempts: { type: 'number', description: 'Failed logins before lockout, 3-10. 0 means no limit. USER POLICIES ONLY' },
  lock_effective_minutes: { type: 'number', description: 'Lockout duration in minutes (15, 30, 60). 0 means locked until an admin unlocks. USER POLICIES ONLY' },

  // --- User policies only: session ---
  session_timeout_by_inactivity_value: { type: 'number', description: 'Idle timeout. 0 means never. Pair with session_timeout_by_inactivity_unit. USER POLICIES ONLY' },
  session_timeout_by_inactivity_unit: { type: 'number', description: 'Unit for the idle timeout: 0=minutes, 1=hours. USER POLICIES ONLY' },
  session_timeout_by_fixed_time_value: { type: 'number', description: 'Absolute session lifetime regardless of activity. 0 means never. USER POLICIES ONLY' },
  session_timeout_by_fixed_time_unit: { type: 'number', description: 'Unit for the fixed timeout: 0=minutes, 1=hours. USER POLICIES ONLY' },
  session_timeout_minutes: { type: 'number', description: 'Legacy single session timeout. The server recomputes this from the session_timeout_by_* fields whenever those are set - prefer them. USER POLICIES ONLY' },
  session_timeout_type: { type: 'number', description: 'Legacy companion to session_timeout_minutes: 0=by inactivity, 1=by fixed time. Server-derived when the session_timeout_by_* fields are set. USER POLICIES ONLY' },
  persistent_session_enabled: { type: 'boolean', description: 'Allow "keep me signed in" across browser restarts. USER POLICIES ONLY' },

  // --- User policies only: MFA ---
  otp_config: { type: 'number', description: 'Who MFA applies to: 0=administrators only, 1=configured users only, 2=all users. USER POLICIES ONLY' },
  otp_trigger_condition: { type: 'number', description: 'When to prompt for MFA: 0=every login, 1=unknown browser only. USER POLICIES ONLY' },
  otp_security_token_expiration_days: { type: 'number', description: 'Days a remembered-device MFA token stays valid (1-99999). USER POLICIES ONLY' },
  mfa_registration_enabled: { type: 'boolean', description: 'Prompt users to register MFA factors. USER POLICIES ONLY' },
  voluntary_mfa_registration_enabled: { type: 'boolean', description: 'With mfa_registration_enabled true, makes registration optional rather than required. USER POLICIES ONLY' },
  user_phone_update_allowed: { type: 'boolean', description: 'Let users change the phone number on an MFA factor. USER POLICIES ONLY' },
  disable_protect_push_notifications: { type: 'boolean', description: 'Turn off OneLogin Protect push, forcing manual OTP entry. USER POLICIES ONLY' },
  disable_protect_push_recovery: { type: 'boolean', description: 'Turn off OneLogin Protect push for account recovery. USER POLICIES ONLY' },
  enable_number_match: { type: 'boolean', description: 'Require number matching on OneLogin Protect push (anti push-fatigue). USER POLICIES ONLY' },

  // --- User policies only: device trust ---
  self_install_cert: { type: 'boolean', description: 'Let users install their own device trust certificate. USER POLICIES ONLY' },
  browser_pki_expiration: { type: 'number', description: 'Device trust certificate lifetime in days: 365, 730 or 1826. USER POLICIES ONLY' },
  trusted_device_login_enabled: { type: 'boolean', description: 'Allow login from trusted devices. USER POLICIES ONLY' },
  trusted_device_login_mfa_allowed: { type: 'boolean', description: 'Allow MFA to be satisfied by the trusted device. USER POLICIES ONLY' },

  // --- User policies only: portal ---
  new_portal_setting: { type: 'string', enum: ['required', 'allowed', 'forbidden'], description: 'Access to the new portal experience. USER POLICIES ONLY' },
  allow_add_company_app: { type: 'boolean', description: 'Let users add company apps to their portal. USER POLICIES ONLY' },
  allow_add_personal_app: { type: 'boolean', description: 'Let users add personal apps to their portal. USER POLICIES ONLY' },
  enable_browser_extensions: { type: 'boolean', description: 'Allow the OneLogin browser extension. USER POLICIES ONLY' },
  disable_browser_password_manager: { type: 'boolean', description: 'Stop the browser offering to save OneLogin passwords. USER POLICIES ONLY' },
  enable_email_hint: { type: 'boolean', description: 'Show an email hint on the login page. USER POLICIES ONLY' },

  // --- User policies only: social sign-in ---
  social_sign_in: { type: 'boolean', description: 'Master switch for social sign-in. The per-provider flags below do nothing without it. USER POLICIES ONLY' },
  google: { type: 'boolean', description: 'Allow Google sign-in. USER POLICIES ONLY' },
  facebook: { type: 'boolean', description: 'Allow Facebook sign-in. USER POLICIES ONLY' },
  linkedin: { type: 'boolean', description: 'Allow LinkedIn sign-in. USER POLICIES ONLY' },
  twitter: { type: 'boolean', description: 'Allow X/Twitter sign-in. USER POLICIES ONLY' },

  // --- User policies only: secure OneLogin areas (step-up) ---
  secure_admin: { type: 'boolean', description: 'Require step-up authentication to reach the admin console. USER POLICIES ONLY' },
  admin_policy_id: { type: 'number', description: 'ID of the APP policy that governs the admin console step-up. USER POLICIES ONLY' },
  secure_profile: { type: 'boolean', description: 'Require step-up authentication to reach the user profile page. USER POLICIES ONLY' },
  profile_policy_id: { type: 'number', description: 'ID of the APP policy that governs the profile page step-up. USER POLICIES ONLY' },
  secure_area_otp_timeout_minutes: { type: 'number', description: 'How long a step-up stays valid: 5, 10, 15, 20, 30, 45 or 60 minutes. USER POLICIES ONLY' },

  // --- User policies only: advanced ---
  euba_enabled: { type: 'boolean', description: 'Enable end-user behaviour analytics. USER POLICIES ONLY' },
  euba_risk_threshold: { type: 'number', description: 'Risk score (0-100) at or above which EUBA acts. USER POLICIES ONLY' },
  track_inactive_users: { type: 'boolean', description: 'Track and report inactive users. USER POLICIES ONLY' },
  enable_system_use_notification: { type: 'boolean', description: 'Show a system use notification before login. USER POLICIES ONLY' },
  system_use_notification: { type: 'string', description: 'Text of the system use notification. USER POLICIES ONLY' },
  terms_and_conditions: {
    type: 'object',
    description: 'Terms users must accept at login. USER POLICIES ONLY',
    properties: {
      enabled: { type: 'boolean', description: 'Whether the terms are shown' },
      content: { type: 'string', description: 'Terms text' }
    },
    additionalProperties: false
  }
};

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_policies',
    description: 'Get a list of security policies in a OneLogin account. Filter by kind ("user" for policies assigned to users and groups, "app" for policies assigned to apps) or by name (partial match). IMPORTANT: list responses are brief - only id, name, kind and is_default. Call get_policy for a policy\'s actual settings. Returns 50 policies per page (max 1000); read total_count from the pagination block to count without paging. Returns x-request-id for log tracing (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['user', 'app'], description: 'Filter by policy kind' },
        name: { type: 'string', description: 'Filter by name (case-insensitive partial match)' },
        limit: { type: 'number', description: 'Results per page (default 50, max 1000)' },
        page: { type: 'number', description: 'Page number' },
        cursor: { type: 'string', description: 'Fetch another page: pass the after_cursor (next page) or before_cursor (previous page) value from a previous response\'s pagination block. One `cursor` parameter serves both directions' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_policy',
    description: 'Get a single security policy with its full settings. IMPORTANT: the response only contains fields that apply to that policy\'s kind - an app policy will not include password, session or account-recovery fields at all, and their absence does not mean they are unset. Returns id, name, kind, is_default, every applicable setting, authentication_factor_ids, and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        policy_id: { type: 'number', description: 'The OneLogin policy ID' }
      },
      required: ['policy_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_policy',
    description: 'Create a security policy. IMPORTANT: requires the Custom Security Policies plan feature - without it the API returns 406. `kind` is required and cannot be changed afterwards: "user" for a policy assigned to users and groups (passwords, lockout, sessions, MFA, portal), "app" for a policy assigned to apps via update_app\'s policy_id (force_authn, per-app MFA, IP restriction, device trust). Fields belonging to the other kind are rejected - each field below is marked USER POLICIES ONLY, APP POLICIES ONLY, or "Both kinds". Creating a policy does not assign it to anyone: use update_user, update_group or update_app to apply it, or set_default_policy to make it the account default. Returns the created policy with its new ID and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['user', 'app'], description: 'Policy kind. Required, and immutable once created' },
        ...POLICY_SETTING_PROPERTIES
      },
      required: ['name', 'kind'],
      additionalProperties: false
    }
  },
  {
    name: 'update_policy',
    description: 'Update a security policy. Partial updates are supported - only supply the fields you want to change. IMPORTANT: `kind` cannot be changed, and a field belonging to the other kind is rejected with 422 naming the field, so check the policy\'s kind with get_policy first. authentication_factor_ids and reset_password_authentication_factor_ids REPLACE the whole set rather than adding to it - send the full list you want, and read the current one from get_policy first. Changes take effect on the next authentication for every user, group or app the policy is assigned to. Returns the updated policy and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        policy_id: { type: 'number', description: 'The OneLogin policy ID to update' },
        ...POLICY_SETTING_PROPERTIES
      },
      required: ['policy_id'],
      additionalProperties: false
    }
  },
  {
    name: 'delete_policy',
    description: 'Delete a security policy. WARNING: this cannot be undone. Users, groups and apps assigned to the policy are not deleted - their policy assignment is cleared, so they fall back to the account default policy. The account default policy itself cannot be deleted (422) - use set_default_policy to hand that role to another policy first. Returns 204 No Content on success and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        policy_id: { type: 'number', description: 'The OneLogin policy ID to delete' }
      },
      required: ['policy_id'],
      additionalProperties: false
    }
  },
  {
    name: 'set_default_policy',
    description: 'Make a user policy the account default, applied to every user without a policy of their own or one inherited from a group. IMPORTANT: only works on kind=user policies - an app policy returns 422. This changes authentication behaviour account-wide immediately, so confirm the target policy with get_policy first. The previous default keeps existing and simply stops being the default. Returns the policy with is_default true and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        policy_id: { type: 'number', description: 'The user policy ID to make the account default' }
      },
      required: ['policy_id'],
      additionalProperties: false
    }
  },
  {
    name: 'list_authentication_factors',
    description: 'List the authentication factors configured on the account, each with id, name and type (OneLogin Protect, SMS, Voice, Email, Yubikey, authenticator apps, etc). Use this to get the IDs for a policy\'s authentication_factor_ids or reset_password_authentication_factor_ids. IMPORTANT: these are account-level factor definitions, NOT a user\'s enrolled devices - for those use get_enrolled_factors, and for what a specific user may still enrol use get_available_factors. Returns the factor list and x-request-id (API v2).',
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
  list_policies: listPolicies,
  get_policy: getPolicy,
  create_policy: createPolicy,
  update_policy: updatePolicy,
  delete_policy: deletePolicy,
  set_default_policy: setDefaultPolicy,
  list_authentication_factors: listAuthenticationFactors
};
