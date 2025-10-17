# Contributing to OneLogin MCP Server

## Adding New Tools

When adding new tools to the OneLogin MCP server, follow these guidelines to ensure high-quality tool descriptions that enable AI to use them effectively.

## Tool Description Quality Framework

### Core Principle
Tool descriptions are read by AI models to understand **when** and **how** to use each tool. Good descriptions enable AI to:
- Select the right tool for a task
- Understand behavioral nuances
- Warn users about gotchas
- Make efficient API call choices
- Troubleshoot errors effectively

### Description Template

Each tool description should include these components:

```javascript
{
  name: 'tool_name',
  description: '[1-2 sentence core purpose]. [Behavioral context]. [Important warnings/caveats]. [Best practices]. [Return data structure]. Returns x-request-id [API version notes].',
  inputSchema: { /* ... */ }
}
```

### Required Components

#### 1. Core Description (1-2 sentences)
State what the tool does clearly and concisely.

**Example:**
- ✅ "Create a new user in OneLogin."
- ❌ "Create user." (too terse)
- ❌ "Use this API to create a new user in your OneLogin account for managing user access and authentication." (too verbose)

#### 2. Behavioral Context
Explain what happens in different scenarios.

**Examples:**
- "Users without a password get status 7 (Password Pending) and cannot log in until password is set."
- "If MFA is not required: returns SAML assertion immediately. If MFA is required: returns state_token and devices list."
- "Returns 50 events per page. Can filter by event_type_id, user_id, and date range."

#### 3. Important Warnings/Caveats
Highlight unexpected behavior that could surprise users.

**Format:** Use "IMPORTANT:" or "WARNING:" prefix for critical information.

**Examples:**
- "IMPORTANT: No invite email is sent when users are created via this API."
- "WARNING: This operation cannot be undone. All users with this attribute will have the field and data removed."
- "IMPORTANT: Requires Delegated Administration subscription."

#### 4. Best Practices (when applicable)
Share efficiency tips and recommended usage patterns.

**Examples:**
- "For efficient syncing between systems, use the updated_since parameter to return only users that changed since last check."
- "Use ignore_visibility=true to return all apps regardless of portal visibility setting."
- "Poll periodically until status changes to approved/denied."

#### 5. Pagination Details (when applicable)
Specify limits and pagination behavior.

**Examples:**
- "Returns 50 users per page."
- "Max 1000 apps per page."
- "Returns up to 650 roles per page."

#### 6. Return Data Structure
Describe what data is returned.

**Examples:**
- "Returns user data with ID, email, status, roles, custom attributes, and x-request-id."
- "Returns mfa_token, expires_at, reusable flag, device_id, and x-request-id."

#### 7. API Version Notes
Indicate API version and any rate limiting.

**Examples:**
- "(API v2)"
- "(API v1 - Rate Limited)"
- "(API v1 - 5000 requests/hour)"

## Examples by Tool Tier

### Tier 1 (Critical, High Usage)
**Most detail required** - Users rely on these frequently.

```javascript
{
  name: 'create_user',
  description: 'Create a new user in OneLogin. Users without a password get status 7 (Password Pending) and cannot log in until password is set. PKI certificates require this initial status. IMPORTANT: No invite email is sent when users are created via this API. Mappings run async by default (use mappings=sync query parameter to get mapped values in response). Returns created user data and x-request-id.',
  // ...
}
```

### Tier 2 (High Usage)
**Substantial detail** - Include workflow guidance and warnings.

```javascript
{
  name: 'enroll_factor',
  description: 'Initiate MFA enrollment for a user. Status will be "pending" if confirmation required (Google Authenticator, OneLogin Protect) or "accepted" if verified=true (SMS, Voice, Email with pre-verified values). For OTP factors, returns verification_token and totp_url for QR code display. Supports custom_message for SMS (max 160 chars) and redirect_to for Email MagicLink. Returns enrollment data with registration ID, status, and x-request-id.',
  // ...
}
```

### Tier 3 (Medium Usage)
**Moderate detail** - Focus on key behavioral context and warnings.

```javascript
{
  name: 'generate_saml_assertion',
  description: 'Generate a SAML assertion for user authentication to an app. If MFA is not required: returns SAML assertion data immediately. If MFA is required: returns state_token, devices, callback_url, and user info - must then call verify_saml_assertion_factor. Works with ip_address parameter to honor MFA IP allow-listing. Returns assertion data or MFA challenge and x-request-id (API v2).',
  // ...
}
```

### Tier 4 (Low Usage)
**Basic detail** - Clear purpose with key behavioral notes.

```javascript
{
  name: 'list_events',
  description: 'Get a paginated list of events in a OneLogin account (50 events per page). Can filter by event_type_id, user_id, client_id, directory_id, resolution, and date range (since/until with millisecond precision). Returns event data with user_name/actor_user_name (first+last name or email fallback), risk scores, IP addresses, and full event details. Returns x-request-id (API v1 - Rate Limited).',
  // ...
}
```

