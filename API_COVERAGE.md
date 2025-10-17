# OneLogin MCP Server - API Coverage Analysis

**Generated:** 2025-10-16

This document provides a comprehensive analysis of OneLogin API coverage in the MCP server, comparing implemented tools against all documented API endpoints.

---

## Summary Statistics

| API Version | Total Endpoints | Implemented | Missing | Coverage |
|-------------|----------------|-------------|---------|----------|
| **API v2** (api/2) | 152 | 17 | 135 | 11.2% |
| **API v1** (api/1) | 48 | 0 | 48 | 0% |
| **API v1-v3** (legacy) | 31 | 0 | 31 | 0% |
| **TOTAL** | **231** | **17** | **214** | **7.4%** |

---

## Currently Implemented (17 Tools)

### ✅ User Management (5 tools - API v2)
- `list_users` → `GET /api/2/users`
- `get_user` → `GET /api/2/users/:user_id`
- `create_user` → `POST /api/2/users`
- `update_user` → `PUT /api/2/users/:user_id`
- `delete_user` → `DELETE /api/2/users/:user_id`

### ✅ App Management (3 tools - API v2)
- `list_apps` → `GET /api/2/apps`
- `get_app` → `GET /api/2/apps/:app_id`
- `update_app` → `PUT /api/2/apps/:app_id`

### ✅ Role Management (4 tools - API v2)
- `list_roles` → `GET /api/2/roles`
- `get_role` → `GET /api/2/roles/:role_id`
- `assign_role_to_user` → `POST /api/2/roles/:role_id/users`
- `remove_role_from_user` → `DELETE /api/2/roles/:role_id/users/:user_id`

### ✅ Event Management (2 tools - API v1)
- `list_events` → `GET /api/1/events`
- `get_event` → `GET /api/1/events/:id`

### ✅ Group Management (2 tools - API v1)
- `list_groups` → `GET /api/1/groups`
- `get_group` → `GET /api/1/groups/:id`

### ✅ Privilege Management (1 tool - API v1)
- `list_privileges` → `GET /api/1/privileges`

---

## Missing API v2 Endpoints (135 endpoints)

### OAuth 2.0 Tokens (5 endpoints)
- `POST /auth/oauth2/v2/token` - Generate Tokens
- `POST /auth/oauth2/token` - Refresh Tokens (deprecated)
- `POST /auth/oauth2/revoke` - Revoke Token
- `GET /auth/rate_limit` - Get Rate Limit
- `POST /auth/oauth2/v2/token` - Refresh Token v2

### API Authorization (16 endpoints)
- `GET /api/2/authorization_servers` - List Authorization Servers
- `GET /api/2/authorization_servers/:id` - Get Authorization Server
- `POST /api/2/authorization_servers` - Create Authorization Server
- `PUT /api/2/authorization_servers/:id` - Update Authorization Server
- `DELETE /api/2/authorization_servers/:id` - Delete Authorization Server
- `GET /api/2/authorization_servers/:id/claims` - List Access Token Claims
- `POST /api/2/authorization_servers/:id/claims` - Add Access Token Claim
- `PUT /api/2/authorization_servers/:id/claims/:claim_id` - Update Access Token Claim
- `DELETE /api/2/authorization_servers/:id/claims/:claim_id` - Delete Access Token Claim
- `GET /api/2/authorization_servers/:id/scopes` - List Authorization Server Scopes
- `POST /api/2/authorization_servers/:id/scopes` - Add Authorization Server Scope
- `PUT /api/2/authorization_servers/:id/scopes/:scope_id` - Update Authorization Server Scope
- `DELETE /api/2/authorization_servers/:id/scopes/:scope_id` - Delete Authorization Server Scope
- `GET /api/2/authorization_servers/:id/client_apps` - List Client Apps
- `POST /api/2/authorization_servers/:id/client_apps` - Add Client App
- `PUT /api/2/authorization_servers/:id/client_apps/:client_app_id` - Update Client App
- `DELETE /api/2/authorization_servers/:id/client_apps/:client_app_id` - Remove Client App

### Apps (4 missing endpoints)
- `POST /api/2/apps` - Create App
- `DELETE /api/2/apps/:app_id/parameters/:param_id` - Delete App Parameter
- `DELETE /api/2/apps/:app_id` - Delete App
- `GET /api/2/apps/:app_id/users` - List App Users

