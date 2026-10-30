---
title: Read inventory and telemetry
description: Find a computer, inspect its current evidence and understand when a value is stale.
---

Use **Estate Management → Clients** at `/clients` to find computers across the tenants you can access. Client identity, connectivity and telemetry describe different things: a saved client record can exist while its computer is offline.

## Find the right computer

1. Select the relevant tenant and environment.
2. Search by hostname, friendly name, tag or reported network address.
3. Check the client identity and last-seen information before opening an action. Two records can share a hostname.
4. Choose **Telemetry** to inspect the available CPU, memory and disk observations.

The reported address is the interface address selected by the native client. It may differ from the address seen by a reverse proxy or NAT gateway. **Not reported** means no valid address has been recorded.

## Read the age with the value

Telemetry includes an observation age. Use it when interpreting a disconnected client's last reported CPU or disk state. An old reading remains useful history; it does not establish the computer's current state.

| What you see | What it tells you |
| --- | --- |
| Online connection | The client has an admitted connection to the gateway. |
| Recent telemetry | The client has supplied a recent measurement. |
| Cached service inventory | The last complete service collection is available, including while offline. |
| Unknown or unsupported | The required current evidence or platform capability is unavailable. |

Open **Services** for Windows services or Linux systemd units. Search by service name, then inspect state and collection age. **Refresh** requests a new collection; wait for its result before treating the displayed inventory as refreshed.

## Turn observations into alerts

[Monitoring rules](/docs/guides/monitoring/) evaluate CPU, disk free space and explicitly selected services. Memory is displayed as telemetry in this release, but is not a monitoring rule type. A rule can also raise a grouped alert when its selected clients go offline.

For automated inspection, use the [CLI](/docs/reference/cli/) or [HTTP MCP](/docs/integrations/http-mcp/) with the tenant ID and registered agent ID returned by discovery. Display names are labels, not API target identifiers.

[v0.1.2 client reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/client/CLIENT.md) · [Services reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/operations/SERVICES.md)
