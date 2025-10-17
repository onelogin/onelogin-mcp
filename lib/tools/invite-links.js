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
