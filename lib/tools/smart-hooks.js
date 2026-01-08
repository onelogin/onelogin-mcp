/**
 * OneLogin Smart Hooks Tools
 * API Reference: /api/2/hooks
 *
 * Smart Hooks are webhooks that trigger external HTTP endpoints based on OneLogin events.
 * Use cases: provisioning automation, custom MFA, security alerts, compliance logging.
 */

/**
 * List all Smart Hooks
 * GET /api/2/hooks
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listSmartHooks(api, args = {}) {
  const params = {};

  // Filter parameters
  if (args.type) params.type = args.type;
  if (args.disabled !== undefined) params.disabled = args.disabled;

  // Pagination
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/hooks', params);
}

/**
 * Get a specific Smart Hook by ID
 * GET /api/2/hooks/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {hook_id: string}
 * @returns {Promise<Object>}
 */
export async function getSmartHook(api, args) {
  if (!args.hook_id) {
    throw new Error('hook_id is required');
  }

  return await api.get(`/api/2/hooks/${args.hook_id}`);
}

/**
 * Create a new Smart Hook
 * POST /api/2/hooks
 * @param {OneLoginApi} api
 * @param {Object} args - Hook configuration
 * @returns {Promise<Object>}
 */
export async function createSmartHook(api, args) {
  if (!args.type) {
    throw new Error('type is required');
  }

  if (!args.function) {
    throw new Error('function (code) is required');
  }

  // Transform env_vars from object format {"VAR": "value"} to array format [{name: "VAR", value: "value"}]
  // The OneLogin API expects an array, but we accept object format for better UX
  const payload = { ...args };
  if (payload.env_vars && typeof payload.env_vars === 'object' && !Array.isArray(payload.env_vars)) {
    payload.env_vars = Object.entries(payload.env_vars).map(([name, value]) => ({ name, value }));
  }

  return await api.post('/api/2/hooks', payload);
}

/**
 * Update an existing Smart Hook
 * PUT /api/2/hooks/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {hook_id: string, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateSmartHook(api, args) {
  if (!args.hook_id) {
    throw new Error('hook_id is required');
  }

  const hookId = args.hook_id;
  const updateData = { ...args };
  delete updateData.hook_id;

  // Transform env_vars from object format {"VAR": "value"} to array format [{name: "VAR", value: "value"}]
  if (updateData.env_vars && typeof updateData.env_vars === 'object' && !Array.isArray(updateData.env_vars)) {
    updateData.env_vars = Object.entries(updateData.env_vars).map(([name, value]) => ({ name, value }));
  }

  return await api.put(`/api/2/hooks/${hookId}`, updateData);
}

/**
 * Delete a Smart Hook
 * DELETE /api/2/hooks/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {hook_id: string}
 * @returns {Promise<Object>}
 */
export async function deleteSmartHook(api, args) {
  if (!args.hook_id) {
    throw new Error('hook_id is required');
  }

  return await api.delete(`/api/2/hooks/${args.hook_id}`);
}

/**
 * Get Smart Hook environment variables
 * GET /api/2/hooks/{id}/envs
 * @param {OneLoginApi} api
 * @param {Object} args - {hook_id: string}
 * @returns {Promise<Object>}
 */
export async function getSmartHookEnvVars(api, args) {
  if (!args.hook_id) {
    throw new Error('hook_id is required');
  }

  return await api.get(`/api/2/hooks/${args.hook_id}/envs`);
}

/**
 * Create or update Smart Hook environment variables
 * POST /api/2/hooks/{id}/envs
 * @param {OneLoginApi} api
 * @param {Object} args - {hook_id: string, env_vars: object}
 * @returns {Promise<Object>}
 */
export async function updateSmartHookEnvVars(api, args) {
  if (!args.hook_id) {
    throw new Error('hook_id is required');
  }

  if (!args.env_vars) {
    throw new Error('env_vars object is required');
  }

  // Transform env_vars from object format {"VAR": "value"} to array format [{name: "VAR", value: "value"}]
  // The OneLogin API expects an array, but we accept object format for better UX
  let envVarsPayload = args.env_vars;
  if (typeof envVarsPayload === 'object' && !Array.isArray(envVarsPayload)) {
    envVarsPayload = Object.entries(envVarsPayload).map(([name, value]) => ({ name, value }));
  }

  return await api.post(`/api/2/hooks/${args.hook_id}/envs`, envVarsPayload);
}

/**
 * Delete Smart Hook environment variables
 * DELETE /api/2/hooks/{id}/envs
 * @param {OneLoginApi} api
 * @param {Object} args - {hook_id: string, env_var_names: string[]}
 * @returns {Promise<Object>}
 */
