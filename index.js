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
          description: 'List OneLogin users with optional filters. Returns user data and x-request-id for log tracing.',
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
          description: 'Get detailed information about a specific OneLogin user by ID. Returns user data and x-request-id for log tracing.',
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
          description: 'Create a new OneLogin user. Returns created user data and x-request-id.',
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
          description: 'Update an existing OneLogin user. Returns updated user data and x-request-id.',
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
        // Apps tools
        {
          name: 'list_apps',
          description: 'List OneLogin apps with optional filters. Returns app data and x-request-id for log tracing.',
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
        // Roles tools
        {
          name: 'list_roles',
          description: 'List OneLogin roles with optional filters. Returns role data and x-request-id for log tracing.',
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
          description: 'Assign one or more roles to a OneLogin user. Returns updated user data and x-request-id.',
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