### App Rules (11 endpoints)
- `GET /api/2/apps/:app_id/rules` - List Rules
- `GET /api/2/apps/:app_id/rules/:rule_id` - Get Rule
- `POST /api/2/apps/:app_id/rules` - Create Rule
- `PUT /api/2/apps/:app_id/rules/:rule_id` - Update Rule
- `DELETE /api/2/apps/:app_id/rules/:rule_id` - Delete Rule
- `GET /api/2/apps/:app_id/rules/conditions` - List Conditions
- `GET /api/2/apps/:app_id/rules/condition_operators` - List Condition Operators
- `GET /api/2/apps/:app_id/rules/condition_values` - List Condition Values
- `GET /api/2/apps/:app_id/rules/actions` - List Actions
- `GET /api/2/apps/:app_id/rules/action_values` - List Action Values
- `PUT /api/2/apps/:app_id/rules/bulk_sort` - Bulk Sort Rules

### Branding (28 endpoints)
- `GET /api/2/branding/brands` - List Account Brands
- `POST /api/2/branding/brands` - Create Account Brand
- `GET /api/2/branding/brands/:brand_id` - Get Account Brand
- `PUT /api/2/branding/brands/:brand_id` - Update Account Brand
- `DELETE /api/2/branding/brands/:brand_id` - Delete Account Brand
- `GET /api/2/branding/brands/:brand_id/apps` - Get Apps Associated with Account Brand
- `GET /api/2/branding/email_settings` - Get Email Settings Config
- `DELETE /api/2/branding/email_settings` - Reset Email Settings Config
- `PUT /api/2/branding/email_settings` - Update Email Settings Config
- `GET /api/2/branding/email_settings/test` - Verify Email Settings Config
- `PUT /api/2/branding/email_settings/test` - Test Config Without Account Email Settings Update
- `GET /api/2/branding/templates` - List Message Templates
- `POST /api/2/branding/templates` - Create Message Template
- `GET /api/2/branding/templates/:template_id` - Get Message Template
- `GET /api/2/branding/templates/type/:template_type` - Get Message Template by Type
- `GET /api/2/branding/templates/type/:template_type/locales/:locale` - Get Message Template by Type & Locale
- `GET /api/2/branding/templates/type/:template_type/master` - Get Master Message Template by Type
- `GET /api/2/branding/templates/type/:template_type/master/locales/:locale` - Get Master Message Template by Type & Locale
- `PUT /api/2/branding/templates/:template_id` - Update Message Template
- `PUT /api/2/branding/templates/type/:template_type/locales/:locale` - Update Message Template by Type & Locale
- `DELETE /api/2/branding/templates/:template_id` - Delete Message Template
- `GET /api/2/branding/languages` - List Languages
- `POST /api/2/branding/custom_messages/lookup` - Lookup Custom Message
- `POST /api/2/branding/custom_messages` - List Custom Messages
- `PUT /api/2/branding/custom_messages/:message_id` - Update Custom Message
- `DELETE /api/2/branding/custom_messages/:message_id` - Delete Custom Message

### Connectors (1 endpoint)
- `GET /api/2/connectors` - List Connectors

### Multi-Factor Authentication (11 endpoints)
- `GET /api/2/users/:user_id/factors/available` - Get Available Authentication Factors
- `POST /api/2/users/:user_id/factors/:factor_type/enroll` - Enroll Authentication Factor
- `PUT /api/2/users/:user_id/factors/:factor_type/enroll/verify_otp` - Verify Enrollment of Authentication Factors
- `GET /api/2/users/:user_id/factors/:factor_type/enroll/verify_poll` - Verify Enrollment of OneLogin Voice & Protect
- `POST /api/2/users/:user_id/factors/:factor_type/activate` - Activate Authentication Factor
- `GET /api/2/users/:user_id/factors/:user_id/status` - Get Enrolled Authentication Factors
- `PUT /api/2/users/:user_id/factors/:factor_type/verify` - Verify Authentication Factor
- `GET /api/2/users/:user_id/factors/:factor_type/verify_poll` - Verify Authentication Factor (Poll)
- `POST /api/2/users/:user_id/factors/:factor_type/verify` - Verify Authentication Factor (POST)
- `DELETE /api/2/users/:user_id/factors/:factor_type` - Remove Authentication Factor
- `POST /api/2/users/:user_id/mfa_token` - Generate MFA Token

### Roles (6 missing endpoints)
- `POST /api/2/roles` - Create Role
- `PUT /api/2/roles/:role_id` - Update Role
- `GET /api/2/roles/:role_id/apps` - Get Role Apps
- `PUT /api/2/roles/:role_id/apps` - Set Role Apps
- `GET /api/2/roles/:role_id/users` - Get Role Users
- `GET /api/2/roles/:role_id/admins` - Get Role Admins
- `POST /api/2/roles/:role_id/admins` - Add Role Admins
- `DELETE /api/2/roles/:role_id/admins/:admin_id` - Remove Role Admins
- `DELETE /api/2/roles/:role_id` - Delete Role

