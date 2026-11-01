---
title: Choose a sign-in method
description: Choose Local, OIDC or Hybrid sign-in for your NetRatel installation.
---

NetRatel can manage accounts itself, use your identity provider, or offer both. Choose the mode that fits the people operating your installation.

| Mode | What people see | Use it when |
| --- | --- | --- |
| **Local** | Email and passphrase | You want NetRatel accounts without an identity provider. |
| **OIDC** | Your organization's sign-in | Your identity provider manages operator authentication. |
| **Hybrid** | Both sign-in methods | Staff use SSO and selected operators also need local accounts. |

All three use NetRatel's tenant and role assignments to control access. Signing in and receiving permission to operate a tenant are separate steps.

## Set the mode

In the supplied Compose bundle, set one value in the deployment's `.env`:

```dotenv
NETRATEL_AUTHENTICATION_MODE=Local
```

Use `Oidc` or `Hybrid` for the other modes. OIDC and Hybrid also need the [identity provider configuration](/docs/identity/oidc/).

Recreate API and Web using the same Compose files and project options as your deployment. For the basic image bundle:

```sh
docker compose --env-file .env -f compose.images.yaml up -d --force-recreate api web
```

A custom Compose file must map `Authentication__Mode` into **both** services. The shorter `NETRATEL_AUTHENTICATION_MODE` variable works because the supplied bundle performs that mapping.

Open `/login` in a fresh browser session and check that the expected sign-in methods appear.

## Make the choice explicit

The default `Auto` mode selects OIDC when supported OIDC settings are present; otherwise it selects Local. It never enables both. Explicit configuration makes the intended behavior easier to maintain.

Local and OIDC accounts remain separate identities, even when they share an email address. Each has its own roles and integration credentials. OIDC identities are identified by their provider's issuer and subject.

## Next steps

- [Local accounts](/docs/identity/local/): complete setup, activate users and enable an authenticator.
- [OIDC](/docs/identity/oidc/): register your application and configure SSO.
- [Hybrid](/docs/identity/hybrid/): enable both methods on one installation.
- [Users and tenants](/docs/identity/users-and-tenants/): assign access to the right scope.

Browser sign-in mode does not configure [HTTP MCP authentication](/docs/integrations/http-mcp/). MCP has its own endpoint, credentials and permissions.

[Configuration reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/deployment/CONFIGURATION.md)
