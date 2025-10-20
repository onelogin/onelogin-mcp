/**
 * OneLogin Device Trust Tools
 * API Reference: /api/2/devices
 *
 * Device Trust enables device-based authentication and conditional access.
 * Register and manage trusted devices to allow passwordless login or bypass MFA
 * for recognized devices while enforcing stricter controls for unknown devices.
 */

/**
 * List trusted devices
 * GET /api/2/devices
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listDevices(api, args = {}) {
  const params = {};

  if (args.user_id) params.user_id = args.user_id;
  if (args.device_type) params.device_type = args.device_type;
  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/devices', params);
}

/**
 * Get a specific device by ID
 * GET /api/2/devices/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {device_id: string}
 * @returns {Promise<Object>}
 */
export async function getDevice(api, args) {
  if (!args.device_id) {
    throw new Error('device_id is required');
  }

  return await api.get(`/api/2/devices/${args.device_id}`);
}

/**
 * Register a new trusted device
 * POST /api/2/devices
 * @param {OneLoginApi} api
 * @param {Object} args - Device information
 * @returns {Promise<Object>}
 */
export async function registerDevice(api, args) {
  if (!args.user_id) {
    throw new Error('user_id is required');
  }

  if (!args.device_name) {
    throw new Error('device_name is required');
  }

  return await api.post('/api/2/devices', args);
}

/**
 * Update a trusted device
 * PUT /api/2/devices/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {device_id: string, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateDevice(api, args) {
  if (!args.device_id) {
    throw new Error('device_id is required');
  }

  const deviceId = args.device_id;
  const updateData = { ...args };
  delete updateData.device_id;

  return await api.put(`/api/2/devices/${deviceId}`, updateData);
}

/**
 * Delete a trusted device
 * DELETE /api/2/devices/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {device_id: string}
 * @returns {Promise<Object>}
 */
export async function deleteDevice(api, args) {
  if (!args.device_id) {
    throw new Error('device_id is required');
  }

  return await api.delete(`/api/2/devices/${args.device_id}`);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_devices',
    description: 'Get a list of trusted devices registered in OneLogin. Trusted devices can bypass MFA requirements or enable passwordless authentication based on risk rules. Filter by user_id to see devices for specific user, or device_type (desktop, mobile, tablet). Returns device list with IDs, names, types, user ownership, registration dates, last used timestamps, trust status, and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'Filter by user ID' },
        device_type: { type: 'string', description: 'Filter by device type (desktop, mobile, tablet)' },
        limit: { type: 'number', description: 'Number of results to return' },
        page: { type: 'number', description: 'Page number for pagination' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_device',
    description: 'Get detailed information about a specific trusted device by ID. Returns complete device data including device_id, device_name (user-provided label), device_type, user_id (owner), platform (OS), browser, registration_date, last_used_at, trust_level, device_fingerprint (unique identifier), and security status. Use to audit device trust or troubleshoot authentication issues. Returns device data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: { type: 'string', description: 'The trusted device ID' }
      },
      required: ['device_id'],
      additionalProperties: false
    }
  },
  {
    name: 'register_device',
    description: 'Register a new trusted device for a user to enable device-based authentication. Required: user_id, device_name (user-friendly label like "John\'s MacBook"). Optionally provide device_type, platform, browser for better tracking. Device receives unique device_id. Use in conjunction with risk rules to allow MFA bypass for trusted devices. Returns registered device with device_id and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID to associate device with' },
        device_name: { type: 'string', description: 'User-friendly device name' },
        device_type: { type: 'string', description: 'Device type (desktop, mobile, tablet)' },
        platform: { type: 'string', description: 'Operating system' },
        browser: { type: 'string', description: 'Browser name' }
      },
      required: ['user_id', 'device_name'],
      additionalProperties: true
    }
  },
  {
    name: 'update_device',
    description: 'Update a trusted device configuration. Can modify device_name (rename device), trust_level, or metadata. Use to update device labels for better user experience or adjust trust settings. Partial updates supported - only provide fields to change. Returns updated device data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: { type: 'string', description: 'The trusted device ID to update' },
        device_name: { type: 'string', description: 'New device name' },
        trust_level: { type: 'string', description: 'New trust level' }
      },
      required: ['device_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_device',
    description: 'Remove a device from the trusted devices list. User will be required to re-register the device or complete full MFA on next login from that device. Use when device is lost, stolen, or no longer trusted. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: { type: 'string', description: 'The trusted device ID to delete' }
      },
      required: ['device_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_devices: listDevices,
  get_device: getDevice,
  register_device: registerDevice,
  update_device: updateDevice,
  delete_device: deleteDevice
};
