# OneLogin MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that provides tools for interacting with OneLogin's API. This server enables Claude Code to manage OneLogin users, apps, and roles through conversational commands.

## Features

- **User Management** (5 tools): List, get, create, update, and delete users
- **App Management** (3 tools): List, get, and update applications
- **Role Management** (4 tools): List, get, assign, and remove roles
- **Event Management** (2 tools): List and get events
- **Group Management** (2 tools): List and get groups
- **Privilege Management** (1 tool): List privileges
- **Comprehensive Filtering**: Wildcard search, time-based filtering, custom fields
- **Flexible Pagination**: Both page numbers and cursor-based pagination
- **OAuth2 Authentication**: Automatic token management with caching
- **Multi-Environment Support**: Connect to multiple OneLogin instances (production, shadow, etc.)
- **Datadog Integration**: Every response includes `x-request-id` for tracing

## Quick Start

### 1. Installation

```bash
cd onelogin-mcp
bun install
```

### 2. Configuration

Run the interactive setup to configure your OneLogin servers:

```bash
bun run setup
```

The setup will ask for:
- **Server Name**: A friendly name (e.g., "Chicken", "Chicken-Shadow", "Production")
- **OneLogin URL**: Your subdomain URL (e.g., `https://chicken.onelogin.com`)
- **Client ID**: OAuth2 client ID from OneLogin API credentials
- **Client Secret**: OAuth2 client secret
- **Legacy API Key**: (Optional) For API v1 endpoints

Configuration is stored in `~/.config/onelogin-mcp/`:
- `servers.json`: All configured OneLogin servers
- `config.json`: Active server and preferences

### 3. Add to Claude Code

#### Option A: Single Environment

If you only need to connect to one OneLogin environment:

```bash
claude mcp add onelogin -- bun run /path/to/onelogin-mcp/index.js
```

The server will use the active server from `~/.config/onelogin-mcp/config.json`.

#### Option B: Multiple Environments (Recommended)

For production and non-production environments, add separate MCP server entries:

```bash
# Production environment
claude mcp add onelogin-prod \
  --env ONELOGIN_SERVER=Chicken \
  -- bun run /path/to/onelogin-mcp/index.js

# Shadow/test environment
claude mcp add onelogin-shadow \
  --env ONELOGIN_SERVER=Chicken-Shadow \
  -- bun run /path/to/onelogin-mcp/index.js
```

**Benefits of this approach:**
- Both environments available simultaneously in Claude Code
- Tools are prefixed with server name (e.g., `mcp__onelogin-prod__list_users`)
- No need to reconfigure or restart
- Follows standard MCP pattern (same as Jira, GitHub, etc.)

### 4. Usage in Claude Code

Start a new conversation and use natural language:

```
List OneLogin users in production
Show me app details for app ID 1443549 in shadow
Get role information for role 380586
```

## Available Tools

### User Management Tools

1. **list_users** - List users with optional filters
   - Filters: `email`, `firstname`, `lastname`, `status`, `limit`, `page`
   - Example: "List all active users"

2. **get_user** - Get detailed user information
   - Parameters: `user_id`
   - Example: "Get user details for ID 63697765"

3. **create_user** - Create a new user
   - Required: `email`, `firstname`, `lastname`
   - Optional: `username`
   - Example: "Create user john.doe@example.com"

4. **update_user** - Update existing user
   - Parameters: `user_id`, various user fields
   - Example: "Update user 12345 email to new@example.com"

5. **delete_user** - Delete a user
   - Parameters: `user_id`
   - Example: "Delete user 12345"

### App Management Tools

6. **list_apps** - List applications with optional filters
   - Filters: `name`, `connector_id`, `auth_method`, `limit`, `page`
   - Example: "List all SAML apps"

7. **get_app** - Get application details
   - Parameters: `app_id`
   - Example: "Show app details for ID 1443549"

8. **update_app** - Update application properties
   - Parameters: `app_id`, various app fields
   - Example: "Update app 1443549 name to 'New Name'"

### Role Management Tools

9. **list_roles** - List roles with optional filters
   - Filters: `name`, `limit`, `page`
   - Example: "List all roles"

10. **get_role** - Get role details including users and apps
    - Parameters: `role_id`
    - Example: "Get role details for ID 380586"

11. **assign_role_to_user** - Assign roles to a user
    - Parameters: `user_id`, `role_ids` (array)
    - Example: "Assign roles [123, 456] to user 789"

12. **remove_role_from_user** - Remove roles from a user
    - Parameters: `user_id`, `role_ids` (array)
    - Example: "Remove role 123 from user 789"

### Event Tools (API v1 - Rate Limited)

13. **list_events** - List events with optional filters
    - Filters: `since`, `until`, `event_type_id`, `user_id`, `client_id`, `directory_id`, `resolution`, `user_name`
    - Example: "List events since 2025-01-01"

14. **get_event** - Get event details by ID
    - Parameters: `event_id`
    - Example: "Get event details for ID abc123"

### Group Tools (API v1 - Rate Limited)

15. **list_groups** - List groups with optional filters
    - Filters: `name`, `reference`, `updated_since`
    - Supports wildcard search
    - Example: "List groups with name Engineering*"

16. **get_group** - Get group details by ID
    - Parameters: `group_id`
    - Example: "Get group details for ID 12345"

### Privilege Tools (API v1 - Rate Limited)

17. **list_privileges** - List all privileges
    - Example: "List all OneLogin privileges"

## Pagination and Filtering

### Pagination Methods

OneLogin API supports two pagination methods:

**1. Page Numbers (Traditional)**
```
List users page 2 with limit 100
```
Parameters: `page` and `limit`

**2. Cursor-Based (Recommended)**
```
List users with after_cursor eyJpZCI6MTIzfQ==
```
Parameters: `after_cursor` or `before_cursor`

