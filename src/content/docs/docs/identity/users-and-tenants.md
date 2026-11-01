---
title: Users, roles and tenants
description: Give each operator the right role in the right tenant, and understand how integration access follows it.
---

A tenant groups the systems an operator is allowed to manage. Assign a role and its scope together: permission in one tenant does not grant access to another.

## Add a local operator

1. Sign in with access-administration authority and open **Admin → Access** (`/admin/access`).
2. Under **Create local user**, enter the person's name and email, then select **Create activation handoff**.
3. Deliver the one-time token privately. The person opens `/activate`, enters the email and token, and sets a passphrase.
4. Select the intended scope in **Manage tenant**. Instance administrators can also select **Instance-wide**.
5. Select the local user, choose a role and select **Add**.
6. Confirm the saved role and scope in **Assignments**. Ask the operator to open a permitted tenant and read its clients.

The access page lists local accounts. OIDC accounts have durable principal IDs too, but their assignments currently use the authenticated `/api/v2/access` administration API. Matching an email address does not identify or link an OIDC account; its issuer and subject do.

## Choose a role

The built-in catalog includes:

| Role | Starting point |
| --- | --- |
| `Observer` | People who need visibility into systems. |
| `Operator` | People carrying out operational work. |
| `ScriptEditor` | People maintaining the script library. |
| `IntegrationAdministrator` | People configuring integrations. |
| `Publisher` | People publishing artifacts. |
| `TenantAdministrator` | Administration within a tenant. |
| `InstanceAdministrator` | Administration across the installation. |

Inspect the role's actual permissions before assigning it. Existing and custom roles are preserved during upgrades; their name alone does not describe every permission currently saved in your installation.

Custom roles use the same permission catalog. The person creating or assigning access can only delegate authority they hold in that scope. NetRatel prevents removal of the last instance administrator.

## Change or remove access

Select the same user and scope, then remove the assignment you intend to retire. Changes are checked on the next API operation. Refreshing a browser menu is not what enforces access; the API checks it.

An integration credential inherits a ceiling from its owner's current access. Its selected grants can be narrower, but cannot exceed the owner's permissions. Expiry, revocation, account status and tenant access are checked when it is used.

[MCP operator policies](/docs/integrations/operator-policies/) add operation and target restrictions. An account role, credential grant and matching policy each have a separate job; adding a role does not automatically allow every MCP action.

[Role and permission reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/operations/rbac.md)
