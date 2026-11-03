---
title: Other OIDC providers
description: Configure another standards-based OIDC provider and connect its group claims to explicit NetRatel application access.
---

Use this procedure when your provider has no dedicated guide. Complete [the shared NetRatel setup](/docs/identity/oidc/) alongside the provider's own instructions. Portal labels and group/role claim formats vary, so record the actual values rather than copying another provider's defaults.

## Register and discover

1. Register a confidential browser client that supports authorization code with PKCE. Add the exact public Web redirect and sign-out callback URLs from the shared guide.
2. Enable the required identity scopes and refresh-token access, subject to the provider's policy. Define or select an API resource/scope for the NetRatel API.
3. Read that issuer's OpenID configuration. Record its issuer, authorization endpoint, token endpoint and JWKS URI. API and Web must be able to reach the metadata and key endpoints.
4. Configure the Web client ID/secret and requested API scope. Set the API audience to the access token's actual resource audience. An ID token or opaque access token is not a substitute for the signed API JWT expected by this deployment.
5. Use separate clients, secrets, resource audiences and access assignments for test and production. Keep issuers distinct when the provider supports it.

Use the provider's discovery document to obtain endpoints, as defined by [OpenID Connect Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html). Do not derive a token endpoint from another vendor's URL pattern.

## Map group membership into the token

Choose a dedicated administrator group for this application/environment. Configure a claim mapper so the validated API access token includes its exact value in `groups` when the user is a member.

An illustrative token fragment is:

```json
{
  "groups": ["netratel-test-instance-admins"]
}
```

For this example, set `OIDC_ADMIN_GROUP_ID=netratel-test-instance-admins` in the test deployment. If the provider emits UUIDs or full group paths, configure that exact emitted value instead. Ensure ordinary users do not receive the administrator value. Provider-side sign-in permission is separate from this claim.

If the provider emits roles under nested objects or a custom claim, do not assume NetRatel discovers or flattens them. Confirm the current [application claim behavior](/docs/identity/oidc/#configure-the-supplied-compose-bundle). Avoid a provider `Operator` role/group value for ordinary operators in v0.1.3 because it grants installation-wide authority in that release.

## Assign the catalog roles

Use a separate provider group for each intended responsibility and environment where useful. Record its trusted issuer, stable group value, intended [NetRatel role](/docs/identity/users-and-tenants/#choose-a-role) and tenant/instance scope using the [mapping plan](/docs/identity/oidc/providers/#what-a-group-to-role-mapping-needs).

In v0.1.3, arbitrary group/role claim values do not automatically become catalog-role assignments. An authorized administrator must save the role and scope for each resolved OIDC principal through [the assignment API](/docs/identity/oidc/#assign-application-roles-to-an-oidc-user). Group removal does not delete that separate assignment; review both sides of access changes. [#478](https://github.com/BostonTechnologies/netratel/issues/478) tracks configurable mapping and browser administration.

## Verify with two users

Use an intended administrator and a scoped operator. Obtain fresh sessions, confirm issuer/audience and relevant claim names without sharing raw tokens, and follow [the shared access checks](/docs/identity/oidc/#verify-sign-in-and-access). The administrator should have the expected installation access, while the scoped operator must be denied outside the assigned scope.

For 401 responses, check token validation and configuration. For 403 responses, check effective role/scope and [the current MCP Policies requirement](/docs/identity/oidc/#mcp-policies-returns-403-despite-administrator-access). This procedure does not claim certification of an unspecified provider.