## Documentation Sources

When writing tool descriptions, refer to the official OneLogin API documentation:

1. **Local Docs Clone**: `/Users/willmunslow/src/developers.onelogin.com/_content/10-api-docs/`
2. **API Versions**:
   - `05-2/`: API v2 (not rate limited, modern)
   - `10-1/`: API v1 (rate limited - 5000 requests/hour)
   - `20-v1-v3/`: Legacy APIs (deprecated)

## Common Patterns

### Subscription Requirements
If an endpoint requires a specific subscription, mention it upfront:
```
IMPORTANT: Requires Delegated Administration subscription.
```

### Status Codes and Their Meanings
Include status code meanings when they affect user workflow:
```
Users get status 7 (Password Pending) when created without password.
Status values: 0=Unactivated, 1=Active, 2=Suspended, 3=Locked
```

### Workflow Steps
For multi-step workflows, explain the sequence:
```
Use after enroll_factor returns pending status. Provide the OTP code user received/generated. On success, factor becomes active.
```

### MFA Patterns
Explain factor-specific behavior:
```
For some factors (SMS): OTP not immediately required, returns pending status.
For others (Google Authenticator): OTP required immediately.
For OneLogin Protect: first call triggers push notification, subsequent calls poll with do_not_notify=true.
```

### Cross-References
Guide users to related tools:
```
To find which group a user belongs to, use get_user.
To add/remove users from groups, use update_user.
```

## Testing Your Descriptions

Before committing, ask yourself:

1. **Purpose Clear?** Can someone understand what this tool does in 5 seconds?
2. **Warnings Visible?** Are critical warnings (no email sent, permanent deletion, subscription required) clearly marked?
3. **Workflow Explained?** If this is part of a multi-step flow, is that clear?
4. **Return Value Clear?** Will the user know what data to expect?
5. **Edge Cases Covered?** Are special behaviors (MFA required, status codes, pagination) explained?

## Validation Checklist

Before submitting a PR with new tools:

- [ ] Description follows the template structure
- [ ] Critical warnings use "IMPORTANT:" or "WARNING:" prefix
- [ ] API version and rate limiting noted
- [ ] Pagination limits specified (if applicable)
- [ ] Return data structure described
- [ ] Multi-step workflows explained (if applicable)
- [ ] Cross-references to related tools included (if applicable)
- [ ] Subscription requirements mentioned (if applicable)
- [ ] JavaScript syntax validated (`node --check index.js`)
- [ ] Tool actually works (test with real API call)

## Examples to Avoid

### Too Generic
❌ "Create a new privilege. Returns created privilege data and x-request-id."

✅ "Create a new privilege object that defines actions on OneLogin resources. IMPORTANT: Privileges don't grant user access - they describe what actions can be performed. Assign privilege to user/role to grant access. Returns created privilege ID and x-request-id (API v1 - Rate Limited)."

### Missing Critical Context
❌ "Generate an invite link for a user."

✅ "Generate a password reset invite link for an existing user in OneLogin. Returns the link URL but does NOT send any email - use send_invite_link to email it. Email parameter is case-sensitive. Returns invite link and x-request-id (API v1 - Rate Limited)."

### Too Verbose
❌ "Use this API to create a new user in your OneLogin account. The user creation process allows you to specify various attributes and properties for the new user including their email address, first name, last name, username, and many other optional fields. When you create a user through this API endpoint, you have the flexibility to either provide a password for the user or leave it blank, in which case the user will need to set their password through other means."

✅ "Create a new user in OneLogin. Users without a password get status 7 (Password Pending) and cannot log in. IMPORTANT: No invite email is sent when users are created via this API. Returns created user data and x-request-id."

## Impact of Good Descriptions

Quality descriptions enable AI to:
- **Avoid errors**: "I'll use send_invite_link to email the user, since generate_invite_link doesn't send emails"
- **Optimize calls**: "I'll use updated_since to efficiently sync users since you last ran this"
- **Warn proactively**: "Note: This requires Delegated Administration subscription - do you have that enabled?"
- **Guide workflows**: "Since MFA is required, I'll first call generate_saml_assertion, then verify_saml_assertion_factor with the OTP"

## Questions?

If you're unsure about how to describe a tool:
1. Read the official OneLogin API documentation for that endpoint
2. Look at similar existing tools in `index.js`
3. Refer to `TOOL_DESCRIPTION_ANALYSIS.md` for before/after examples
4. Test the tool and note any surprises or edge cases you encounter

## Related Documentation

- `TOOL_DESCRIPTION_ANALYSIS.md` - Gap analysis showing before/after quality comparison
- `PROGRESS.md` - Current implementation status
- `README.md` - User-facing documentation
