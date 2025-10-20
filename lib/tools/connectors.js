/**
 * OneLogin Connectors Tools
 * API Reference: /api/2/connectors
 *
 * Connectors are templates for integrating apps with OneLogin. The connector catalog
 * contains thousands of pre-built integrations for popular SaaS apps like Salesforce,
 * Slack, AWS, etc. Use these tools to browse the catalog before creating apps.
 */

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
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

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
 * Search connectors
 * GET /api/2/connectors/search
 * @param {OneLoginApi} api
 * @param {Object} args - {query: string}
 * @returns {Promise<Object>}
 */
export async function searchConnectors(api, args) {
  if (!args.query) {
    throw new Error('query is required');
  }

  const params = { query: args.query };
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/connectors/search', params);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_connectors',
    description: 'Get a list of all available app connectors in the OneLogin catalog. Connectors are pre-built integration templates for SaaS apps (Salesforce, Slack, AWS, Office 365, etc.). Each connector defines SSO configuration, provisioning rules, and attribute mappings. Filter by name to find specific apps. Returns connector list with IDs, names, descriptions, logos, auth methods (SAML, OIDC, etc.), and x-request-id. Use to discover available integrations before creating apps.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by connector name' },
        limit: { type: 'number', description: 'Number of results to return (default 50)' },
        page: { type: 'number', description: 'Page number for pagination' },
        after_cursor: { type: 'string', description: 'Cursor for next page' },
        before_cursor: { type: 'string', description: 'Cursor for previous page' }
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
  },
  {
    name: 'search_connectors',
    description: 'Search the connector catalog by name or keyword. More flexible than list_connectors filter - supports partial matches and searches across name and description. Query "salesforce" finds all Salesforce-related connectors, "aws" finds all AWS integrations. Returns matching connectors with IDs, names, descriptions, logos, and x-request-id. Use to discover integrations when you don\'t know exact connector name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (app name or keyword)' },
        limit: { type: 'number', description: 'Number of results to return' },
        page: { type: 'number', description: 'Page number for pagination' }
      },
      required: ['query'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_connectors: listConnectors,
  get_connector: getConnector,
  search_connectors: searchConnectors
};
