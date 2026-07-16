/**
 * OneLogin Smart Hooks Tools
 * API Reference: /api/2/hooks
 *
 * Smart Hooks are webhooks that trigger external HTTP endpoints based on OneLogin events.
 * Use cases: provisioning automation, custom MFA, security alerts, compliance logging.
 */

/**
 * Reduce env_vars input to the array of names the hooks API expects.
 * Tolerates a name array, a {NAME: value} map, or [{name, value}] objects, since
 * callers reasonably assume values are set here - they are not.
 * @param {*} envVars
 * @returns {string[]}
 */
function normalizeEnvVarNames(envVars) {
  if (!envVars) {
    return [];
  }

  if (Array.isArray(envVars)) {
    return envVars.map(v => (typeof v === 'string' ? v : v?.name)).filter(Boolean);
  }

  if (typeof envVars === 'object') {
    return Object.keys(envVars);
  }

  return [];
}

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

  // The API requires disabled, runtime, timeout, retries, env_vars and packages on
  // every create and rejects the request without them, so default any the caller omitted.
  const payload = {
    disabled: false,
    runtime: 'nodejs24.x',
    timeout: 1,
    retries: 0,
    env_vars: [],
    packages: {},
    ...args
  };

  // A hook references account-scoped env vars by name only - values live on the env var
  // itself, via create_smart_hook_env_var. Accept an object or a {name: value} map and
  // reduce either to the name array the API expects.
  payload.env_vars = normalizeEnvVarNames(payload.env_vars);

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

  // Hooks reference account-scoped env vars by name only (see normalizeEnvVarNames).
  if (updateData.env_vars !== undefined) {
    updateData.env_vars = normalizeEnvVarNames(updateData.env_vars);
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
 * List environment variables for the account
 * GET /api/2/hooks/envs
 *
 * Env vars are account-scoped resources, not owned by an individual hook. A hook
 * opts in to one by listing its name in the hook's env_vars array.
 * @param {OneLoginApi} api
 * @param {Object} args - Optional pagination
 * @returns {Promise<Object>}
 */
export async function listSmartHookEnvVars(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/hooks/envs', params);
}

/**
 * Get a specific environment variable by ID
 * GET /api/2/hooks/envs/{envvarId}
 * @param {OneLoginApi} api
 * @param {Object} args - {env_var_id: string}
 * @returns {Promise<Object>}
 */
export async function getSmartHookEnvVar(api, args) {
  if (!args.env_var_id) {
    throw new Error('env_var_id is required');
  }

  return await api.get(`/api/2/hooks/envs/${args.env_var_id}`);
}

/**
 * Create an environment variable for the account
 * POST /api/2/hooks/envs
 * @param {OneLoginApi} api
 * @param {Object} args - {name: string, value: string}
 * @returns {Promise<Object>}
 */
export async function createSmartHookEnvVar(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  if (!args.value) {
    throw new Error('value is required');
  }

  return await api.post('/api/2/hooks/envs', { name: args.name, value: args.value });
}

/**
 * Update an environment variable's value
 * PUT /api/2/hooks/envs/{envvarId}
 *
 * Only the value can change - the name is immutable once created.
 * @param {OneLoginApi} api
 * @param {Object} args - {env_var_id: string, value: string}
 * @returns {Promise<Object>}
 */
export async function updateSmartHookEnvVar(api, args) {
  if (!args.env_var_id) {
    throw new Error('env_var_id is required');
  }

  if (!args.value) {
    throw new Error('value is required');
  }

  return await api.put(`/api/2/hooks/envs/${args.env_var_id}`, { value: args.value });
}

/**
 * Delete an environment variable
 * DELETE /api/2/hooks/envs/{envvarId}
 * @param {OneLoginApi} api
 * @param {Object} args - {env_var_id: string}
 * @returns {Promise<Object>}
 */
export async function deleteSmartHookEnvVar(api, args) {
  if (!args.env_var_id) {
    throw new Error('env_var_id is required');
  }

  return await api.delete(`/api/2/hooks/envs/${args.env_var_id}`);
}

/**
 * Get Smart Hook execution logs
 * GET /api/2/hooks/{id}/logs
 * @param {OneLoginApi} api
 * @param {Object} args - {hook_id: string, ...filters}
 * @returns {Promise<Object>}
 */
export async function getSmartHookLogs(api, args) {
  if (!args.hook_id) {
    throw new Error('hook_id is required');
  }

  const params = {};

  // Filter parameters
  if (args.request_id) params.request_id = args.request_id;
  if (args.correlation_id) params.correlation_id = args.correlation_id;

  // Pagination
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get(`/api/2/hooks/${args.hook_id}/logs`, params);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_smart_hooks',
    description: 'Get a list of all Smart Hooks configured in your OneLogin account. Smart Hooks are serverless functions that execute custom logic in response to OneLogin events (user login, user creation, pre-authentication, etc). Filter by hook type or disabled status. Returns hook list with IDs, types, status, runtime, created/updated timestamps, and x-request-id. Report the runtime from the response rather than assuming a value - new hooks default to nodejs24.x, but hooks predating the runtime upgrade still report older values.',
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
    description: 'Create a new Smart Hook to execute custom logic on OneLogin events. Required: type and function. There are ONLY two hook types: "pre-authentication" (modify auth flow) and "user-migration" (sync users) - no other value is accepted. Each type is synchronous, so an account can only have ONE hook of each type; creating a second returns 409. function must be base64-encoded JavaScript (max 20000 chars). The API also requires disabled, runtime, timeout, retries, env_vars and packages - this tool defaults them (runtime nodejs24.x, timeout 1, retries 0, env_vars [], packages {}, disabled false) so you need not pass them, but you may override any. runtime accepts ONLY nodejs22.x or nodejs24.x. IMPORTANT: each options flag defaults to false, and the context data it controls is absent unless you set it HERE at create time - there is no admin console setting for these. If a hook needs context.location, context.risk, or context.mfa_devices, it must pass the matching options flag. Returns created hook with ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['pre-authentication', 'user-migration'],
          description: 'Hook type. Only these two values exist, and an account may have only one hook of each.'
        },
        function: {
          type: 'string',
          description: 'Base64-encoded JavaScript function code (max 20000 chars)'
        },
        runtime: {
          type: 'string',
          enum: ['nodejs22.x', 'nodejs24.x'],
          description: 'Lambda runtime. Defaults to nodejs24.x. Older values such as nodejs18.x are rejected by the API.'
        },
        options: {
          type: 'object',
          description: 'Opt in to extra data on the hook context. Each flag defaults to false, which means the data it controls is undefined inside the function. Set via this API only - these are NOT configurable in the OneLogin admin console. Ignored for user-migration hooks, which always report options as {}.',
          properties: {
            location_enabled: {
              type: 'boolean',
              description: 'Adds context.location (ip, country_code as ISO 3166 Alpha-2, etc). Required for any geolocation or country check - without it context.location is undefined.'
            },
            risk_enabled: {
              type: 'boolean',
              description: 'Adds context.risk (score, and triggers explaining risk factors). Without it context.risk is undefined.'
            },
            mfa_device_info_enabled: {
              type: 'boolean',
              description: 'Adds context.mfa_devices, the user\'s registered MFA devices. Note the flag name and the context field name differ.'
            },
            failed_login_attempts_enabled: {
              type: 'boolean',
              description: 'Adds failed login attempt data to the context.'
            }
          }
        },
        packages: {
          type: 'object',
          description: 'npm packages as {"package-name": "version"}'
        },
        env_vars: {
          type: 'array',
          items: { type: 'string' },
          description: 'Names of existing account env vars this hook may read, e.g. ["API_KEY"]. Names only - values are NOT set here, but via create_smart_hook_env_var. The variable must already exist. Defaults to [].'
        },
        retries: {
          type: 'number',
          description: 'Number of retries on failure (0-4, default 0)'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in seconds (1-10, default 1)'
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
    description: 'Update an existing Smart Hook configuration. Can modify function code, packages, environment variables, retries, timeout, status, and options. Partial updates supported - only provide fields to change. IMPORTANT: Updating function code while hook is enabled may cause errors during deployment - consider disabling first. Use this to turn on options flags (location_enabled, risk_enabled, mfa_device_info_enabled, failed_login_attempts_enabled) on a hook that was created without them - that is the ONLY way to fix a hook whose context is missing data, as these are not settable in the admin console. Returns updated hook data and x-request-id.',
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
        options: {
          type: 'object',
          description: 'Opt in to extra data on the hook context. Each flag defaults to false, which means the data it controls is undefined inside the function. Set via this API only - these are NOT configurable in the OneLogin admin console. Ignored for user-migration hooks, which always report options as {}.',
          properties: {
            location_enabled: {
              type: 'boolean',
              description: 'Adds context.location (ip, country_code as ISO 3166 Alpha-2, etc). Required for any geolocation or country check - without it context.location is undefined.'
            },
            risk_enabled: {
              type: 'boolean',
              description: 'Adds context.risk (score, and triggers explaining risk factors). Without it context.risk is undefined.'
            },
            mfa_device_info_enabled: {
              type: 'boolean',
              description: 'Adds context.mfa_devices, the user\'s registered MFA devices. Note the flag name and the context field name differ.'
            },
            failed_login_attempts_enabled: {
              type: 'boolean',
              description: 'Adds failed login attempt data to the context.'
            }
          }
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
    name: 'list_smart_hook_env_vars',
    description: 'List the Smart Hook environment variables defined for the account. IMPORTANT: env vars are account-scoped, NOT owned by a single hook - there is no per-hook env var endpoint. A hook opts in to one by listing its NAME in the hook\'s env_vars array (see create_smart_hook / update_smart_hook); to see which a given hook uses, call get_smart_hook and read env_vars. Returns each variable\'s id, name and timestamps - values are never returned. Use the id with get/update/delete_smart_hook_env_var. Returns x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of results to return'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination'
        }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_smart_hook_env_var',
    description: 'Get a single account Smart Hook environment variable by its ID. Returns id, name and timestamps - the value is never returned, as values are write-only for security. Use list_smart_hook_env_vars to find the ID from a name. Returns x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        env_var_id: {
          type: 'string',
          description: 'The environment variable UUID (from list_smart_hook_env_vars) - NOT the variable name, and NOT a hook ID'
        }
      },
      required: ['env_var_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_smart_hook_env_var',
    description: 'Create an account-scoped Smart Hook environment variable. Creates ONE variable per call - to add several, call this repeatedly. Variables are encrypted at rest and readable in hook code via process.env.NAME. Creating a variable does NOT attach it to any hook: you must also list its name in that hook\'s env_vars array via create_smart_hook or update_smart_hook, or the hook cannot see it. name must match ^[a-zA-Z_][a-zA-Z0-9_]*$ (2-100 chars) and is immutable afterwards; value is 1-5000 chars. Returns the new variable\'s id and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Variable name, e.g. API_KEY. Must match ^[a-zA-Z_][a-zA-Z0-9_]*$, 2-100 chars. Cannot be changed later.'
        },
        value: {
          type: 'string',
          description: 'Variable value, 1-5000 chars'
        }
      },
      required: ['name', 'value'],
      additionalProperties: false
    }
  },
  {
    name: 'update_smart_hook_env_var',
    description: 'Update the value of an existing account Smart Hook environment variable. Only the value can change - the name is immutable, so to rename you must delete and recreate (and update any hook env_vars arrays referencing the old name). The new value takes effect for every hook referencing this variable. Returns x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        env_var_id: {
          type: 'string',
          description: 'The environment variable UUID (from list_smart_hook_env_vars) - NOT the variable name, and NOT a hook ID'
        },
        value: {
          type: 'string',
          description: 'New value, 1-5000 chars'
        }
      },
      required: ['env_var_id', 'value'],
      additionalProperties: false
    }
  },
  {
    name: 'delete_smart_hook_env_var',
    description: 'Delete an account Smart Hook environment variable by ID. WARNING: env vars are account-scoped and shared, so this removes it from EVERY hook referencing it, not just one. Any hook code reading process.env for this name will break. To detach a variable from a single hook instead, remove its name from that hook\'s env_vars array via update_smart_hook and leave the variable itself alone. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        env_var_id: {
          type: 'string',
          description: 'The environment variable UUID (from list_smart_hook_env_vars) - NOT the variable name, and NOT a hook ID'
        }
      },
      required: ['env_var_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_smart_hook_logs',
    description: 'Get execution logs for a Smart Hook including console.log output from hook code. Logs include request_id (unique per execution), correlation_id (links related executions), created_at timestamp, and events array with logged messages. Use for debugging hook logic, troubleshooting errors, or monitoring execution. Can filter by request_id or correlation_id. Max 1,000 logs per page. Returns array of log objects with execution details and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        hook_id: {
          type: 'string',
          description: 'The OneLogin Smart Hook ID'
        },
        request_id: {
          type: 'string',
          description: 'Filter logs by specific request_id'
        },
        correlation_id: {
          type: 'string',
          description: 'Filter logs by specific correlation_id'
        },
        limit: {
          type: 'integer',
          description: 'Number of results per page (max 1000)'
        },
        page: {
          type: 'integer',
          description: 'Page number for pagination'
        }
      },
      required: ['hook_id'],
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
  list_smart_hook_env_vars: listSmartHookEnvVars,
  get_smart_hook_env_var: getSmartHookEnvVar,
  create_smart_hook_env_var: createSmartHookEnvVar,
  update_smart_hook_env_var: updateSmartHookEnvVar,
  delete_smart_hook_env_var: deleteSmartHookEnvVar,
  get_smart_hook_logs: getSmartHookLogs
};