export async function deleteSmartHookEnvVars(api, args) {
  if (!args.hook_id) {
    throw new Error('hook_id is required');
  }

  if (!args.env_var_names || !Array.isArray(args.env_var_names)) {
    throw new Error('env_var_names array is required');
  }

  return await api.delete(`/api/2/hooks/${args.hook_id}/envs`, {
    env_var_names: args.env_var_names
  });
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_smart_hooks',
    description: 'Get a list of all Smart Hooks configured in your OneLogin account. Smart Hooks are serverless functions that execute custom logic in response to OneLogin events (user login, user creation, pre-authentication, etc). Filter by hook type or disabled status. Returns hook list with IDs, types, status, runtime (nodejs18.x), created/updated timestamps, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Filter by hook type (pre-authentication, user-migration, etc.)'
        },
        disabled: {
          type: 'boolean',
          description: 'Filter by disabled status'
        },
        limit: {
          type: 'number',
          description: 'Number of results to return'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination'
        },
        after_cursor: {
          type: 'string',
          description: 'Cursor for next page'
        },
        before_cursor: {
          type: 'string',
          description: 'Cursor for previous page'
        }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_smart_hook',
    description: 'Get detailed configuration of a specific Smart Hook by ID. Returns complete hook definition including type (determines when it triggers), status (enabled/disabled), runtime environment, function code (JavaScript), packages (npm dependencies), environment variables (names only, values hidden), retries, timeout settings, and x-request-id. Use to review or backup hook logic.',
    inputSchema: {
      type: 'object',
      properties: {
        hook_id: {
          type: 'string',
          description: 'The OneLogin Smart Hook ID'
        }
      },
      required: ['hook_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_smart_hook',
    description: 'Create a new Smart Hook to execute custom logic on OneLogin events. Required: type (event trigger: "pre-authentication", "user-migration", etc.) and function (JavaScript code string). Hook types: pre-authentication (modify auth flow), user-migration (sync users), user-created/updated/deleted (provisioning automation). Function receives event context and must return specific structure. Optional: packages (npm dependencies as {"name": "version"}), env_vars (secure config), retries, timeout. Returns created hook with ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Hook type (pre-authentication, user-migration, user-created, etc.)'
        },
        function: {
          type: 'string',
          description: 'JavaScript function code'
        },
        packages: {
          type: 'object',
          description: 'npm packages as {"package-name": "version"}'
        },
        env_vars: {
          type: 'object',
          description: 'Environment variables as {"VAR_NAME": "value"}'
        },
        retries: {
          type: 'number',
          description: 'Number of retries on failure (0-2, default 0)'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in seconds (1-10, default 3)'
        },
        disabled: {
          type: 'boolean',
          description: 'Whether hook is disabled (default false)'
        }
      },
      required: ['type', 'function'],
      additionalProperties: true
    }
  },
  {
    name: 'update_smart_hook',
    description: 'Update an existing Smart Hook configuration. Can modify function code, packages, environment variables, retries, timeout, status, and options. Partial updates supported - only provide fields to change. IMPORTANT: Updating function code while hook is enabled may cause errors during deployment - consider disabling first. Use to iterate on hook logic or adjust settings. Returns updated hook data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        hook_id: {
          type: 'string',
          description: 'The OneLogin Smart Hook ID to update'
        },
        type: {
          type: 'string',
          description: 'New hook type'
        },
        function: {
          type: 'string',
          description: 'New JavaScript function code'
        },
        packages: {
          type: 'object',
          description: 'New npm packages'
        },
        retries: {
          type: 'number',
          description: 'New retry count'
        },
        timeout: {
          type: 'number',
          description: 'New timeout in seconds'
        },
        disabled: {
          type: 'boolean',
          description: 'New disabled status'
        }
      },
      required: ['hook_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_smart_hook',
    description: 'Permanently delete a Smart Hook. WARNING: This operation cannot be undone. Events will no longer trigger this hook logic. Any automation depending on this hook will stop working. If you don\'t know the hook ID, use list_smart_hooks to find it. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        hook_id: {
          type: 'string',
          description: 'The OneLogin Smart Hook ID to delete'
        }
      },
      required: ['hook_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_smart_hook_env_vars',
    description: 'Get environment variable names configured for a Smart Hook. Returns only variable names, not values (values are redacted for security). Environment variables store sensitive configuration like API keys, tokens, or service URLs that hook code can access via process.env. Use to audit what config variables a hook uses. Returns env var names array and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        hook_id: {
          type: 'string',
          description: 'The OneLogin Smart Hook ID'
        }
      },
      required: ['hook_id'],
      additionalProperties: false
    }
  },
  {
    name: 'update_smart_hook_env_vars',
    description: 'Create or update environment variables for a Smart Hook. Provide key-value pairs as object: {"API_KEY": "secret123", "SERVICE_URL": "https://api.example.com"}. Variables are encrypted and accessible in hook code via process.env.API_KEY. Use for storing secrets, API endpoints, or configuration without hardcoding in function. Existing variables with same names are overwritten. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        hook_id: {
          type: 'string',
          description: 'The OneLogin Smart Hook ID'
        },
        env_vars: {
          type: 'object',
          description: 'Environment variables as {"VAR_NAME": "value"}'
        }
      },
      required: ['hook_id', 'env_vars'],
      additionalProperties: false
    }
  },
  {
    name: 'delete_smart_hook_env_vars',
    description: 'Delete specific environment variables from a Smart Hook by providing array of variable names. Hook code will no longer be able to access these variables via process.env. IMPORTANT: Deleting env vars used by hook code will cause runtime errors - verify hook doesn\'t need them first. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        hook_id: {
          type: 'string',
          description: 'The OneLogin Smart Hook ID'
        },
        env_var_names: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of environment variable names to delete'
        }
      },
      required: ['hook_id', 'env_var_names'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_smart_hooks: listSmartHooks,
  get_smart_hook: getSmartHook,
  create_smart_hook: createSmartHook,
  update_smart_hook: updateSmartHook,
  delete_smart_hook: deleteSmartHook,
  get_smart_hook_env_vars: getSmartHookEnvVars,
  update_smart_hook_env_vars: updateSmartHookEnvVars,
  delete_smart_hook_env_vars: deleteSmartHookEnvVars
};
