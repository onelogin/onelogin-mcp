#!/usr/bin/env bun
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getActiveServer } from './lib/config.js';
import { OneLoginApi } from './lib/onelogin-api.js';
import { getToolDefinitions, callTool } from './lib/tools/registry.js';

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
    // Register available tools using the registry
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: getToolDefinitions()
    }));

    // Handle tool calls using the registry
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        const result = await callTool(this.api, name, args || {});

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
