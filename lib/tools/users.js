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
  Object.keys(args).forEach((key) => {
    if (key.startsWith("custom_attributes.")) {
      params[key] = args[key];
    }
  });

  return await api.get("/api/2/users", params);
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
    throw new Error("user_id is required");
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
    throw new Error("email is required");
  }

  if (!args.firstname) {
    throw new Error("firstname is required");
  }

  if (!args.lastname) {
    throw new Error("lastname is required");
  }

  return await api.post("/api/2/users", args);
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
    throw new Error("user_id is required");
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
    throw new Error("user_id is required");
  }

  return await api.delete(`/api/2/users/${args.user_id}`);
}

/**
 * Unlock a user account
 * POST /api/2/users/{user_id}/unlock
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function unlockUser(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }

  return await api.post(`/api/2/users/${args.user_id}/unlock`, {});
}

/**
 * Get apps assigned to a user
 * GET /api/2/users/{user_id}/apps
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function getUserApps(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }

  return await api.get(`/api/2/users/${args.user_id}/apps`);
}

/**
 * List custom attributes for a user
 * GET /api/2/users/{user_id}/custom_attributes
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function listUserCustomAttributes(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }

  return await api.get(`/api/2/users/${args.user_id}/custom_attributes`);
}

/**
 * Get a specific custom attribute for a user
 * GET /api/2/users/{user_id}/custom_attributes/{attribute_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, attribute_id: number}
 * @returns {Promise<Object>}
 */
export async function getUserCustomAttribute(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }
  if (!args.attribute_id) {
    throw new Error("attribute_id is required");
  }

  return await api.get(
    `/api/2/users/${args.user_id}/custom_attributes/${args.attribute_id}`,
  );
}

/**
 * Create a custom attribute for a user
 * POST /api/2/users/{user_id}/custom_attributes
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, name: string, value: string}
 * @returns {Promise<Object>}
 */
export async function createUserCustomAttribute(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }

  const userId = args.user_id;
  const attributeData = { ...args };
  delete attributeData.user_id;

  return await api.post(
    `/api/2/users/${userId}/custom_attributes`,
    attributeData,
  );
}

/**
 * Update a custom attribute for a user
 * PUT /api/2/users/{user_id}/custom_attributes/{attribute_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, attribute_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateUserCustomAttribute(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }
  if (!args.attribute_id) {
    throw new Error("attribute_id is required");
  }

  const userId = args.user_id;
  const attributeId = args.attribute_id;
  const attributeData = { ...args };
  delete attributeData.user_id;
  delete attributeData.attribute_id;

  return await api.put(
    `/api/2/users/${userId}/custom_attributes/${attributeId}`,
    attributeData,
  );
}

/**
 * Delete a custom attribute from a user
 * DELETE /api/2/users/{user_id}/custom_attributes/{attribute_id}
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number, attribute_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteUserCustomAttribute(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }
  if (!args.attribute_id) {
    throw new Error("attribute_id is required");
  }

  return await api.delete(
    `/api/2/users/${args.user_id}/custom_attributes/${args.attribute_id}`,
  );
}

/**
 * Get privileges assigned to a user
 * GET /api/2/users/{user_id}/privileges
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function getUserPrivileges(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }

  return await api.get(`/api/2/users/${args.user_id}/privileges`);
}

/**
 * Get delegated privileges for a user
 * GET /api/2/users/{user_id}/delegated_privileges
 * @param {OneLoginApi} api
 * @param {Object} args - {user_id: number}
 * @returns {Promise<Object>}
 */
