/**
 * OneLogin Connectors Tools
 * API Reference: /api/2/connectors
 *
 * Connectors are templates for integrating apps with OneLogin. The connector catalog
 * contains thousands of pre-built integrations for popular SaaS apps like Salesforce,
 * Slack, AWS, etc. Use these tools to browse the catalog before creating apps.
 */

import { applyV2Pagination, CURSOR_PARAM, AFTER_CURSOR_ALIAS, BEFORE_CURSOR_ALIAS } from '../pagination.js';

/**
 * List available connectors
 * GET /api/2/connectors
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listConnectors(api, args = {}) {
  const params = {};

  if (args.name) params.name = args.name;
  // Pagination: limit/page, or a single cursor (see lib/pagination.js)
  applyV2Pagination(params, args);

  return await api.get('/api/2/connectors', params);
}

/**
 * Get a specific connector by ID
 * GET /api/2/connectors/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {connector_id: number}
 * @returns {Promise<Object>}
 */
export async function getConnector(api, args) {
  if (!args.connector_id) {
    throw new Error('connector_id is required');
  }

  return await api.get(`/api/2/connectors/${args.connector_id}`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_connectors',
    description: 'Get a list of all available app connectors in the OneLogin catalog. Connectors are pre-built integration templates for SaaS apps (Salesforce, Slack, AWS, Office 365, etc.). Each connector defines SSO configuration, provisioning rules, and attribute mappings. Filter by name to find specific apps (use *wildcards* for partial matches - this is the only search the API offers). Paginate with limit/page, or pass a previous response\'s pagination.after_cursor / before_cursor as cursor. Returns connector list with IDs, names, descriptions, logos, auth methods (SAML, OIDC, etc.), a pagination block, and x-request-id. Use to discover available integrations before creating apps.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by connector name. Exact match by default; wrap in * for a partial match (e.g. "*slack*" finds every Slack connector). This is the catalog search - there is no separate search endpoint.' },
        limit: { type: 'number', description: 'Number of results to return (default 50)' },
        page: { type: 'number', description: 'Page number for pagination' },
        cursor: CURSOR_PARAM,
        after_cursor: AFTER_CURSOR_ALIAS,
        before_cursor: BEFORE_CURSOR_ALIAS
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_connector',
    description: 'Get detailed configuration for a specific connector by ID. Returns complete connector definition including name, description, logo_url, auth_method (0=Password, 2=SAML, 8=OIDC, etc.), icon_url, allows_new_parameters (can add custom SAML attributes), default parameters (required config fields), provisioning capabilities (create/update/delete users), and supported features. Use to understand connector requirements before creating an app. Returns connector data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        connector_id: { type: 'number', description: 'The connector ID' }
      },
      required: ['connector_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_connectors: listConnectors,
  get_connector: getConnector
};
