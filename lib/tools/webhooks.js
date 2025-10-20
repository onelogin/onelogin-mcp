/**
 * OneLogin Webhooks Tools
 * API Reference: /api/2/webhooks
 *
 * Webhooks enable real-time event notifications from OneLogin to your applications.
 * Configure webhooks to receive HTTP callbacks when users login, apps are accessed,
 * accounts are locked, and other security events occur.
 */

/**
 * List all webhooks
 * GET /api/2/webhooks
 * @param {OneLoginApi} api
 * @param {Object} args - Optional filters
 * @returns {Promise<Object>}
 */
export async function listWebhooks(api, args = {}) {
  const params = {};

  if (args.limit) params.limit = args.limit;
  if (args.page) params.page = args.page;

  return await api.get('/api/2/webhooks', params);
}

/**
 * Get a specific webhook by ID
 * GET /api/2/webhooks/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {webhook_id: number}
 * @returns {Promise<Object>}
 */
export async function getWebhook(api, args) {
  if (!args.webhook_id) {
    throw new Error('webhook_id is required');
  }

  return await api.get(`/api/2/webhooks/${args.webhook_id}`);
}

/**
 * Create a new webhook
 * POST /api/2/webhooks
 * @param {OneLoginApi} api
 * @param {Object} args - Webhook configuration
 * @returns {Promise<Object>}
 */
export async function createWebhook(api, args) {
  if (!args.url) {
    throw new Error('url is required');
  }

  if (!args.events || !Array.isArray(args.events) || args.events.length === 0) {
    throw new Error('events array is required and must not be empty');
  }

  return await api.post('/api/2/webhooks', args);
}

/**
 * Update an existing webhook
 * PUT /api/2/webhooks/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {webhook_id: number, ...fields to update}
 * @returns {Promise<Object>}
 */
export async function updateWebhook(api, args) {
  if (!args.webhook_id) {
    throw new Error('webhook_id is required');
  }

  const webhookId = args.webhook_id;
  const updateData = { ...args };
  delete updateData.webhook_id;

  return await api.put(`/api/2/webhooks/${webhookId}`, updateData);
}

/**
 * Delete a webhook
 * DELETE /api/2/webhooks/{id}
 * @param {OneLoginApi} api
 * @param {Object} args - {webhook_id: number}
 * @returns {Promise<Object>}
 */
export async function deleteWebhook(api, args) {
  if (!args.webhook_id) {
    throw new Error('webhook_id is required');
  }

  return await api.delete(`/api/2/webhooks/${args.webhook_id}`);
}

/**
 * Test a webhook
 * POST /api/2/webhooks/{id}/test
 * @param {OneLoginApi} api
 * @param {Object} args - {webhook_id: number}
 * @returns {Promise<Object>}
 */
export async function testWebhook(api, args) {
  if (!args.webhook_id) {
    throw new Error('webhook_id is required');
  }

  return await api.post(`/api/2/webhooks/${args.webhook_id}/test`, {});
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'list_webhooks',
    description: 'Get a list of all webhooks configured in OneLogin. Webhooks send real-time HTTP notifications to your applications when events occur (user login, app access, account lock, etc.). Returns webhook list with IDs, names, target URLs, subscribed event types, enabled status, delivery statistics (success/failure counts), and last_delivery timestamp. Use to audit event integrations. Returns webhooks array and x-request-id.',
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
    name: 'get_webhook',
    description: 'Get detailed configuration of a specific webhook by ID. Returns complete webhook settings including name, url (endpoint that receives events), events (array of subscribed event types: user.created, user.updated, user.deleted, user.login, user.logout, app.accessed, account.locked, mfa.enrolled, etc.), enabled status, content_type (application/json), secret (for signature verification), retry_policy (max_attempts, backoff_strategy), delivery_stats (success_count, failure_count, last_success, last_failure), and error_messages. Returns webhook data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        webhook_id: { type: 'number', description: 'The webhook ID' }
      },
      required: ['webhook_id'],
      additionalProperties: false
    }
  },
  {
    name: 'create_webhook',
    description: 'Create a new webhook to receive real-time event notifications. Required: url (HTTPS endpoint), events (array of event types to subscribe to). Available events: user.created, user.updated, user.deleted, user.login, user.logout, user.locked, app.created, app.updated, app.accessed, mfa.enrolled, mfa.challenged, role.assigned, group.membership_changed, password.changed, session.created, risk.detected, etc. Optionally provide name (descriptive label), secret (for HMAC signature verification), enabled (default true). OneLogin sends POST requests with JSON payload. Returns created webhook with ID and x-request-id. IMPORTANT: Endpoint must return 2xx status within 10 seconds or delivery is retried.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'HTTPS endpoint URL to receive webhook events' },
        events: { type: 'array', items: { type: 'string' }, description: 'Array of event types to subscribe to' },
        name: { type: 'string', description: 'Webhook name (optional)' },
        secret: { type: 'string', description: 'Secret for HMAC signature verification (optional)' },
        enabled: { type: 'boolean', description: 'Whether webhook is enabled (default true)' }
      },
      required: ['url', 'events'],
      additionalProperties: true
    }
  },
  {
    name: 'update_webhook',
    description: 'Update an existing webhook configuration. Can modify name, url, events (array of subscribed event types), enabled status, secret, and retry settings. Partial updates supported - only provide fields to change. IMPORTANT: Changing URL or events takes effect immediately. Test webhook after updates to ensure endpoint is reachable. Returns updated webhook data and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        webhook_id: { type: 'number', description: 'The webhook ID to update' },
        url: { type: 'string', description: 'New endpoint URL' },
        events: { type: 'array', items: { type: 'string' }, description: 'New array of event types' },
        name: { type: 'string', description: 'New webhook name' },
        enabled: { type: 'boolean', description: 'New enabled status' },
        secret: { type: 'string', description: 'New secret for signature verification' }
      },
      required: ['webhook_id'],
      additionalProperties: true
    }
  },
  {
    name: 'delete_webhook',
    description: 'Permanently delete a webhook. Stops all event notifications to the configured endpoint immediately. Use when endpoint is decommissioned or integration is no longer needed. Returns 204 No Content on success and x-request-id.',
    inputSchema: {
      type: 'object',
      properties: {
        webhook_id: { type: 'number', description: 'The webhook ID to delete' }
      },
      required: ['webhook_id'],
      additionalProperties: false
    }
  },
  {
    name: 'test_webhook',
    description: 'Send a test event to a webhook to verify endpoint is reachable and configured correctly. OneLogin sends sample event payload to the webhook URL and reports delivery success/failure. Use to validate webhook configuration before enabling or after making changes. Returns test result with status (success/failure), http_status_code received from endpoint, response_time, error_message (if failed), and x-request-id. IMPORTANT: Endpoint must return 2xx status code for test to pass.',
    inputSchema: {
      type: 'object',
      properties: {
        webhook_id: { type: 'number', description: 'The webhook ID to test' }
      },
      required: ['webhook_id'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  list_webhooks: listWebhooks,
  get_webhook: getWebhook,
  create_webhook: createWebhook,
  update_webhook: updateWebhook,
  delete_webhook: deleteWebhook,
  test_webhook: testWebhook
};