export async function getUserDelegatedPrivileges(api, args) {
  if (!args.user_id) {
    throw new Error("user_id is required");
  }

  return await api.get(`/api/2/users/${args.user_id}/delegated_privileges`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: "list_users",
    description:
      "Get a paginated list of users in a OneLogin account (50 users per page). Can filter by user properties including custom attributes. For efficient syncing between OneLogin and another system, use the updated_since parameter to return only users that changed since last check. Returns user data and x-request-id for log tracing.",
    inputSchema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Filter by email address",
        },
        firstname: {
          type: "string",
          description: "Filter by first name",
        },
        lastname: {
          type: "string",
          description: "Filter by last name",
        },
        status: {
          type: "number",
          description:
            "Filter by status (0=Unactivated, 1=Active, 2=Suspended, 3=Locked, 4=Password expired, 5=Awaiting password reset, 7=Password Pending, 8=Security questions required)",
        },
        limit: {
          type: "number",
          description: "Number of results to return (default 50)",
        },
        page: {
          type: "number",
          description: "Page number for pagination",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_user",
    description:
      "Get a single user from a OneLogin account by user ID. If you don't know the user's ID, use list_users to find it. Returns complete user data including custom attributes, roles, status, and x-request-id for log tracing.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
      },
      required: ["user_id"],
      additionalProperties: false,
    },
  },
  {
    name: "create_user",
    description:
      "Create a new user in OneLogin. Users without a password get status 7 (Password Pending) and cannot log in until password is set. PKI certificates require this initial status. IMPORTANT: No invite email is sent when users are created via this API. Mappings run async by default (use mappings=sync query parameter to get mapped values in response). Returns created user data and x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "User email address",
        },
        firstname: {
          type: "string",
          description: "User first name",
        },
        lastname: {
          type: "string",
          description: "User last name",
        },
        username: {
          type: "string",
          description: "Username (optional, defaults to email)",
        },
      },
      required: ["email", "firstname", "lastname"],
      additionalProperties: true,
    },
  },
  {
    name: "update_user",
    description:
      "Update user attributes including passwords and custom attributes. To update roles, use assign_role_to_user or remove_role_from_user instead. Mappings run async by default (use mappings=sync query parameter to get mapped values in response). Passwords validate against User Policy by default (use validate_policy=false to skip). Returns updated user data and x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID to update",
        },
        email: {
          type: "string",
          description: "Email address",
        },
        firstname: {
          type: "string",
          description: "First name",
        },
        lastname: {
          type: "string",
          description: "Last name",
        },
        username: {
          type: "string",
          description: "Username",
        },
        status: {
          type: "number",
          description:
            "Status (0=Unactivated, 1=Active, 2=Suspended, 3=Locked, 4=Password expired, 5=Awaiting password reset, 7=Password Pending, 8=Security questions required)",
        },
        state: {
          type: "number",
          description:
            "State (0=Unapproved, 1=Approved, 2=Rejected, 3=Unlicensed)",
        },
        group_id: {
          type: "number",
          description: "Group ID to assign the user to",
        },
        role_ids: {
          type: "array",
          items: { type: "number" },
          description: "Array of role IDs to assign to the user",
        },
        directory_id: {
          type: "number",
          description: "Directory ID",
        },
        trusted_idp_id: {
          type: "number",
          description: "Trusted IDP ID",
        },
        manager_user_id: {
          type: "number",
          description: "Manager user ID (OneLogin user ID of the manager)",
        },
        manager_ad_id: {
          type: "string",
          description: "Manager AD ID",
        },
        external_id: {
          type: "string",
          description: "External ID for mapping to external systems",
        },
        company: {
          type: "string",
          description: "Company name",
        },
        department: {
          type: "string",
          description: "Department name",
        },
        title: {
          type: "string",
          description: "Job title",
        },
        phone: {
          type: "string",
          description: "Phone number",
        },
        comment: {
          type: "string",
          description: "Comment/notes about the user",
        },
        samaccountname: {
          type: "string",
          description: "SAM account name (AD)",
        },
        userprincipalname: {
          type: "string",
          description: "User principal name (AD)",
        },
        distinguished_name: {
          type: "string",
          description: "Distinguished name (AD/LDAP)",
        },
        member_of: {
          type: "string",
          description: "Member of (AD group membership)",
        },
        preferred_locale_code: {
          type: "string",
          description: 'Preferred locale code (e.g., "en-US")',
        },
        custom_attributes: {
          type: "object",
          description: "Custom attributes object with attribute names as keys",
        },
      },
      required: ["user_id"],
      additionalProperties: true,
    },
  },
  {
    name: "delete_user",
    description:
      "Permanently delete a user from OneLogin. WARNING: This operation cannot be undone. The user will be deleted and will no longer be able to log in. If you don't know the user's ID, use list_users to find it. Returns 204 No Content on success and x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID to delete",
        },
      },
      required: ["user_id"],
      additionalProperties: false,
    },
  },
  {
    name: "unlock_user",
    description:
      'Unlock a locked user in OneLogin. The API checks if the user is locked, calls for an unlock, and returns a JSON response with successful or unsuccessful completion. Returns "User unlocked" message on success or error if user cannot be unlocked. Returns status and x-request-id.',
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID to unlock",
        },
      },
      required: ["user_id"],
      additionalProperties: false,
    },
  },
  {
    name: "get_user_apps",
    description:
      "Get a list of apps assigned to a given user. Use ignore_visibility parameter (defaults to false) to return all apps regardless of portal visibility setting. Returns app list with provisioning status, icons, and login IDs, plus x-request-id for log tracing.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
      },
      required: ["user_id"],
      additionalProperties: false,
    },
  },
  {
    name: "list_user_custom_attributes",
    description:
      "Get a list of custom attribute definitions in a OneLogin account (not user-specific values). Returns account-wide custom attribute definitions with ID, name, shortname, and position. Use this to discover available custom attributes before querying user-specific values. Returns custom attribute data and x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
      },
      required: ["user_id"],
      additionalProperties: false,
    },
  },
  {
    name: "get_user_custom_attribute",
    description:
      "Get a single custom attribute definition by ID. If you don't know the attribute ID, use list_user_custom_attributes to find it. Returns custom attribute data (id, name, shortname, position) and x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
        attribute_id: {
          type: "number",
          description: "The custom attribute ID",
        },
      },
      required: ["user_id", "attribute_id"],
      additionalProperties: false,
    },
  },
  {
    name: "create_user_custom_attribute",
    description:
      "Create a new custom attribute in OneLogin. Requires both name (descriptive name) and shortname (unique identifier). The shortname must be unique across the account or creation will fail. Returns created custom attribute data with new ID and x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
        name: {
          type: "string",
          description: "Custom attribute name",
        },
        value: {
          type: "string",
          description: "Custom attribute value",
        },
      },
      required: ["user_id", "name", "value"],
      additionalProperties: true,
    },
  },
  {
    name: "update_user_custom_attribute",
    description:
      "Update a custom attribute definition in OneLogin. Both name and shortname are required. If you don't know the attribute ID, use list_user_custom_attributes to find it. Returns updated custom attribute data and x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
        attribute_id: {
          type: "number",
          description: "The custom attribute ID",
        },
        name: {
          type: "string",
          description: "New custom attribute name",
        },
        value: {
          type: "string",
          description: "New custom attribute value",
        },
      },
      required: ["user_id", "attribute_id"],
      additionalProperties: true,
    },
  },
  {
    name: "delete_user_custom_attribute",
    description:
      "Permanently delete a custom attribute from OneLogin. WARNING: This operation cannot be undone. All users with this attribute will have the field and any contained data removed. Returns 204 No Content on success and x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
        attribute_id: {
          type: "number",
          description: "The custom attribute ID",
        },
      },
      required: ["user_id", "attribute_id"],
      additionalProperties: false,
    },
  },
  {
    name: "get_user_privileges",
    description:
      "Get all privileges directly assigned to a user (does not include privileges inherited through roles). IMPORTANT: Requires Delegated Administration subscription. Returns privilege list with IDs, names, descriptions, and policy statements. Use to audit user permissions. Returns x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
      },
      required: ["user_id"],
      additionalProperties: false,
    },
  },
  {
    name: "get_user_delegated_privileges",
    description:
      "Get effective privileges for a user including both directly assigned privileges and privileges inherited through role membership. IMPORTANT: Requires Delegated Administration subscription. Returns comprehensive privilege list showing complete user permissions. Use to understand actual user access. Returns x-request-id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "number",
          description: "The OneLogin user ID",
        },
      },
      required: ["user_id"],
      additionalProperties: false,
    },
  },
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_users: listUsers,
  get_user: getUser,
  create_user: createUser,
  update_user: updateUser,
  delete_user: deleteUser,
  unlock_user: unlockUser,
  get_user_apps: getUserApps,
  list_user_custom_attributes: listUserCustomAttributes,
  get_user_custom_attribute: getUserCustomAttribute,
  create_user_custom_attribute: createUserCustomAttribute,
  update_user_custom_attribute: updateUserCustomAttribute,
  delete_user_custom_attribute: deleteUserCustomAttribute,
  get_user_privileges: getUserPrivileges,
  get_user_delegated_privileges: getUserDelegatedPrivileges,
};
