---
title: Authentik OIDC setup
description: Configure Authentik applications, group claims and NetRatel application access for separate test and production installations.
---

Use this guide for the Authentik side of [OIDC sign-in](/docs/identity/oidc/). You need permission to manage its applications, providers, groups and property mappings. NetRatel administrators do not need Authentik superuser membership.

## Separate the installations

Create an application and confidential OAuth2/OpenID Connect provider for each NetRatel installation. Example names:

| Environment | Application/provider | Sign-in group | Administrator group |
| --- | --- | --- | --- |
| Test | `netratel-test` | `netratel-test-access` | `netratel-test-instance-admins` |
| Production | `netratel-prod` | `netratel-prod-access` | `netratel-prod-instance-admins` |

These names are illustrative. Keep each provider's callbacks, client secret and API audience with that environment. Prefer Authentik's per-provider issuer so the test and production applications have separate issuer identities.

## Register the browser application

1. In **Applications → Providers**, create the confidential OAuth2/OpenID Connect provider. Register the installation's exact `/signin-oidc` callback and `/signout-callback-oidc` sign-out callback.
2. Associate it with the matching application in **Applications → Applications**.
3. In **Directory → Groups**, create the environment's sign-in and administrator groups. Add each person deliberately; include administrators in the sign-in group too.
4. In the application's **Policy / Group / User Bindings**, allow the sign-in group to use the application. This grants login access, not a NetRatel catalog-role assignment.
5. Keep the identity scopes and `offline_access` mapping available. Configure the API scope the Web client will request.

Copy issuer and token-endpoint values from the application's discovery document. For the example test slug, discovery is at `https://identity.example.com/application/o/netratel-test/.well-known/openid-configuration`. The token endpoint is normally `https://identity.example.com/application/o/token/`. Use discovery's actual issuer and the API token's actual audience in NetRatel.

The [Authentik OAuth2 provider reference](https://docs.goauthentik.io/add-secure-apps/providers/oauth2/) explains provider endpoints, issuer selection and refresh-token scopes.

## Emit the group claim

Create an OAuth2/OIDC scope mapping under **Customization → Property Mappings**, give it the API scope name the client requests, and select it in the provider's scope mappings. Enable **Include claims in id_token** so mapped claims are included in the issued tokens rather than available only through UserInfo. Check the API access token in particular.

This example mapping emits membership in the test administrator group:

```python
admin_group = "netratel-test-instance-admins"
return {
    "groups": [group.name for group in request.user.groups.all()
               if group.name == admin_group]
}
```

For that mapping, set this value in the **test deployment's** Compose environment:

```dotenv
OIDC_ADMIN_GROUP_ID=netratel-test-instance-admins
```

Use a separate production mapping and administrator-group value. If you emit group IDs instead of names, configure the emitted ID, not its display name.

Test the mapping with an administrator and an ordinary member. A custom mapping does not remove group values emitted by another mapping: review the default profile mapping too when an allowlist is required. See [Authentik's scope-mapping rules](https://docs.goauthentik.io/add-secure-apps/providers/property-mappings/#scope-mappings-with-oauth2).

## Connect groups to application roles

For ordinary roles, create environment-specific groups such as `netratel-test-observers` or `netratel-test-tenant-operators` to record intended membership. Choose any of the ten [NetRatel catalog roles](/docs/identity/users-and-tenants/#choose-a-role) and a tenant or instance scope according to the [mapping plan](/docs/identity/oidc/providers/#what-a-group-to-role-mapping-needs).

In v0.1.3, these group names do not automatically assign catalog roles. An authorized administrator must resolve each OIDC user's NetRatel principal and save the role/scope using the [assignment procedure](/docs/identity/oidc/#assign-application-roles-to-an-oidc-user). Review saved assignments when group membership changes; there is no automatic synchronization in this procedure.

Do not emit `roles: ["Operator"]` or `groups: ["Operator"]` for ordinary operators: v0.1.3 treats that provider value as installation-wide authority. Use scoped application assignments for operational access. The dedicated `OIDC_ADMIN_GROUP_ID` mapping above is only for intended installation administrators.

## Verify the result

Apply [the shared NetRatel configuration](/docs/identity/oidc/#configure-the-supplied-compose-bundle), then sign out and sign in again. Check the [shared verification steps](/docs/identity/oidc/#verify-sign-in-and-access) with an administrator and a scoped operator. Repeat independently for production.

If the administrator can sign in but **MCP Policies** returns 403, use the [current-release diagnosis](/docs/identity/oidc/#mcp-policies-returns-403-despite-administrator-access). Browser groups do not configure a separate [HTTP MCP consumer](/docs/integrations/http-mcp/).

These are source-reviewed instructions and an illustrative expression; they do not report a live test of your Authentik deployment.
