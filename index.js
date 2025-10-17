#!/usr/bin/env bun
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getActiveServer } from './lib/config.js';
import { OneLoginApi } from './lib/onelogin-api.js';
import * as userTools from './lib/tools/users.js';
import * as appTools from './lib/tools/apps.js';
import * as roleTools from './lib/tools/roles.js';
import * as eventTools from './lib/tools/events.js';
import * as groupTools from './lib/tools/groups.js';
import * as privilegeTools from './lib/tools/privileges.js';
import * as mfaTools from './lib/tools/mfa.js';
import * as samlTools from './lib/tools/saml.js';
import * as inviteLinkTools from './lib/tools/invite-links.js';

class OneLoginMcpServer {
  constructor() {
    this.server = new Server(
      {
        name: 'onelogin-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Load server config and create API client
    try {
      const serverConfig = getActiveServer();
      this.api = new OneLoginApi(serverConfig);
      this.serverName = serverConfig.name;
    } catch (error) {
      console.error('Configuration error:', error.message);
      process.exit(1);
    }

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    // Handle both SIGINT and SIGTERM for proper shutdown
    const handleShutdown = async (signal) => {
      console.error(`Received ${signal}, shutting down gracefully...`);

      // Set a timeout to force exit if shutdown takes too long
      const forceExitTimeout = setTimeout(() => {
        console.error('Shutdown timeout reached, forcing exit');
        process.exit(1);
      }, 5000); // 5 second timeout

      try {
        await this.server.close();
        clearTimeout(forceExitTimeout);
        console.error('Shutdown complete');
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        clearTimeout(forceExitTimeout);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  }

  setupToolHandlers() {
    // Register available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_users',
          description: 'Get a paginated list of users in a OneLogin account (50 users per page). Can filter by user properties including custom attributes. For efficient syncing between OneLogin and another system, use the updated_since parameter to return only users that changed since last check. Returns user data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'Filter by email address'
              },
              firstname: {
                type: 'string',
                description: 'Filter by first name'
              },
              lastname: {
                type: 'string',
                description: 'Filter by last name'
              },
              status: {
                type: 'number',
                description: 'Filter by status (0=Unactivated, 1=Active, 2=Suspended, 3=Locked, 4=Password expired, 5=Awaiting password reset, 7=Password Pending, 8=Security questions required)'
              },
              limit: {
                type: 'number',
                description: 'Number of results to return (default 50)'
              },
              page: {
                type: 'number',
                description: 'Page number for pagination'
              }
            },
            additionalProperties: false
          }
        },
        {
          name: 'get_user',
          description: 'Get a single user from a OneLogin account by user ID. If you don\'t know the user\'s ID, use list_users to find it. Returns complete user data including custom attributes, roles, status, and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              }
            },
            required: ['user_id'],
            additionalProperties: false
          }
        },
        {
          name: 'create_user',
          description: 'Create a new user in OneLogin. Users without a password get status 7 (Password Pending) and cannot log in until password is set. PKI certificates require this initial status. IMPORTANT: No invite email is sent when users are created via this API. Mappings run async by default (use mappings=sync query parameter to get mapped values in response). Returns created user data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'User email address'
              },
              firstname: {
                type: 'string',
                description: 'User first name'
              },
              lastname: {
                type: 'string',
                description: 'User last name'
              },
              username: {
                type: 'string',
                description: 'Username (optional, defaults to email)'
              }
            },
            required: ['email', 'firstname', 'lastname'],
            additionalProperties: true
          }
        },
        {
          name: 'update_user',
          description: 'Update user attributes including passwords and custom attributes. To update roles, use assign_role_to_user or remove_role_from_user instead. Mappings run async by default (use mappings=sync query parameter to get mapped values in response). Passwords validate against User Policy by default (use validate_policy=false to skip). Returns updated user data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID to update'
              },
              email: {
                type: 'string',
                description: 'New email address'
              },
              firstname: {
                type: 'string',
                description: 'New first name'
              },
              lastname: {
                type: 'string',
                description: 'New last name'
              },
              status: {
                type: 'number',
                description: 'New status'
              }
            },
            required: ['user_id'],
            additionalProperties: true
          }
        },
        {
          name: 'delete_user',
          description: 'Delete a OneLogin user. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID to delete'
              }
            },
            required: ['user_id'],
            additionalProperties: false
          }
        },
        {
          name: 'unlock_user',
          description: 'Unlock a locked OneLogin user account. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID to unlock'
              }
            },
            required: ['user_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_user_apps',
          description: 'Get apps assigned to a user. Returns app list and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              }
            },
            required: ['user_id'],
            additionalProperties: false
          }
        },
        {
          name: 'list_user_custom_attributes',
          description: 'List custom attributes for a user. Returns custom attribute data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              }
            },
            required: ['user_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_user_custom_attribute',
          description: 'Get a specific custom attribute for a user. Returns custom attribute data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              attribute_id: {
                type: 'number',
                description: 'The custom attribute ID'
              }
            },
            required: ['user_id', 'attribute_id'],
            additionalProperties: false
          }
        },
        {
          name: 'create_user_custom_attribute',
          description: 'Create a custom attribute for a user. Returns created custom attribute data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              name: {
                type: 'string',
                description: 'Custom attribute name'
              },
              value: {
                type: 'string',
                description: 'Custom attribute value'
              }
            },
            required: ['user_id', 'name', 'value'],
            additionalProperties: true
          }
        },
        {
          name: 'update_user_custom_attribute',
          description: 'Update a custom attribute for a user. Returns updated custom attribute data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              attribute_id: {
                type: 'number',
                description: 'The custom attribute ID'
              },
              name: {
                type: 'string',
                description: 'New custom attribute name'
              },
              value: {
                type: 'string',
                description: 'New custom attribute value'
              }
            },
            required: ['user_id', 'attribute_id'],
            additionalProperties: true
          }
        },
        {
          name: 'delete_user_custom_attribute',
          description: 'Delete a custom attribute from a user. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              attribute_id: {
                type: 'number',
                description: 'The custom attribute ID'
              }
            },
            required: ['user_id', 'attribute_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_user_privileges',
          description: 'Get privileges assigned to a user. Returns privilege data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              }
            },
            required: ['user_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_user_delegated_privileges',
          description: 'Get delegated privileges for a user. Returns delegated privilege data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              }
            },
            required: ['user_id'],
            additionalProperties: false
          }
        },
        // Apps tools
        {
          name: 'list_apps',
          description: 'Get a list of all apps in a OneLogin account with pagination support (max 1000 per page). Can filter by connector_id or auth_method (0=Password, 1=OpenId, 2=SAML, 3=API, 4=Google, 6=Forms, 7=WSFED, 8=OpenId Connect). Use name parameter with wildcard (*) for partial name search (e.g., name=workday*). Returns app data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Filter by app name'
              },
              connector_id: {
                type: 'number',
                description: 'Filter by connector ID'
              },
              auth_method: {
                type: 'number',
                description: 'Filter by authentication method'
              },
              limit: {
                type: 'number',
                description: 'Number of results to return (default 50)'
              },
              page: {
                type: 'number',
                description: 'Page number for pagination'
              }
            },
            additionalProperties: false
          }
        },
        {
          name: 'get_app',
          description: 'Get detailed information about a specific OneLogin app by ID. Returns app data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              app_id: {
                type: 'number',
                description: 'The OneLogin app ID'
              }
            },
            required: ['app_id'],
            additionalProperties: false
          }
        },
        {
          name: 'update_app',
          description: 'Update an existing OneLogin app. Returns updated app data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              app_id: {
                type: 'number',
                description: 'The OneLogin app ID to update'
              },
              name: {
                type: 'string',
                description: 'New app name'
              },
              description: {
                type: 'string',
                description: 'New app description'
              },
              notes: {
                type: 'string',
                description: 'New app notes'
              }
            },
            required: ['app_id'],
            additionalProperties: true
          }
        },
        {
          name: 'create_app',
          description: 'Create a new OneLogin app. Returns created app data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              connector_id: {
                type: 'number',
                description: 'Connector ID for the app type'
              },
              name: {
                type: 'string',
                description: 'App name'
              },
              description: {
                type: 'string',
                description: 'App description'
              }
            },
            additionalProperties: true
          }
        },
        {
          name: 'delete_app',
          description: 'Delete an app. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              app_id: {
                type: 'number',
                description: 'The OneLogin app ID to delete'
              }
            },
            required: ['app_id'],
            additionalProperties: false
          }
        },
        {
          name: 'delete_app_parameter',
          description: 'Delete a parameter from an app. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              app_id: {
                type: 'number',
                description: 'The OneLogin app ID'
              },
              param_id: {
                type: 'number',
                description: 'The parameter ID to delete'
              }
            },
            required: ['app_id', 'param_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_app_users',
          description: 'Get users assigned to an app. Returns user list and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              app_id: {
                type: 'number',
                description: 'The OneLogin app ID'
              }
            },
            required: ['app_id'],
            additionalProperties: false
          }
        },
        // Roles tools
        {
          name: 'list_roles',
          description: 'Get a list of roles with pagination and sorting support (max 650 per page). Can filter by name, app_id, or app_name. Use fields parameter to include related data (apps, users, admins) in response. Returns role data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Filter by role name'
              },
              limit: {
                type: 'number',
                description: 'Number of results to return (default 50)'
              },
              page: {
                type: 'number',
                description: 'Page number for pagination'
              }
            },
            additionalProperties: false
          }
        },
        {
          name: 'get_role',
          description: 'Get detailed information about a specific OneLogin role by ID. Returns role data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID'
              }
            },
            required: ['role_id'],
            additionalProperties: false
          }
        },
        {
          name: 'assign_role_to_user',
          description: 'Assign one or more roles to a OneLogin user by providing an array of role IDs. This is the recommended way to manage user roles (rather than using update_user). Returns updated user data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              role_ids: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'Array of role IDs to assign to the user'
              }
            },
            required: ['user_id', 'role_ids'],
            additionalProperties: false
          }
        },
        {
          name: 'remove_role_from_user',
          description: 'Remove one or more roles from a OneLogin user. Returns updated user data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              role_ids: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'Array of role IDs to remove from the user'
              }
            },
            required: ['user_id', 'role_ids'],
            additionalProperties: false
          }
        },
        {
          name: 'create_role',
          description: 'Create a new role. Returns created role data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Role name'
              },
              apps: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'Array of app IDs to assign to the role'
              },
              users: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'Array of user IDs to assign to the role'
              }
            },
            required: ['name'],
            additionalProperties: true
          }
        },
        {
          name: 'update_role',
          description: 'Update an existing role. Returns updated role data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID to update'
              },
              name: {
                type: 'string',
                description: 'New role name'
              },
              apps: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'Array of app IDs to assign to the role'
              },
              users: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'Array of user IDs to assign to the role'
              }
            },
            required: ['role_id'],
            additionalProperties: true
          }
        },
        {
          name: 'delete_role',
          description: 'Delete a role. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID to delete'
              }
            },
            required: ['role_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_role_apps',
          description: 'Get apps assigned to a role. Returns app list and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID'
              }
            },
            required: ['role_id'],
            additionalProperties: false
          }
        },
        {
          name: 'set_role_apps',
          description: 'Set apps for a role (replaces existing apps). Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID'
              },
              app_ids: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'Array of app IDs to assign to the role'
              }
            },
            required: ['role_id', 'app_ids'],
            additionalProperties: false
          }
        },
        {
          name: 'get_role_users',
          description: 'Get users assigned to a role. Returns user list and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID'
              }
            },
            required: ['role_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_role_admins',
          description: 'Get admins assigned to a role. Returns admin list and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID'
              }
            },
            required: ['role_id'],
            additionalProperties: false
          }
        },
        {
          name: 'add_role_admins',
          description: 'Add admins to a role. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID'
              },
              admin_ids: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'Array of admin user IDs to add to the role'
              }
            },
            required: ['role_id', 'admin_ids'],
            additionalProperties: false
          }
        },
        {
          name: 'remove_role_admin',
          description: 'Remove an admin from a role. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              role_id: {
                type: 'number',
                description: 'The OneLogin role ID'
              },
              admin_id: {
                type: 'number',
                description: 'The admin user ID to remove from the role'
              }
            },
            required: ['role_id', 'admin_id'],
            additionalProperties: false
          }
        },
        // Events tools (API v1)
        {
          name: 'list_events',
          description: 'List OneLogin events with optional filters (API v1 - Rate Limited). Returns event data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              since: { type: 'string', description: 'Start date filter (ISO 8601)' },
              until: { type: 'string', description: 'End date filter (ISO 8601)' },
              event_type_id: { type: 'number', description: 'Filter by event type ID' },
              user_id: { type: 'number', description: 'Filter by user ID' },
              client_id: { type: 'string', description: 'Filter by client ID' },
              directory_id: { type: 'number', description: 'Filter by directory ID' },
              resolution: { type: 'string', description: 'Filter by resolution' },
              user_name: { type: 'string', description: 'Filter by username' },
              limit: { type: 'number', description: 'Results per page' },
              page: { type: 'number', description: 'Page number' },
              after_cursor: { type: 'string', description: 'Cursor for next page' },
              before_cursor: { type: 'string', description: 'Cursor for previous page' }
            },
            additionalProperties: false
          }
        },
        {
          name: 'get_event',
          description: 'Get a specific event by ID (API v1). Returns event data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              event_id: { type: 'string', description: 'The OneLogin event ID' }
            },
            required: ['event_id'],
            additionalProperties: false
          }
        },
        // Groups tools (API v1)
        {
          name: 'list_groups',
          description: 'List OneLogin groups with optional filters (API v1 - Rate Limited). Returns group data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Filter by group name (supports wildcards)' },
              reference: { type: 'string', description: 'Filter by reference' },
              updated_since: { type: 'string', description: 'Filter by update date (ISO 8601)' },
              limit: { type: 'number', description: 'Results per page' },
              page: { type: 'number', description: 'Page number' },
              after_cursor: { type: 'string', description: 'Cursor for next page' },
              before_cursor: { type: 'string', description: 'Cursor for previous page' }
            },
            additionalProperties: false
          }
        },
        {
          name: 'get_group',
          description: 'Get a specific group by ID (API v1). Returns group data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              group_id: { type: 'number', description: 'The OneLogin group ID' }
            },
            required: ['group_id'],
            additionalProperties: false
          }
        },
        // Privileges tools (API v1)
        {
          name: 'list_privileges',
          description: 'List OneLogin privileges (API v1 - Rate Limited). Returns privilege data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'number', description: 'Results per page' },
              page: { type: 'number', description: 'Page number' },
              after_cursor: { type: 'string', description: 'Cursor for next page' },
              before_cursor: { type: 'string', description: 'Cursor for previous page' }
            },
            additionalProperties: false
          }
        },
        // MFA tools
        {
          name: 'get_available_factors',
          description: 'Get available authentication factors for a user. Returns factor list and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              }
            },
            required: ['user_id'],
            additionalProperties: false
          }
        },
        {
          name: 'enroll_factor',
          description: 'Enroll a user in an authentication factor. Returns enrollment data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor (e.g., "Google Authenticator", "OneLogin SMS", "OneLogin Voice")'
              },
              display_name: {
                type: 'string',
                description: 'Display name for the factor'
              },
              verified: {
                type: 'boolean',
                description: 'Whether the factor is pre-verified'
              }
            },
            required: ['user_id', 'factor_type'],
            additionalProperties: true
          }
        },
        {
          name: 'verify_factor_enrollment_otp',
          description: 'Verify enrollment of an authentication factor using OTP. Returns verification status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor'
              },
              otp_token: {
                type: 'string',
                description: 'One-time password token'
              }
            },
            required: ['user_id', 'factor_type', 'otp_token'],
            additionalProperties: false
          }
        },
        {
          name: 'verify_factor_enrollment_poll',
          description: 'Verify enrollment of OneLogin Voice & Protect using polling. Returns verification status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor'
              }
            },
            required: ['user_id', 'factor_type'],
            additionalProperties: false
          }
        },
        {
          name: 'activate_factor',
          description: 'Activate an enrolled authentication factor. Returns activation status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor'
              }
            },
            required: ['user_id', 'factor_type'],
            additionalProperties: false
          }
        },
        {
          name: 'get_factor_status',
          description: 'Get enrolled authentication factor status for a user. Returns factor status and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor'
              }
            },
            required: ['user_id', 'factor_type'],
            additionalProperties: false
          }
        },
        {
          name: 'verify_factor',
          description: 'Verify an authentication factor using OTP or device ID. Returns verification status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor'
              },
              otp_token: {
                type: 'string',
                description: 'One-time password token'
              },
              device_id: {
                type: 'string',
                description: 'Device ID for push notifications'
              }
            },
            required: ['user_id', 'factor_type'],
            additionalProperties: true
          }
        },
        {
          name: 'verify_factor_poll',
          description: 'Verify an authentication factor using polling. Returns verification status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor'
              }
            },
            required: ['user_id', 'factor_type'],
            additionalProperties: false
          }
        },
        {
          name: 'trigger_factor_verification',
          description: 'Trigger authentication factor verification (sends push notification). Returns trigger status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor'
              }
            },
            required: ['user_id', 'factor_type'],
            additionalProperties: false
          }
        },
        {
          name: 'remove_factor',
          description: 'Remove an authentication factor from a user. Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              factor_type: {
                type: 'string',
                description: 'Type of authentication factor'
              }
            },
            required: ['user_id', 'factor_type'],
            additionalProperties: false
          }
        },
        {
          name: 'generate_mfa_token',
          description: 'Generate an MFA token for a user. Returns MFA token data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              user_id: {
                type: 'number',
                description: 'The OneLogin user ID'
              },
              reusable: {
                type: 'boolean',
                description: 'Whether the token is reusable'
              },
              expires_in: {
                type: 'number',
                description: 'Token expiration time in seconds'
              }
            },
            required: ['user_id'],
            additionalProperties: true
          }
        },
        // SAML Assertions tools
        {
          name: 'generate_saml_assertion',
          description: 'Generate a SAML assertion for a user. Returns SAML assertion data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              username_or_email: {
                type: 'string',
                description: 'Username or email address'
              },
              password: {
                type: 'string',
                description: 'User password'
              },
              app_id: {
                type: 'string',
                description: 'App ID to generate assertion for'
              },
              subdomain: {
                type: 'string',
                description: 'Account subdomain'
              },
              ip_address: {
                type: 'string',
                description: 'IP address (optional)'
              }
            },
            required: ['username_or_email', 'password', 'app_id', 'subdomain'],
            additionalProperties: false
          }
        },
        {
          name: 'verify_saml_assertion_factor',
          description: 'Verify a SAML assertion factor using MFA. Returns verification data and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              app_id: {
                type: 'string',
                description: 'App ID'
              },
              device_id: {
                type: 'string',
                description: 'Device ID for MFA'
              },
              state_token: {
                type: 'string',
                description: 'State token from initial assertion'
              },
              otp_token: {
                type: 'string',
                description: 'One-time password token (optional)'
              },
              do_not_notify: {
                type: 'boolean',
                description: 'Whether to skip notification (optional)'
              }
            },
            required: ['app_id', 'device_id', 'state_token'],
            additionalProperties: false
          }
        },
        // Invite Links tools (API v1)
        {
          name: 'generate_invite_link',
          description: 'Generate an invite link for a user (API v1 - Rate Limited). Returns invite link data and x-request-id.',
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
          description: 'Send an invite link to a user via email (API v1 - Rate Limited). Returns send status and x-request-id.',
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
        },
        // Privilege CRUD tools (API v1)
        {
          name: 'get_privilege',
          description: 'Get a specific privilege by ID (API v1 - Rate Limited). Returns privilege data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID'
              }
            },
            required: ['privilege_id'],
            additionalProperties: false
          }
        },
        {
          name: 'create_privilege',
          description: 'Create a new privilege (API v1 - Rate Limited). Returns created privilege data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Privilege name'
              }
            },
            required: ['name'],
            additionalProperties: true
          }
        },
        {
          name: 'update_privilege',
          description: 'Update an existing privilege (API v1 - Rate Limited). Returns updated privilege data and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID to update'
              },
              name: {
                type: 'string',
                description: 'New privilege name'
              }
            },
            required: ['privilege_id'],
            additionalProperties: true
          }
        },
        {
          name: 'delete_privilege',
          description: 'Delete a privilege (API v1 - Rate Limited). Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID to delete'
              }
            },
            required: ['privilege_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_privilege_roles',
          description: 'Get roles assigned to a privilege (API v1 - Rate Limited). Returns role list and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID'
              }
            },
            required: ['privilege_id'],
            additionalProperties: false
          }
        },
        {
          name: 'assign_role_to_privilege',
          description: 'Assign a role to a privilege (API v1 - Rate Limited). Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID'
              },
              role_id: {
                type: 'number',
                description: 'The role ID to assign'
              }
            },
            required: ['privilege_id', 'role_id'],
            additionalProperties: false
          }
        },
        {
          name: 'remove_role_from_privilege',
          description: 'Remove a role from a privilege (API v1 - Rate Limited). Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID'
              },
              role_id: {
                type: 'number',
                description: 'The role ID to remove'
              }
            },
            required: ['privilege_id', 'role_id'],
            additionalProperties: false
          }
        },
        {
          name: 'get_privilege_users',
          description: 'Get users assigned to a privilege (API v1 - Rate Limited). Returns user list and x-request-id for log tracing.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID'
              }
            },
            required: ['privilege_id'],
            additionalProperties: false
          }
        },
        {
          name: 'assign_users_to_privilege',
          description: 'Assign users to a privilege (API v1 - Rate Limited). Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID'
              },
              user_id: {
                type: 'number',
                description: 'The user ID to assign'
              }
            },
            required: ['privilege_id', 'user_id'],
            additionalProperties: false
          }
        },
        {
          name: 'remove_user_from_privilege',
          description: 'Remove a user from a privilege (API v1 - Rate Limited). Returns success status and x-request-id.',
          inputSchema: {
            type: 'object',
            properties: {
              privilege_id: {
                type: 'string',
                description: 'The OneLogin privilege ID'
              },
              user_id: {
                type: 'number',
                description: 'The user ID to remove'
              }
            },
            required: ['privilege_id', 'user_id'],
            additionalProperties: false
          }
        }
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        let result;

        switch (name) {
          case 'list_users':
            result = await userTools.listUsers(this.api, args || {});
            break;

          case 'get_user':
            result = await userTools.getUser(this.api, args);
            break;

          case 'create_user':
            result = await userTools.createUser(this.api, args);
            break;

          case 'update_user':
            result = await userTools.updateUser(this.api, args);
            break;

          case 'delete_user':
            result = await userTools.deleteUser(this.api, args);
            break;

          case 'unlock_user':
            result = await userTools.unlockUser(this.api, args);
            break;

          case 'get_user_apps':
            result = await userTools.getUserApps(this.api, args);
            break;

          case 'list_user_custom_attributes':
            result = await userTools.listUserCustomAttributes(this.api, args);
            break;

          case 'get_user_custom_attribute':
            result = await userTools.getUserCustomAttribute(this.api, args);
            break;

          case 'create_user_custom_attribute':
            result = await userTools.createUserCustomAttribute(this.api, args);
            break;

          case 'update_user_custom_attribute':
            result = await userTools.updateUserCustomAttribute(this.api, args);
            break;

          case 'delete_user_custom_attribute':
            result = await userTools.deleteUserCustomAttribute(this.api, args);
            break;

          case 'get_user_privileges':
            result = await userTools.getUserPrivileges(this.api, args);
            break;

          case 'get_user_delegated_privileges':
            result = await userTools.getUserDelegatedPrivileges(this.api, args);
            break;

          // Apps tools
          case 'list_apps':
            result = await appTools.listApps(this.api, args || {});
            break;

          case 'get_app':
            result = await appTools.getApp(this.api, args);
            break;

          case 'update_app':
            result = await appTools.updateApp(this.api, args);
            break;

          case 'create_app':
            result = await appTools.createApp(this.api, args);
            break;

          case 'delete_app':
            result = await appTools.deleteApp(this.api, args);
            break;

          case 'delete_app_parameter':
            result = await appTools.deleteAppParameter(this.api, args);
            break;

          case 'get_app_users':
            result = await appTools.getAppUsers(this.api, args);
            break;

          // Roles tools
          case 'list_roles':
            result = await roleTools.listRoles(this.api, args || {});
            break;

          case 'get_role':
            result = await roleTools.getRole(this.api, args);
            break;

          case 'assign_role_to_user':
            result = await roleTools.assignRoleToUser(this.api, args);
            break;

          case 'remove_role_from_user':
            result = await roleTools.removeRoleFromUser(this.api, args);
            break;

          case 'create_role':
            result = await roleTools.createRole(this.api, args);
            break;

          case 'update_role':
            result = await roleTools.updateRole(this.api, args);
            break;

          case 'delete_role':
            result = await roleTools.deleteRole(this.api, args);
            break;

          case 'get_role_apps':
            result = await roleTools.getRoleApps(this.api, args);
            break;

          case 'set_role_apps':
            result = await roleTools.setRoleApps(this.api, args);
            break;

          case 'get_role_users':
            result = await roleTools.getRoleUsers(this.api, args);
            break;

          case 'get_role_admins':
            result = await roleTools.getRoleAdmins(this.api, args);
            break;

          case 'add_role_admins':
            result = await roleTools.addRoleAdmins(this.api, args);
            break;

          case 'remove_role_admin':
            result = await roleTools.removeRoleAdmin(this.api, args);
            break;

          // Events tools
          case 'list_events':
            result = await eventTools.listEvents(this.api, args || {});
            break;

          case 'get_event':
            result = await eventTools.getEvent(this.api, args);
            break;

          // Groups tools
          case 'list_groups':
            result = await groupTools.listGroups(this.api, args || {});
            break;

          case 'get_group':
            result = await groupTools.getGroup(this.api, args);
            break;

          // Privileges tools
          case 'list_privileges':
            result = await privilegeTools.listPrivileges(this.api, args || {});
            break;

          // MFA tools
          case 'get_available_factors':
            result = await mfaTools.getAvailableFactors(this.api, args);
            break;

          case 'enroll_factor':
            result = await mfaTools.enrollFactor(this.api, args);
            break;

          case 'verify_factor_enrollment_otp':
            result = await mfaTools.verifyFactorEnrollmentOTP(this.api, args);
            break;

          case 'verify_factor_enrollment_poll':
            result = await mfaTools.verifyFactorEnrollmentPoll(this.api, args);
            break;

          case 'activate_factor':
            result = await mfaTools.activateFactor(this.api, args);
            break;

          case 'get_factor_status':
            result = await mfaTools.getFactorStatus(this.api, args);
            break;

          case 'verify_factor':
            result = await mfaTools.verifyFactor(this.api, args);
            break;

          case 'verify_factor_poll':
            result = await mfaTools.verifyFactorPoll(this.api, args);
            break;

          case 'trigger_factor_verification':
            result = await mfaTools.triggerFactorVerification(this.api, args);
            break;

          case 'remove_factor':
            result = await mfaTools.removeFactor(this.api, args);
            break;

          case 'generate_mfa_token':
            result = await mfaTools.generateMFAToken(this.api, args);
            break;

          // SAML Assertions tools
          case 'generate_saml_assertion':
            result = await samlTools.generateSAMLAssertion(this.api, args);
            break;

          case 'verify_saml_assertion_factor':
            result = await samlTools.verifySAMLAssertionFactor(this.api, args);
            break;

          // Invite Links tools
          case 'generate_invite_link':
            result = await inviteLinkTools.generateInviteLink(this.api, args);
            break;

          case 'send_invite_link':
            result = await inviteLinkTools.sendInviteLink(this.api, args);
            break;

          // Privilege CRUD tools
          case 'get_privilege':
            result = await privilegeTools.getPrivilege(this.api, args);
            break;

          case 'create_privilege':
            result = await privilegeTools.createPrivilege(this.api, args);
            break;

          case 'update_privilege':
            result = await privilegeTools.updatePrivilege(this.api, args);
            break;

          case 'delete_privilege':
            result = await privilegeTools.deletePrivilege(this.api, args);
            break;

          case 'get_privilege_roles':
            result = await privilegeTools.getPrivilegeRoles(this.api, args);
            break;

          case 'assign_role_to_privilege':
            result = await privilegeTools.assignRoleToPrivilege(this.api, args);
            break;

          case 'remove_role_from_privilege':
            result = await privilegeTools.removeRoleFromPrivilege(this.api, args);
            break;

          case 'get_privilege_users':
            result = await privilegeTools.getPrivilegeUsers(this.api, args);
            break;

          case 'assign_users_to_privilege':
            result = await privilegeTools.assignUsersToPrivilege(this.api, args);
            break;

          case 'remove_user_from_privilege':
            result = await privilegeTools.removeUserFromPrivilege(this.api, args);
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        // Return formatted response
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };

      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`OneLogin MCP server running (${this.serverName})`);
  }
}

const server = new OneLoginMcpServer();
server.run().catch(console.error);
