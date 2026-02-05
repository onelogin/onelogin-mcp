/**
 * OneLogin API Authorization Tools
 * API Reference: /api/2/api_authorizations
 *
 * API Authorization controls OAuth 2.0 scopes and which client credentials can access
 * which resources. Manages the authorization layer between API clients and OneLogin resources.
 */

/**
 * List API authorizations
 * GET /api/2/api_authorizations
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listApiAuthorizations(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/api_authorizations', params);
}

/**
 * Get a specific API authorization by ID
 * GET /api/2/api_authorizations/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number}
 * @returns {Promise<Object>}
 */
export async function getApiAuthorization(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  return await api.get(`/api/2/api_authorizations/${args.auth_id}`);
}

/**
 * Create a new API authorization
 * POST /api/2/api_authorizations
 * @param {OneLoginApi} api
 * @param {Object} args - Authorization configuration
 * @returns {Promise<Object>}
 */
export async function createApiAuthorization(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  return await api.post('/api/2/api_authorizations', args);
}

/**
 * Update an API authorization
 * PUT /api/2/api_authorizations/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateApiAuthorization(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  const authId = args.auth_id;
  const updateData = { ...args };
  delete updateData.auth_id;

  return await api.put(`/api/2/api_authorizations/${authId}`, updateData);
}

/**
 * Delete an API authorization
 * DELETE /api/2/api_authorizations/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteApiAuthorization(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  return await api.delete(`/api/2/api_authorizations/${args.auth_id}`);
}

/**
 * List scopes for an API authorization
 * GET /api/2/api_authorizations/{id}/scopes
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number}
 * @returns {Promise<Object>}
 */
export async function listAuthorizationScopes(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  return await api.get(`/api/2/api_authorizations/${args.auth_id}/scopes`);
}

/**
 * Add scopes to an API authorization
 * POST /api/2/api_authorizations/{id}/scopes
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number, scopes: string[]}
 * @returns {Promise<Object>}
 */
export async function addAuthorizationScopes(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  if (!args.scopes || !Array.isArray(args.scopes)) {
    throw new Error('scopes array is required');
  }

  return await api.post(`/api/2/api_authorizations/${args.auth_id}/scopes`, {
    scopes: args.scopes
  });
}

/**
 * Remove scopes from an API authorization
 * DELETE /api/2/api_authorizations/{id}/scopes
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number, scopes: string[]}
 * @returns {Promise<Object>}
 */
export async function removeAuthorizationScopes(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  if (!args.scopes || !Array.isArray(args.scopes)) {
    throw new Error('scopes array is required');
  }

  return await api.delete(`/api/2/api_authorizations/${args.auth_id}/scopes`, {
    scopes: args.scopes
  });
}

/**
 * List clients authorized for an API authorization
 * GET /api/2/api_authorizations/{id}/clients
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number}
 * @returns {Promise<Object>}
 */
export async function listAuthorizedClients(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  return await api.get(`/api/2/api_authorizations/${args.auth_id}/clients`);
}

/**
 * Authorize clients for an API authorization
 * POST /api/2/api_authorizations/{id}/clients
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number, client_ids: number[]}
 * @returns {Promise<Object>}
 */
export async function addAuthorizedClients(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  if (!args.client_ids || !Array.isArray(args.client_ids)) {
    throw new Error('client_ids array is required');
  }

  return await api.post(`/api/2/api_authorizations/${args.auth_id}/clients`, {
    client_ids: args.client_ids
  });
}

/**
 * Remove authorized clients from an API authorization
 * DELETE /api/2/api_authorizations/{id}/clients
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number, client_ids: number[]}
 * @returns {Promise<Object>}
 */
export async function removeAuthorizedClients(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  if (!args.client_ids || !Array.isArray(args.client_ids)) {
    throw new Error('client_ids array is required');
  }

  return await api.delete(`/api/2/api_authorizations/${args.auth_id}/clients`, {
    client_ids: args.client_ids
  });
}

/**
 * List all available OAuth scopes
 * GET /api/2/api_authorizations/scopes
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listAvailableScopes(api, args = {}) {
  return await api.get('/api/2/api_authorizations/scopes', args);
}

/**
 * List client apps (API credentials)
 * GET /api/2/api_authorizations/clients
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listClientApps(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/api_authorizations/clients', params);
}

/**
 * Get a specific client app
 * GET /api/2/api_authorizations/clients/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {client_id: number}
 * @returns {Promise<Object>}
 */
