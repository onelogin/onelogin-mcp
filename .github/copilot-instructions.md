# GitHub Copilot Instructions for OneLogin MCP Server

## Project Overview

This is a Model Context Protocol (MCP) server that provides comprehensive access to the OneLogin API. It enables Claude Desktop and other MCP clients to manage users, apps, roles, authentication, and security settings through 172 tools covering the complete OneLogin API surface.

**Technology Stack:**
- Runtime: Bun (Node.js compatible)
- Language: JavaScript (ES modules)
- Protocol: Model Context Protocol (MCP) SDK v1.20.1
- API: OneLogin API v1 and v2

## Repository Structure

```
onelogin-mcp/
├── index.js                    # MCP server entry point
├── setup.js                    # Interactive credential configuration
├── lib/
│   ├── config.js               # Credential management
│   ├── onelogin-api.js         # OAuth2 client with token caching
│   └── tools/
│       ├── registry.js         # Tool registry and dispatcher
│       └── [28 tool modules]   # Individual API category handlers
├── package.json
├── CONTRIBUTING.md             # Tool description quality guidelines
├── PROGRESS.md                 # Implementation tracking
└── README.md                   # User documentation
```

## Architecture Principles

### Tool Module Pattern
Each tool module in `lib/tools/` follows this structure:
```javascript
export const tools = [
  {
    name: 'tool_name',
    description: '[Detailed description following CONTRIBUTING.md guidelines]',
    inputSchema: { type: 'object', properties: {...}, required: [...] }
  }
];

export const handlers = {
  tool_name: async (api, args) => {
    // Implementation using OneLogin API client
    return await api.get('/api/2/path', args);
  }
};
```

### Tool Registration
- `lib/tools/registry.js` automatically discovers and registers all tools from imported modules
- Tool names use snake_case convention
- Handlers receive validated arguments and authenticated API client

### Authentication Flow
- Credentials stored in `~/.config/onelogin-mcp/servers.json`
- OAuth2 token caching handled by `onelogin-api.js`
- Multiple environment support via `ONELOGIN_SERVER` environment variable
- Automatic token refresh on expiration

## Coding Standards

### File Organization
- ES modules only (`type: "module"` in package.json)
- Use `export` for public interfaces
- Import paths should be relative for local modules

