/**
 * OneLogin User Mappings Tools
 * API Reference: /api/2/mappings
 *
 * User mappings define how user attributes are synchronized between OneLogin and apps.
 * They control data flow during provisioning, updates, and de-provisioning.
 */

/**
 * List all mappings
 * GET /api/2/mappings
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listMappings(api, args = {}) {
  const params = {};

  // Filter parameters
  if (args.enabled !== undefined) params.enabled = args.enabled;
  if (args.has_conditions !== undefined) params.has_conditions = args.has_conditions;

  // Pagination
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/mappings', params);
}

/**
 * List available mapping actions
 * GET /api/2/mappings/actions
 * @param {OneLoginApi} api
 * @param {Object} args - No parameters required
 * @returns {Promise<Object>}
 */
export async function listMappingActions(api, args = {}) {
  return await api.get('/api/2/mappings/actions');
}

/**
 * Get a specific mapping by ID
 * GET /api/2/mappings/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number}
 * @returns {Promise<Object>}
 */
export async function getMapping(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  return await api.get(`/api/2/mappings/${args.mapping_id}`);
}

/**
 * Create a new mapping
 * POST /api/2/mappings
 * @param {OneLoginApi} api
 * @param {Object} args - Mapping configuration
 * @returns {Promise<Object>}
 */
export async function createMapping(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  if (!args.match) {
    throw new Error('match is required');
  }

  if (!args.actions) {
    throw new Error('actions is required');
  }

  // Build the request body with proper types
  const body = {
    name: args.name,
    match: args.match,
    actions: Array.isArray(args.actions) ? args.actions : (typeof args.actions === 'string' ? JSON.parse(args.actions) : [args.actions]),
    conditions: args.conditions ? (Array.isArray(args.conditions) ? args.conditions : (typeof args.conditions === 'string' ? JSON.parse(args.conditions) : [args.conditions])) : []
  };

  // Add optional fields
  if (args.enabled !== undefined) body.enabled = args.enabled;
  if (args.position !== undefined) body.position = args.position;

  return await api.post('/api/2/mappings', body);
}

/**
 * Update an existing mapping
 * PUT /api/2/mappings/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateMapping(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  const mappingId = args.mapping_id;
  const updateData = { ...args };
  delete updateData.mapping_id;

  // Parse actions and conditions arrays if provided as strings (same logic as createMapping)
  if (updateData.actions) {
    updateData.actions = Array.isArray(updateData.actions)
      ? updateData.actions
      : (typeof updateData.actions === 'string' ? JSON.parse(updateData.actions) : [updateData.actions]);
  }

  if (updateData.conditions) {
    updateData.conditions = Array.isArray(updateData.conditions)
      ? updateData.conditions
      : (typeof updateData.conditions === 'string' ? JSON.parse(updateData.conditions) : [updateData.conditions]);
  }

  return await api.put(`/api/2/mappings/${mappingId}`, updateData);
}

/**
 * Delete a mapping
 * DELETE /api/2/mappings/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteMapping(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  return await api.delete(`/api/2/mappings/${args.mapping_id}`);
}

/**
 * Get mapping conditions
 * GET /api/2/mappings/{id}/conditions
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number}
 * @returns {Promise<Object>}
 */
export async function getMappingConditions(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  return await api.get(`/api/2/mappings/${args.mapping_id}/conditions`);
}

/**
 * Create a mapping condition
 * POST /api/2/mappings/{id}/conditions
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number, source: string, operator: string, value: string}
 * @returns {Promise<Object>}
 */
export async function createMappingCondition(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  const mappingId = args.mapping_id;
  const conditionData = { ...args };
  delete conditionData.mapping_id;

  return await api.post(`/api/2/mappings/${mappingId}/conditions`, conditionData);
}

/**
 * Update a mapping condition
 * PUT /api/2/mappings/{id}/conditions/{condition_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number, condition_id: number, ...fields}
 * @returns {Promise<Object>}
 */
