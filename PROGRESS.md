# OneLogin MCP Server - Development Progress

## Status: Phase 3 Complete ✓

### What's Working
- ✅ Project structure with Bun runtime
- ✅ Standalone credential management at `~/.config/onelogin-mcp/`
- ✅ Interactive setup script (`bun run setup`)
- ✅ OAuth2 authentication client with token caching
- ✅ MCP server connected to Claude Code
- ✅ 5 user management tools (API v2)
- ✅ 3 app management tools (API v2)
- ✅ 4 role management tools (API v2)
- ✅ 2 event management tools (API v1)
- ✅ 2 group management tools (API v1)
- ✅ 1 privilege management tool (API v1)
- ✅ Comprehensive filtering (wildcards, time-based, custom fields)
- ✅ Flexible pagination (page numbers and cursors)

### Configured Servers
- **onelogin-shadow**: Chicken-Shadow test environment (via ONELOGIN_SERVER env var)
- **onelogin-prod**: Chicken production environment (via ONELOGIN_SERVER env var)

### Implemented Tools (17 total)

#### User Management (5 tools - API v2)
1. `list_users` - List users with comprehensive filters and pagination
2. `get_user` - Get user details by ID
3. `create_user` - Create new user
4. `update_user` - Update existing user
5. `delete_user` - Delete user by ID

#### App Management (3 tools - API v2)
6. `list_apps` - List apps with filters and pagination
7. `get_app` - Get app details by ID
8. `update_app` - Update existing app

#### Role Management (4 tools - API v2)
9. `list_roles` - List roles with filters and pagination
10. `get_role` - Get role details by ID
11. `assign_role_to_user` - Assign roles to a user
12. `remove_role_from_user` - Remove roles from a user

#### Event Management (2 tools - API v1)
13. `list_events` - List events with time-based and user filters
14. `get_event` - Get event details by ID

#### Group Management (2 tools - API v1)
15. `list_groups` - List groups with filters and pagination
16. `get_group` - Get group details by ID

#### Privilege Management (1 tool - API v1)
17. `list_privileges` - List all privileges

### Current State
- Two MCP servers configured (onelogin-prod and onelogin-shadow)
- Both servers show "✓ Connected" status
- **17 tools ready**: 5 user + 3 app + 4 role + 2 event + 2 group + 1 privilege
- Comprehensive pagination support (page numbers + cursors)
- Wildcard search, field selection, sorting, time filtering
- Ready for production use

### Next Steps (In Priority Order)

#### Phase 4: Documentation & Cleanup

**Quick Test Commands for New Conversation:**
```
List OneLogin apps
List OneLogin roles
Get app details for app ID [insert ID from list]
Get role details for role ID [insert ID from list]
```

**Detailed Testing Steps:**
1. **Start fresh conversation** - Required to load 7 new tools (apps + roles)
2. **Verify tool availability** - Ask "what OneLogin tools are available?"
3. **Test Apps tools**:
   - `list_apps` - List all apps or filter by name
   - `get_app` - Get details for a specific app ID (use ID from list_apps)
   - `update_app` - Update an app's properties (optional, if needed)
4. **Test Roles tools**:
   - `list_roles` - List all roles or filter by name
   - `get_role` - Get details for a specific role ID (use ID from list_roles)
   - `assign_role_to_user` - Assign role(s) to a test user (optional)
   - `remove_role_from_user` - Remove role(s) from a test user (optional)
5. **Verify x-request-id** - Confirm all responses include request IDs for Datadog tracing

#### Future Enhancements (Optional)
1. **Additional CRUD operations**:
   - Create/update/delete apps
   - Create/update/delete roles
   - Create/update/delete groups

2. **Advanced features**:
   - Batch operations
   - Webhook management
   - Session management
   - Directory integration

3. **Testing**:
   - Integration tests
   - Error handling tests
   - Rate limit handling

### Technical Notes

**Authentication**:
- OAuth2 client credentials flow
- 10-hour token expiry with 30-second buffer
- Auto-refresh on expiry
- Preprod cookie support via `ol_use_preprod` config

