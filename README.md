# OneLogin MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server providing comprehensive access to the OneLogin API. Enables Claude Desktop and other MCP clients to manage users, apps, roles, authentication, and security settings.

## Overview

This server provides 187 tools covering a comprehensive set of supported OneLogin API endpoints:

- **Identity Management**: Users, roles, groups
- **Applications**: Apps, connectors, SAML, OAuth
- **Authentication**: MFA, sessions, risk rules
- **Security**: API authorization
- **Configuration**: Brands, login pages, mappings
- **Operations**: Events, reports, rate limits

All tools include comprehensive descriptions with warnings, best practices, and return data specifications.

## Installation

### Prerequisites

- OneLogin API credentials (OAuth2 client ID and secret)
- An AI client such as [Copilot CLI](https://github.com/features/copilot/cli/), [Claude Code](https://www.claude.com/product/claude-code) or [Claude Desktop](https://claude.ai/download)

### Setup

1. Install the package:

```bash
npm install -g @onelogin/onelogin-mcp
```

2. Configure OneLogin credentials:

```bash
npx onelogin-mcp-setup
```

Enter your OneLogin server details when prompted:
- Server name (e.g., "Production", "Shadow")
- OneLogin subdomain URL (e.g., `https://mycompany.onelogin.com`)
- OAuth2 client ID and secret

Configuration is stored in `~/.config/onelogin-mcp/servers.json`.

3. Add to Claude Desktop config:

Edit the config file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Single environment:**

```json
{
  "mcpServers": {
    "onelogin": {
      "command": "npx",
      "args": ["-y", "@onelogin/onelogin-mcp"]
    }
  }
}
```

**Multiple environments** (recommended for production/test separation):

```json
{
  "mcpServers": {
    "onelogin-prod": {
      "command": "npx",
      "args": ["-y", "@onelogin/onelogin-mcp"],
      "env": {
        "ONELOGIN_SERVER": "Production"
      }
    },
    "onelogin-shadow": {
      "command": "npx",
      "args": ["-y", "@onelogin/onelogin-mcp"],
      "env": {
        "ONELOGIN_SERVER": "Shadow"
      }
    }
  }
}
```

4. Restart Claude Desktop completely.

## Usage

Use natural language to interact with OneLogin:

```
List all users with email ending in @example.com
Get details for user ID 12345
Create a user john.doe@example.com with firstname John, lastname Doe
Assign roles [123, 456] to user 789
Generate MFA token for user 101112
List all SAML apps
```

Claude will select the appropriate tool, call the OneLogin API, and present results.

## API Coverage

All 187 tools are organized into 21 categories:

**Identity & Access** (79 tools)
- Users (30)
- Roles (16)
- Privileges (13)
- Groups (3)
- Mappings (17)

**Applications** (14 tools)
- Apps (10)
- Connectors (4)

**Authentication** (26 tools)
- MFA (11)
- Sessions (5)
- SAML (2)
- OAuth Tokens (2)
- Invite Links (6)

**Security** (41 tools)
- Risk Rules (9)
- Smart Hooks (11)
- API Authorization (21)

**Customization** (15 tools)
- Brands (8)
- Login Pages (7)

**Monitoring** (8 tools)
- Events (3)
- Reports (3)
- Rate Limits (2)

**Account** (4 tools)
- Account Settings (4)

## Configuration

### Multiple OneLogin Instances

Configure multiple servers in `~/.config/onelogin-mcp/servers.json`:

```json
{
  "Production": {
    "url": "https://company.onelogin.com",
    "client_id": "prod_client_id",
    "client_secret": "prod_secret"
  },
  "Shadow": {
    "url": "https://company.onelogin-shadow01.com",
    "client_id": "shadow_client_id",
    "client_secret": "shadow_secret"
  }
}
```

### Preprod Environment

For OneLogin preprod environments, add `use_preprod: true`:

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

## Response Format

All tools return structured responses:

```json
{
  "success": true,
  "request_id": "68F194DE-0A0D05A2-55F8-0A0F6C42-01BB-62EAE-0008",
  "status": 200,
  "data": {
    // Tool-specific data
  }
}
```

The `request_id` matches the `x-request-id` HTTP header for tracing in Datadog and OneLogin logs.

## Troubleshooting

### Server not appearing in Claude Desktop

1. Verify JSON config syntax
2. Ensure absolute path to `index.js`
3. Restart Claude Desktop completely (quit and reopen)

### "spawn bun ENOENT" error

Claude cannot find the Bun runtime. Solutions:

```bash
# Verify Bun is installed
which bun

# If not found, install Bun
curl -fsSL https://bun.sh/install | bash

# Or use full path in config
{
  "command": "/Users/yourname/.bun/bin/bun",
  "args": ["run", "/path/to/index.js"]
}
```

### Authentication errors

1. Verify credentials in `~/.config/onelogin-mcp/servers.json`
2. Ensure OAuth2 client has API permissions in OneLogin admin panel
3. Check client_id and client_secret are for API v2

### Wrong environment

Check the `ONELOGIN_SERVER` environment variable in Claude Desktop config matches a server name in `servers.json`.

## Project Structure

```
onelogin-mcp/
├── index.js                    # MCP server entry point
├── setup.js                    # Interactive credential setup
├── lib/
│   ├── config.js               # Credential management
│   ├── onelogin-api.js         # OAuth2 client with token caching
│   └── tools/
│       ├── registry.js         # Tool registry and dispatcher
│       ├── users.js            # User management (10 tools)
│       ├── roles.js            # Role management (13 tools)
│       ├── privileges.js       # Privilege management (11 tools)
│       ├── apps.js             # App management (7 tools)
│       ├── mfa.js              # MFA management (11 tools)
│       ├── mappings.js         # User mappings (14 tools)
│       ├── smart-hooks.js      # Smart Hooks (8 tools)
│       ├── risk-rules.js       # Risk rules (6 tools)
│       ├── api-authorization.js # OAuth scopes (17 tools)
│       ├── sessions.js         # Session tokens (5 tools)
│       ├── brands.js           # Branding (6 tools)
│       ├── connectors.js       # App catalog (3 tools)
│       ├── login-pages.js      # Custom login (5 tools)
│       ├── reports.js          # Analytics (3 tools)
│       ├── rate-limits.js      # API throttling (2 tools)
│       ├── account-settings.js # Global config (4 tools)
│       ├── saml.js             # SAML assertions (2 tools)
│       ├── invite-links.js     # Password resets (2 tools)
│       ├── oauth-tokens.js     # OAuth tokens (2 tools)
│       ├── events.js           # Audit logs (2 tools)
│       └── groups.js           # User groups (2 tools)
├── package.json
├── CONTRIBUTING.md
├── PROGRESS.md
└── README.md
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new tools.

Key conventions:
- Tool descriptions include warnings, best practices, and return data structure
- All modules export `tools` array and `handlers` object
- Registry auto-discovers tools from module imports

## Releasing

To publish a new version to npm:

1. **Merge your changes** to the `main` branch

2. **Create a GitHub Release**:
   - Go to [Releases](https://github.com/onelogin/onelogin-mcp/releases) → "Draft a new release"
   - Create a new tag with the version (e.g., `v1.1.0`)
   - Set the release title (e.g., "v1.1.0 - MFA API fixes")
   - Add release notes describing the changes
   - Click "Publish release"

3. **Automatic Publishing**: The GitHub Action will:
   - Extract the version from the release tag (strips `v` prefix)
   - Update `package.json` with the new version
   - Publish to npm under `@onelogin/onelogin-mcp`

**Version Format**: Use semantic versioning (`MAJOR.MINOR.PATCH`)
- `MAJOR`: Breaking API changes
- `MINOR`: New features, backward compatible
- `PATCH`: Bug fixes, backward compatible

**Manual Publishing** (if needed):
- Go to Actions → "Publish Package" → "Run workflow"
- Optionally specify a version override

## Support

- [GitHub Issues](https://github.com/onelogin/onelogin-mcp/issues)
- [OneLogin API Documentation](https://developers.onelogin.com/api-docs)
- [Model Context Protocol](https://modelcontextprotocol.io)

## License

MIT
