---
title: Troubleshoot a deployment
description: Start with the failing boundary and collect the smallest useful diagnostic record.
---

Identify whether the problem is deployment startup, browser sign-in, client connectivity or a specific operation. A working login page does not by itself establish that the client gateway or MCP service is configured.

## The server will not start

From the release-bundle directory, use the same environment file and overlays as your deployment:

```sh
docker compose --env-file .env -f compose.images.yaml config --quiet
docker compose --env-file .env -f compose.images.yaml ps -a
docker compose --env-file .env -f compose.images.yaml logs --tail 100 migrations api web
```

For the bundled database, PostgreSQL should be healthy, `migrations` and `volume-init` should exit with code 0, and API/Web should be running. Check database reachability, secret mounts and writable persistent storage when they are not.

## Sign-in does not match the configured mode

| Symptom | First check |
| --- | --- |
| Local account exists but no password form | Set API and Web to `Local` or `Hybrid`, then recreate both containers. |
| SSO redirects fail | Check the provider authority, client ID and exact redirect URI. |
| Sign-in succeeds but an action is denied | Check the user's current tenant permissions. |
| Setup unexpectedly reports Recovery | Restore a matching database, bootstrap and key set. |

`Auto` selects Local or OIDC; it does not enable both. See [authentication modes](/docs/identity/overview/).

## A client is offline

Check its service, effective API/Gateway URLs, TLS trust and enrolment identity. The gateway needs HTTP/2 end to end through the public proxy, with the private upstream routed to the API's h2c gateway listener.

A connection that drops at a repeatable interval may be hitting a proxy stream timeout. Compare the effective proxy settings with the [gateway deployment reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/client/CLIENT.md#sustained-traefik-gateway-streams).

## A CLI or MCP connection fails

Run the selected tooling entry point's `config validate` and `doctor`. Check the configured instance, credential purpose, tenant grants and operation policy. A successful authentication check does not grant every operation. See [CLI diagnostics](/docs/reference/cli/) and [HTTP MCP](/docs/integrations/http-mcp/).

## Report a useful issue

Include the product version, component, operating system, expected result, observed result and steps to reproduce. Add the relevant task, run or operation ID and a small redacted log excerpt. Keep credentials, installation links and private configuration values out of the report.

[Open a product issue](https://github.com/BostonTechnologies/netratel/issues) · [v0.1.3 troubleshooting reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/operations/TROUBLESHOOTING.md)