### Reports (3 endpoints)
- `GET /api/2/reports` - List Reports
- `POST /api/2/reports/:report_id/run` - Run Report
- `POST /api/2/reports/:report_id/run_async` - Run Report in Background

### SAML Assertions (2 endpoints)
- `POST /api/2/saml_assertion` - Generate SAML Assertion
- `POST /api/2/saml_assertion/verify_factor` - Verify Factor (SAML)

### Smart Hooks (10 endpoints)
- `GET /api/2/hooks` - List Hooks
- `GET /api/2/hooks/:hook_id` - Get Hook
- `POST /api/2/hooks` - Create Hook
- `PUT /api/2/hooks/:hook_id` - Update Hook
- `DELETE /api/2/hooks/:hook_id` - Delete Hook
- `GET /api/2/hooks/:hook_id/logs` - Get Hook Logs
- `GET /api/2/hooks/:hook_id/environment_variables` - List Environment Variables
- `POST /api/2/hooks/:hook_id/environment_variables` - Create Environment Variable
- `GET /api/2/hooks/:hook_id/environment_variables/:variable_id` - Get Environment Variable
- `PUT /api/2/hooks/:hook_id/environment_variables/:variable_id` - Update Environment Variable
- `DELETE /api/2/hooks/:hook_id/environment_variables/:variable_id` - Delete Environment Variable

### Smart MFA (2 endpoints)
- `POST /api/2/smart_mfa/validate` - Validate User
- `POST /api/2/smart_mfa/verify` - Verify MFA Token

### Users (6 missing endpoints)
- `POST /api/2/users/:user_id/unlock` - Unlock User
- `GET /api/2/users/:user_id/apps` - Get User Apps
- `GET /api/2/users/:user_id/custom_attributes` - List Custom Attributes
- `GET /api/2/users/:user_id/custom_attributes/:attribute_id` - Get Custom Attribute
- `POST /api/2/users/:user_id/custom_attributes` - Create Custom Attribute
- `PUT /api/2/users/:user_id/custom_attributes/:attribute_id` - Update Custom Attribute
- `DELETE /api/2/users/:user_id/custom_attributes/:attribute_id` - Delete Custom Attribute
- `GET /api/2/users/:user_id/privileges` - Get User Privileges
- `GET /api/2/users/:user_id/delegated_privileges` - Get User Delegated Privileges

### User Mappings (11 endpoints)
- `GET /api/2/mappings` - List Mappings
- `POST /api/2/mappings` - Create Mapping
- `GET /api/2/mappings/:mapping_id` - Get Mapping
- `PUT /api/2/mappings/:mapping_id` - Update Mapping
- `DELETE /api/2/mappings/:mapping_id` - Delete Mapping
- `POST /api/2/mappings/:mapping_id/dry_run` - Dry Run Mapping
- `POST /api/2/mappings/bulk_sort` - Bulk Sort Mappings
- `GET /api/2/mappings/conditions` - List Conditions
- `GET /api/2/mappings/condition_operators` - List Condition Operators
- `GET /api/2/mappings/condition_values` - List Condition Values
- `GET /api/2/mappings/actions` - List Actions
- `GET /api/2/mappings/action_values` - List Action Values

### User Self-Registration (6 endpoints)
- `GET /api/2/user_self_registration/profiles` - List All Profiles
- `GET /api/2/user_self_registration/profiles/:profile_id` - Get Specific Profile
- `POST /api/2/user_self_registration/profiles` - Create Profile
- `PUT /api/2/user_self_registration/profiles/:profile_id` - Update Profile
- `DELETE /api/2/user_self_registration/profiles/:profile_id` - Delete Profile
- `POST /api/2/user_self_registration/profiles/:profile_id/fields` - Add Field to Profile
- `DELETE /api/2/user_self_registration/profiles/:profile_id/fields/:field_id` - Remove Field from Profile

### Vigilance (8 endpoints)
- `POST /api/2/vigilance/verify` - Get Risk Score
- `POST /api/2/vigilance/train` - Track Event
- `GET /api/2/vigilance/rules` - List Rules
- `GET /api/2/vigilance/rules/:rule_id` - Get Rule
- `POST /api/2/vigilance/rules` - Create Rule
- `PUT /api/2/vigilance/rules/:rule_id` - Update Rule
- `DELETE /api/2/vigilance/rules/:rule_id` - Delete Rule
- `GET /api/2/vigilance/scores` - Get Score Insights

