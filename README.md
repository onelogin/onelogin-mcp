# OneLogin MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that provides comprehensive access to OneLogin's API for user, role, app, MFA, and privilege management through Claude Desktop and other MCP clients.

## Features

### Complete OneLogin API Coverage (65 Tools)

- **User Management** (14 tools): CRUD operations, custom attributes, unlock, privileges
- **App Management** (7 tools): List, get, create, update, delete, parameters, users
- **Role Management** (13 tools): CRUD, assignments, apps, users, admins
- **MFA Management** (11 tools): Enrollment, verification, removal, token generation
- **Privilege Management** (13 tools): CRUD, role/user assignments (requires Delegated Administration)
- **SAML Assertions** (2 tools): Generate and verify with MFA support
- **Invite Links** (2 tools): Generate and send password reset links
- **Events** (2 tools): List and get audit logs
- **Groups** (2 tools): List and get user groups

### Key Features

- **High-Quality Tool Descriptions**: 72% of tools enhanced with rich contextual information, warnings, and best practices
- **OAuth2 Authentication**: Automatic token management with 10-hour caching
- **Multi-Environment Support**: Connect to multiple OneLogin instances (production, shadow, preprod)
- **Datadog Integration**: Every response includes `x-request-id` for distributed tracing
- **Flexible Filtering**: Wildcard search, time-based filtering, pagination
- **API v1 & v2 Support**: Automatic handling of rate-limited and modern endpoints

## Installation

### Prerequisites