**Response Format** (all tools):
```javascript
{
  success: boolean,
  request_id: string,  // x-request-id for Datadog tracing
  status: number,
  data: object
}
```

**API Versions**:
- `api/2`: users, apps, roles (not rate limited) ← current focus
- `api/1`: events, groups, privileges (rate limited)
- `api/v1`: accounts (legacy key auth)

**File Structure**:
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
│       └── roles.js      # Role management tools (4 tools)
├── package.json
└── .gitignore
```

**Config Locations**:
- Credentials: `~/.config/onelogin-mcp/servers.json`
- Active server: `~/.config/onelogin-mcp/config.json`
- MCP config: Claude Code local config (managed by `claude mcp` CLI)

### Known Issues
- None currently

### Multi-Environment Setup
The server supports multiple OneLogin environments via the `ONELOGIN_SERVER` environment variable:

**Add both environments to Claude Code:**
```bash
# Production
claude mcp add onelogin-prod \
  --env ONELOGIN_SERVER=Chicken \
  -- bun run /path/to/onelogin-mcp/index.js

# Shadow/test
claude mcp add onelogin-shadow \
  --env ONELOGIN_SERVER=Chicken-Shadow \
  -- bun run /path/to/onelogin-mcp/index.js
```

**Benefits:**
- Both environments available simultaneously
- Tools prefixed with server name (e.g., `mcp__onelogin-prod__list_users`)
- No reconfiguration needed
- Follows standard MCP pattern (same as Jira, GitHub, etc.)

### Recent Changes
- **2025-10-16 (Session 4)**: Phase 3 Complete - Pagination & API v1 Tools
  - ✅ Enhanced all list tools with comprehensive filtering
  - ✅ Added cursor-based pagination support (after_cursor, before_cursor)
  - ✅ Added page number pagination support
  - ✅ Added common query parameters (fields, sort, updated_since)
  - ✅ Created `lib/tools/events.js` with 2 event management tools
  - ✅ Created `lib/tools/groups.js` with 2 group management tools
  - ✅ Created `lib/tools/privileges.js` with 1 privilege management tool
  - ✅ Updated index.js with 5 new tool definitions and handlers
  - ✅ Documented comprehensive pagination and filtering in README.md
  - Server now provides 17 total tools across all OneLogin resources
  - All list tools support wildcards, cursors, sorting, and field selection

- **2025-10-16 (Session 3)**: Multi-Environment Support
  - ✅ Added `onelogin-prod` MCP server for Chicken production
  - ✅ Renamed `onelogin` to `onelogin-shadow` for clarity
  - ✅ Documented multi-environment setup in README.md
  - ✅ Updated PROGRESS.md with multi-environment notes
  - Both production and shadow environments now accessible simultaneously
  - Follows industry-standard MCP pattern used by Jira, GitHub, etc.

- **2025-10-16 (Session 2)**: Phase 2 Complete - Added Apps and Roles tools
  - ✅ Created `lib/tools/apps.js` with 3 app management tools
  - ✅ Created `lib/tools/roles.js` with 4 role management tools
  - ✅ Updated `index.js` with 7 new tool definitions and handlers
  - ✅ Updated PROGRESS.md with Phase 2 completion notes
  - 🔜 **Testing required**: Start fresh conversation to test all 12 tools
  - Server now provides 12 total tools across Users, Apps, and Roles

- **2025-10-16 (Session 1)**: Phase 1 Complete - User tools tested
  - ✅ Tested `list_users` tool successfully with Chicken-Shadow server
  - ✅ Verified x-request-id tracking for Datadog correlation
  - ✅ Confirmed all 5 user tools operational

- **2025-10-16**: Fixed JSON Schema draft 2020-12 validation errors
  - Removed invalid `required: true` from individual property definitions
  - All schemas now properly use top-level `required` array only
  - Server successfully re-added and connected to Claude Code

### Environment Variables (optional overrides)
- `ONELOGIN_SERVER`: Override active server
- `ONELOGIN_USE_PREPROD`: Set to "true" for preprod cookie
