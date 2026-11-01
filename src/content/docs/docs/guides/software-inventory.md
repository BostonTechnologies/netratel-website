---
title: Inspect installed software
description: Find installed packages, compare versions across the estate and refresh a client's saved software inventory.
---

Open **Estate Management → Software Inventory** at `/software-inventory/` to see installed software across an authorised tenant. For one computer, open **Software Inventory** from its card on `/clients`. Software collection is available on updated Windows and Linux clients; macOS software inventory is unsupported.

You need `telemetry.read` to inspect inventory or export it, `client.manage` to request a collection, and `tenant.admin` to change the tenant schedule.

## Inspect one computer

1. Find the computer by friendly name or hostname in **Clients** and open **Software Inventory**.
2. Read **Last complete scan** before interpreting the saved installations. A saved snapshot remains available while the computer is offline or a new scan runs.
3. Search the **Installations** tab by software, version or publisher. Expand **Package details** beneath a row for the full-width cards: package identity, installation, client/platform and collection/freshness.
4. Choose **Refresh inventory** when you need a new collection. A queued scan is waiting for the client; a receiving scan shows uploaded chunk progress. The table changes when the complete new snapshot is stored.
5. Open **Changes** for additions, removals and version changes between successful snapshots.

The detail cards distinguish the agent's detection time from the last successful scan receipt. **Not reported** means the collector supplied no value, for example an install date. It does not mean the package is missing. Long paths and identifiers wrap; the cards stack on smaller screens and the disclosure supports keyboard operation.

Opening the dialog requests a fresh collection when the saved scan is at least 30 minutes old and you have refresh permission. Opening a fresh snapshot reuses it. An explicit refresh requests collection regardless of age. Concurrent requests share the active collection instead of starting duplicates.

## Find software across the estate

Select one tenant, then use the view that answers your question:

| View | Use it to |
| --- | --- |
| **Software** | Compare software/version groups and their distinct device counts; choose **View installations** to drill into a group. |
| **Installations** | Inspect individual entries, filter by client, name, version, publisher, operating system, package source or scan state, and expand the same package detail cards. |
| **Devices** | Check coverage, find computers that have never completed a scan and open their client inventory. |
| **Changes** | Review additions, removals and version changes across complete scans. |

The overview separates inventoried devices, software products and installed entries, and shows never-scanned devices, active scans and attempts needing attention. Multiple scopes on one computer can produce multiple installed entries while counting as one device.

**Export installations** downloads a CSV of all matching installation entries using the selected filters. It is independent of the current page and software grouping. **Reload data** reads stored results; **Refresh inventory** asks the client to collect again.

## Set the collection schedule

In tenant settings, open **Software Inventory** beside **Auto Update**. Automatic collection is enabled every seven days by default. Choose hours, days, weeks or calendar months, from one hour up to a year; collection adds up to 10% jitter to spread the work. Disabling the schedule still permits an authorised explicit refresh.

An inventory-capable client starts its first collection on its first authenticated connection after upgrade. Existing records have no software snapshot until that collection finishes. The 30-minute interactive cache indication is separate from the scheduled interval: an older snapshot is not necessarily overdue for its weekly scan.

## Understand coverage and incomplete scans

| Platform | Read-only sources |
| --- | --- |
| Windows | Uninstall registry entries, including available loaded user hives, and AppX/MSIX metadata when the provider is available. |
| Linux | Available dpkg, rpm, pacman, snap and flatpak databases. apt, dnf and zypper use the underlying dpkg or rpm records. |
| macOS | Software collection is unsupported; native client availability does not imply software inventory support. |

Collection does not install software, read licence keys or run `Win32_Product`. It is an inventory of the supported sources, not a vulnerability assessment or licence-compliance verdict.

Only a successful complete collection replaces the saved snapshot and establishes changes. Partial, failed or superseded scans preserve the previous complete data. Queued requests survive offline clients; compressed chunk uploads are durable and can be replayed safely after interruptions. A version change under the same package identity is recorded as **Upgraded**, including a downgrade; an identity change appears as an addition and a removal.

If receiving progress stalls, check the client connection and the reported scan error. An accepted collection has a five-minute server deadline. **Retry scan** requests a new attempt when the old one has ended; it does not clear the last complete inventory.

## Use an assistant or API

HTTP and stdio MCP expose `netratel_software` for tenant policy, client status and snapshots, installations, prevalence, change history and explicit refresh. Reads never start collection. Refresh and policy changes require the existing preview/confirmation flow and current delegated permissions. Web overview and device coverage also have tenant-scoped REST endpoints.

[Connect HTTP MCP](/docs/integrations/http-mcp/) · [Understand operator policies](/docs/integrations/operator-policies/) · [Release-pinned inventory API and collection reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/client/software-inventory.md)
