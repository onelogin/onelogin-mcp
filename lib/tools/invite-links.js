/**
 * OneLogin Invite Links Tools
 * API Reference: /api/2/invites (v2) and /api/1/users/invite_link (v1)
 *
 * Note: The v2 API endpoints are not documented in the API docs yet,
 * so we're using the v1 endpoints which are still functional.
 */

/**
 * Generate an invite link for a user
 * POST /api/1/users/invite_link/generate (API v1)
 * @param {OneLoginApi} api
 * @param {Object} args - {email: string, firstname?: string, lastname?: string, role_ids?: number[]}
 * @returns {Promise<Object>}
 */
export async function generateInviteLink(api, args) {
  if (!args.email) {
    throw new Error('email is required');
  }

  return await api.post('/api/1/users/invite_link/generate', args);
}

/**
 * Send an invite link to a user
 * POST /api/1/users/invite_link/send (API v1)
 * @param {OneLoginApi} api
 * @param {Object} args - {email: string, firstname?: string, lastname?: string, role_ids?: number[], personal_email?: string}
 * @returns {Promise<Object>}
 */
export async function sendInviteLink(api, args) {
  if (!args.email) {
    throw new Error('email is required');
  }

  return await api.post('/api/1/users/invite_link/send', args);
}

/**
 * Tool Definitions for MCP
 */
export const tools = [
  {
    name: 'generate_invite_link',
    description: 'Generate a password reset invite link for an existing user in OneLogin. Returns the link URL but does NOT send any email - use send_invite_link to email it. Provide link to user to enable them to set password and access OneLogin portal. Email parameter is case-sensitive. Returns invite link and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'User email address'
        },
        firstname: {
          type: 'string',
          description: 'User first name (optional)'
        },
        lastname: {
          type: 'string',
          description: 'User last name (optional)'
        },
        role_ids: {
          type: 'array',
          items: {
            type: 'number'
          },
          description: 'Array of role IDs to assign (optional)'
        }
      },
      required: ['email'],
      additionalProperties: false
    }
  },
  {
    name: 'send_invite_link',
    description: 'Send a password reset invite link email to an existing user in OneLogin. User clicks link to set password and access OneLogin portal. Email parameter is case-sensitive. Use personal_email to send to different address than user\'s OneLogin email. Returns success message with recipient email and x-request-id (API v1 - Rate Limited).',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'User email address'
        },
        firstname: {
          type: 'string',
          description: 'User first name (optional)'
        },
        lastname: {
          type: 'string',
          description: 'User last name (optional)'
        },
        role_ids: {
          type: 'array',
          items: {
            type: 'number'
          },
          description: 'Array of role IDs to assign (optional)'
        },
        personal_email: {
          type: 'string',
          description: 'Personal email to send invite to (optional)'
        }
      },
      required: ['email'],
      additionalProperties: false
    }
  }
];

/**
 * Tool Handlers
 */
export const handlers = {
  generate_invite_link: generateInviteLink,
  send_invite_link: sendInviteLink
};
