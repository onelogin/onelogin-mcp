/**
 * OneLogin Brands Tools
 * API Reference: /api/2/branding/brands
 *
 * Brands control the visual appearance of OneLogin portals, login pages, and emails.
 * Customize logos, colors, backgrounds, and copy to match your company branding.
 */

/**
 * List all brands
 * GET /api/2/branding/brands
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listBrands(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  return await api.get('/api/2/branding/brands', params);
}

/**
 * Get a specific brand by ID
 * GET /api/2/branding/brands/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {brand_id: number}
 * @returns {Promise<Object>}
 */
export async function getBrand(api, args) {
  if (!args.brand_id) {
    throw new Error('brand_id is required');
  }

  return await api.get(`/api/2/branding/brands/${args.brand_id}`);
}

/**
 * Create a new brand
 * POST /api/2/branding/brands
 * @param {OneLoginApi} api
 * @param {Object} args - Brand configuration
 * @returns {Promise<Object>}
 */
export async function createBrand(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  return await api.post('/api/2/branding/brands', args);
}

/**
 * Update an existing brand
 * PUT /api/2/branding/brands/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {brand_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateBrand(api, args) {
  if (!args.brand_id) {
    throw new Error('brand_id is required');
  }

  const brandId = args.brand_id;
  const updateData = { ...args };
  delete updateData.brand_id;

  return await api.put(`/api/2/branding/brands/${brandId}`, updateData);
}

/**
 * Delete a brand
 * DELETE /api/2/branding/brands/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {brand_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteBrand(api, args) {
  if (!args.brand_id) {
    throw new Error('brand_id is required');
  }

  return await api.delete(`/api/2/branding/brands/${args.brand_id}`);
}

/**
 * Get brand apps (apps using this brand)
 * GET /api/2/branding/brands/{id}/apps
 * @param {OneLoginApi} api
 * @param {Object} args - {brand_id: number}
 * @returns {Promise<Object>}
 */
export async function getBrandApps(api, args) {
  if (!args.brand_id) {
    throw new Error('brand_id is required');
  }

  return await api.get(`/api/2/branding/brands/${args.brand_id}/apps`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_brands',
    description: 'Get a list of all branding configurations in your OneLogin account. Brands control the visual appearance of login pages, portals, and emails. Each brand can be assigned to specific apps or used account-wide. Returns brand list with IDs, names, enabled status, custom settings (logo URLs, colors, background images), and x-request-id.',
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
    name: 'get_brand',
    description: 'Get detailed configuration of a specific brand by ID. Returns complete brand settings including name, enabled status, customization options: logo (header, login page, favicon), colors (primary, secondary, navigation), background images, custom CSS, login page copy (title, tagline), email templates, and apps using this brand. Use to review or backup branding configuration. Returns brand data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        brand_id: { type: 'number', description: 'The brand ID' }
      },
      required: ['brand_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_brand',
    description: 'Create a new brand to customize OneLogin portal appearance. Required: name. Configure visual elements: logo_url (header logo), login_logo_url (login page logo), favicon_url, primary_color (hex color for buttons/links), secondary_color, navigation_color, background_image_url (login page background), custom_css (advanced styling), custom_login_page_title, custom_login_page_tagline. Assign to apps or set as account default. Returns created brand with ID and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Brand name' },
        enabled: { type: 'boolean', description: 'Whether brand is enabled (default true)' },
        logo_url: { type: 'string', description: 'Header logo URL' },
        login_logo_url: { type: 'string', description: 'Login page logo URL' },
        favicon_url: { type: 'string', description: 'Favicon URL' },
        primary_color: { type: 'string', description: 'Primary color (hex)' },
        secondary_color: { type: 'string', description: 'Secondary color (hex)' },
        background_image_url: { type: 'string', description: 'Login background image URL' }
      },
      required: ['name'],
      additionalProperties: true
    }
  },
  {
    name: 'update_brand',
    description: 'Update an existing brand configuration. Can modify name, enabled status, and any customization settings (logos, colors, backgrounds, custom copy). Partial updates supported - only provide fields to change. Changes apply immediately to login pages and portals using this brand. Returns updated brand data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        brand_id: { type: 'number', description: 'The brand ID to update' },
        name: { type: 'string', description: 'New brand name' },
        enabled: { type: 'boolean', description: 'New enabled status' },
        logo_url: { type: 'string', description: 'New header logo URL' },
        login_logo_url: { type: 'string', description: 'New login logo URL' },
        primary_color: { type: 'string', description: 'New primary color' },
        background_image_url: { type: 'string', description: 'New background image' }
      },
      required: ['brand_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_brand',
    description: 'Permanently delete a brand. WARNING: Apps using this brand will revert to the account default brand. Custom branding settings are lost and cannot be recovered. If you don\'t know the brand ID, use list_brands to find it. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        brand_id: { type: 'number', description: 'The brand ID to delete' }
      },
      required: ['brand_id'],
      additionalProperties: false
    }
  },
  {
    name: 'get_brand_apps',
    description: 'Get a list of apps currently using a specific brand. Returns app list with IDs, names, and connector info. Use to understand brand impact before making changes or to audit which apps share branding. Returns app data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        brand_id: { type: 'number', description: 'The brand ID' }
      },
      required: ['brand_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_brands: listBrands,
  get_brand: getBrand,
  create_brand: createBrand,
  update_brand: updateBrand,
  delete_brand: deleteBrand,
  get_brand_apps: getBrandApps
};