### Naming Conventions
- Tool names: `snake_case` (e.g., `create_user`, `list_apps`)
- File names: `kebab-case` for modules (e.g., `api-authorization.js`)
- Functions: `camelCase` (e.g., `generateToken`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PAGE_SIZE`)

### Error Handling
- Return structured responses: `{ success: boolean, status: number, data: any, request_id: string }`
- Include `x-request-id` from API responses for tracing
- Handle OAuth2 token refresh transparently
- Provide meaningful error messages referencing OneLogin API documentation

### Tool Descriptions
**CRITICAL:** Follow the comprehensive guidelines in `CONTRIBUTING.md` when adding or modifying tools:

1. **Structure:** Core purpose → Behavioral context → Warnings → Best practices → Return data → API version
2. **Required Elements:**
   - Clear 1-2 sentence purpose
   - Behavioral nuances (status codes, conditional flows)
   - "IMPORTANT:" or "WARNING:" prefixed caveats
   - Pagination limits when applicable
   - Return data structure description
   - API version notation (v1/v2, rate limits)

3. **Quality Tiers:**
   - Critical/High Usage: Maximum detail with workflow guidance
   - Medium Usage: Key behavioral context and warnings
   - Low Usage: Clear purpose with essential notes

**Example Quality Description:**
```javascript
description: 'Create a new user in OneLogin. Users without a password get status 7 (Password Pending) and cannot log in until password is set. IMPORTANT: No invite email is sent when users are created via this API. Mappings run async by default (use mappings=sync query parameter to get mapped values in response). Returns created user data and x-request-id.'
```

### Code Comments
- Add comments for non-obvious business logic
- Document API quirks and workarounds
- Reference OneLogin API documentation URLs when relevant
- Avoid obvious comments that restate code

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run setup wizard
npm run setup

# Start MCP server (connects via stdio)
npm start

# Manual testing with Claude Desktop:
# 1. Configure in claude_desktop_config.json
# 2. Restart Claude Desktop
# 3. Test tools in conversation
```

### Testing Approach
- **No automated test suite:** Manual testing with real OneLogin API
- **Validation checklist:**
  1. JavaScript syntax: `node --check index.js`
  2. Tool registration: Server starts without errors
  3. Real API calls: Test with actual OneLogin credentials
  4. Error cases: Invalid inputs, authentication failures
  5. MCP client integration: Works in Claude Desktop

### Making Changes

#### Adding New Tools
1. Choose appropriate module in `lib/tools/` (or create new one)
2. Add tool definition to `tools` array with high-quality description
3. Add handler to `handlers` object
4. Import module in `lib/tools/registry.js` if new
5. Test tool works with real API calls
6. Update README.md API Coverage section if adding new category

#### Modifying Existing Tools
1. Check `CONTRIBUTING.md` for description quality standards
2. Preserve existing parameter names (breaking change for users)
3. Test backward compatibility
4. Document behavior changes in commit message

#### Updating Dependencies
- Minimize dependency changes
- Use `npm` for package management (Bun compatible)
- Test with both `npm` and `bun` after updates
- `@modelcontextprotocol/sdk` is primary dependency

## API Integration

### OneLogin API Versions
- **API v2** (`/api/2/`): Modern, not rate limited - PREFER THIS
- **API v1** (`/api/1/`): Legacy, 5000 requests/hour rate limit
- Always note API version in tool descriptions

### Common Patterns
```javascript
// GET with query parameters
await api.get('/api/2/users', { email: 'user@example.com' });

// POST with body
await api.post('/api/2/users', { firstname: 'John', lastname: 'Doe', email: 'john@example.com' });

// PUT for updates
await api.put('/api/2/users/123', { title: 'Senior Engineer' });

// DELETE operations
await api.delete('/api/2/users/123');
```

### Response Handling
All tools should return:
```javascript
{
  success: true,          // Boolean indicating success
  status: 200,            // HTTP status code
  request_id: "...",      // x-request-id from API for tracing
  data: {...}            // Response data from OneLogin API
}
```

## Important Warnings & Caveats

### Security
- **NEVER commit credentials** to repository
- Credentials stored in `~/.config/onelogin-mcp/servers.json`
- Use environment variables for server selection
- OAuth2 tokens cached in memory, not persisted
- Test with sandbox/shadow environments first

### API Limitations
- API v1 endpoints: 5000 requests/hour rate limit
- Pagination: Most endpoints return 50 items per page (some up to 1000)
- Async operations: User mappings run asynchronously by default
- No email notifications: API user creation doesn't send invite emails
- Subscription requirements: Some endpoints require specific OneLogin subscriptions

### MCP Protocol
- Server uses stdio transport (not HTTP)
- Clients communicate via JSON-RPC over stdin/stdout
- No web interface - designed for AI assistants
- Multiple concurrent requests supported via MCP SDK

### Breaking Changes to Avoid
- Changing tool names (users reference by name)
- Removing required parameters
- Changing parameter types
- Altering response structure significantly

## Build & Deployment

### Publishing to npm
**Automated via GitHub Actions:**
1. Merge changes to `main` branch
2. Create GitHub Release with version tag (e.g., `v1.1.0`)
3. GitHub Action automatically publishes to `@onelogin/onelogin-mcp`

**Manual publish** (if needed):
```bash
# Update version in package.json
npm version patch|minor|major

# Publish to npm
npm publish --access public
```

### Version Strategy
Use semantic versioning:
- **MAJOR:** Breaking API changes (tool renames, parameter changes)
- **MINOR:** New features, backward compatible (new tools, new parameters)
- **PATCH:** Bug fixes, description improvements

### Files Included in Package
See `files` array in `package.json`:
- `index.js`, `setup.js`
- `lib/**/*.js`
- `README.md`, `LICENSE`
- **Excluded:** Tests, docs, .github, development files

## Common Tasks

### Add a New Tool to Existing Module
1. Open appropriate module in `lib/tools/`
2. Add tool definition to `tools` array
3. Add handler function to `handlers` object
4. Follow description quality guidelines from `CONTRIBUTING.md`
5. Test with real API call
6. Commit with clear message

### Create New Tool Category
1. Create new file: `lib/tools/new-category.js`
2. Define `tools` and `handlers` exports
3. Import in `lib/tools/registry.js`
4. Update README.md API Coverage section
5. Test module loads correctly

### Update Tool Description
1. Locate tool in appropriate `lib/tools/*.js` module
2. Follow `CONTRIBUTING.md` description template
3. Include: purpose, behavior, warnings, best practices, return data, API version
4. Test description clarity with AI assistant
5. Commit with description of improvement

### Debug Authentication Issues
1. Check `~/.config/onelogin-mcp/servers.json` exists
2. Verify credentials are correct for API v2
3. Check `ONELOGIN_SERVER` environment variable matches server name
4. Test OAuth2 token generation manually
5. Check OneLogin admin panel for API client permissions

## Resources

- [OneLogin API Documentation](https://developers.onelogin.com/api-docs)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Claude Desktop Integration](https://claude.ai/download)
- [GitHub Repository](https://github.com/onelogin/onelogin-mcp)
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Tool description guidelines

## Questions?

When unsure about implementation details:
1. Check existing similar tools for patterns
2. Refer to `CONTRIBUTING.md` for tool description quality standards
3. Review OneLogin API documentation for endpoint behavior
4. Test with real API calls in sandbox environment
5. Consider backward compatibility impact

## Task Assignment Guidelines

**Good Tasks for Copilot:**
- Adding new tools from OneLogin API documentation
- Improving tool descriptions following CONTRIBUTING.md guidelines
- Fixing bugs in existing tool implementations
- Updating documentation
- Refactoring duplicate code patterns

**Tasks Requiring Human Review:**
- Changing authentication mechanism
- Modifying core API client behavior
- Breaking changes to tool interfaces
- Security-sensitive modifications
- Publishing releases
