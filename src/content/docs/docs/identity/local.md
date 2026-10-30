---
title: Local accounts
description: Set up local sign-in, activate operator accounts and manage authenticator security.
---

Local accounts let you run NetRatel without an identity provider. The installation creates its first administrator through a one-time setup process; it has no default administrator password or public self-registration.

## Create the first administrator

Start with the [deployment guide](/docs/deployment/overview/) and set `NETRATEL_AUTHENTICATION_MODE=Local` in the supplied bundle. The migration service must finish successfully before API and Web start.

1. Open your NetRatel Web address. A fresh installation shows the setup wizard.
2. On the Docker host, from the extracted bundle directory, read the setup code:

   ```sh
   docker compose --env-file .env -f compose.images.yaml exec -T api \
     cat /var/netratel/bootstrap/setup-proof
   ```

3. Enter that code in the wizard. Choose the initial tenant, administrator name, email and a passphrase of at least 15 characters.
4. When setup finishes, sign in with that email and passphrase.

If you are already inside the API container's console, run only `cat /var/netratel/bootstrap/setup-proof`. The code proves access to the installation; it is separate from the passphrase you choose.

## Add an operator

Open **Admin → Access** and choose **Create activation handoff** after entering the person's display name and email. Give the one-time activation token to that person through your normal private handoff channel.

The operator opens `/activate`, enters their email and activation token, and chooses a passphrase. Assign their role and tenant scope in **Admin → Access**. Account activation does not assign permissions.

See [users and tenants](/docs/identity/users-and-tenants/) for role selection.

## Add an authenticator

Open **Account security** at `/account/security` and choose **Set up authenticator**. Complete the displayed enrollment and retain the recovery codes. Future sign-ins ask for the passphrase first, then the authenticator code.

The same page lets you change your passphrase or manage an enrolled authenticator. A passphrase change ends existing sessions, so sign in again afterward.

## When sign-in does not work

| What you see | What to check |
| --- | --- |
| No password form | API and Web must both use `Local` or `Hybrid`; recreate them after changing Compose values. |
| Account cannot sign in | Complete activation and check the account is enabled. |
| Sign-in succeeds but a tenant is missing | Check the account's role assignment for that tenant. |
| Setup code is missing | Inspect API startup and migration logs, then run `dotnet NetRatel.API.dll --setup-status` inside the API container. |

For an established administrator account that cannot be recovered through normal sign-in, use the deployment-side [administrator recovery procedure](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/deployment/FIRST_RUN_SETUP.md#administrator-recovery-and-existing-oidc-identities). It recovers an existing administrator and requires access to the API deployment.
