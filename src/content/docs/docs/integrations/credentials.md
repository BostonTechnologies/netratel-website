---
title: Integration credentials
description: Create a scoped credential, edit its access in the browser and rotate it without losing track of its consumers.
---

Create one credential for each tool or connection you want to manage independently. Give it a recognizable name, an expiry and only the tenant and server permissions it needs.

Open **Integrations → API & MCP credentials** at `/account/integration-credentials?tab=credentials` while signed in as the intended credential owner.

## Choose its purpose

| Purpose | Accepted by |
| --- | --- |
| **API / CLI / stdio MCP** | The NetRatel business API, CLI and direct stdio server. |
| **HTTP MCP gateway** | The configured canonical HTTPS MCP endpoint. |

The credential owner needs current NetRatel role assignments for every requested permission. A credential cannot grant more access than its owner holds. Local and OIDC logins have separate owned-credential lists.

## Create an HTTP MCP credential

Complete [HTTP MCP host setup](/docs/integrations/http-mcp/) first, then:

1. Select **Create credential → HTTP MCP gateway**. Enter a name, the canonical `/mcp` URL and the exact UTC expiry.
2. Under **Server access**, select the required instance permissions. **Discover MCP capabilities** (`mcp.discovery.read`) supports discovery and authentication-status checks.
3. Under **Tenant access**, choose **Add tenant**, select the tenant by name and ID, and select its permissions. Repeat only for the tenants this connection needs.
4. Under **Policies**, review one base policy per tenant and the separate Server access base. Choose **Read only**, **All access** within the selected grants, or narrower operation families and limits.
5. Review the connection, expiry, all grants and policy bounds. Explicitly approve creation.
6. Store the one-time secret in the consumer's protected configuration and choose **I stored the secret** within five minutes.

New setup saves the credential and approved base policies together. Policy expiry cannot exceed credential expiry. Creating or changing policies requires the corresponding policy-administration authority.

For a first read, choose `mcp.discovery.read` for the server and `flow.read` for one tenant. Tenant and server grants are separate; selecting a server permission does not supply a missing tenant grant.

## Edit access without replacing the secret

Open the credential's **Details → Configured access → Edit access**.

1. Review the existing selections.
2. Add a tenant, change its permissions or remove its grant group. Use **Access scope → Server-level access** to edit instance permissions separately.
3. Review the base policies and choose **Review changes**.
4. Check the complete resulting access, including removals, then choose **Apply changes** if your account can approve it.

If another operator must approve, give them the displayed code and review URL. Keep the editor open or reopen it after approval; it applies the approved result without an MCP client or an agent.

The credential ID, secret, purpose, resource and exact expiry remain unchanged. The installed consumer continues using its existing secret. **Back to edit** cancels that pending review and keeps your selections for correction.

## Verify, rotate or revoke

Use **Details → Refresh admission**, then run a permitted read through the actual consumer. For a new tenant, check that tenant explicitly.

To rotate a credential, create its replacement, update the consumer, verify a permitted read, then revoke the old credential. Deleting a local profile does not revoke the server credential. An expired or revoked credential needs an intentional replacement; its secret cannot be retrieved later.

[Credential setup and editing reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/mcp-http/setup.md#choose-tenant-and-server-access-yourself)