---

## Missing API v1 Endpoints (48 endpoints)

### OAuth 2.0 Tokens (5 endpoints)
- `POST /auth/oauth2/v2/token` - Generate Tokens
- `POST /auth/oauth2/token` - Refresh Tokens (deprecated)
- `POST /auth/oauth2/v2/token` - Refresh Token v2
- `POST /auth/oauth2/revoke` - Revoke Token
- `GET /auth/rate_limit` - Get Rate Limit

### Apps (1 endpoint)
- `GET /api/1/apps` - Get Apps

### Users (17 endpoints)
- `GET /api/1/users` - Get Users
- `GET /api/1/users/:id` - Get User by ID
- `POST /api/1/users` - Create User
- `PUT /api/1/users/:id` - Update User by ID
- `DELETE /api/1/users/:id` - Delete User by ID
- `GET /api/1/users/:id/apps` - Get Apps for a User
- `GET /api/1/users/:id/roles` - Get Roles for a User
- `PUT /api/1/users/:id/add_roles` - Assign Role to User
- `PUT /api/1/users/:id/remove_roles` - Remove Role from User
- `GET /api/1/users/custom_attributes` - Get Custom Attributes
- `PUT /api/1/users/:id/set_custom_attributes` - Set Custom Attribute Value
- `PUT /api/1/users/set_password_clear_text/:id` - Set Password by ID Using Cleartext
- `PUT /api/1/users/set_password_using_salt/:id` - Set Password by ID Using Salt and SHA-256
- `PUT /api/1/users/:id/set_state` - Set User State
- `PUT /api/1/users/:id/logout` - Log User Out
- `PUT /api/1/users/:id/lock_user` - Lock User Account
- `POST /api/1/users/delegate_authentication` - Delegate Authentication

### Login Page / Authentication (4 endpoints)
- `POST /api/1/login/create_session_login_token` - Create Session Login Token
- `POST /api/1/login/verify_factor` - Verify Factor
- `POST /session_via_api_token` - Create Session via Token
- (Overview) - Logging a User In Via API

### SAML Assertions (2 endpoints)
- `POST /api/1/saml_assertion/generate` - Generate SAML Assertion
- `POST /api/1/saml_assertion/verify_factor` - Verify Factor (SAML)

### Multi-Factor Authentication (7 endpoints)
- `GET /api/1/factors` - Get Available Factors
- `GET /api/1/factors/enrolled` - Get Enrolled Factors
- `POST /api/1/factors/enroll` - Enroll Factor
- `POST /api/1/factors/activate` - Activate Factor
- `POST /api/1/factors/verify` - Verify Factor
- `DELETE /api/1/factors/remove` - Remove Factor
- `POST /api/1/factors/generate_mfa_token` - Generate MFA Token

### Roles (2 endpoints)
- `GET /api/1/roles` - Get Roles
- `GET /api/1/roles/:id` - Get Role by ID

### Events (2 missing endpoints)
- `GET /api/1/events/event_types` - Get Event Types
- `POST /api/1/events/webhooks` - Webhooks

### Privileges (9 missing endpoints)
- `POST /api/1/privileges` - Create Privilege
- `GET /api/1/privileges/:id` - Get Privilege
- `PUT /api/1/privileges/:id` - Update Privilege
- `DELETE /api/1/privileges/:id` - Delete Privilege
- `GET /api/1/privileges/:id/roles` - Get Roles for Privilege
- `POST /api/1/privileges/:id/roles/assign` - Assign Role to Privilege
- `DELETE /api/1/privileges/:id/roles/remove` - Remove Role from Privilege
- `GET /api/1/privileges/:id/users` - Get Users for Privilege
- `POST /api/1/privileges/:id/users/assign` - Assign Users to Privilege
- `DELETE /api/1/privileges/:id/users/remove` - Remove User from Privilege

### Invite Links (2 endpoints)
- `POST /api/1/users/invite_link/generate` - Generate Invite Link
- `POST /api/1/users/invite_link/send` - Send Invite Link

### Embed Apps (1 endpoint)
- `GET /api/1/users/:id/apps/embed` - Get Apps to Embed for a User

### nApps Token (1 endpoint)
- `POST /api/1/napps_token/verify` - Verify nApps Token

---

## Missing Legacy API Endpoints (31 endpoints)

