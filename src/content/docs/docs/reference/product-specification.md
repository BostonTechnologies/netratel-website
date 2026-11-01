---
title: Product specification
description: NetRatel 0.1.3 capabilities, supported platforms and operational boundaries, including software inventory.
---

NetRatel is a self-hosted operations platform for managing enrolled computers, running repeatable work and connecting assistants under explicit access rules. This specification describes **v0.1.3**; use the matching [release and downloads](/releases/) for your installation.

## Platform and deployment

| Area | Included capability |
| --- | --- |
| Server | Linux x64 containers for Web, API, migrations and optional HTTP MCP; PostgreSQL for durable application and identity state. |
| Native clients | Self-contained Windows x64, Linux x64 and macOS Apple Silicon archives. Feature support varies by platform. |
| Operator tools | Browser workspace, CLI, HTTP MCP and stdio MCP/HTTP bridge. |
| Identity | Local accounts, OpenID Connect or Hybrid sign-in; tenant-scoped permissions and delegated operator policies. |
| Distribution | Matching release archives, checksums, software bills of materials, immutable container digests and a publication record. |

See [requirements](/docs/getting-started/requirements/), [deployment options](/docs/deployment/overview/) and the [security model](/docs/reference/security/) before choosing a setup.

## Software inventory — new in 0.1.3

Software inventory adds installed-package visibility alongside existing client, service and telemetry views. It is available per computer and across an authorised tenant.

| Capability | Behaviour |
| --- | --- |
| Supported collection | Windows uninstall registry and available AppX/MSIX providers; available Linux dpkg, rpm, pacman, snap and flatpak databases. macOS collection is unsupported. |
| Collection policy | First scan on an updated client's authenticated connection; tenant schedule enabled every seven days by default, configurable from one hour to a year with up to 10% jitter. |
| Saved snapshots | The last complete inventory stays readable offline and during refresh. Opening a client inventory at least 30 minutes old requests a refresh when authorised. |
| Client workspace | Full-screen installations and changes, received-chunk progress, retry/error states and explicit refresh. |
| Package inspection | A full-width, keyboard-accessible disclosure with responsive cards for package identity, installation, client/platform and collection timing. Missing fields are labelled. |
| Estate workspace | Software/version prevalence, filtered installations, device coverage including never-scanned clients, change history and filtered CSV export. |
| Integrity | Durable, compressed chunk delivery; only complete successful snapshots replace saved entries or establish changes. Partial scans preserve previous complete data. |
| Automation access | The shared `netratel_software` HTTP/stdio tool and tenant-scoped REST reads; refresh and policy writes retain preview/confirmation and current access checks. |

Inventory records supported package metadata. It does not install software, collect licence keys or establish vulnerability/compliance status. Device counts and installed-entry counts are separate. Snapshot freshness is separate from client connectivity.

[Inspect installed software](/docs/guides/software-inventory/)

## Operations workspace

| Feature | What an operator can do |
| --- | --- |
| [Fleet and telemetry](/docs/guides/clients/) | Discover enrolled computers, inspect identity/connectivity and read available CPU, memory and disk observations. |
| [Scripts](/docs/guides/scripts/) | Organise scripts, rename and edit them in the normal or full-screen editor while retaining unsaved drafts. |
| [Jobs and schedules](/docs/guides/jobs/) | Combine script steps, collect inputs, run or schedule work and inspect retained results; Task History includes a bounded in-place output preview. |
| [Terminals and services](/docs/guides/terminal-and-services/) | Open admitted terminals and inspect or manage available Windows services and Linux systemd units. |
| [Files and logs](/docs/guides/files-and-logs/) | Browse files and read selected log sources within the client's capabilities and the operator's permissions. |
| [Monitoring](/docs/guides/monitoring/) | Evaluate CPU, disk, selected services and grouped offline conditions; inspect full-width alert evidence and validated incident links. Memory remains telemetry rather than a rule type. |
| [Alert flows](/docs/guides/flows/) | Map alerts into reviewed, published flows with configured actions and recorded outcomes. |
| [Client updates](/docs/guides/updates/) | Review release packs, manage Local imports separately, generate installers and control tenant rollouts. |

## Integrations and AI

[HTTP MCP and stdio](/docs/integrations/overview/) expose scoped tools for connected consumers. [Netclaw](/docs/integrations/netclaw/) supplies optional tenant conversations and investigations. [RatelDesk](/docs/integrations/rateldesk/) connects alert handling to service delivery; configured notification actions can use channels such as Slack and Discord. AI is optional.

Each consumer needs its own supported identity and current operation policies. A successful flow, delivered command or recent snapshot does not by itself prove the external business result.

## Release and acceptance boundaries

The Windows remote desktop and computer-use bridge remains a disabled-by-default proof of concept. Production client installations do not start its desktop gateway or advertise support. Enabling `ComputerUse:Enabled` alone is insufficient; disposable canary evaluation is documented separately. Terminal, telemetry and ordinary execution retain their existing paths.

Build and distribution integrity are recorded in `publication.json`, separately from owner deployment and native runtime functional acceptance. A stable version number does not mean those owner checks were executed.

[v0.1.3 release notes](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/release-notes/0.1.3.md) · [Windows evaluation boundaries](/docs/guides/computer-use/)