export async function getClientApp(api, args) {
  if (!args.client_id) {
    throw new Error('client_id is required');
  }

  return await api.get(`/api/2/api_authorizations/clients/${args.client_id}`);
}

/**
 * Create a new client app
 * POST /api/2/api_authorizations/clients
 * @param {OneLoginApi} api
 * @param {Object} args - Client app configuration
 * @returns {Promise<Object>}
 */
export async function createClientApp(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  return await api.post('/api/2/api_authorizations/clients', args);
}

/**
 * Update a client app
 * PUT /api/2/api_authorizations/clients/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {client_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateClientApp(api, args) {
  if (!args.client_id) {
    throw new Error('client_id is required');
  }

  const clientId = args.client_id;
  const updateData = { ...args };
  delete updateData.client_id;

  return await api.put(`/api/2/api_authorizations/clients/${clientId}`, updateData);
}

/**
 * Delete a client app
 * DELETE /api/2/api_authorizations/clients/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {client_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteClientApp(api, args) {
  if (!args.client_id) {
    throw new Error('client_id is required');
  }

  return await api.delete(`/api/2/api_authorizations/clients/${args.client_id}`);
}

/**
 * List claims for an API authorization
 * GET /api/2/api_authorizations/{id}/claims
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number}
 * @returns {Promise<Object>}
 */
export async function listAuthorizationClaims(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  return await api.get(`/api/2/api_authorizations/${args.auth_id}/claims`);
}

/**
 * Add a claim to an API authorization
 * POST /api/2/api_authorizations/{id}/claims
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number, name: string, user_attribute_mappings: string, ...optional fields}
 * @returns {Promise<Object>}
 */
export async function addAuthorizationClaim(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  if (!args.name) {
    throw new Error('name is required');
  }

  if (!args.user_attribute_mappings) {
    throw new Error('user_attribute_mappings is required');
  }

  const authId = args.auth_id;
  const claimData = { ...args };
  delete claimData.auth_id;

  return await api.post(`/api/2/api_authorizations/${authId}/claims`, claimData);
}

