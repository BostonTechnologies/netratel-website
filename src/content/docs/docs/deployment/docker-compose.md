---
title: Run with Docker Compose
description: Understand the release bundle, service lifecycle, persistent volumes and everyday Compose commands.
---

The release bundle runs NetRatel from published image digests. Follow the [quickstart](/docs/getting-started/quickstart/) for the complete download, key creation and first-administrator procedure.

## Bundle contents

| File | Purpose |
| --- | --- |
| `compose.images.yaml` | Web, API, migrations, volume initialization and PostgreSQL |
| `.env.images.example` | Release image digests and deployment inputs; copy to `.env` |
| `compose.public-https.yaml` | Optional HTTPS ingress |
| `nginx.public-https.conf` | Web and native-gateway routing for that ingress |
| `compose.external-postgres.yaml` | Optional external database connection |
| `setup-http-mcp.sh` and MCP overlays | Optional HTTP MCP host setup |
| `INSTALL.md` | Instructions shipped with this exact release |

Run commands from the extracted bundle directory. The signing-key and certificate paths are relative to the Compose files. Keep the digest values supplied by the release and put your own database password and instance settings in `.env`.

## Startup order

PostgreSQL must become healthy before migrations run. The `volume-init` helper prepares writable storage for UID/GID 1654. API starts after both one-shot services complete successfully. Web then connects to API at `http://api:9222` on the private Compose network.

Inspect the whole stack, including completed services:

```bash
docker compose --env-file .env -f compose.images.yaml ps -a
docker compose --env-file .env -f compose.images.yaml logs --tail=100 api web
```

An exited `migrations` or `volume-init` container with code 0 is expected. A nonzero migration exit needs attention before API startup:

```bash
docker compose --env-file .env -f compose.images.yaml logs migrations
```

## Daily commands

For the base deployment:

```bash
# Check configuration without printing its secrets.
docker compose --env-file .env -f compose.images.yaml config --quiet

# Start or reconcile the stack.
docker compose --env-file .env -f compose.images.yaml up -d

# Restart running API and Web without changing their environment.
docker compose --env-file .env -f compose.images.yaml restart api web
```

After editing environment values, recreate the affected services:

```bash
docker compose --env-file .env -f compose.images.yaml up -d --force-recreate api web
```

Add your external-database, ingress and MCP overlays to **every** command that manages the stack. A plain restart keeps the container's existing environment.

## Persistent storage

| Storage | Contents |
| --- | --- |
| `postgres-data` | Bundled PostgreSQL database |
| `api-data` | API application and bootstrap state |
| `web-keys` | Shared Data Protection key ring |
| Your ES256 PEM file | Native-agent token signing key |

Preserve the existing Compose project name so future commands keep using the same named volumes. Back up the database, application state and original keys together before an upgrade.

## Related pages

- [Public HTTPS](/docs/deployment/public-https/)
- [External PostgreSQL](/docs/deployment/external-postgresql/)
- [Upgrade NetRatel](/docs/deployment/upgrades/)
