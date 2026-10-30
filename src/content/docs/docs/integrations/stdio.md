---
title: Stdio MCP and the HTTP bridge
description: Launch NetRatel from a local MCP consumer, or bridge that consumer to the hosted HTTP MCP endpoint.
---

Stdio MCP works with applications that launch a local process and communicate over its standard input and output. NetRatel provides both a direct API connection and a bridge to its hosted HTTP MCP service.

| Path | What it connects to | Credential purpose |
| --- | --- | --- |
| Direct stdio | NetRatel API | API / CLI / stdio MCP |
| `http-bridge` | Canonical HTTPS `/mcp` endpoint | HTTP MCP gateway |

## Install the tooling

Install the .NET 10 runtime on the consumer's machine. Download the matching archive and `SHA256SUMS` from [v0.1.2](https://github.com/BostonTechnologies/netratel/releases/tag/v0.1.2):

- Linux x64: `netratel-mcp-stdio-0.1.2-linux-x64.tar.gz`
- Windows x64: `netratel-mcp-stdio-0.1.2-win-x64.zip`

Verify the archive against its checksum, then extract it. The folders are named `netratel-mcp-linux-x64` and `netratel-mcp-win-x64`. Use the same operating-system account that runs your MCP consumer.

## Connect directly to the API

From the extracted tooling directory, run:

```sh
dotnet ./NetRatel.Mcp.dll setup --transport stdio --profile mcp-operator
```

On Windows, the equivalent apphost command is:

```powershell
.\NetRatel.Mcp.exe setup --transport stdio --profile mcp-operator
```

Enter the NetRatel Web URL. Open the browser approval link, review the intended tenant permissions and expiry, then return to the terminal to save the profile. Setup shows the resolved configuration location and launch instructions.

Add that launch configuration to your consumer. An explicit-file example looks like this; replace both absolute paths with the ones on your machine:

```json
{
  "command": "dotnet",
  "args": ["/absolute/path/netratel-mcp-linux-x64/NetRatel.Mcp.dll"],
  "env": {
    "NETRATEL_MCP_CONFIG": "/absolute/path/to/your-stdio-profile.json",
    "NETRATEL_MCP_INSTANCE": "prod"
  }
}
```

Use the generated configuration when available. Select `prod` for the production operator surface; `dev` selects the development compatibility surface. The process does not infer this choice from the API URL. The stdio server keeps its configuration separate from CLI profiles and does not import ambient CLI credentials.

## Use a stdio-only client with HTTP MCP

Complete [HTTP MCP hosting](/docs/integrations/http-mcp/) first. In the same extracted tooling directory, create a separate HTTP client profile:

```sh
dotnet ./NetRatel.Mcp.dll setup --transport http --profile http-operator
```

Approve the HTTP MCP-purpose credential and canonical resource. Configure your consumer to launch:

```json
{
  "command": "dotnet",
  "args": [
    "/absolute/path/netratel-mcp-linux-x64/NetRatel.Mcp.dll",
    "http-bridge",
    "--profile",
    "http-operator"
  ]
}
```

A consumer with maintained native Streamable HTTP support can connect directly to `/mcp` instead of using the bridge.

## Verify and troubleshoot

For the direct stdio profile above, run:

```sh
dotnet ./NetRatel.Mcp.dll config validate --transport stdio --profile mcp-operator
dotnet ./NetRatel.Mcp.dll doctor --transport stdio --profile mcp-operator
```

For the HTTP bridge profile, use `--transport http --profile http-operator` instead. Reconnect the actual consumer after changing its launch entry, then check its reported NetRatel version, authentication status and one permitted tenant read.

Setup is interactive; ordinary stdio startup is not. A consumer must launch the serving process, not the `setup` command. JSON-RPC is written to stdout and diagnostics to stderr.

If direct stdio rejects a credential, check that it has API purpose. If the bridge rejects one, check HTTP MCP purpose and the exact `/mcp` resource. These paths do not substitute credentials for each other.

The Windows package also includes a protected launcher for existing DPAPI credentials. Use the [Windows migration procedure](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/integrations/http-mcp-bridge.md#retain-an-existing-windows-dpapi-credential) when retaining an encrypted credential from another launcher.

[Tooling configuration reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/integrations/configuration.md)
