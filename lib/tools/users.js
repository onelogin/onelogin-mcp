/**
 * OneLogin User Management Tools
 * Based on ol_cli scripts in users/ directory
 */

/**
 * List OneLogin users
 * Reference: ol_cli/users/list.sh -> GET /api/2/users
 * Supports wildcard search with * (e.g., email=katinka*)
 * @param {OneLoginApi} api
 * @param {Object} args - Filters and pagination
 * @returns {Promise<Object>}
 */
export async function listUsers(api, args = {}) {
  // Build query parameters from args
  const params = {};

  // Filter parameters
  if (args.directory_id) params.directory_id = args.directory_id;
  if (args.email) params.email = args.email;
  if (args.external_id) params.external_id = args.external_id;
  if (args.firstname) params.firstname = args.firstname;
  if (args.lastname) params.lastname = args.lastname;
  if (args.id) params.id = args.id;
  if (args.manager_ad_id) params.manager_ad_id = args.manager_ad_id;
  if (args.role_id) params.role_id = args.role_id;
  if (args.samaccountname) params.samaccountname = args.samaccountname;
  if (args.since) params.since = args.since;
  if (args.until) params.until = args.until;
  if (args.username) params.username = args.username;
  if (args.userprincipalname) params.userprincipalname = args.userprincipalname;
  if (args.status !== undefined) params.status = args.status;

  // Display and sorting parameters
  if (args.fields) params.fields = args.fields;
  if (args.sort) params.sort = args.sort;
  if (args.limit) params.limit = args.limit;

  // Pagination: support both page numbers and cursors
  if (args.page) params.page = args.page;
  if (args.after_cursor) params.after_cursor = args.after_cursor;
  if (args.before_cursor) params.before_cursor = args.before_cursor;

  // Custom attributes (pass through any custom_attributes.* parameters)
  Object.keys(args).forEach(key => {
    if (key.startsWith('custom_attributes.')) {
      params[key] = args[key];
    }
  });

  return await api.get('/api/2/users', params);
}

/**
 * Get a specific user by ID
 * Reference: ol_cli/users/get.sh -> GET /api/2/users/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function getUser(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  return await api.get(`/api/2/users/${args.user_id}`);
}

/**
 * Create a new user
 * Reference: ol_cli/users/create.sh -> POST /api/2/users
 * @param {OneLoginApi} api
 * @param {Object} args - User data (email, firstname, lastname, username, etc.)
 * @returns {Promise<Object>}
 */
export async function createUser(api, args) {
  if (!args.email) {
    throw new Error('email is required');
  }

  if (!args.firstname) {
    throw new Error('firstname is required');
  }

  if (!args.lastname) {
    throw new Error('lastname is required');
  }

  return await api.post('/api/2/users', args);
}

/**
 * Update an existing user
 * Reference: ol_cli/users/update.sh -> PUT /api/2/users/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateUser(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  const userId = args.user_id;
  const updateData = { ...args };
  delete updateData.user_id;

  return await api.put(`/api/2/users/${userId}`, updateData);
}

/**
 * Delete a user
 * Reference: ol_cli/users/delete.sh -> DELETE /api/2/users/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteUser(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  return await api.delete(`/api/2/users/${args.user_id}`);
}