### How Pagination Works

All list tools return pagination metadata:

```json
{
  "data": {
    "pagination": {
      "after_cursor": "eyJpZCI6MTIzfQ==",
      "before_cursor": null,
      "next_link": "https://...",
      "previous_link": null
    },
    "data": [...]
  }
}
```

**To get the next page:**
1. Extract `after_cursor` from the response
2. Use it in the next request: `list_users after_cursor eyJpZCI6MTIzfQ==`

### Filtering

All list tools support wildcard search with `*`:

```
List users with email *@onelogin.com
List apps with name AWS*
List groups with name Engineering*
```

### Common Parameters

All list tools support these common parameters:

- **Pagination**: `limit`, `page`, `after_cursor`, `before_cursor`
- **Sorting**: `sort` (e.g., `+firstname` or `-created_at`)
- **Field Selection**: `fields` (comma-separated list)
- **Time Filtering**: `updated_since` (ISO 8601 format)

### Examples

```
# Filter users by name with wildcard
List users with firstname John*

# Get next page using cursor
List users limit 50 after_cursor abc123

# Filter by time and sort
List users updated_since 2025-01-01 sort +email

# Select specific fields only
List users fields id,email,firstname limit 100
```

## Multi-Environment Configuration

### Server Configuration

All OneLogin servers are stored in `~/.config/onelogin-mcp/servers.json`:

```json
{
  "Chicken": {
    "url": "https://chicken.onelogin.com",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "legacy_key": "your_legacy_key"
  },
  "Chicken-Shadow": {
    "url": "https://chicken.onelogin-shadow01.com",
    "client_id": "shadow_client_id",
    "client_secret": "shadow_client_secret",
    "legacy_key": "shadow_legacy_key"
  }
}
```

### Environment Variable Override

The `ONELOGIN_SERVER` environment variable allows you to select which server to use:

```bash
# Use production
claude mcp add onelogin-prod \
  --env ONELOGIN_SERVER=Chicken \
  -- bun run /path/to/onelogin-mcp/index.js

# Use shadow
claude mcp add onelogin-shadow \
  --env ONELOGIN_SERVER=Chicken-Shadow \
  -- bun run /path/to/onelogin-mcp/index.js
```

### Managing Multiple Servers

```bash
# List all configured MCP servers
claude mcp list

# Get details about a specific server
claude mcp get onelogin-prod

# Remove a server
claude mcp remove onelogin-shadow -s local
```

## Response Format

All tools return responses in this format:

```json
{
  "success": true,
  "request_id": "68F194DE-0A0D05A2-55F8-0A0F6C42-01BB-62EAE-0008",
  "status": 200,
  "data": {
    // Tool-specific response data
  }
}
```

The `request_id` corresponds to the `x-request-id` header from OneLogin's API, enabling you to trace requests in Datadog logs.

## Authentication

### OAuth2 Client Credentials

The server uses OAuth2 client credentials flow for authentication:
- Tokens are cached with 10-hour expiry
- Automatic refresh with 30-second buffer before expiry
- Token cache stored in memory (not persisted)

### Preprod Cookie Support

For OneLogin preprod environments, set `use_preprod: true` in config:

```json
{
  "active_server": "Chicken-Shadow",
  "use_preprod": true
}
```

Or use the environment variable:

```bash
claude mcp add onelogin-preprod \
  --env ONELOGIN_SERVER=Preprod \
  --env ONELOGIN_USE_PREPROD=true \
  -- bun run /path/to/onelogin-mcp/index.js
```

## API Coverage

### Currently Implemented

**API v2 - No Rate Limits** (12 tools)
- ✅ Users: `/api/2/users` - List, get, create, update, delete
- ✅ Apps: `/api/2/apps` - List, get, update
- ✅ Roles: `/api/2/roles` - List, get, assign to user, remove from user

**API v1 - Rate Limited** (5 tools)
- ✅ Events: `/api/1/events` - List, get
- ✅ Groups: `/api/1/groups` - List, get
- ✅ Privileges: `/api/1/privileges` - List

## Troubleshooting

### Server Not Connecting

```bash
# Check server status
claude mcp list

# Verify server configuration
claude mcp get onelogin-prod

# Re-run setup to reconfigure
cd onelogin-mcp
bun run setup
```

### Wrong Environment

If you're connecting to the wrong environment:

```bash
# Check which server is being used
claude mcp get onelogin-prod

# Verify ONELOGIN_SERVER environment variable
# Should match a key in ~/.config/onelogin-mcp/servers.json
```

### Authentication Errors

1. Verify credentials in `~/.config/onelogin-mcp/servers.json`
2. Check that OAuth2 credentials are for API v2
3. Ensure client has necessary permissions in OneLogin

## Development

### Project Structure

```
onelogin-mcp/
├── index.js              # MCP server entry point
├── setup.js              # Interactive credential setup
├── lib/
│   ├── config.js         # Credential management
│   ├── onelogin-api.js   # OAuth2 client
│   └── tools/
│       ├── users.js      # User management tools (5 tools)
│       ├── apps.js       # App management tools (3 tools)
│       ├── roles.js      # Role management tools (4 tools)
│       ├── events.js     # Event management tools (2 tools)
│       ├── groups.js     # Group management tools (2 tools)
│       └── privileges.js # Privilege management tools (1 tool)
├── package.json
├── README.md
├── PROGRESS.md           # Development progress tracker
└── .gitignore
```

### Adding New Tools

1. Create tool implementation in `lib/tools/`
2. Export tool functions
3. Add tool definitions to `index.js`
4. Add tool handlers to `index.js`
5. Update README and PROGRESS.md

## License

MIT

## Support

For issues or questions, please file an issue in the repository.
