/**
 * OneLogin Trusted Identity Providers Tools
 * API Reference: /api/2/trusted_idps
 *
 * Trusted IDPs enable federation with external identity providers (SAML, OIDC).
 * Configure trust relationships to allow users from partner organizations to access
 * your OneLogin apps using their own credentials.
 */

/**
 * List all trusted identity providers
 * GET /api/2/trusted_idps
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listTrustedIdps(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/trusted_idps', params);
}

/**
 * Get a specific trusted IDP by ID
 * GET /api/2/trusted_idps/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {idp_id: number}
 * @returns {Promise<Object>}
 */
export async function getTrustedIdp(api, args) {
  if (!args.idp_id) {
    throw new Error('idp_id is required');
  }

  return await api.get(`/api/2/trusted_idps/${args.idp_id}`);
}

/**
 * Create a new trusted IDP
 * POST /api/2/trusted_idps
 * @param {OneLoginApi} api
 * @param {Object} args - IDP configuration
 * @returns {Promise<Object>}
 */
export async function createTrustedIdp(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  if (!args.type) {
    throw new Error('type is required');
  }

  return await api.post('/api/2/trusted_idps', args);
}

/**
 * Update an existing trusted IDP
 * PUT /api/2/trusted_idps/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {idp_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateTrustedIdp(api, args) {
  if (!args.idp_id) {
    throw new Error('idp_id is required');
  }

  const idpId = args.idp_id;
  const updateData = { ...args };
  delete updateData.idp_id;

  return await api.put(`/api/2/trusted_idps/${idpId}`, updateData);
}

/**
 * Delete a trusted IDP
 * DELETE /api/2/trusted_idps/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {idp_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteTrustedIdp(api, args) {
  if (!args.idp_id) {
    throw new Error('idp_id is required');
  }

  return await api.delete(`/api/2/trusted_idps/${args.idp_id}`);
}

/**
 * Get trusted IDP metadata
 * GET /api/2/trusted_idps/{id}/metadata
 * @param {OneLoginApi} api
 * @param {Object} args - {idp_id: number}
 * @returns {Promise<Object>}
 */
export async function getTrustedIdpMetadata(api, args) {
  if (!args.idp_id) {
    throw new Error('idp_id is required');
  }

  return await api.get(`/api/2/trusted_idps/${args.idp_id}/metadata`);
}

/**
 * Update trusted IDP metadata
 * PUT /api/2/trusted_idps/{id}/metadata
 * @param {OneLoginApi} api
 * @param {Object} args - {idp_id: number, metadata: string}
 * @returns {Promise<Object>}
 */
export async function updateTrustedIdpMetadata(api, args) {
  if (!args.idp_id) {
    throw new Error('idp_id is required');
  }

  if (!args.metadata) {
    throw new Error('metadata is required');
  }

  return await api.put(`/api/2/trusted_idps/${args.idp_id}/metadata`, {
    metadata: args.metadata
  });
}

/**
 * Get trusted IDP issuer
 * GET /api/2/trusted_idps/{id}/issuer
 * @param {OneLoginApi} api
 * @param {Object} args - {idp_id: number}
 * @returns {Promise<Object>}
 */