- **Bun runtime**: Install from [bun.sh](https://bun.sh)
- **OneLogin API credentials**: OAuth2 client ID/secret from OneLogin admin panel
- **Claude Desktop**: Download from [claude.ai](https://claude.ai/download)

### 1. Clone Repository

```bash
cd ~/src  # or your preferred directory
git clone https://github.com/onelogin/onelogin-mcp.git
cd onelogin-mcp
bun install
```

### 2. Configure OneLogin Credentials

Run the interactive setup to configure your OneLogin server(s):

```bash
bun run setup
```

You'll need to provide:
- **Server Name**: Friendly identifier (e.g., "Production", "Shadow", "Chicken")
- **OneLogin URL**: Your subdomain URL (e.g., `https://mycompany.onelogin.com`)
- **Client ID**: OAuth2 client ID from OneLogin
- **Client Secret**: OAuth2 client secret
- **Legacy API Key**: (Optional) For API v1 endpoints requiring different auth

Configuration is stored in `~/.config/onelogin-mcp/`:
- `servers.json` - All configured OneLogin servers
- `config.json` - Active server and preferences

### 3. Add to Claude Desktop

#### Single Environment Setup

If you only need one OneLogin environment:

**macOS/Linux:**
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "onelogin": {
      "command": "bun",
      "args": ["run", "/Users/yourname/src/onelogin-mcp/index.js"]
    }
  }
}
```

**Windows:**
Edit `%APPDATA%\Claude\claude_desktop_config.json`

#### Multiple Environment Setup (Recommended)

For production and non-production environments:

```json
{
  "mcpServers": {
    "onelogin-prod": {
      "command": "bun",
      "args": ["run", "/Users/yourname/src/onelogin-mcp/index.js"],
      "env": {
        "ONELOGIN_SERVER": "Production"
      }
    },
    "onelogin-shadow": {
      "command": "bun",
      "args": ["run", "/Users/yourname/src/onelogin-mcp/index.js"],
      "env": {
        "ONELOGIN_SERVER": "Shadow"
      }
    }
  }
}
```

**Benefits:**
- Both environments available simultaneously
- Tools prefixed with server name (e.g., `mcp__onelogin-prod__list_users`)
- No need to reconfigure or restart
- Clear separation between production and test operations

### 4. Restart Claude Desktop

After editing the configuration, quit and restart Claude Desktop completely for changes to take effect.

## Usage

Start a conversation in Claude Desktop and use natural language to interact with OneLogin:

```
Show me all users in production with email ending in @onelogin.com
Get details for user ID 12345 in shadow
List all SAML apps
Create a user john.doe@example.com with roles [123, 456]
Generate an MFA token for user 789
Get privileges assigned to user 456
```

Claude will:
1. Select the appropriate tool based on your request
2. Call the OneLogin API through the MCP server
3. Present the results in a readable format
4. Suggest next steps or related operations

## Available Tools by Category

### User Management (14 tools)

| Tool | Description | Key Features |
|------|-------------|--------------|
| `list_users` | Get paginated user list | Filters, wildcard search, updated_since |
| `get_user` | Get user details | Complete user data including custom attributes |
| `create_user` | Create new user | **Warning**: No invite email sent automatically |
| `update_user` | Update user | Supports mappings sync, password validation |
| `delete_user` | Delete user | Permanent deletion |
| `unlock_user` | Unlock locked account | Checks lock status first |
| `get_user_apps` | List user's apps | Supports ignore_visibility parameter |
| `list_user_custom_attributes` | List custom attribute definitions | Account-wide attribute list |
| `get_user_custom_attribute` | Get custom attribute | Single attribute details |
| `create_user_custom_attribute` | Create custom attribute | Requires unique shortname |
| `update_user_custom_attribute` | Update custom attribute | Modify name and shortname |
| `delete_user_custom_attribute` | Delete custom attribute | **Warning**: Permanent, removes from all users |
| `get_user_privileges` | Get user's direct privileges | Requires Delegated Administration |
| `get_user_delegated_privileges` | Get effective privileges | Includes role-inherited privileges |

### App Management (7 tools)

| Tool | Description | Key Features |
|------|-------------|--------------|
| `list_apps` | List applications | 1000/page max, auth_method filter, wildcard search |
| `get_app` | Get app details | Complete app configuration |
| `create_app` | Create app | Requires connector_id |
| `update_app` | Update app | Modify name, description, notes |
| `delete_app` | Delete app | Permanent deletion |
| `delete_app_parameter` | Delete app parameter | Remove specific parameter |
| `get_app_users` | List app users | See all assigned users |

### Role Management (13 tools)

| Tool | Description | Key Features |
|------|-------------|--------------|
| `list_roles` | List roles | 650/page max, fields parameter for related data |
| `get_role` | Get role details | Complete role information |
| `create_role` | Create role | Can assign apps/users/admins in single call |
| `update_role` | Update role | Modify properties and assignments |
| `delete_role` | Delete role | Permanent deletion |
| `assign_role_to_user` | Assign roles | Array of role IDs, recommended over update_user |
| `remove_role_from_user` | Remove roles | Array of role IDs |
| `get_role_apps` | Get role's apps | See app assignments |
| `set_role_apps` | Set role apps | Replace all app assignments |
| `get_role_users` | Get role users | See user assignments |
| `get_role_admins` | Get role admins | See admin assignments |
| `add_role_admins` | Add admins | Array of admin user IDs |
| `remove_role_admin` | Remove admin | Single admin removal |

### MFA Management (11 tools)

| Tool | Description | Key Features |
|------|-------------|--------------|
| `get_available_factors` | List available MFA factors | Check before enrollment |
| `enroll_factor` | Initiate MFA enrollment | Returns pending/accepted, supports custom_message |
| `activate_factor` | Trigger MFA challenge | Sends OTP/push, returns verification_id |
| `verify_factor` | Verify OTP code | Authenticate SMS/Email/Authenticator |
| `verify_factor_poll` | Poll verification status | For push-based factors (Protect) |
| `verify_factor_enrollment_otp` | Verify enrollment OTP | Activate factor with OTP |
| `verify_factor_enrollment_poll` | Poll enrollment status | For Voice/Protect enrollment |
| `get_factor_status` | Get factor status | Check active/pending/disabled |
| `trigger_factor_verification` | Send push notification | OneLogin Protect verification |
| `remove_factor` | Remove enrolled factor | Requires device_id |
| `generate_mfa_token` | Generate recovery token | 72-hour max, for lost device recovery |

### Privilege Management (13 tools)

**Note**: All privilege tools require Delegated Administration subscription

| Tool | Description | Key Features |
|------|-------------|--------------|
| `list_privileges` | List privileges | Account privilege definitions |
| `get_privilege` | Get privilege | Returns policy statement |
| `create_privilege` | Create privilege | Policy language (Version, Statement, Effect, Action, Scope) |
| `update_privilege` | Update privilege | Modify name, description, statement |
| `delete_privilege` | Delete privilege | Unassigns from all users/roles |
| `get_privilege_roles` | Get privilege roles | Roles with this privilege |
| `assign_role_to_privilege` | Assign role | Grant privilege to role's users |
| `remove_role_from_privilege` | Remove role | Revoke privilege from role |
| `get_privilege_users` | Get privilege users | Direct user assignments |
| `assign_users_to_privilege` | Assign users | Direct assignment |
| `remove_user_from_privilege` | Remove user | Revoke direct assignment |

### SAML Assertions (2 tools)

| Tool | Description | Key Features |
|------|-------------|--------------|
| `generate_saml_assertion` | Generate SAML assertion | Returns assertion or MFA challenge |
| `verify_saml_assertion_factor` | Verify SAML MFA | Complete MFA for SAML authentication |

### Invite Links (2 tools)

| Tool | Description | Key Features |
|------|-------------|--------------|
| `generate_invite_link` | Generate invite link | **Warning**: Does NOT send email |
| `send_invite_link` | Email invite link | Sends to user or personal_email |

### Events (2 tools)

| Tool | Description | Key Features |
|------|-------------|--------------|
| `list_events` | List audit events | 50/page, millisecond-precision date filters |
| `get_event` | Get event details | Full event with risk scores |

### Groups (2 tools)

| Tool | Description | Key Features |
|------|-------------|--------------|
| `list_groups` | List groups | 50/page, wildcard search |
| `get_group` | Get group details | Group info (use get_user for membership) |

## Common Usage Patterns

### User Lifecycle

```
1. Create user: "Create user alice@example.com, Alice, Smith"
2. Assign roles: "Assign roles [380586, 380587] to user 12345"
3. Enroll MFA: "Enroll OneLogin SMS factor for user 12345"
4. Update attributes: "Update user 12345 title to 'Engineer'"
```

### MFA Enrollment Workflow

```
1. Check factors: "Get available MFA factors for user 12345"
2. Enroll: "Enroll Google Authenticator for user 12345"
3. Verify (if pending): "Verify factor enrollment with OTP 123456"
4. Check status: "Get factor status for user 12345"
```

### SAML with MFA

```
1. Request assertion: "Generate SAML assertion for user@example.com to app 999"
2. If MFA required: "Verify SAML assertion factor with device 123, state_token abc, OTP 456"
```

### Privilege Management

```
1. Create privilege: "Create privilege 'Help Desk' with users:Unlock action"
2. Assign to role: "Assign role 380586 to privilege abc-def-123"
3. Check user access: "Get delegated privileges for user 12345"
```

## Configuration

### Multiple OneLogin Instances

Configure multiple servers in `~/.config/onelogin-mcp/servers.json`:

```json
{
  "Production": {
    "url": "https://company.onelogin.com",
    "client_id": "prod_client_id",
    "client_secret": "prod_secret",
    "legacy_key": "optional_v1_key"
  },
  "Shadow": {
    "url": "https://company.onelogin-shadow01.com",
    "client_id": "shadow_client_id",
    "client_secret": "shadow_secret"
  }
}
```

### Preprod Support

For OneLogin preprod environments:

```json
{
  "Preprod": {
    "url": "https://preprod.onelogin.com",
    "client_id": "preprod_client_id",
    "client_secret": "preprod_secret",
    "use_preprod": true
  }
}
```

Or use environment variable in Claude Desktop config:

```json
{
  "onelogin-preprod": {
    "command": "bun",
    "args": ["run", "/path/to/index.js"],
    "env": {
      "ONELOGIN_SERVER": "Preprod",
      "ONELOGIN_USE_PREPROD": "true"
    }
  }
}
```

## Response Format

All tools return structured responses:

```json
{
  "success": true,
  "request_id": "68F194DE-0A0D05A2-55F8-0A0F6C42-01BB-62EAE-0008",
  "status": 200,
  "data": {
    // Tool-specific data (users, apps, roles, etc.)
  }
}
```

The `request_id` matches the `x-request-id` HTTP header, enabling request tracing in Datadog and OneLogin logs.

## Troubleshooting

### MCP Server Not Appearing in Claude Desktop

1. Check configuration file location:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Verify JSON syntax is valid
3. Ensure absolute path to `index.js`
4. Restart Claude Desktop completely (quit and relaunch)

### Authentication Errors

1. Verify credentials in `~/.config/onelogin-mcp/servers.json`
2. Ensure OAuth2 client has necessary OneLogin permissions
3. Check that client_id and client_secret are for API v2
4. For v1 endpoints, verify legacy_key is configured

### Wrong Environment

1. Check `ONELOGIN_SERVER` environment variable in Claude Desktop config
2. Verify server name matches a key in `servers.json`
3. Look at tool prefix (e.g., `mcp__onelogin-prod__` vs `mcp__onelogin-shadow__`)

### Rate Limiting

API v1 endpoints are rate-limited to 5000 requests/hour:
- Events (`list_events`, `get_event`)
- Groups (`list_groups`, `get_group`)
- Privileges (all privilege tools)
- Invite Links (`generate_invite_link`, `send_invite_link`)

If you hit rate limits, wait 1 hour or use API v2 endpoints where available.

## Distribution & Updates

### Installation Methods

**Git Clone (Current)**:
```bash
cd ~/src
git clone https://github.com/onelogin/onelogin-mcp.git
cd onelogin-mcp
bun install
```

**Future: npm Package**:
When published to npm registry:
```bash
npm install -g @onelogin/onelogin-mcp
# or
npx @onelogin/onelogin-mcp
```

### Updating

**Git Clone Users**:
```bash
cd onelogin-mcp
git pull origin main
bun install
```

**npm Users** (future):
```bash
npm update -g @onelogin/onelogin-mcp
```

After updating, restart Claude Desktop to load the new version.

### GitHub Releases

New versions will be tagged with semantic versioning (e.g., `v1.0.0`). No build artifacts needed - the repository contains runnable JavaScript.

## Development

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new tools with high-quality descriptions.

Key guidelines:
- Follow the description template (core purpose, behavioral context, warnings, best practices)
- Include critical warnings with "IMPORTANT:" or "WARNING:" prefix
- Specify pagination limits and return data structure
- Document subscription requirements and API version

### Project Structure

```
onelogin-mcp/
├── index.js                        # MCP server entry point (65 tool definitions)
├── setup.js                        # Interactive credential configuration
├── lib/
│   ├── config.js                   # Credential management
│   ├── onelogin-api.js             # OAuth2 client with token caching
│   └── tools/                      # Tool implementations
│       ├── users.js                # User management (14 functions)
│       ├── apps.js                 # App management (7 functions)
│       ├── roles.js                # Role management (13 functions)
│       ├── mfa.js                  # MFA management (11 functions)
│       ├── privileges.js           # Privilege management (13 functions)
│       ├── saml.js                 # SAML assertions (2 functions)
│       ├── invite-links.js         # Invite links (2 functions)
│       ├── events.js               # Events (2 functions)
│       └── groups.js               # Groups (2 functions)
├── package.json
├── CONTRIBUTING.md                 # Tool description quality guidelines
├── TOOL_DESCRIPTION_ANALYSIS.md    # Quality gap analysis
├── API_COVERAGE.md                 # API endpoint coverage tracker
├── PROGRESS.md                     # Development progress
└── README.md                       # This file
```

### Running Tests

```bash
# Interactive credential setup
bun run setup

