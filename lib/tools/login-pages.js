/**
 * OneLogin Custom Login Pages Tools
 * API Reference: /api/2/login_pages
 *
 * Custom login pages allow you to completely customize the OneLogin login experience
 * with your own HTML, CSS, and JavaScript. Create branded, fully customized login
 * flows while maintaining OneLogin's security and authentication backend.
 */

/**
 * List all custom login pages
 * GET /api/2/login_pages
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listLoginPages(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/login_pages', params);
}

/**
 * Get a specific login page by ID
 * GET /api/2/login_pages/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {page_id: number}
 * @returns {Promise<Object>}
 */
export async function getLoginPage(api, args) {
  if (!args.page_id) {
    throw new Error('page_id is required');
  }

  return await api.get(`/api/2/login_pages/${args.page_id}`);
}

/**
 * Create a new custom login page
 * POST /api/2/login_pages
 * @param {OneLoginApi} api
 * @param {Object} args - Login page configuration
 * @returns {Promise<Object>}
 */
export async function createLoginPage(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  return await api.post('/api/2/login_pages', args);
}

/**
 * Update an existing login page
 * PUT /api/2/login_pages/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {page_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateLoginPage(api, args) {
  if (!args.page_id) {
    throw new Error('page_id is required');
  }

  const pageId = args.page_id;
  const updateData = { ...args };
  delete updateData.page_id;

  return await api.put(`/api/2/login_pages/${pageId}`, updateData);
}

/**
 * Delete a custom login page
 * DELETE /api/2/login_pages/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {page_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteLoginPage(api, args) {
  if (!args.page_id) {
    throw new Error('page_id is required');
  }

  return await api.delete(`/api/2/login_pages/${args.page_id}`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_login_pages',
    description: 'Get a list of all custom login pages configured in OneLogin. Custom login pages allow complete HTML/CSS/JS customization of the login experience while maintaining OneLogin security backend. Returns login page list with IDs, names, enabled status, default page flag, subdomain associations, and preview URLs. Use to audit custom branding configurations. Returns pages array and x-request-id.',
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
    name: 'get_login_page',
    description: 'Get detailed configuration of a specific custom login page by ID. Returns complete page definition including name, enabled status, html_content (full HTML source), css_content (custom styles), javascript_content (custom scripts), subdomain (which subdomain uses this page), default (whether this is the default page for subdomain), preview_url, and last_modified timestamp. SECURITY: Review JavaScript carefully for XSS vulnerabilities. Returns page data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: { type: 'number', description: 'The login page ID' }
      },
      required: ['page_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_login_page',
    description: 'Create a new custom login page with your own HTML, CSS, and JavaScript. Required: name. Provide html_content (complete HTML including form), css_content (custom styles), javascript_content (custom behavior). OneLogin injects special variables and functions for authentication (e.g., {{username_field}}, {{password_field}}, submitLogin()). Reference OneLogin documentation for available template variables. Set subdomain to associate with specific subdomain. Returns created page with ID, preview_url, and x-request-id. IMPORTANT: Test thoroughly in preview before enabling.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Login page name' },
        html_content: { type: 'string', description: 'Custom HTML content' },
        css_content: { type: 'string', description: 'Custom CSS styles' },
        javascript_content: { type: 'string', description: 'Custom JavaScript code' },
        subdomain: { type: 'string', description: 'Subdomain to associate page with' },
        enabled: { type: 'boolean', description: 'Whether page is enabled (default false)' }
      },
      required: ['name'],
      additionalProperties: true
    }
  },
  {
    name: 'update_login_page',
    description: 'Update an existing custom login page. Can modify name, html_content, css_content, javascript_content, subdomain, enabled status, and default flag. Partial updates supported - only provide fields to change. IMPORTANT: Changes affect all users immediately when enabled. Test in preview mode first. Consider versioning HTML/CSS/JS in source control. Returns updated page data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: { type: 'number', description: 'The login page ID to update' },
        name: { type: 'string', description: 'New page name' },
        html_content: { type: 'string', description: 'New HTML content' },
        css_content: { type: 'string', description: 'New CSS styles' },
        javascript_content: { type: 'string', description: 'New JavaScript code' },
        enabled: { type: 'boolean', description: 'New enabled status' }
      },
      required: ['page_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_login_page',
    description: 'Permanently delete a custom login page. IMPORTANT: If this is the default page for a subdomain, users will fall back to OneLogin standard login page. If page is currently in use (enabled=true), deletion immediately reverts to standard page. Recommended: disable page first, monitor for issues, then delete. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: { type: 'number', description: 'The login page ID to delete' }
      },
      required: ['page_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_login_pages: listLoginPages,
  get_login_page: getLoginPage,
  create_login_page: createLoginPage,
  update_login_page: updateLoginPage,
  delete_login_page: deleteLoginPage
};