export async function getTrustedIdpIssuer(api, args) {
  if (!args.idp_id) {
    throw new Error('idp_id is required');
  }

  return await api.get(`/api/2/trusted_idps/${args.idp_id}/issuer`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_trusted_idps',
    description: 'Get a list of all trusted identity providers (external IDPs) configured for federation. Trusted IDPs allow users from partner organizations to authenticate using their own credentials (SAML or OIDC). Returns IDP list with IDs, names, types (saml, oidc), enabled status, issuer URLs, and x-request-id. Use to audit federation relationships.',
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
    name: 'get_trusted_idp',
    description: 'Get detailed configuration of a specific trusted IDP by ID. Returns complete IDP settings including name, type (saml/oidc), enabled status, issuer URL, SSO endpoint, SLO endpoint, certificate data, attribute mappings (how external attributes map to OneLogin user fields), login hints, and apps that can use this IDP. Use to review federation configuration. Returns IDP data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        idp_id: { type: 'number', description: 'The trusted IDP ID' }
      },
      required: ['idp_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_trusted_idp',
    description: 'Create a new trusted identity provider for federation. Required: name, type (saml or oidc). For SAML: provide issuer, sso_endpoint, slo_endpoint (optional), certificate (X.509 cert). For OIDC: provide issuer, client_id, client_secret, authorization_endpoint, token_endpoint. Configure attribute mappings to sync user data. Supports JIT (just-in-time) provisioning to auto-create users. Returns created IDP with ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'IDP name' },
        type: { type: 'string', description: 'IDP type (saml or oidc)' },
        enabled: { type: 'boolean', description: 'Whether IDP is enabled (default true)' },
        issuer: { type: 'string', description: 'IDP issuer URL' },
        sso_endpoint: { type: 'string', description: 'SAML SSO endpoint URL' },
        certificate: { type: 'string', description: 'X.509 certificate (SAML)' }
      },
      required: ['name', 'type'],
      additionalProperties: true
    }
  },
  {
    name: 'update_trusted_idp',
    description: 'Update an existing trusted IDP configuration. Can modify name, enabled status, endpoints (SSO, SLO, authorization, token), certificates, attribute mappings, and JIT provisioning settings. Partial updates supported - only provide fields to change. IMPORTANT: Changing issuer or endpoints may break existing federation. Returns updated IDP data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        idp_id: { type: 'number', description: 'The trusted IDP ID to update' },
        name: { type: 'string', description: 'New IDP name' },
        enabled: { type: 'boolean', description: 'New enabled status' },
        issuer: { type: 'string', description: 'New issuer URL' },
        certificate: { type: 'string', description: 'New X.509 certificate' }
      },
      required: ['idp_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_trusted_idp',
    description: 'Permanently delete a trusted identity provider. WARNING: This breaks federation with the external IDP. Users from that organization can no longer access OneLogin apps via federated login. Existing federated users in OneLogin are NOT deleted but can no longer authenticate through this IDP. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        idp_id: { type: 'number', description: 'The trusted IDP ID to delete' }
      },
      required: ['idp_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_trusted_idp_metadata',
    description: 'Get SAML metadata XML for a trusted IDP. Metadata contains complete federation configuration including entity ID, endpoints, certificates, and supported bindings. Returns metadata as XML string and x-request-id. Use to review SAML configuration or provide to external IDP for reciprocal setup.',
    inputSchema: {
      type: 'object',
      properties: {
        idp_id: { type: 'number', description: 'The trusted IDP ID' }
      },
      required: ['idp_id'],
      additionalProperties: false
    }
  },
  {
    name: 'update_trusted_idp_metadata',
    description: 'Update a trusted SAML IDP by uploading new metadata XML. Metadata file from external IDP contains issuer, SSO/SLO endpoints, and certificate. OneLogin parses XML and updates IDP configuration automatically. Easier than manually updating individual fields. Provide raw XML as string. Returns success status and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        idp_id: { type: 'number', description: 'The trusted IDP ID' },
        metadata: { type: 'string', description: 'SAML metadata XML content' }
      },
      required: ['idp_id', 'metadata'],
      additionalProperties: false
    }
  },
  {
    name: 'get_trusted_idp_issuer',
    description: 'Get the issuer URL (entity ID) for a trusted IDP. The issuer uniquely identifies the external identity provider in SAML/OIDC flows. Returns issuer string and x-request-id. Use to verify IDP identity or troubleshoot federation issues.',
    inputSchema: {
      type: 'object',
      properties: {
        idp_id: { type: 'number', description: 'The trusted IDP ID' }
      },
      required: ['idp_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_trusted_idps: listTrustedIdps,
  get_trusted_idp: getTrustedIdp,
  create_trusted_idp: createTrustedIdp,
  update_trusted_idp: updateTrustedIdp,
  delete_trusted_idp: deleteTrustedIdp,
  get_trusted_idp_metadata: getTrustedIdpMetadata,
  update_trusted_idp_metadata: updateTrustedIdpMetadata,
  get_trusted_idp_issuer: getTrustedIdpIssuer
};
