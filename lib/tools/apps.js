/**
 * OneLogin App Management Tools
 * API Reference: /api/2/apps
 */

/**
 * List OneLogin apps
 * Reference: GET /api/2/apps
 * Supports wildcard search with * (e.g., name=AWS*)
 * @param {OneLoginApi} api
 * @param {Object} args - Filters and pagination
 * @returns {Promise<Object>}
 */
export async function listApps(api, args = {}) {
  // Build query parameters from args
  const params = {};

  // Filter parameters
  if (args.name) params.name = args.name;
  if (args.connector_id) params.connector_id = args.connector_id;
  if (args.auth_method !== undefined) params.auth_method = args.auth_method;
  if (args.updated_since) params.updated_since = args.updated_since;

  // Display and sorting parameters
  if (args.fields) params.fields = args.fields;
  if (args.sort) params.sort = args.sort;
  if (args.limit) params.limit = args.limit;

  // Pagination: support both page numbers and cursors
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/apps', params);
}

/**
 * Get a specific app by ID
 * Reference: GET /api/2/apps/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function getApp(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.get(`/api/2/apps/${args.app_id}`);
}

/**
 * Update an existing app
 * Reference: PUT /api/2/apps/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateApp(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  const appId = args.app_id;
  const updateData = { ...args };
  delete updateData.app_id;

  return await api.put(`/api/2/apps/${appId}`, updateData);
}

/**
 * Create a new app
 * POST /api/2/apps
 * @param {OneLoginApi} api
 * @param {Object} args - App configuration data
 * @returns {Promise<Object>}
 */
export async function createApp(api, args) {
  return await api.post('/api/2/apps', args);
}

/**
 * Delete an app
 * DELETE /api/2/apps/{app_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteApp(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.delete(`/api/2/apps/${args.app_id}`);
}

/**
 * Delete an app parameter
 * DELETE /api/2/apps/{app_id}/parameters/{param_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, param_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteAppParameter(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.param_id) {
    throw new Error('param_id is required');
  }

  return await api.delete(`/api/2/apps/${args.app_id}/parameters/${args.param_id}`);
}

/**
 * Get users assigned to an app
 * GET /api/2/apps/{app_id}/users
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function getAppUsers(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.get(`/api/2/apps/${args.app_id}/users`);
}

/**
 * List all rules for an app
 * GET /api/2/apps/{app_id}/rules
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function listAppRules(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.get(`/api/2/apps/${args.app_id}/rules`);
}

/**
 * Get a specific app rule by ID
 * GET /api/2/apps/{app_id}/rules/{rule_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, rule_id: number}
 * @returns {Promise<Object>}
 */
export async function getAppRule(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.rule_id) {
    throw new Error('rule_id is required');
  }

  return await api.get(`/api/2/apps/${args.app_id}/rules/${args.rule_id}`);
}

/**
 * Create a new app rule
 * POST /api/2/apps/{app_id}/rules
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, name: string, match: string, enabled: boolean, conditions: array, actions: array}
 * @returns {Promise<Object>}
 */
export async function createAppRule(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.name) {
    throw new Error('name is required');
  }

  if (!args.match) {
    throw new Error('match is required');
  }

  if (!args.conditions) {
    throw new Error('conditions is required');
  }

  if (!args.actions) {
    throw new Error('actions is required');
  }

  const appId = args.app_id;
  const ruleData = { ...args };
  delete ruleData.app_id;

  return await api.post(`/api/2/apps/${appId}/rules`, ruleData);
}

/**
 * Update an existing app rule
 * PUT /api/2/apps/{app_id}/rules/{rule_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, rule_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateAppRule(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.rule_id) {
    throw new Error('rule_id is required');
  }

  const appId = args.app_id;
  const ruleId = args.rule_id;
  const updateData = { ...args };
  delete updateData.app_id;
  delete updateData.rule_id;

  return await api.put(`/api/2/apps/${appId}/rules/${ruleId}`, updateData);
}

/**
 * Delete an app rule
 * DELETE /api/2/apps/{app_id}/rules/{rule_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, rule_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteAppRule(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.rule_id) {
    throw new Error('rule_id is required');
  }

  return await api.delete(`/api/2/apps/${args.app_id}/rules/${args.rule_id}`);
}

/**
 * Reorder app rules by priority
 * PUT /api/2/apps/{app_id}/rules/sort
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number, rule_ids: array}
 * @returns {Promise<Object>}
 */
export async function reorderAppRules(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  if (!args.rule_ids || !Array.isArray(args.rule_ids)) {
    throw new Error('rule_ids array is required');
  }

  return await api.put(`/api/2/apps/${args.app_id}/rules/sort`, { rule_ids: args.rule_ids });
}

