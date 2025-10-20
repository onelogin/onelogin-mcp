/**
 * OneLogin MCP Tool Registry
 *
 * Centralized registry that collects tool definitions and handlers from all modules.
 * This eliminates the need for manual tool definitions and switch statements in index.js.
 *
 * Supports both:
 * - New format: modules export { tools: [...], handlers: {...} }
 * - Legacy format: modules export functions directly (requires toolDefinitions.js)
 */

import * as userTools from './users.js';
import * as appTools from './apps.js';
import * as roleTools from './roles.js';
import * as eventTools from './events.js';
import * as groupTools from './groups.js';
import * as privilegeTools from './privileges.js';
import * as mfaTools from './mfa.js';
import * as samlTools from './saml.js';
import * as inviteLinkTools from './invite-links.js';
import * as oauthTokenTools from './oauth-tokens.js';
import { legacyToolDefinitions, legacyHandlerMap } from './toolDefinitions.js';

/**
 * Tool module registry
 * Modules can be in new format (with tools/handlers) or legacy format (direct exports)
 */
const toolModules = [
  userTools,
  appTools,
  roleTools,
  eventTools,
  groupTools,
  privilegeTools,
  mfaTools,
  samlTools,
  inviteLinkTools,
  oauthTokenTools,
];

/**
 * Get all tool definitions for MCP ListToolsRequestSchema
 * @returns {Array} Array of tool definition objects
 */
export function getToolDefinitions() {
  const definitions = [];

  // Collect definitions from new-style modules
  for (const module of toolModules) {
    if (module.tools && Array.isArray(module.tools)) {
      definitions.push(...module.tools);
    }
  }

  // Add legacy tool definitions
  definitions.push(...legacyToolDefinitions);

  return definitions;
}

/**
 * Call a tool by name with given arguments
 * @param {OneLoginApi} api - API client instance
 * @param {string} name - Tool name
 * @param {Object} args - Tool arguments
 * @returns {Promise<Object>} Tool result
 */
export async function callTool(api, name, args) {
  // Try new-style module handlers first
  for (const module of toolModules) {
    if (module.handlers && module.handlers[name]) {
      return await module.handlers[name](api, args);
    }
  }

  // Fall back to legacy handler map
  if (legacyHandlerMap[name]) {
    return await legacyHandlerMap[name](api, args);
  }

  throw new Error(`Unknown tool: ${name}`);
}