# Validate syntax
node --check index.js
```

## API Coverage

### Implemented (65 tools)

- ✅ **Users (API v2)**: 14 tools - Complete CRUD, custom attributes, privileges
- ✅ **Apps (API v2)**: 7 tools - CRUD, parameters, users
- ✅ **Roles (API v2)**: 13 tools - CRUD, assignments, apps, users, admins
- ✅ **MFA (API v2)**: 11 tools - Full enrollment and verification workflow
- ✅ **Privileges (API v1)**: 13 tools - CRUD, role/user assignments
- ✅ **SAML Assertions (API v2)**: 2 tools - Generate and verify
- ✅ **Invite Links (API v1)**: 2 tools - Generate and send
- ✅ **Events (API v1)**: 2 tools - List and get audit logs
- ✅ **Groups (API v1)**: 2 tools - List and get

### Not Yet Implemented

- 📋 Mappings
- 📋 Policies
- 📋 API Auth
- 📋 Brand/Customization
- 📋 Connectors
- 📋 Webhooks
- 📋 Risk Rules

## Support

- **Issues**: [GitHub Issues](https://github.com/onelogin/onelogin-mcp/issues)
- **Documentation**: [OneLogin API Docs](https://developers.onelogin.com/api-docs)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io)

## License

MIT

---

**Quality Note**: 72% of tools (47/65) have been enhanced with rich contextual information including behavioral details, warnings, best practices, and workflow guidance to enable AI assistants to use them effectively.