/**
 * List available condition sources for app rules
 * GET /api/2/apps/{app_id}/conditions
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function listAppRuleConditions(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.get(`/api/2/apps/${args.app_id}/conditions`);
}

/**
 * List available actions for app rules
 * GET /api/2/apps/{app_id}/actions
 * @param {OneLoginApi} api
 * @param {Object} args - {app_id: number}
 * @returns {Promise<Object>}
 */
export async function listAppRuleActions(api, args) {
  if (!args.app_id) {
    throw new Error('app_id is required');
  }

  return await api.get(`/api/2/apps/${args.app_id}/actions`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_apps',
    description: 'Get a list of all apps in a OneLogin account with pagination support (max 1000 per page). Can filter by connector_id or auth_method (0=Password, 1=OpenId, 2=SAML, 3=API, 4=Google, 6=Forms, 7=WSFED, 8=OpenId Connect). Use name parameter with wildcard (*) for partial name search (e.g., name=workday*). Returns app data and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by app name' },
        connector_id: { type: 'number', description: 'Filter by connector ID' },
        auth_method: { type: 'number', description: 'Filter by authentication method' },
        limit: { type: 'number', description: 'Number of results to return (default 50)' },
        page: { type: 'number', description: 'Page number for pagination' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_app',
    description: 'Get configuration settings of an app. Useful for backing up app configuration or cloning apps - take the response and POST it to create_app to clone. Response payload is broken into sections (parameters, sso settings, configuration) that vary based on app type (SAML, OpenId Connect, etc.). Returns complete app configuration and x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  },
  {
    name: 'update_app',
    description: 'Update an existing OneLogin app. Returns updated app data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID to update' },
        name: { type: 'string', description: 'New app name' },
        description: { type: 'string', description: 'New app description' },
        notes: { type: 'string', description: 'New app notes' }
      },
      required: ['app_id'],
      additionalProperties: true
    }
  },
  {
    name: 'create_app',
    description: 'Create a new app based on a OneLogin connector. Minimum required: connector_id and name. If connector allows (check allows_new_parameters via List Connectors), custom parameters can be added during creation - any parameter not matching existing parameters will be auto-created. For complete app configuration options, do a get_app request on an app with the same connector. For OpenId Connect apps: response includes client_id and client_secret. Returns created app data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        connector_id: { type: 'number', description: 'Connector ID for the app type' },
        name: { type: 'string', description: 'App name' },
        description: { type: 'string', description: 'App description' }
      },
      additionalProperties: true
    }
  },
  {
    name: 'delete_app',
    description: 'Delete an app from OneLogin. WARNING: This operation is final and cannot be undone. If you don\'t know the app ID, use list_apps to find it. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID to delete' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  },
  {
    name: 'delete_app_parameter',
    description: 'Delete a custom parameter from an app. WARNING: This operation is final and cannot be undone. You cannot delete connector-level parameters (defined on underlying connector) - only custom app-specific parameters can be deleted. If you don\'t know the parameter ID, use get_app to retrieve app configuration with parameter IDs. Returns 204 No Content on success or 403 Forbidden if attempting to delete connector parameter. Returns x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' },
        param_id: { type: 'number', description: 'The parameter ID to delete' }
      },
      required: ['app_id', 'param_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_app_users',
    description: 'Get a list of users assigned to an app (max 1000 users per page). Supports standard pagination. Returns user list with ID, firstname, lastname, username, and email for each user. Use to audit app access or find users to remove. Returns x-request-id for log tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  },
  {
    name: 'list_app_rules',
    description: 'Get all mapping rules for an app. App rules act like "if this then that" logic to automate user attribute management, parameters, and entitlements. Each rule has conditions (the "if") and actions (the "then"). IMPORTANT: Rules are not applied automatically when added/modified via API - a user event (create/update) or "Reapply Entitlement Mappings" in UI is required to trigger rule execution. Returns array of rules with ID, name, match type (all/any), enabled status, position, conditions, and actions. Returns x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_app_rule',
    description: 'Get detailed configuration of a specific app rule by ID. Returns complete rule definition including name, match type (all=AND conditions, any=OR conditions), enabled status, position in execution order, conditions array (each with source field, operator, and value), and actions array (each with action type and value). Use to review mapping logic or clone rules to other apps. Returns x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' },
        rule_id: { type: 'number', description: 'The app rule ID' }
      },
      required: ['app_id', 'rule_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_app_rule',
    description: 'Create a new mapping rule for an app to automate user attribute management. Required: name (rule name), match ("all"=AND conditions, "any"=OR conditions), conditions array (each with source, operator, value - e.g., {"source":"has_role","operator":"~","value":"765432"}), actions array (each with action and value - e.g., {"action":"add_role","value":"272444"}). Optional: enabled (default true), position (null=append to end). IMPORTANT: Rules execute in position order. Use list_app_rule_conditions and list_app_rule_actions to discover available condition sources and action types for your app. Rules do NOT auto-apply after creation - trigger via user event or UI. Returns created rule with ID and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' },
        name: { type: 'string', description: 'Rule name' },
        match: { type: 'string', description: 'Condition matching logic: "all" (AND) or "any" (OR)' },
        enabled: { type: 'boolean', description: 'Whether rule is enabled (default true)' },
        position: { type: 'number', description: 'Execution order position (null=append to end)' },
        conditions: {
          type: 'array',
          description: 'Array of condition objects with source, operator, value',
          items: {
            type: 'object',
            properties: {
              source: { type: 'string', description: 'Condition source (e.g., has_role, department)' },
              operator: { type: 'string', description: 'Comparison operator (e.g., ~, =, !=, >, <)' },
              value: { type: 'string', description: 'Value to compare against' }
            }
          }
        },
        actions: {
          type: 'array',
          description: 'Array of action objects with action and value',
          items: {
            type: 'object',
            properties: {
              action: { type: 'string', description: 'Action type (e.g., add_role, set_attribute)' },
              value: { type: 'string', description: 'Action value' }
            }
          }
        }
      },
      required: ['app_id', 'name', 'match', 'conditions', 'actions'],
      additionalProperties: true
    }
  },
  {
    name: 'update_app_rule',
    description: 'Update an existing app rule. Can modify name, match type, enabled status, position, conditions, or actions. Partial updates supported - only provide fields to change. IMPORTANT: Rules do NOT auto-apply after modification - changes take effect on next user event or when "Reapply Entitlement Mappings" is triggered in UI. Changing position affects execution order which may alter mapping results. Returns updated rule data and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' },
        rule_id: { type: 'number', description: 'The app rule ID to update' },
        name: { type: 'string', description: 'New rule name' },
        match: { type: 'string', description: 'New condition matching logic' },
        enabled: { type: 'boolean', description: 'New enabled status' },
        position: { type: 'number', description: 'New execution order position' },
        conditions: { type: 'array', description: 'New conditions array' },
        actions: { type: 'array', description: 'New actions array' }
      },
      required: ['app_id', 'rule_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_app_rule',
    description: 'Delete an app rule permanently. WARNING: This operation cannot be undone. Users who were previously affected by this rule will NOT have their existing mappings reverted - deletion only prevents the rule from executing in future. To reverse existing mappings, create a new rule with opposite actions before deletion, then trigger "Reapply Entitlement Mappings" in UI. If you don\'t know the rule ID, use list_app_rules to find it. Returns 204 No Content on success and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' },
        rule_id: { type: 'number', description: 'The app rule ID to delete' }
      },
      required: ['app_id', 'rule_id'],
      additionalProperties: false
    }
  },
  {
    name: 'reorder_app_rules',
    description: 'Change the execution order of app rules by providing a new sorted array of rule IDs. Rules execute in the order specified by their position, which affects mapping outcomes when multiple rules modify the same attribute. The rule_ids array must include ALL rule IDs for the app in the desired execution order (first ID = position 1, second ID = position 2, etc.). IMPORTANT: Reordering does NOT auto-apply - changes take effect on next user event or when "Reapply Entitlement Mappings" is triggered in UI. Returns success status and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' },
        rule_ids: {
          type: 'array',
          description: 'Array of rule IDs in desired execution order',
          items: { type: 'number' }
        }
      },
      required: ['app_id', 'rule_ids'],
      additionalProperties: false
    }
  },
  {
    name: 'list_app_rule_conditions',
    description: 'Get available condition sources for creating app rules. Returns array of condition objects showing what user/group attributes can be used in rule conditions (e.g., has_role, department, group_id, last_login). Each condition includes source name, display label, data type, and supported operators (~, =, !=, >, <, in, not_in, etc.). Use this before creating rules to discover valid condition sources for the app type. Returns x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  },
  {
    name: 'list_app_rule_actions',
    description: 'Get available actions for creating app rules. Returns array of action objects showing what operations can be performed in rule actions (e.g., add_role, remove_role, set_attribute, set_parameter_value). Each action includes action type, display label, required value format, and description of effect. Actions vary by app type - SAML apps support different actions than OpenID Connect apps. Use this before creating rules to discover valid action types for the app. Returns x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'The OneLogin app ID' }
      },
      required: ['app_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_apps: listApps,
  get_app: getApp,
  update_app: updateApp,
  create_app: createApp,
  delete_app: deleteApp,
  delete_app_parameter: deleteAppParameter,
  get_app_users: getAppUsers,
  list_app_rules: listAppRules,
  get_app_rule: getAppRule,
  create_app_rule: createAppRule,
  update_app_rule: updateAppRule,
  delete_app_rule: deleteAppRule,
  reorder_app_rules: reorderAppRules,
  list_app_rule_conditions: listAppRuleConditions,
  list_app_rule_actions: listAppRuleActions
};
