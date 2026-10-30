---
title: Requirements
description: Check the supported server, client and operator-tool platforms for NetRatel v0.1.2.
---

Run the server on a Linux x64 host with Docker Engine, Docker Compose v2 and persistent storage. Use the published Compose bundle for the first installation.

## Server

| Requirement | What it is used for |
| --- | --- |
| Linux x64 / `linux/amd64` | Published API, Web, migration and optional HTTP MCP images |
| Docker Engine and Compose v2 | Starting services and applying deployment overlays |
| OpenSSL | Generating the instance's ES256 signing key |
| `curl`, `tar` and `sha256sum` | Downloading and checking the release bundle |
| PostgreSQL | Application and identity data; the bundle includes PostgreSQL 17 |
| Persistent Docker volumes or equivalent mounts | Database, bootstrap state, Data Protection keys and application storage |
| Browser | Initial setup and the Web console |

The external PostgreSQL overlay uses Compose's `!reset` syntax. If `docker compose config --quiet` rejects that tag, update the Compose v2 plugin before deploying it.

There is no published minimum CPU or RAM sizing profile for v0.1.2. Size the host for the database, number of connected clients and workload you intend to run, and monitor it as you add clients.

The local evaluation binds Web to `127.0.0.1:8080`. For clients on other computers, provide a public HTTPS origin, a trusted certificate and an ingress that supports native HTTP/2 streams. The [included HTTPS overlay](/docs/deployment/public-https/) routes the Web console and native gateway on one hostname.

## Managed computers

| Native Client | Published target | Service installation |
| --- | --- | --- |
| Linux | x64 | Root access and systemd |
| Windows | x64 | Elevated PowerShell for the Windows service |
| macOS | Apple Silicon / arm64 | Root access for the launchd daemon |

Native Client archives are self-contained. They do not need a separately installed .NET runtime. Scripts still need their selected interpreter: PowerShell scripts on Linux or macOS require `pwsh` to be installed on that client.

## Operator tools

| Tool | Published target | Additional software |
| --- | --- | --- |
| CLI archive | Linux x64 | .NET 10 runtime |
| CLI NuGet tool | Published tool package | .NET SDK to install the tool |
| stdio MCP and HTTP bridge | Linux x64, Windows x64 | .NET 10 runtime |
| Protected Windows MCP launcher | Windows x64 | PowerShell 7.4 or later |

## Sign-in

Choose [Local](/docs/identity/local/) for email and password, [OIDC](/docs/identity/oidc/) for single sign-on, or [Hybrid](/docs/identity/hybrid/) for both. Local setup needs no OIDC provider or SMTP service.

## Next step

[Deploy your first instance](/docs/getting-started/quickstart/), or [compare deployment scenarios](/docs/deployment/overview/).

Install Docker using the [official Docker Engine instructions](https://docs.docker.com/engine/install/) for your distribution. Download product assets from the [v0.1.2 release](https://github.com/BostonTechnologies/netratel/releases/tag/v0.1.2).
