---
title: OIDC provider setup
description: Choose your identity provider's setup guide for application registration, groups, claims and NetRatel role assignments.
---

Start with [OpenID Connect](/docs/identity/oidc/) for the shared NetRatel configuration and access checks. Then follow the guide for your identity provider:

| Provider | Guide covers |
| --- | --- |
| [Authentik](/docs/identity/oidc/providers/authentik/) | Separate applications/providers, sign-in bindings, group scope mappings and application assignments. |
| [Microsoft Entra ID / Azure](/docs/identity/oidc/providers/entra-id/) | Web/API registrations, delegated API scope, group IDs, app-role claims and application assignments. |
| [Other OIDC providers](/docs/identity/oidc/providers/other-providers/) | The required discovery/token contract, claim mappings and a provider-independent assignment procedure. |

## What a group-to-role mapping needs

Record the complete relationship, not just matching names:

| Provider identity | Intended application access |
| --- | --- |
| Trusted issuer + environment-specific administrator group | `InstanceAdministrator`, instance scope. |
| Trusted issuer + tenant operations group | `Operator`, the selected tenant. |
| Trusted issuer + tenant observation group | `Observer`, the selected tenant. |
| Trusted issuer + another approved role group | The selected [catalog role](/docs/identity/users-and-tenants/#choose-a-role) and its explicit scope. |

The catalog applies regardless of provider. Create groups only for roles you use; a group name is not a permission grant.

In the documented v0.1.3 release, one dedicated administrator group can be selected through `OIDC_ADMIN_GROUP_ID`. Other application roles use explicit principal assignments through the [access-administration API](/docs/identity/oidc/#assign-application-roles-to-an-oidc-user). This is not automatic group synchronization: changing a provider group does not remove a separately saved application assignment. Administrators must review both when changing access.

[NetRatel #478](https://github.com/BostonTechnologies/netratel/issues/478) tracks configurable provider-to-role mappings and the complete OIDC browser administration workflow. Provider-specific instructions describe current release behavior and do not claim that this correction is already available.
