---
title: Microsoft Entra ID / Azure OIDC setup
description: Register NetRatel Web and API in Microsoft Entra ID, emit group or app-role claims, and assign application roles with explicit scope.
---

Use this guide for Microsoft Entra ID, also known as Azure AD. Start with the [shared OIDC setup](/docs/identity/oidc/). You need authority to manage the selected directory's app registrations, enterprise application assignments and consent.

## Register Web and API

Use separate Web and API registrations for each environment, for example `NetRatel Test Web` / `NetRatel Test API` and a separate production pair.

In the Entra admin center:

1. Create the API registration. Under **Expose an API**, define a delegated scope such as `netratel.access`; record its full resource-qualified scope URI. Configure `api.requestedAccessTokenVersion` as `2` in the API registration's manifest for the v2 token example below.
2. Create a confidential Web registration with the exact public `/signin-oidc` Web redirect URI. Register the sign-out callback as required by the shared setup and keep the client secret in the deployment's secret store.
3. Give the Web registration delegated permission to the API scope and obtain the consent required by your directory. This browser flow uses a signed-in user, not an application-only permission grant.
4. Limit enterprise application sign-in to the intended users/groups where your directory policy requires assignment. Keep test and production assignments separate.

Microsoft documents [exposing an API scope](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-configure-app-expose-web-apis) and the [API token-version setting](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest#api-attribute). The Web client ID, API audience and API scope are distinct values.

## Configure NetRatel

Replace every bracketed placeholder with that environment's actual value:

```dotenv
NETRATEL_AUTHENTICATION_MODE=Oidc
OIDC_AUTHORITY=https://login.microsoftonline.com/<directory-tenant-id>/v2.0
OIDC_CLIENT_ID=<web-application-client-id>
OIDC_API_AUDIENCE=<api-application-client-id>
OIDC_API_SCOPE=api://<api-application-client-id>/netratel.access
OIDC_TOKEN_ENDPOINT=https://login.microsoftonline.com/<directory-tenant-id>/oauth2/v2.0/token
```

The scope URI above assumes the API's identifier is `api://<api-application-client-id>`. Use the full scope you actually exposed. Supply `OIDC_CLIENT_SECRET` for the **Web** registration through your secret mechanism. For the v2 API example, validate the API application's client ID as audience; confirm the actual token's issuer/audience before applying the settings. Use the directory-specific authority, not a directory-independent login URL.

## Use a dedicated administrator group

Create environment-specific security groups, such as `NetRatel-Test-Access` and `NetRatel-Test-InstanceAdmins`. The access group controls application sign-in; the administrator group has a separate purpose.

Configure the **API registration's** token configuration to include the intended `groups` claim. Choose an appropriate group-selection filter and check that the administrator's API access token actually contains the administrator group's object ID. Then configure that object ID as `OIDC_ADMIN_GROUP_ID` in the matching NetRatel deployment. Do not use the group's display name when the token emits its object ID.

Large memberships can produce an overage indicator instead of a group list. NetRatel's configured group match needs the actual group value; do not assume it follows an overage reference. Where group claims are restricted to application-assigned groups, use direct membership and verify the result. See [Microsoft's group-claim guidance](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims).

## Groups, app-role claims and NetRatel roles

Entra can assign users/groups to an app role and emit its value in `roles`. For a Web-to-API flow, define the role on the **API registration** and assign the user/group through that API's enterprise application. A role appearing only in the Web ID token does not prove it is present in the API access token. See [Microsoft's app-role procedure](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps).

Those emitted claims are provider data. In v0.1.3, naming an Entra app role `Observer`, `TenantAdministrator` or `InstanceAdministrator` does not automatically create a matching NetRatel assignment. Follow the [group-to-role plan](/docs/identity/oidc/providers/#what-a-group-to-role-mapping-needs) and save the intended [application role and tenant scope](/docs/identity/oidc/#assign-application-roles-to-an-oidc-user) for each resolved OIDC principal. Review these assignments when directory membership changes.

Use the dedicated administrator-group method above for provider-selected installation administrators. Do not create an Entra app-role value `Operator` for ordinary operators: v0.1.3 interprets that provider value as installation-wide authority, while the application `Operator` role is scoped operational access. Configurable catalog-role claim mappings are tracked in [#478](https://github.com/BostonTechnologies/netratel/issues/478).

## Verify the result

Apply the [shared deployment settings](/docs/identity/oidc/#configure-the-supplied-compose-bundle), obtain a fresh sign-in session, and perform the [administrator and scoped-user checks](/docs/identity/oidc/#verify-sign-in-and-access) in each environment. A directory administrator role does not, by itself, make the person a NetRatel administrator.

Check the [v0.1.3 MCP Policies 403 diagnosis](/docs/identity/oidc/#mcp-policies-returns-403-despite-administrator-access) if that screen rejects an otherwise authorized administrator. These instructions are source-reviewed; they are not evidence of a live Entra deployment test.