export async function updateMappingCondition(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  if (!args.condition_id) {
    throw new Error('condition_id is required');
  }

  const mappingId = args.mapping_id;
  const conditionId = args.condition_id;
  const updateData = { ...args };
  delete updateData.mapping_id;
  delete updateData.condition_id;

  return await api.put(`/api/2/mappings/${mappingId}/conditions/${conditionId}`, updateData);
}

/**
 * Delete a mapping condition
 * DELETE /api/2/mappings/{id}/conditions/{condition_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number, condition_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteMappingCondition(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  if (!args.condition_id) {
    throw new Error('condition_id is required');
  }

  return await api.delete(`/api/2/mappings/${args.mapping_id}/conditions/${args.condition_id}`);
}

/**
 * Get mapping actions
 * GET /api/2/mappings/{id}/actions
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number}
 * @returns {Promise<Object>}
 */
export async function getMappingActions(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  return await api.get(`/api/2/mappings/${args.mapping_id}/actions`);
}

/**
 * Create a mapping action
 * POST /api/2/mappings/{id}/actions
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number, action: string, value: array}
 * @returns {Promise<Object>}
 */
export async function createMappingAction(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  const mappingId = args.mapping_id;
  const actionData = { ...args };
  delete actionData.mapping_id;

  return await api.post(`/api/2/mappings/${mappingId}/actions`, actionData);
}

/**
 * Update a mapping action
 * PUT /api/2/mappings/{id}/actions/{action_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number, action_id: number, ...fields}
 * @returns {Promise<Object>}
 */
export async function updateMappingAction(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  if (!args.action_id) {
    throw new Error('action_id is required');
  }

  const mappingId = args.mapping_id;
  const actionId = args.action_id;
  const updateData = { ...args };
  delete updateData.mapping_id;
  delete updateData.action_id;

  return await api.put(`/api/2/mappings/${mappingId}/actions/${actionId}`, updateData);
}

/**
 * Delete a mapping action
 * DELETE /api/2/mappings/{id}/actions/{action_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_id: number, action_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteMappingAction(api, args) {
  if (!args.mapping_id) {
    throw new Error('mapping_id is required');
  }

  if (!args.action_id) {
    throw new Error('action_id is required');
  }

  return await api.delete(`/api/2/mappings/${args.mapping_id}/actions/${args.action_id}`);
}

/**
 * Sort mappings (reorder execution priority)
 * PUT /api/2/mappings/sort
 * @param {OneLoginApi} api
 * @param {Object} args - {mapping_ids: number[]} - Array of mapping IDs in desired order
 * @returns {Promise<Object>}
 */
