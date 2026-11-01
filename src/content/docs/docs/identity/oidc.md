---
title: OpenID Connect
description: Connect NetRatel to an OIDC identity provider with the correct callbacks, audience and operator permissions.
---

Use OpenID Connect when your organization already manages operator identities through an identity provider. NetRatel uses an authorization-code flow with PKCE for browser sign-in and validates API access tokens separately.

Start from a working NetRatel installation with a canonical HTTPS Web address and access to your identity provider's application settings.

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
OIDC_ADMIN_GROUP_ID=your-operator-group-id
```

Supply `OIDC_CLIENT_SECRET` through the deployment's secret mechanism. Copy the authority and token endpoint from the provider's discovery metadata. The token endpoint setting is needed when your provider does not use the default Azure-compatible refresh-token path.

The bundle maps these values to API and Web. In a custom stack, use the complete container environment keys:

| Service | Environment keys |
| --- | --- |
| API and Web | `Authentication__Mode=Oidc`, `Authentication__Oidc__Authority` |
| Web | `Authentication__Oidc__ClientId`, `Authentication__Oidc__ApiScope`, `Authentication__Oidc__TokenEndpoint`, plus the `OIDC_CLIENT_SECRET` secret |
| API | `Authentication__Oidc__Audience`, `Authorization__Oidc__AdminGroupId` |

`NETRATEL_AUTHENTICATION_MODE` is an input to the supplied Compose bundle; a custom stack must map it to `Authentication__Mode`.

Recreate API and Web using your complete deployment command. For the basic image bundle:

```sh
docker compose --env-file .env -f compose.images.yaml up -d --force-recreate api web
```

## Verify sign-in and access

1. Open `/login` in a fresh session and choose the identity-provider sign-in.
2. Complete the provider's login and return to NetRatel.
3. Open an authorized tenant and read its client list.
4. Check a protected API-backed screen as well as the landing page. A successful browser login does not prove the API audience and scopes are correct.

The configured operator group provides the documented administrator compatibility mapping. Durable NetRatel role assignments can grant more specific access. The browser's **Admin → Access** user list currently covers local accounts; OIDC assignments use the authenticated access-administration API.

## Resolve common problems

| Symptom | Check |
| --- | --- |
| Provider rejects the redirect | Exact public origin and callback path, including HTTPS. |
| Login works but API calls return 401 | API audience, issuer, signing keys and requested API scope. |
| Account lacks access | Provider group claims or the principal's durable NetRatel assignments. |
| Redirect uses an internal hostname | Trusted proxy settings and allowed public hosts. |

Use [Hybrid sign-in](/docs/identity/hybrid/) when you also want local accounts available. Matching email addresses do not link Local and OIDC identities.

[OIDC configuration reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/deployment/CONFIGURATION.md#interactive-browser-authentication)
