---
title: Use the CLI
description: Install the Linux CLI, connect a profile and inspect or operate a selected tenant.
---

The NetRatel CLI provides structured commands for operators and automation. The v0.1.2 CLI archive targets Linux x64 and requires the .NET 10 runtime.

## Install

Download [netratel-cli-0.1.2-linux-x64.tar.gz](https://github.com/BostonTechnologies/netratel/releases/download/v0.1.2/netratel-cli-0.1.2-linux-x64.tar.gz) and [SHA256SUMS](https://github.com/BostonTechnologies/netratel/releases/download/v0.1.2/SHA256SUMS) into the same directory. From that directory:

```sh
sha256sum --ignore-missing --check SHA256SUMS
tar -xzf netratel-cli-0.1.2-linux-x64.tar.gz
export PATH="$PWD/netratel-cli-linux-x64:$PATH"
netratel --help
```

The PATH change applies to this shell. Keep the extracted directory in a permanent location if you add it to your normal shell configuration.

## Connect your account

```sh
netratel setup
```

Enter the instance's HTTPS Web URL. Follow the browser approval link, review the requested tenants, permissions and expiry, then return to the terminal to save the connection. CLI setup requests an **API / CLI / stdio MCP** integration credential.

Check the result:

```sh
netratel config validate
netratel auth whoami
netratel doctor
```

`config validate` checks local configuration. `whoami` shows the selected mode and target without printing the secret. `doctor` performs bounded connection checks and distinguishes denied or unavailable stages from completed ones.

## Read a client

Discover a target through the tenant client picker or a permitted directory operation. Substitute its actual tenant and agent IDs:

```sh
netratel clients-v2 get --tenant-id 7 --agent-id "$AGENT_ID"
netratel clients-v2 telemetry --tenant-id 7 --agent-id "$AGENT_ID"
netratel services inventory --tenant-id 7 --agent-id "$AGENT_ID"
netratel monitoring summary --tenant-id 7
```

Each command needs its own current permissions and policy. Authentication success alone does not establish access to every client or operation.

## Find the command you need

| Work | Command groups |
| --- | --- |
| Client identity and state | `clients-v2`, `telemetry` |
| Scripts, tasks and terminal work | `scripts-v2`, `tasks-v2`, `commands`, `terminal-v2` |
| Remote files | `files-v2` |
| Services and alert response | `services`, `monitoring` |
| Flow definitions and history | `flows` |
| AI investigations | `ai` |

Run `netratel <group> --help` and the operation's own `--help` for exact arguments. Results default to JSON; add `--pretty` for readable formatting.

Mutations use review and confirmation. Some groups repeat the reviewed request with `--confirm`; others have separate preview/confirm commands and require returned plan credentials. Preserve the exact target, inputs and request identity shown by the review.

## Keep profiles separate

Use `netratel setup --transport cli --profile NAME` for another connection. `netratel profile list` lists saved profiles; `netratel profile select NAME` prints the explicit selection to use. CLI, stdio MCP and HTTP MCP profiles have separate namespaces.

[v0.1.2 CLI reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/integrations/CLI_AND_MCP.md) · [Configuration keys](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/integrations/configuration.md)
