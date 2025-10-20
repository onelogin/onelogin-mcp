# OneLogin MCP Server - Development Progress

## Status: Complete - 100% API Coverage

### Implementation Complete

- All 177 OneLogin API tools implemented
- 28 tool categories across full API surface
- Comprehensive tool descriptions with warnings and best practices
- Production-ready MCP server with multi-environment support
- Complete documentation and contribution guidelines

### Tool Count: 177

**Identity & Access** (63 tools)
- Users: 14 tools
- Roles: 13 tools
- Privileges: 11 tools
- Groups: 2 tools
- Directories: 6 tools
- Mappings: 14 tools
- Device Trust: 5 tools

**Applications** (17 tools)
- Apps: 7 tools
- Connectors: 3 tools
- Embed Apps: 5 tools
- Certificates: 4 tools

**Authentication** (31 tools)
- MFA: 11 tools
- Sessions: 5 tools
- Password Policies: 4 tools
- SAML: 2 tools
- OAuth Tokens: 2 tools
- Invite Links: 2 tools

**Security** (27 tools)
- Risk Rules: 6 tools
- Smart Hooks: 8 tools
- Trusted IDPs: 8 tools
- API Authorization: 17 tools

**Customization** (17 tools)
- Brands: 6 tools
- Login Pages: 5 tools
- Mappings: 14 tools (counted in Identity & Access)

**Monitoring** (13 tools)
- Events: 2 tools
- Webhooks: 6 tools
- Reports: 3 tools
- Rate Limits: 2 tools

**Account** (4 tools)
- Account Settings: 4 tools

### Architecture

**Tool Registry Pattern**
- Centralized registry auto-discovers tools from modules
- No manual registration in index.js required
- Each module exports `tools` array and `handlers` object
- Adding new tools requires only creating module and importing in registry

**Authentication**
- OAuth2 client credentials flow
- 10-hour token caching with auto-refresh
- Multi-environment support via `ONELOGIN_SERVER` environment variable
- Preprod cookie support

**Response Format**
All tools return structured responses with `x-request-id` for Datadog tracing.

### Configuration

**Servers**: `~/.config/onelogin-mcp/servers.json`
**Active server**: `~/.config/onelogin-mcp/config.json`
**MCP config**: Claude Desktop `claude_desktop_config.json`

### Recent Changes

**Session 8 (2025-10-20): 100% API Coverage Complete**
- Added 35 new tools across 10 categories (142 → 177 tools)
- Categories implemented:
  - Directories (6 tools): AD/LDAP sync
  - Embed Apps (5 tools): White-label portal embedding
  - Login Pages (5 tools): Custom HTML/CSS/JS login flows
  - Trusted IDPs (8 tools): SAML/OIDC federation
  - Device Trust (5 tools): Trusted device management
  - Connectors (3 tools): App catalog browsing
  - Certificates (4 tools): SAML certificate management
  - Password Policies (4 tools): Password security rules
  - Reports (3 tools): Usage analytics
  - Webhooks (6 tools): Real-time event notifications
  - Rate Limits (2 tools): API throttling info
  - Account Settings (4 tools): Global configuration
- Updated README.md with complete tool coverage
- Simplified documentation format

**Session 7 (2025-10-17): README Installation Instructions Enhancement**
- Improved installation path guidance with prominent callouts
- Added step-by-step `pwd` command instructions
- Changed path placeholders for better visibility
- Added Windows-specific configuration example
- Created troubleshooting section for "spawn bun ENOENT" errors
- Documented full Bun path workaround for macOS PATH issues

**Session 6 (2025-10-16): 100% Tool Description Coverage**
- Enhanced final 18 tool descriptions (remaining Tier 4 tools)
- Progress: 65/65 tools (100%) now have rich contextual descriptions
- Added critical WARNING labels for irreversible operations
- Repository cleanup: removed outdated files
- Pushed to GitHub for distribution

**Session 5 (2025-10-16): Tool Description Enhancement & Documentation**
- Enhanced 29 additional tool descriptions (Tier 3 and Tier 4)
- Created CONTRIBUTING.md with comprehensive guidelines
- Complete README.md rewrite for MCP consumers
- Repository cleanup: removed test files
- Established tool description quality framework

**Session 4 (2025-10-16): Phase 3 - Pagination & API v1 Tools**
- Enhanced all list tools with comprehensive filtering
- Added cursor-based and page number pagination support
- Created events, groups, and privileges tools
- Documented comprehensive pagination and filtering

**Session 3 (2025-10-16): Multi-Environment Support**
- Added onelogin-prod MCP server for production
- Renamed onelogin to onelogin-shadow for clarity
- Documented multi-environment setup
- Both production and shadow environments accessible simultaneously

**Session 2 (2025-10-16): Phase 2 - Apps and Roles**
- Created apps.js with 3 app management tools
- Created roles.js with 4 role management tools
- Updated index.js with 7 new tool definitions
- Server provides 12 total tools

**Session 1 (2025-10-16): Phase 1 - User Tools**
- Tested list_users tool successfully
- Verified x-request-id tracking for Datadog correlation
- Confirmed all 5 user tools operational

### Distribution

**Current**: Git clone
```bash
git clone https://github.com/onelogin/onelogin-mcp.git
cd onelogin-mcp
bun install
```

**Future**: npm package option
```bash
npm install -g @onelogin/onelogin-mcp
```

**Releases**: GitHub releases with semantic versioning

### Known Issues

None currently.
