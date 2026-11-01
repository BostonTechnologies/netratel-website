---
title: Hybrid sign-in
description: Offer local accounts and organization SSO on the same NetRatel installation.
---

Hybrid mode offers both local email/passphrase sign-in and your OIDC provider on the same login page. Use it when operators need a mixture of organization accounts and accounts managed directly in NetRatel.

## Enable both methods

First configure [OIDC](/docs/identity/oidc/). Preserve those settings, then set this value in the supplied Compose bundle's `.env`:

```dotenv
NETRATEL_AUTHENTICATION_MODE=Hybrid
```

For a custom Compose stack, set the actual application option on both services:

```yaml
services:
  api:
    environment:
      Authentication__Mode: Hybrid
  web:
    environment:
      Authentication__Mode: Hybrid
```

Apply the change using the same files, environment and project options that manage your deployment. For the basic image bundle:

```sh
docker compose --env-file .env -f compose.images.yaml up -d --force-recreate api web
```

Recreation applies changed environment values; a container restart alone does not.

## Prepare each account

Enabling Hybrid does not create users or copy permissions between sign-in methods.

- Create and activate local users through [account administration](/docs/identity/users-and-tenants/).
- Assign each local user's role in the intended tenant.
- Keep the OIDC provider and OIDC principal assignments configured for SSO users.

A local account and an OIDC account with the same email are different principals. Their roles, owned credentials and integration lists are independent. Choose the intended sign-in method before creating an integration credential.

## Check the result

Open `/login` in a fresh browser session. Confirm that the password form and identity-provider sign-in are available. Sign in once with each intended account, then open a tenant or screen that account is allowed to use.

If the password form is missing, check the effective authentication mode on **both** API and Web. `Auto` selects one method based on configuration; it is not an alias for Hybrid.

If a local user exists but cannot sign in, check activation, password and enabled state. If sign-in succeeds but the expected tenant is absent, correct the role assignment for that principal.

HTTP MCP remains independently configured. Hybrid browser sign-in does not enable NetRatel credentials on the MCP endpoint; choose its [MCP authentication mode](/docs/integrations/http-mcp/) separately.

[Configuration reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/deployment/CONFIGURATION.md#enable-local-login-on-an-existing-sso-instance)
