---
title: Use terminals and inspect services
description: Open an interactive shell or inspect Windows and Linux service state.
---

Open a terminal when you need an interactive session on an enrolled client. Open **Services** when you only need service inventory; that viewer does not start or stop services.

## Open a terminal

1. Go to **Clients** and find the intended online computer.
2. Choose **Terminal**, then select one of its reported shells.
3. Wait for the session to open before entering commands.
4. Use **Fit** to adjust the terminal to its panel. Choose **Close Session** when finished.

The available shells and terminal backend depend on the client platform and installed interpreters. A disabled terminal action can mean the client is offline, lacks the required capability or is outside your current permissions.

For repeatable work with a result you can revisit, use a [task or script](/docs/guides/scripts/) instead of an interactive shell.

## Inspect services

Choose **Services** on a client card or row. Windows clients report Service Control Manager names, display names, state and start mode. Linux clients report systemd service units, including installed and loaded units. Other platforms report **Unsupported** for this inventory.

Search or filter by **Running**, **Stopped**, **Failed** or **Monitored**. On Linux, enabled and running are separate facts; an `active/exited` oneshot service is not automatically a failure.

**Refresh** requests a new bounded collection. The existing complete inventory remains visible while NetRatel waits for the result. Check the collection status and observation age after it finishes.

## Control a service through the CLI

The CLI and MCP expose separately authorised start, stop and restart operations. Read inventory first to obtain the exact service name and platform:

```sh
netratel services inventory --tenant-id 7 --agent-id "$AGENT_ID"
```

For example, review a Linux restart using a new operation UUID:

```sh
netratel services restart --tenant-id 7 --agent-id "$AGENT_ID" \
  --service-name sshd.service --platform LinuxSystemd \
  --operation-id "$OPERATION_ID" --reason "Apply reviewed service change"
```

After reviewing the response, repeat the same command with `--confirm`. Inspect `netratel services operation --tenant-id 7 --agent-id "$AGENT_ID" --operation-id "$OPERATION_ID"` for its outcome. Keep the same operation ID when checking that request.

[v0.1.3 Services reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/operations/SERVICES.md) · [Service-control CLI](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/integrations/CLI_AND_MCP.md#service-investigation-and-control)
