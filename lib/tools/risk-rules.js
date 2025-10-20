/**
 * OneLogin Risk Rules Tools
 * API Reference: /api/2/risk/rules
 *
 * Risk Rules define security policies based on authentication context like IP address,
 * location, device trust, and user behavior. They enforce conditional access controls
 * by requiring additional authentication factors or blocking access when risk is detected.
 */

/**
 * List all risk rules
 * GET /api/2/risk/rules
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listRiskRules(api, args = {}) {
  const params = {};

  // Filter parameters
  if (args.name) params.name = args.name;
  if (args.enabled !== undefined) params.enabled = args.enabled;

  // Pagination
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/risk/rules', params);
}

/**
 * Get a specific risk rule by ID
 * GET /api/2/risk/rules/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {rule_id: string}
 * @returns {Promise<Object>}
 */
export async function getRiskRule(api, args) {
  if (!args.rule_id) {
    throw new Error('rule_id is required');
  }

  return await api.get(`/api/2/risk/rules/${args.rule_id}`);
}

/**
 * Create a new risk rule
 * POST /api/2/risk/rules
 * @param {OneLoginApi} api
 * @param {Object} args - Risk rule configuration
 * @returns {Promise<Object>}
 */
export async function createRiskRule(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  if (!args.type) {
    throw new Error('type is required');
  }

  if (!args.target) {
    throw new Error('target is required');
  }

  return await api.post('/api/2/risk/rules', args);
}

/**
 * Update an existing risk rule
 * PUT /api/2/risk/rules/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {rule_id: string, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateRiskRule(api, args) {
  if (!args.rule_id) {
    throw new Error('rule_id is required');
  }

  const ruleId = args.rule_id;
  const updateData = { ...args };
  delete updateData.rule_id;

  return await api.put(`/api/2/risk/rules/${ruleId}`, updateData);
}

/**
 * Delete a risk rule
 * DELETE /api/2/risk/rules/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {rule_id: string}
 * @returns {Promise<Object>}
 */
export async function deleteRiskRule(api, args) {
  if (!args.rule_id) {
    throw new Error('rule_id is required');
  }

  return await api.delete(`/api/2/risk/rules/${args.rule_id}`);
}

/**
 * Get risk score for a specific context
 * POST /api/2/risk/verify
 * @param {OneLoginApi} api
 * @param {Object} args - Context information (ip_address, user_id, etc.)
 * @returns {Promise<Object>}
 */
export async function verifyRisk(api, args) {
  return await api.post('/api/2/risk/verify', args);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_risk_rules',
    description: 'Get a list of all risk-based authentication rules configured in OneLogin. Risk rules enforce conditional access by requiring MFA, blocking access, or challenging users based on context like IP address, geolocation, device trust, impossible travel, or user behavior anomalies. Filter by name or enabled status. Returns rule list with IDs, names, types, targets, enabled status, priority order, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Filter by rule name'
        },
        enabled: {
          type: 'boolean',
          description: 'Filter by enabled status'
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
    name: 'get_risk_rule',
    description: 'Get detailed configuration of a specific risk rule by ID. Returns complete rule definition including name, type (IP-based, location-based, device-based, impossible-travel, user-behavior), target (who it applies to: all users, specific apps, specific roles), filters (IP ranges, country codes, risk scores), action (block, challenge, require-mfa, allow), priority, enabled status, and x-request-id. Use to review security policy logic.',
    inputSchema: {
      type: 'object',
      properties: {
        rule_id: {
          type: 'string',
          description: 'The OneLogin risk rule ID'
        }
      },
      required: ['rule_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_risk_rule',
    description: 'Create a new risk-based authentication rule to enforce conditional access. Required: name, type (ip_range, geo_location, device_trust, impossible_travel, user_behavior), target (scope: all/app_id/role_id). Configure filters based on type: IP ranges (CIDR notation), country codes (ISO), device trust level, travel velocity, behavior anomaly score. Set action: "block" (deny access), "challenge" (step-up auth), "require_mfa" (force MFA), "allow" (bypass MFA). Rules execute in priority order. Returns created rule with ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Risk rule name'
        },
        type: {
          type: 'string',
          description: 'Rule type (ip_range, geo_location, device_trust, impossible_travel, user_behavior)'
        },
        target: {
          type: 'string',
          description: 'Target scope (all, or specific app/role ID)'
        },
        filters: {
          type: 'object',
          description: 'Risk filters based on rule type'
        },
        action: {
          type: 'string',
          description: 'Action to take (block, challenge, require_mfa, allow)'
        },
        priority: {
          type: 'number',
          description: 'Execution priority (lower executes first)'
        },
        enabled: {
          type: 'boolean',
          description: 'Whether rule is enabled (default true)'
        }
      },
      required: ['name', 'type', 'target'],
      additionalProperties: true
    }
  },
  {
    name: 'update_risk_rule',
    description: 'Update an existing risk rule configuration. Can modify name, type, target scope, filters (IP ranges, countries, etc.), action (block/challenge/require-mfa/allow), priority, or enabled status. Partial updates supported - only provide fields to change. Use to adjust security policies as threat landscape evolves. IMPORTANT: Changing action from "allow" to "block" may immediately lock out users. Returns updated rule data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        rule_id: {
          type: 'string',
          description: 'The OneLogin risk rule ID to update'
        },
        name: {
          type: 'string',
          description: 'New rule name'
        },
        type: {
          type: 'string',
          description: 'New rule type'
        },
        target: {
          type: 'string',
          description: 'New target scope'
        },
        filters: {
          type: 'object',
          description: 'New risk filters'
        },
        action: {
          type: 'string',
          description: 'New action'
        },
        priority: {
          type: 'number',
          description: 'New priority'
        },
        enabled: {
          type: 'boolean',
          description: 'New enabled status'
        }
      },
      required: ['rule_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_risk_rule',
    description: 'Permanently delete a risk rule. WARNING: This operation cannot be undone. Security controls enforced by this rule will no longer apply. Users previously blocked or challenged by this rule will authenticate normally (subject to other rules). If you don\'t know the rule ID, use list_risk_rules to find it. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        rule_id: {
          type: 'string',
          description: 'The OneLogin risk rule ID to delete'
        }
      },
      required: ['rule_id'],
      additionalProperties: false
    }
  },
  {
    name: 'verify_risk',
    description: 'Calculate risk score for a specific authentication context without performing actual authentication. Provide context: ip_address (requester IP), user_id (authenticating user), app_id (target app), device_id (trusted device ID). Returns risk assessment with overall risk_score (0-100, higher = riskier), risk_level (low/medium/high/critical), matched_rules (which risk rules triggered), risk_factors (contributing elements: new_device, impossible_travel, suspicious_ip, behavior_anomaly), recommended_action (allow/challenge/block), and x-request-id. Use for testing risk policies or building custom authentication flows.',
    inputSchema: {
      type: 'object',
      properties: {
        ip_address: {
          type: 'string',
          description: 'IP address to evaluate'
        },
        user_id: {
          type: 'number',
          description: 'User ID attempting authentication'
        },
        app_id: {
          type: 'number',
          description: 'App ID being accessed'
        },
        device_id: {
          type: 'string',
          description: 'Device ID (if known)'
        }
      },
      additionalProperties: true
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_risk_rules: listRiskRules,
  get_risk_rule: getRiskRule,
  create_risk_rule: createRiskRule,
  update_risk_rule: updateRiskRule,
  delete_risk_rule: deleteRiskRule,
  verify_risk: verifyRisk
};
