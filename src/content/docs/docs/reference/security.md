---
title: Security and access model
description: Understand tenant permissions, credential purposes and operation approval.
---

NetRatel checks the caller, permission, tenant, target resource and credential together. Operational tooling can also require a matching MCP policy and an explicit confirmation.

## Accounts and roles

Local accounts and validated OIDC identities have durable NetRatel principal IDs. OIDC identity linking uses issuer and subject, not an email address.

Administrators manage scoped assignments under **Admin → Access** at `/admin/access`. Built-in roles include Instance Administrator, Tenant Administrator, Operator, Observer, Script Editor, Integration Administrator and Publisher. Custom roles use the same permission vocabulary.

A role assigned in one tenant does not grant access in another. The API enforces access for each operation; hiding a navigation item is only a reflection of that access.

## Use the right credential

| Credential | Intended use |
| --- | --- |
| Local session or OIDC browser identity | Interactive access through Web. |
| API-purpose integration credential | CLI, stdio MCP and admitted API operations. |
| HTTP MCP-purpose integration credential | The configured HTTP MCP resource. |
| Native enrolment code and agent credentials | Enrolling and connecting one native client. |

Integration credentials are limited by their explicit grants and the owner's current permissions. Expiry, revocation and account disablement are checked during use. Creating a credential does not grant permissions the account lacks.

## Review operational access

Use [MCP policies](/docs/integrations/operator-policies/) to specify allowed operations, clients and file roots. A matching policy adds a required check; it does not replace tenant permissions.

For a mutation, review the exact target and inputs before confirming. The server checks access again at execution. A saved preview cannot preserve a permission that has since been removed.

File read, write and delete are distinct permissions. Computer-use view/control are also distinct from terminal access. Grant the specific workflow needed by the operator or integration.

## Preserve the instance's keys

The Data Protection key ring protects stored application material. The native-agent signing key has a different purpose. Keep both with the matching database and bootstrap state in your [backup set](/docs/guides/backup-and-restore/).

Use HTTPS for public origins and explicitly configure trusted reverse proxies. Browser sessions, API credentials and enrolled-client credentials remain separate paths through the system.

[v0.1.3 access model](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/operations/rbac.md) · [Deployment configuration](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/deployment/CONFIGURATION.md)
