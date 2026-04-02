/**
 * OneLogin Accounts Tools (Reseller API)
 * API Reference: /api/2/accounts
 *
 * These endpoints are available to reseller and OneLogin accounts for managing
 * child (sub) accounts. Requires super user privileges.
 */

/**
 * List child accounts
 * GET /api/2/accounts
 * @param {OneLoginApi} api
 * @param {Object} args - Pagination parameters
 * @returns {Promise<Object>}
 */
export async function listAccounts(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/accounts', params);
}

/**
 * Get a specific child account by ID
 * GET /api/2/accounts/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {account_id: number}
 * @returns {Promise<Object>}
 */
export async function getAccount(api, args) {
  if (!args.account_id) {
    throw new Error('account_id is required');
  }

  return await api.get(`/api/2/accounts/${args.account_id}`);
}

/**
 * Create a child account
 * POST /api/2/accounts
 * @param {OneLoginApi} api
 * @param {Object} args - Account data
 * @returns {Promise<Object>}
 */
export async function createAccount(api, args) {
  if (!args.account) {
    throw new Error('account object is required');
  }

  const body = { account: args.account };

  if (args.plan) body.plan = args.plan;
  if (args.subscription_state) body.subscription_state = args.subscription_state;
  if (args.enforce_user_limit !== undefined) body.enforce_user_limit = args.enforce_user_limit;
  if (args.email_activation !== undefined) body.email_activation = args.email_activation;
  if (args.api_credential) body.api_credential = args.api_credential;

  return await api.post('/api/2/accounts', body);
}

/**
 * Update a child account
 * PUT /api/2/accounts/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {account_id: number, account: {...fields}}
 * @returns {Promise<Object>}
 */
export async function updateAccount(api, args) {
  if (!args.account_id) {
    throw new Error('account_id is required');
  }
  if (!args.account) {
    throw new Error('account object is required');
  }

  const body = { account: args.account };

  if (args.api_credential) body.api_credential = args.api_credential;

  return await api.put(`/api/2/accounts/${args.account_id}`, body);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_accounts',
    description: 'List child accounts under your reseller account. Requires reseller privileges. Returns account data including id, name, address, city, state, country, zip, phone, homepage, notes, created_at, and updated_at. Use pagination parameters for large account lists. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Results per page' },
        page: { type: 'number', description: 'Page number' },
        after_cursor: { type: 'string', description: 'Cursor for next page' },
        before_cursor: { type: 'string', description: 'Cursor for previous page' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_account',
    description: 'Get a specific child account by ID. Requires reseller privileges. Returns account data including id, name, address (address1, address2, city, state, zip, country), phone, homepage, notes, created_at, updated_at, and assigned roles. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'number', description: 'The child account ID' }
      },
      required: ['account_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_account',
    description: 'Create a new child account under your reseller account. Requires reseller privileges. The account object should contain name and optionally address1, address2, city, state, zip, country, phone, homepage, notes. Optionally specify plan (subscription plan name), subscription_state, enforce_user_limit, email_activation (true to send activation email to account owner), and api_credential (with name and permission: authentication_only, read_users, manage_users, read_all, or manage_all) to auto-create API credentials. Returns created account data with new ID and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        account: {
          type: 'object',
          description: 'Account details (name, address1, address2, city, state, zip, country, phone, homepage, notes)',
          properties: {
            name: { type: 'string', description: 'Account name (required)' },
            address1: { type: 'string', description: 'Address line 1' },
            address2: { type: 'string', description: 'Address line 2' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State/province' },
            zip: { type: 'string', description: 'ZIP/postal code' },
            country: { type: 'string', description: 'Country' },
            phone: { type: 'string', description: 'Phone number' },
            homepage: { type: 'string', description: 'Homepage URL' },
            notes: { type: 'string', description: 'Account notes' }
          },
          required: ['name']
        },
        plan: { type: 'string', description: 'Subscription plan name' },
        subscription_state: { type: 'string', description: 'Subscription state' },
        enforce_user_limit: { type: 'boolean', description: 'Whether to enforce user limits for this plan' },
        email_activation: { type: 'string', description: 'Set to "true" to send activation email to account owner' },
        api_credential: {
          type: 'object',
          description: 'Auto-create API credential for the new account',
          properties: {
            name: { type: 'string', description: 'API credential display name (required)' },
            permission: { type: 'string', description: 'Permission level: authentication_only, read_users, manage_users, read_all, or manage_all (required)' }
          },
          required: ['name', 'permission']
        }
      },
      required: ['account'],
      additionalProperties: false
    }
  },
  {
    name: 'update_account',
    description: 'Update a child account. Requires reseller privileges. Partial updates supported - only provide fields to change within the account object (name, address1, address2, city, state, zip, country, phone, homepage, notes). Optionally include api_credential to create new API credentials for the account (requires allow_assuming_users on the account). Returns updated account data and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'number', description: 'The child account ID to update' },
        account: {
          type: 'object',
          description: 'Account fields to update',
          properties: {
            name: { type: 'string', description: 'Account name' },
            address1: { type: 'string', description: 'Address line 1' },
            address2: { type: 'string', description: 'Address line 2' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State/province' },
            zip: { type: 'string', description: 'ZIP/postal code' },
            country: { type: 'string', description: 'Country' },
            phone: { type: 'string', description: 'Phone number' },
            homepage: { type: 'string', description: 'Homepage URL' },
            notes: { type: 'string', description: 'Account notes' }
          }
        },
        api_credential: {
          type: 'object',
          description: 'Create API credential for the account (requires allow_assuming_users)',
          properties: {
            name: { type: 'string', description: 'API credential display name (required)' },
            permission: { type: 'string', description: 'Permission level: authentication_only, read_users, manage_users, read_all, or manage_all (required)' }
          },
          required: ['name', 'permission']
        }
      },
      required: ['account_id', 'account'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_accounts: listAccounts,
  get_account: getAccount,
  create_account: createAccount,
  update_account: updateAccount
};
