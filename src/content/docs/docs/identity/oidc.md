---
title: OpenID Connect
description: Configure provider-neutral OIDC sign-in, assign NetRatel roles and verify access.
---

Use OpenID Connect when your organization already manages operator identities through an identity provider. NetRatel uses an authorization-code flow with PKCE for browser sign-in and validates API access tokens separately.

Start from a working NetRatel installation with a canonical HTTPS Web address and access to your identity provider's application settings.

Use the [provider setup guides](/docs/identity/oidc/providers/) for the identity provider's application registration, group claims and role configuration. This page covers the settings and access checks shared by every provider.

## Choose who can sign in and what they can do

Configure two things separately:

1. **Sign-in access in the provider:** who may use this NetRatel application's OIDC login.
2. **Application access in NetRatel:** the person's role and its instance or tenant scope.

An identity provider's application-access policy allows sign-in. It does not, by itself, assign a NetRatel role. Creating a provider group named `InstanceAdministrator` or sending arbitrary role names does not automatically create application assignments.

The [role catalog](/docs/identity/users-and-tenants/#choose-a-role) includes `InstanceAdministrator`, `TenantAdministrator`, `Operator`, `Observer`, `ScriptEditor`, `IntegrationAdministrator`, `Publisher`, `MonitoringReader`, `MonitoringManager` and `MonitoringResponder`. These are application roles for Local and OIDC identities. Hybrid offers both sign-in methods; it does not copy assignments between them.

Use `InstanceAdministrator` for installation-wide administration. Assign operational roles with the intended tenant. An application `Operator` assignment is not an instance-administrator assignment.

## Register the application

Create a confidential Web application in your provider. For a NetRatel installation at `https://netratel.example.com`, register:

| Provider setting | Value |
| --- | --- |
| Redirect URI | `https://netratel.example.com/signin-oidc` |
| Sign-out callback URI | `https://netratel.example.com/signout-callback-oidc` |
| Requested identity scopes | `openid profile email offline_access` |
| API scope | The scope your provider issues for the NetRatel API |
| API token audience | The audience the NetRatel API will validate |

Replace the example origin with your public Web address. The default callback paths can be changed through `Authentication:Oidc` if your deployment needs different paths.

## Configure the supplied Compose bundle

Set the provider's actual values in the deployment configuration:

```dotenv
NETRATEL_AUTHENTICATION_MODE=Oidc
OIDC_AUTHORITY=https://identity.example.com/your-issuer
OIDC_CLIENT_ID=your-netratel-web-client
OIDC_API_AUDIENCE=your-netratel-api-audience
OIDC_API_SCOPE=your-netratel-api-scope
OIDC_TOKEN_ENDPOINT=https://identity.example.com/your-token-endpoint
OIDC_ADMIN_GROUP_ID=your-dedicated-instance-admin-group-value
```

Supply `OIDC_CLIENT_SECRET` through the deployment's secret mechanism. Copy the authority and token endpoint from the provider's discovery metadata. Set the explicit token endpoint so token refresh uses the provider's actual endpoint.

The bundle maps these values to API and Web. In a custom stack, use the complete container environment keys:

| Service | Environment keys |
| --- | --- |
| API and Web | `Authentication__Mode=Oidc`, `Authentication__Oidc__Authority` |
| Web | `Authentication__Oidc__ClientId`, `Authentication__Oidc__ApiScope`, `Authentication__Oidc__TokenEndpoint`, plus the `OIDC_CLIENT_SECRET` secret |
| API | `Authentication__Oidc__Audience`, `Authorization__Oidc__AdminGroupId` |

`NETRATEL_AUTHENTICATION_MODE` is an input to the supplied Compose bundle; a custom stack must map it to `Authentication__Mode`.

In v0.1.3, `OIDC_ADMIN_GROUP_ID` selects one provider `groups` claim value for installation-wide administration. It is not a general group-to-role mapping table. Use a dedicated administrator group, keep ordinary sign-in users out of it, and leave it unset if you manage all access through explicit application assignments. The API also treats a provider `Operator` role/group claim as installation-wide authority in this release; do not emit it for ordinary operators. Use explicit scoped assignments for those people.

Recreate API and Web using your complete deployment command. For the basic image bundle:

```sh
docker compose --env-file .env -f compose.images.yaml up -d --force-recreate api web
```

## Keep test and production separate

Register separate clients and application-access rules for each installation. Keep callback URLs, secrets, API audiences and administrator groups with their intended environment. Use a separate issuer where the provider supports one per application; otherwise enforce the separate audience and application assignment.

A browser-access group and an MCP-consumer group have different purposes. Membership in one does not automatically grant access through the other. Configure [HTTP MCP](/docs/integrations/http-mcp/) separately.

## Assign application roles to an OIDC user

In v0.1.3, **Admin → Access** lists local accounts. OIDC users have durable application principal IDs, but their role assignments use the authenticated access-administration API. Configurable per-role provider mappings and a complete OIDC browser editor are tracked in [NetRatel #478](https://github.com/BostonTechnologies/netratel/issues/478); creating similarly named provider groups alone does not enable them.

An authorized administrator can use the existing API as follows. Run these requests against the **API origin**, with an API client authenticated for that installation. Browser cookies alone are not API bearer credentials.

| Action | Request | What to use |
| --- | --- | --- |
| Identify the signed-in OIDC principal | `GET /api/v2/access/self` as that user | Returned `principalId`; identify the account by validated issuer and subject, not email. |
| Find the role | `GET /api/v2/access/roles` as the administrator | The saved `id` for the intended role; do not use the role name as its ID. |
| Find a tenant | `GET /api/v2/access/tenants` as the administrator | The intended `tenantId`, or instance scope where appropriate. |
| Assign the role | `PUT /api/v2/access/principals/{principalId}/assignments` | JSON body with `roleId` and `tenantId`. |
| Read back assignments | `GET /api/v2/access/principals/{principalId}/assignments` | Verify both role and scope. |

For an instance-administrator assignment, use the saved `InstanceAdministrator` role ID with `"tenantId": null`. For a tenant Operator, use the saved `Operator` role ID and that tenant's numeric ID. The caller must hold authority to make the assignment; users cannot grant themselves access. See [users, roles and tenants](/docs/identity/users-and-tenants/) for the role descriptions.

Some v0.1.3 provider-admitted administrator sessions return `null` for `principalId` in the self summary. Do not substitute an email, provider subject or invented ID in the assignment URL. This identity-discovery gap is also part of [#478](https://github.com/BostonTechnologies/netratel/issues/478); the API procedure requires an actual resolved NetRatel principal ID.

Keep an existing working administrator available while changing mappings or assignments. Confirm the replacement access before removing the old assignment or provider membership.

## Verify sign-in and access

1. Open `/login` in a fresh session and choose the identity-provider sign-in.
2. Complete the provider's login and return to NetRatel.
3. Open an authorized tenant and read its client list.
4. Check a protected API-backed screen as well as the landing page. A successful browser login does not prove the API audience and scopes are correct.
5. For an intended instance administrator, read `/api/v2/access/self` through an authenticated API client. Confirm `isInstanceAdministrator` is true, then open **Admin → Access** and **Admin → MCP Policies**. A true summary alone does not prove every protected route admits the session.
6. For a tenant operator, confirm the permitted tenant works and an unassigned tenant or installation-administration route is denied.

Repeat these checks independently for test and production. In Hybrid, check the Local and OIDC identities separately even when their email addresses match.

### MCP Policies returns 403 despite administrator access

The v0.1.3 OIDC administrator path also checks the OAuth scope `netratel.mcp.admin` on the MCP policy-administration route. A session can therefore report instance-administrator authority yet receive `operator_policy_request_failed, HTTP 403` at `/admin/operator-policies`.

The [browser authorization correction in #478](https://github.com/BostonTechnologies/netratel/issues/478) tracks this inconsistency. It does not mean that Local, OIDC or Hybrid is a different kind of login, and adding every user to a broad provider group is not a remedy. Verify the actual access result, token scope names and deployed version; report the mismatch without posting a raw token. A documentation update does not change the installed authorization code.

## Resolve common problems

| Symptom | Check |
| --- | --- |
| Provider rejects the redirect | Exact public origin and callback path, including HTTPS. |
| Login works but API calls return 401 | API audience, issuer, signing keys and requested API scope. |
| Login works but API calls return 403 | Effective application role/tenant scope, the provider's emitted API claims and any route-specific requirement. |
| Group exists but user has no application role | A sign-in policy binding is not a role assignment. Check the emitted administrator-group value or the principal's explicit application assignments. |
| Test access unexpectedly works in production | Check that the production provider, client, issuer and group mapping use only production values. |
| Redirect uses an internal hostname | Trusted proxy settings and allowed public hosts. |

Use [Hybrid sign-in](/docs/identity/hybrid/) when you also want local accounts available. Matching email addresses do not link Local and OIDC identities.

[OIDC configuration reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/deployment/CONFIGURATION.md#interactive-browser-authentication)
