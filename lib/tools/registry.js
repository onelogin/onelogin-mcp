/**
 * OneLogin MCP Tool Registry
 *
 * Centralized registry that collects tool definitions and handlers from all modules.
 * This eliminates the need for manual tool definitions and switch statements in index.js.
 *
 * Each module exports:
 * - tools: Array of tool definition objects for MCP
 * - handlers: Object mapping tool names to handler functions
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
import * as mappingTools from './mappings.js';
import * as smartHookTools from './smart-hooks.js';
import * as riskRuleTools from './risk-rules.js';
import * as apiAuthTools from './api-authorization.js';
import * as sessionTools from './sessions.js';
import * as brandTools from './brands.js';
import * as connectorTools from './connectors.js';
import * as reportTools from './reports.js';
import * as rateLimitTools from './rate-limits.js';
import * as accountSettingsTools from './account-settings.js';

/**
 * Tool module registry
 * All modules export { tools: [...], handlers: {...} }
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
  mappingTools,
  smartHookTools,
  riskRuleTools,
  apiAuthTools,
  sessionTools,
  brandTools,
  connectorTools,
  reportTools,
  rateLimitTools,
  accountSettingsTools,
];

/**
 * Get all tool definitions for MCP ListToolsRequestSchema
 * @returns {Array} Array of tool definition objects
 */
export function getToolDefinitions() {
  const definitions = [];

  // Collect definitions from all modules
  for (const module of toolModules) {
    if (module.tools && Array.isArray(module.tools)) {
      definitions.push(...module.tools);
    }
  }

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
  // Find and call the appropriate handler
  for (const module of toolModules) {
    if (module.handlers && module.handlers[name]) {
      return await module.handlers[name](api, args);
    }
  }

  throw new Error(`Unknown tool: ${name}`);
}