/**
 * Update a claim in an API authorization
 * PUT /api/2/api_authorizations/{id}/claims/{claim_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number, claim_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateAuthorizationClaim(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  if (!args.claim_id) {
    throw new Error('claim_id is required');
  }

  const authId = args.auth_id;
  const claimId = args.claim_id;
  const updateData = { ...args };
  delete updateData.auth_id;
  delete updateData.claim_id;

  return await api.put(`/api/2/api_authorizations/${authId}/claims/${claimId}`, updateData);
}

/**
 * Delete a claim from an API authorization
 * DELETE /api/2/api_authorizations/{id}/claims/{claim_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {auth_id: number, claim_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteAuthorizationClaim(api, args) {
  if (!args.auth_id) {
    throw new Error('auth_id is required');
  }

  if (!args.claim_id) {
    throw new Error('claim_id is required');
  }

  return await api.delete(`/api/2/api_authorizations/${args.auth_id}/claims/${args.claim_id}`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_api_authorizations',
    description: 'Get a list of all API authorizations (resource servers) configured in OneLogin. API authorizations define protected resources that client apps can request access to via OAuth 2.0 scopes. Each authorization has a unique audience identifier and set of allowed scopes. Returns authorization list with IDs, names, descriptions, audiences, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of results to return' },
        page: { type: 'number', description: 'Page number for pagination' },
        after_cursor: { type: 'string', description: 'Cursor for next page' },
        before_cursor: { type: 'string', description: 'Cursor for previous page' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_api_authorization',
    description: 'Get detailed configuration of a specific API authorization by ID. Returns complete authorization definition including name, description, audience (unique identifier in JWT tokens), configuration (token lifetime, refresh settings), associated scopes, and authorized client apps. Use to review OAuth resource server configuration. Returns authorization data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' }
      },
      required: ['auth_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_api_authorization',
    description: 'Create a new API authorization (OAuth 2.0 resource server) to protect your APIs with OneLogin. Required: name (descriptive label). Recommended: audience (unique identifier, defaults to name), description. Access tokens issued for this authorization will include the audience claim. Define scopes with add_authorization_scopes after creation. Returns created authorization with ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Authorization name' },
        description: { type: 'string', description: 'Authorization description' },
        audience: { type: 'string', description: 'Unique audience identifier (defaults to name)' }
      },
      required: ['name'],
      additionalProperties: true
    }
  },
  {
    name: 'update_api_authorization',
    description: 'Update an existing API authorization configuration. Can modify name, description, audience, and token settings. Partial updates supported - only provide fields to change. IMPORTANT: Changing audience will break existing access tokens. Returns updated authorization data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID to update' },
        name: { type: 'string', description: 'New name' },
        description: { type: 'string', description: 'New description' },
        audience: { type: 'string', description: 'New audience identifier' }
      },
      required: ['auth_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_api_authorization',
    description: 'Permanently delete an API authorization. WARNING: This removes OAuth scope definitions and revokes all associated client access. Existing access tokens for this authorization become invalid. Client apps will receive authorization errors. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID to delete' }
      },
      required: ['auth_id'],
      additionalProperties: false
    }
  },
  {
    name: 'list_authorization_scopes',
    description: 'Get all OAuth 2.0 scopes defined for an API authorization. Scopes control granular permissions (read:users, write:data, etc.). Returns scope list with values, descriptions, and x-request-id. Use to audit what permissions can be requested from this authorization.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' }
      },
      required: ['auth_id'],
      additionalProperties: false
    }
  },
  {
    name: 'add_authorization_scopes',
    description: 'Add OAuth 2.0 scopes to an API authorization. Scopes define granular permissions that client apps can request. Provide array of scope strings (e.g., ["read:users", "write:data"]). Scope naming convention: <action>:<resource>. Duplicate scopes are ignored. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' },
        scopes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of scope strings to add'
        }
      },
      required: ['auth_id', 'scopes'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_authorization_scopes',
    description: 'Remove OAuth 2.0 scopes from an API authorization. Client apps can no longer request removed scopes. Existing access tokens with removed scopes remain valid until expiration. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' },
        scopes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of scope strings to remove'
        }
      },
      required: ['auth_id', 'scopes'],
      additionalProperties: false
    }
  },
  {
    name: 'list_authorized_clients',
    description: 'Get list of client apps (API credentials) authorized to request tokens for this API authorization. Returns client list with IDs, names, client_id values, and granted scopes. Use to audit which apps can access this protected resource. Returns client data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' }
      },
      required: ['auth_id'],
      additionalProperties: false
    }
  },
  {
    name: 'add_authorized_clients',
    description: 'Grant client apps permission to request access tokens for this API authorization. Provide array of client app IDs. Clients can then use OAuth client credentials flow to get tokens with this authorization\'s audience and allowed scopes. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' },
        client_ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of client app IDs to authorize'
        }
      },
      required: ['auth_id', 'client_ids'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_authorized_clients',
    description: 'Revoke client app access to this API authorization. Clients can no longer request new tokens. Existing tokens remain valid until expiration. Use to immediately cut off API access from compromised or deprecated client apps. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' },
        client_ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of client app IDs to revoke'
        }
      },
      required: ['auth_id', 'client_ids'],
      additionalProperties: false
    }
  },
  {
    name: 'list_available_scopes',
    description: 'Get catalog of all available OAuth 2.0 scopes across all API authorizations in your OneLogin account. Returns comprehensive scope list with values, descriptions, and which authorizations they belong to. Use to discover existing scopes before creating new ones or to standardize scope naming. Returns scope catalog and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'list_client_apps',
    description: 'Get a list of all client apps (API credential pairs) configured for OAuth 2.0 authentication. Client apps use client_id and client_secret to obtain access tokens via client credentials flow. Returns client list with IDs, names, client_id values (secrets redacted), scopes, and x-request-id.',
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
    name: 'get_client_app',
    description: 'Get detailed configuration of a specific client app by ID. Returns complete client definition including name, client_id (for authentication), authorized API authorizations, granted scopes, and configuration. Client secret is not returned for security. Use to review API credential configuration. Returns client data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: { type: 'number', description: 'The client app ID' }
      },
      required: ['client_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_client_app',
    description: 'Create a new client app (API credentials) for OAuth 2.0 client credentials flow. Required: name. Returns created client with ID, client_id, and client_secret. IMPORTANT: client_secret is only shown once during creation - store it securely. After creation, use add_authorized_clients to grant access to API authorizations. Returns client credentials and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Client app name' },
        description: { type: 'string', description: 'Client app description' }
      },
      required: ['name'],
      additionalProperties: true
    }
  },
  {
    name: 'update_client_app',
    description: 'Update a client app configuration. Can modify name and description. Cannot change client_id or regenerate client_secret via this endpoint. Partial updates supported - only provide fields to change. Returns updated client data (secret redacted) and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: { type: 'number', description: 'The client app ID to update' },
        name: { type: 'string', description: 'New name' },
        description: { type: 'string', description: 'New description' }
      },
      required: ['client_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_client_app',
    description: 'Permanently delete a client app and revoke its API credentials. WARNING: This immediately invalidates all access tokens obtained by this client. Any applications using these credentials will lose API access. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        client_id: { type: 'number', description: 'The client app ID to delete' }
      },
      required: ['client_id'],
      additionalProperties: false
    }
  },
  {
    name: 'list_authorization_claims',
    description: 'Get all custom claims defined for an API authorization. Claims are user attributes (email, roles, custom fields) included in access tokens as JWT claims. Returns claim list with IDs, names, user attribute mappings, transformations, and x-request-id. Use to audit what user data is exposed in tokens (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' }
      },
      required: ['auth_id'],
      additionalProperties: false
    }
  },
  {
    name: 'add_authorization_claim',
    description: 'Add a custom claim to access tokens for an API authorization. Claims enrich tokens with user attributes (email, roles, custom attributes). Required: name (claim key in JWT), user_attribute_mappings (OneLogin user field to map). For custom attributes, prefix with "custom_attribute_" (e.g., "custom_attribute_employee_id"). Optional: user_attribute_macros (when mappings="_macro_"), attributes_transformations (e.g., "semicolon_separated_list" for role arrays). Returns created claim with ID and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' },
        name: { type: 'string', description: 'Claim name as it appears in the JWT token' },
        user_attribute_mappings: { type: 'string', description: 'OneLogin user attribute to map (e.g., "email", "roles", "custom_attribute_employee_id")' },
        user_attribute_macros: { type: 'string', description: 'Macro logic if user_attribute_mappings is "_macro_"' },
        attributes_transformations: { type: 'string', description: 'Transformation to apply (e.g., "semicolon_separated_list")' }
      },
      required: ['auth_id', 'name', 'user_attribute_mappings'],
      additionalProperties: true
    }
  },
  {
    name: 'update_authorization_claim',
    description: 'Update an existing claim configuration for an API authorization. Can modify name, user attribute mappings, macros, and transformations. Partial updates supported - only provide fields to change. IMPORTANT: Changing claim mapping will affect all future access tokens. Existing tokens retain old claim values until expiration. Returns updated claim data and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' },
        claim_id: { type: 'number', description: 'The claim ID to update' },
        name: { type: 'string', description: 'New claim name' },
        user_attribute_mappings: { type: 'string', description: 'New user attribute mapping' },
        user_attribute_macros: { type: 'string', description: 'New macro logic' },
        attributes_transformations: { type: 'string', description: 'New transformation' }
      },
      required: ['auth_id', 'claim_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_authorization_claim',
    description: 'Remove a claim from an API authorization. Claim will no longer appear in newly issued access tokens. Existing tokens with this claim remain valid until expiration. Use to remove unnecessary user data exposure from tokens. Returns success status and x-request-id (API v2).',
    inputSchema: {
      type: 'object',
      properties: {
        auth_id: { type: 'number', description: 'The API authorization ID' },
        claim_id: { type: 'number', description: 'The claim ID to delete' }
      },
      required: ['auth_id', 'claim_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_api_authorizations: listApiAuthorizations,
  get_api_authorization: getApiAuthorization,
  create_api_authorization: createApiAuthorization,
  update_api_authorization: updateApiAuthorization,
  delete_api_authorization: deleteApiAuthorization,
  list_authorization_scopes: listAuthorizationScopes,
  add_authorization_scopes: addAuthorizationScopes,
  remove_authorization_scopes: removeAuthorizationScopes,
  list_authorized_clients: listAuthorizedClients,
  add_authorized_clients: addAuthorizedClients,
  remove_authorized_clients: removeAuthorizedClients,
  list_available_scopes: listAvailableScopes,
  list_client_apps: listClientApps,
  get_client_app: getClientApp,
  create_client_app: createClientApp,
  update_client_app: updateClientApp,
  delete_client_app: deleteClientApp,
  list_authorization_claims: listAuthorizationClaims,
  add_authorization_claim: addAuthorizationClaim,
  update_authorization_claim: updateAuthorizationClaim,
  delete_authorization_claim: deleteAuthorizationClaim
};