export async function sortMappings(api, args) {
  if (!args.mapping_ids || !Array.isArray(args.mapping_ids)) {
    throw new Error('mapping_ids array is required');
  }

  return await api.put('/api/2/mappings/sort', { mapping_ids: args.mapping_ids });
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_mappings',
    description: 'Get a list of all user attribute mappings configured in OneLogin. Mappings control how user data flows between OneLogin and connected apps during provisioning. Filter by enabled status or whether mappings have conditions. Returns mapping list with IDs, names, match criteria, enabled status, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Filter by enabled status'
        },
        has_conditions: {
          type: 'boolean',
          description: 'Filter by whether mapping has conditions'
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
    name: 'list_mapping_actions',
    description: 'Get the complete list of available mapping action types that can be used when creating or updating mappings. Returns all supported actions with their display names and values (e.g., "Set Role"/"add_role", "Set Group"/"set_group", "Set Department"/"set_department"). Use this to discover what action types are available for your OneLogin environment before creating mapping actions. Returns actions list and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'get_mapping',
    description: 'Get detailed configuration of a specific user mapping by ID. Returns complete mapping definition including match criteria (all/any), conditions array, actions array, enabled status, position in execution order, and x-request-id. Use to understand how a specific mapping transforms user data.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        }
      },
      required: ['mapping_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_mapping',
    description: 'Create a new user attribute mapping to control data flow during provisioning. Mappings execute in position order and can conditionally transform user attributes. Required fields: name (descriptive label), match (all/any - how conditions are evaluated), actions (array of action objects with "action" and "value" fields - see list_mapping_actions for available action types like add_role, set_role, set_group, set_department, etc.). Optional: enabled (default true), conditions (when to apply), position (execution order). Returns created mapping with ID and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Mapping name'
        },
        match: {
          type: 'string',
          description: 'Condition match type: "all" or "any"'
        },
        actions: {
          type: 'array',
          description: 'Array of action objects to perform. Each action object should have "action" (type like add_role, set_group, set_department) and "value" (configuration array) fields. Use list_mapping_actions to see available action types.'
        },
        enabled: {
          type: 'boolean',
          description: 'Whether mapping is enabled'
        },
        position: {
          type: 'number',
          description: 'Position in execution order (optional). Position 0 appends to end of list. Position 1 places at top. Higher values are clamped to valid range.'
        }
      },
      required: ['name', 'match', 'actions'],
      additionalProperties: true
    }
  },
  {
    name: 'update_mapping',
    description: 'Update an existing user mapping configuration. IMPORTANT: The OneLogin API requires ALL fields when updating - you must provide name, match, enabled, position, conditions (array), and actions (array) even if you only want to change one field. This is a full-replacement API pattern, not a partial update. Best practice: use get_mapping first to retrieve current values, then modify only what you need to change. Returns updated mapping data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID to update'
        },
        name: {
          type: 'string',
          description: 'Mapping name (REQUIRED for all updates)'
        },
        match: {
          type: 'string',
          description: 'Condition match type: "all" or "any" (REQUIRED for all updates)'
        },
        enabled: {
          type: 'boolean',
          description: 'Enabled status (REQUIRED for all updates)'
        },
        position: {
          type: 'number',
          description: 'Position in execution order (REQUIRED for all updates). Position 0 appends to end of list. Position 1 places at top (shifting others down). Higher values are clamped to valid range.'
        }
      },
      required: ['mapping_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_mapping',
    description: 'Permanently delete a user mapping. WARNING: This operation cannot be undone. Users will no longer have this mapping applied during provisioning. If you don\'t know the mapping ID, use list_mappings to find it. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID to delete'
        }
      },
      required: ['mapping_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_mapping_conditions',
    description: 'Get all conditions for a mapping. Conditions determine when a mapping applies - they compare user attributes against values using operators (equals, contains, in, etc). Returns conditions array with source field, operator, value, and x-request-id. Use to understand mapping triggering logic.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        }
      },
      required: ['mapping_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_mapping_condition',
    description: 'Add a condition to a mapping that controls when it executes. Conditions check user attributes (source) against values using operators: "==" (equals), "!=" (not equals), ">" (greater), "<" (less), ">=" (gte), "<=" (lte), "in" (contains), "not_in" (not contains), "~" (regex match). Example: source="department", operator="==", value="Engineering" applies mapping only to Engineering users. Returns created condition with ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        },
        source: {
          type: 'string',
          description: 'Source attribute to check'
        },
        operator: {
          type: 'string',
          description: 'Comparison operator (==, !=, >, <, >=, <=, in, not_in, ~)'
        },
        value: {
          type: 'string',
          description: 'Value to compare against'
        }
      },
      required: ['mapping_id'],
      additionalProperties: true
    }
  },
  {
    name: 'update_mapping_condition',
    description: 'Update an existing mapping condition. Can change source attribute, operator, or comparison value. Use to adjust when a mapping applies without recreating the entire condition. Returns updated condition data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        },
        condition_id: {
          type: 'number',
          description: 'The condition ID to update'
        },
        source: {
          type: 'string',
          description: 'New source attribute'
        },
        operator: {
          type: 'string',
          description: 'New operator'
        },
        value: {
          type: 'string',
          description: 'New comparison value'
        }
      },
      required: ['mapping_id', 'condition_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_mapping_condition',
    description: 'Remove a condition from a mapping. Mapping will execute less selectively after condition removal. If all conditions removed, mapping applies to all users (subject to match criteria). Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        },
        condition_id: {
          type: 'number',
          description: 'The condition ID to delete'
        }
      },
      required: ['mapping_id', 'condition_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_mapping_actions',
    description: 'Get all actions configured for a mapping. Actions define the transformations applied to user attributes when mapping conditions match. Common actions: set field value, copy field, transform with macros, map to app parameter. Returns actions array with action type, target fields, values, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        }
      },
      required: ['mapping_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_mapping_action',
    description: 'Add an action to a mapping that transforms user attributes. Actions execute when conditions match. Common action types: "add_role" or "set_role" (assign user to role), "set_group" (assign user to group), "set_department" (set department attribute), "set_status" (set user status), "set_value" (assign static value), "copy_value" (copy from another field), "set_macro" (use OneLogin macro like {firstname}.{lastname}), "set_default_if_null" (fallback value), "set_custom_attribute_*" (set custom fields). Use list_mapping_actions to get complete list of available action types for your environment. Value array structure varies by action type. Returns created action with ID and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        },
        action: {
          type: 'string',
          description: 'Action type (e.g., add_role, set_role, set_group, set_department, set_value, copy_value, set_macro, etc.)'
        },
        value: {
          type: 'array',
          description: 'Action configuration array'
        }
      },
      required: ['mapping_id'],
      additionalProperties: true
    }
  },
  {
    name: 'update_mapping_action',
    description: 'Update an existing mapping action configuration. Can change action type (add_role, set_role, set_group, set_department, set_value, etc.), target fields, or transformation values. Use list_mapping_actions to see available action types. Use to modify how user attributes are transformed without recreating the action. Returns updated action data and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        },
        action_id: {
          type: 'number',
          description: 'The action ID to update'
        },
        action: {
          type: 'string',
          description: 'New action type (e.g., add_role, set_role, set_group, set_department, set_value, copy_value, set_macro, etc.)'
        },
        value: {
          type: 'array',
          description: 'New action configuration'
        }
      },
      required: ['mapping_id', 'action_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_mapping_action',
    description: 'Remove an action from a mapping. The attribute transformation defined by this action will no longer execute. Mapping continues to run other configured actions. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_id: {
          type: 'number',
          description: 'The OneLogin mapping ID'
        },
        action_id: {
          type: 'number',
          description: 'The action ID to delete'
        }
      },
      required: ['mapping_id', 'action_id'],
      additionalProperties: false
    }
  },
  {
    name: 'sort_mappings',
    description: 'Reorder mapping execution priority by providing array of mapping IDs in desired order. IMPORTANT: Mappings execute sequentially in position order during provisioning - earlier mappings can affect values that later mappings see. Provide complete ordered list of all mapping IDs. Missing mappings may be disabled or repositioned unpredictably. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        mapping_ids: {
          type: 'array',
          items: {
            type: 'number'
          },
          description: 'Array of mapping IDs in desired execution order'
        }
      },
      required: ['mapping_ids'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_mappings: listMappings,
  list_mapping_actions: listMappingActions,
  get_mapping: getMapping,
  create_mapping: createMapping,
  update_mapping: updateMapping,
  delete_mapping: deleteMapping,
  get_mapping_conditions: getMappingConditions,
  create_mapping_condition: createMappingCondition,
  update_mapping_condition: updateMappingCondition,
  delete_mapping_condition: deleteMappingCondition,
  get_mapping_actions: getMappingActions,
  create_mapping_action: createMappingAction,
  update_mapping_action: updateMappingAction,
  delete_mapping_action: deleteMappingAction,
  sort_mappings: sortMappings
};
