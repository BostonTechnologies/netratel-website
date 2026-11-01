---
title: Connect your tools
description: Choose the right NetRatel interface for automation, AI assistants and helpdesk workflows.
---

NetRatel exposes the same managed systems through several interfaces. Choose the connection that matches the tool you are using.

| You want to… | Use | Connection |
| --- | --- | --- |
| Work from a terminal or shell script | [CLI](/docs/reference/cli/) | Your machine → NetRatel API |
| Connect an assistant that launches a local process | [Stdio MCP](/docs/integrations/stdio/) | Local MCP process → NetRatel API |
| Connect an assistant over HTTPS | [HTTP MCP](/docs/integrations/http-mcp/) | Assistant → MCP service → NetRatel API |
| Chat and investigate from NetRatel | [Netclaw](/docs/integrations/netclaw/) | NetRatel → your tenant's Netclaw daemon |
| Turn alerts into incidents or run helpdesk automation | [RatelDesk](/docs/integrations/rateldesk/) | Paired systems with an explicit tenant mapping |

The Web application and native clients work without the optional HTTP MCP service.

For software queries, both HTTP and stdio expose the same `netratel_software`
operations. Start with a permitted saved snapshot or installation read, then
request a refresh only when needed. The [software inventory guide](/docs/guides/software-inventory/)
explains the collection and authorisation boundaries.

## Start with a small connection

For a new HTTP MCP client, a useful first connection has the server permission `mcp.discovery.read` and the tenant permission `flow.read`. Approve its corresponding read policy, connect, then list flows in that tenant. An empty list is a valid result.

Add further capabilities through the [credential editor](/docs/integrations/credentials/) when you need them. A credential can contain multiple named tenants, but each tenant's permissions are selected independently.

## Keep the identities straight

| Identity | Purpose |
| --- | --- |
| API / CLI / stdio credential | Personal or automation access to the business API. |
| HTTP MCP credential | Access to one canonical HTTPS `/mcp` resource. |
| MCP host service identity | The separately configured MCP service's connection to the API. |
| Native client enrollment | Registration of a managed endpoint. |
| Netclaw pairing credential | A tenant's native chat connection to its daemon. |
| RatelDesk system pairing | Authorized capabilities between mapped systems. |

These identities have different purposes. An HTTP MCP client credential cannot replace the MCP host's service identity or a native client's enrollment code.

## Understand an operation's result

Authentication tells you which connection is in use. [Credential grants](/docs/integrations/credentials/) specify its selected permissions. [Operator policies](/docs/integrations/operator-policies/) restrict the operations and targets it may use. The target system must also be available and support the requested action.

For actions that return a preview, review it before confirming. After submission, follow the returned task or operation ID until it reports an outcome; a queued response means work has been accepted, not completed.

[CLI and interface reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/integrations/CLI_AND_MCP.md)
