/**
 * OneLogin Directory Integrations Tools
 * API Reference: /api/2/directories
 *
 * Directories sync users and groups from external sources like Active Directory,
 * LDAP, Google Workspace, Okta, etc. Configure directory connectors to automate
 * user provisioning and maintain consistent identity data across systems.
 */

/**
 * List all directory integrations
 * GET /api/2/directories
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listDirectories(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/directories', params);
}

/**
 * Get a specific directory by ID
 * GET /api/2/directories/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {directory_id: number}
 * @returns {Promise<Object>}
 */
export async function getDirectory(api, args) {
  if (!args.directory_id) {
    throw new Error('directory_id is required');
  }

  return await api.get(`/api/2/directories/${args.directory_id}`);
}

/**
 * Create a new directory integration
 * POST /api/2/directories
 * @param {OneLoginApi} api
 * @param {Object} args - Directory configuration
 * @returns {Promise<Object>}
 */
export async function createDirectory(api, args) {
  if (!args.name) {
    throw new Error('name is required');
  }

  if (!args.directory_type) {
    throw new Error('directory_type is required');
  }

  return await api.post('/api/2/directories', args);
}

/**
 * Update an existing directory
 * PUT /api/2/directories/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {directory_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateDirectory(api, args) {
  if (!args.directory_id) {
    throw new Error('directory_id is required');
  }

  const directoryId = args.directory_id;
  const updateData = { ...args };
  delete updateData.directory_id;

  return await api.put(`/api/2/directories/${directoryId}`, updateData);
}

/**
 * Delete a directory integration
 * DELETE /api/2/directories/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {directory_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteDirectory(api, args) {
  if (!args.directory_id) {
    throw new Error('directory_id is required');
  }

  return await api.delete(`/api/2/directories/${args.directory_id}`);
}

/**
 * Sync a directory to pull latest users/groups
 * POST /api/2/directories/{id}/sync
 * @param {OneLoginApi} api
 * @param {Object} args - {directory_id: number}
 * @returns {Promise<Object>}
 */
export async function syncDirectory(api, args) {
  if (!args.directory_id) {
    throw new Error('directory_id is required');
  }

  return await api.post(`/api/2/directories/${args.directory_id}/sync`, {});
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_directories',
    description: 'Get a list of all directory integrations configured in OneLogin. Directories sync users and groups from external sources like Active Directory, LDAP, Google Workspace, Azure AD, Okta. Returns directory list with IDs, names, directory_type (activedirectory, ldap, google, azure, okta), status (active, inactive, error), last_sync timestamp, sync_interval, and x-request-id. Use to audit directory connections.',
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
    name: 'get_directory',
    description: 'Get detailed configuration of a specific directory integration by ID. Returns complete directory settings including name, directory_type, connection details (host, port, base_dn for LDAP/AD; domain for cloud directories), authentication credentials, sync configuration (user_filter, group_filter, attribute_mappings), sync_interval, last_sync timestamp, sync_status, error_message (if sync failed), and statistics (users_synced, groups_synced). Returns directory data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        directory_id: { type: 'number', description: 'The directory ID' }
      },
      required: ['directory_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_directory',
    description: 'Create a new directory integration to sync users/groups from external source. Required: name, directory_type (activedirectory, ldap, google, azure, okta). For AD/LDAP: provide host, port, base_dn, bind_dn, bind_password, use_ssl. For cloud directories: provide domain, client_id, client_secret (API credentials). Configure attribute_mappings to map external fields to OneLogin user attributes. Set sync_interval (hourly, daily, weekly). Returns created directory with ID and x-request-id. IMPORTANT: Test connection before enabling automatic sync.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Directory name' },
        directory_type: { type: 'string', description: 'Directory type (activedirectory, ldap, google, azure, okta)' },
        host: { type: 'string', description: 'LDAP/AD host (for on-premise directories)' },
        port: { type: 'number', description: 'LDAP/AD port (389 or 636 for SSL)' },
        base_dn: { type: 'string', description: 'Base DN for LDAP/AD searches' },
        bind_dn: { type: 'string', description: 'Bind DN for authentication' },
        bind_password: { type: 'string', description: 'Bind password' },
        use_ssl: { type: 'boolean', description: 'Use SSL/TLS for connection' }
      },
      required: ['name', 'directory_type'],
      additionalProperties: true
    }
  },
  {
    name: 'update_directory',
    description: 'Update an existing directory integration configuration. Can modify name, connection settings (host, port, credentials), sync configuration (filters, attribute mappings, sync_interval), and enabled status. Partial updates supported - only provide fields to change. IMPORTANT: Changing connection details may cause sync failures. Test connection after updates. Returns updated directory data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        directory_id: { type: 'number', description: 'The directory ID to update' },
        name: { type: 'string', description: 'New directory name' },
        host: { type: 'string', description: 'New LDAP/AD host' },
        bind_password: { type: 'string', description: 'New bind password' },
        sync_interval: { type: 'string', description: 'New sync interval (hourly, daily, weekly)' }
      },
      required: ['directory_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_directory',
    description: 'Permanently delete a directory integration. IMPORTANT: This stops all automatic syncing from the external directory. Users previously synced from this directory are NOT deleted from OneLogin but will no longer receive updates from the external source. Groups synced from this directory are removed. Use with caution in production. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        directory_id: { type: 'number', description: 'The directory ID to delete' }
      },
      required: ['directory_id'],
      additionalProperties: false
    }
  },
  {
    name: 'sync_directory',
    description: 'Manually trigger an immediate sync for a directory to pull latest users and groups from the external source. Normally directories sync automatically based on sync_interval, but use this for immediate updates (e.g., new employee started, urgent group membership change). Sync runs asynchronously - check directory status or last_sync timestamp to confirm completion. Returns sync job ID and x-request-id. Use get_directory to monitor sync progress.',
    inputSchema: {
      type: 'object',
      properties: {
        directory_id: { type: 'number', description: 'The directory ID to sync' }
      },
      required: ['directory_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_directories: listDirectories,
  get_directory: getDirectory,
  create_directory: createDirectory,
  update_directory: updateDirectory,
  delete_directory: deleteDirectory,
  sync_directory: syncDirectory
};
