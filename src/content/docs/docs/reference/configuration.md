---
title: Configuration reference
description: Find the settings that control deployment, identity, client endpoints and persistent state.
---

NetRatel uses standard .NET configuration. A colon-separated application key becomes a double-underscore environment variable: `Authentication:Mode` becomes `Authentication__Mode`.

The release bundle's `.env` inputs are a separate layer. Compose maps those inputs into application variables; a custom stack must provide the application variables itself.

## Common deployment settings

| Purpose | Application/container setting | Supplied Compose input |
| --- | --- | --- |
| Browser authentication | `Authentication__Mode` on API and Web | `NETRATEL_AUTHENTICATION_MODE` |
| PostgreSQL connection | `ConnectionStrings__NetRatelDb` | Constructed from the bundle's PostgreSQL inputs, or supplied for external PostgreSQL. |
| Public Web/API origin | `Branding__SiteUrl` on API | `NETRATEL_PUBLIC_ORIGIN` |
| Public native gateway origin | `Branding__GatewayUrl` on API | `NETRATEL_PUBLIC_GATEWAY_ORIGIN` |
| API Data Protection keys | `DataProtection__KeysDirectory` | Persistent key-volume mount. |
| Web key directory | `NetRatel_KEYS_DIR` | Shared persistent key-volume mount. |
| Native-agent signing key | `AgentAuth__PrivateKeyPath` | File mounted through `NETRATEL_AGENT_AUTH_PRIVATE_KEY`. |

Choose `Local`, `Oidc` or `Hybrid` explicitly. `Auto` selects OIDC when supported OIDC settings are present and Local otherwise; it does not offer both methods.

For generated installers, public Web and Gateway origins must both be configured. The same hostname can serve both, but it must be entered explicitly for each role. These origins are separate from Web's internal `ApiBaseUrl` and the identity provider's issuer.

## Change settings

Update the saved environment/configuration source, validate the Compose configuration, then recreate the affected services. A container restart retains the old environment values.

Keep deployment-owned secrets in the configured secret mechanism. When a setting comes from a mounted file or injected environment, change that source rather than expecting a setup wizard to edit it.

## Native client precedence

The client reads packaged defaults, installed `clientsettings.json`, deployment environment variables and supported command-line overrides, in that order. Later sources take precedence. Container clients support:

```dotenv
NetRatelCLIENT__Client__ApiBaseUrl=https://netratel.example.com
NetRatelCLIENT__Gateway__Endpoint=https://grpc.example.com
```

An existing enrolled identity is stored separately from these endpoint settings. Preserve it during updates.

## Detailed settings

Use [Local](/docs/identity/local/), [OIDC](/docs/identity/oidc/) and [Hybrid](/docs/identity/hybrid/) for login configuration. Use [HTTP MCP](/docs/integrations/http-mcp/) for its separate ingress, outbound and delegation settings, and [stdio MCP](/docs/integrations/stdio/) for local MCP profiles.

[Complete v0.1.2 deployment configuration](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/deployment/CONFIGURATION.md)