### Users (12 endpoints - API v3)
- `GET /api/v3/users.xml` - Get Users
- `GET /api/v3/users/username/:username` - Get User by Username
- `GET /api/v3/users/:id` - Get User by ID
- `GET /api/v3/users/custom_attributes` - Get Custom Attributes
- `POST /api/v3/users.xml` - Create User
- `PUT /api/v3/users/username/:username` - Update User by Username
- `PUT /api/v3/users/:id` - Update User by ID
- `PUT /api/v3/users/username/:username` - Set Password by Username Using Cleartext
- `PUT /api/v3/users/:id` - Set Password by ID Using Cleartext
- `PUT /api/v3/users/:id/set_password.xml` - Set Password by ID Using Salt and SHA-256
- `DELETE /api/v3/users/username/:username` - Delete User by Username
- `DELETE /api/v3/users/:id` - Delete User by ID

### Roles (2 endpoints - API v1)
- `GET /api/v1/roles.xml` - Get All Roles
- `GET /api/v1/roles/:role_id.xml` - Get Role by ID

### SAML Assertions (1 endpoint - API v3)
- `POST /api/v3/saml/assertion` - Generate SAML Assertion

### Delegated Auth (1 endpoint - API v1)
- `GET /api/v1/delegated_auth` - Delegate App User Authentication to OneLogin

### Invite Links (2 endpoints - API v3)
- `POST /api/v3/invites/get_invite_link` - Generate Invite Link
- `POST /api/v3/invites/send_invite_link` - Send Invite Link

### Events (3 endpoints - API v1)
- `GET /api/v1/events` - Get Events
- `GET /api/v1/logins/failed_provisioning.json` - Get Failed Provisionings
- `POST /api/v1/events.xml` - Create Event

### Accounts (8 endpoints - API v1 - Reseller Only)
- `GET /api/v1/accounts.xml` - Get Accounts
- `GET /api/v1/accounts/:id` - Get Account by ID
- `POST /api/v1/accounts` - Create Account (JSON)
- `POST /api/v1/accounts.xml` - Create Account (XML)
- `PUT /api/v1/accounts/:id.xml` - Update Account by ID
- `GET /api/v1/accounts` - List Accounts
- `GET /api/v1/accounts/:id` - Show Account
- `PUT /api/v1/accounts/:id` - Update Account

### Groups (2 endpoints - API v1)
- `GET /api/v1/groups.xml` - Get All Groups
- `GET /api/v1/groups/:id` - Get Group by ID

---

## Recommended Priorities for Implementation

### **Tier 1: High Priority (Most Commonly Used)**
1. **User Operations** (6 endpoints)
   - Unlock user, get user apps, manage custom attributes, get user privileges
2. **Role Operations** (5 endpoints)
   - Create/update/delete roles, manage role apps/users/admins
3. **MFA Management** (11 endpoints)
   - Critical for security operations
4. **App Operations** (4 endpoints)
   - Create/delete apps, manage app users/parameters

### **Tier 2: Medium Priority (Investigation & Troubleshooting)**
5. **SAML Assertions** (2 endpoints)
   - Generate assertions, verify factors
6. **Session Management** (4 endpoints)
   - Create session tokens, verify factors, logout users
7. **Invite Links** (2 endpoints)
   - Generate and send invite links
8. **Privileges** (9 endpoints)
   - CRUD operations, role/user assignments

### **Tier 3: Advanced Features**
9. **Smart Hooks** (10 endpoints)
   - Automation and custom workflows
10. **User Mappings** (11 endpoints)
    - Provisioning automation
11. **App Rules** (11 endpoints)
    - Advanced app configuration
12. **Vigilance** (8 endpoints)
    - Risk scoring and security

### **Tier 4: Specialized/Administrative**
13. **Branding** (28 endpoints)
    - UI customization
14. **Authorization Servers** (17 endpoints)
    - OAuth2/OIDC management
15. **Reports** (3 endpoints)
    - Analytics and reporting
16. **Accounts** (8 endpoints)
    - Reseller-only features

---

## Implementation Notes

### Rate Limiting
- **API v2** (`/api/2/*`): Not rate limited
- **API v1** (`/api/1/*`): Rate limited (5000 requests per hour per IP)
- **Legacy v1-v3**: Rate limited (varies by endpoint)

### Authentication
- **API v2 & v1**: OAuth2 Bearer tokens (already implemented)
- **Legacy v1-v3**: API key authentication (not implemented)

### Deprecation Status
- **API v2**: Current, actively maintained
- **API v1**: Legacy but still supported
- **API v1-v3**: Deprecated, use v2 when possible

### Next Steps
1. Implement Tier 1 endpoints (most impactful)
2. Add comprehensive error handling for rate limits
3. Consider implementing legacy API key auth for v1-v3 endpoints
4. Add integration tests for new endpoints
