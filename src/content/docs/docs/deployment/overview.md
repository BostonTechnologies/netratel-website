---
title: Choose a deployment
description: Choose bundled or external PostgreSQL, a shared HTTPS origin, or an existing reverse proxy.
---

Use the published Docker Compose bundle on a Linux x64 server. Add the supplied overlays for your database and ingress choices.

## Pick a scenario

| Scenario | Compose files | Best starting point |
| --- | --- | --- |
| Local evaluation with bundled PostgreSQL | `compose.images.yaml` | [Quickstart](/docs/getting-started/quickstart/) |
| One public HTTPS hostname | Base plus `compose.public-https.yaml` | [Public HTTPS](/docs/deployment/public-https/) |
| An existing PostgreSQL service | Base plus `compose.external-postgres.yaml` | [External PostgreSQL](/docs/deployment/external-postgresql/) |
| External PostgreSQL and bundled HTTPS ingress | Base, external database overlay, then HTTPS overlay | Apply both guides |
| Existing ingress or separate Web/API hosts | Base services with your explicit routes and private destinations | [Reverse proxies](/docs/deployment/reverse-proxy/) |

Keep the same file combination, project name and `.env` file for later Compose commands. Compose overlays are part of the running deployment, not one-time installation flags.

## What runs where

The Web application serves the console and forwards supported REST paths to API. The API owns application behavior, authentication and tenant access. A one-shot migration service prepares PostgreSQL before API starts. Native clients connect to a separate HTTP/2 gateway listener.

| Service | Private listener |
| --- | --- |
| Web | HTTP `9111` |
| API REST | HTTP `9222` |
| Native gateway | h2c `9223` |
| Optional HTTP MCP | HTTP `9224` |
| PostgreSQL | TCP `5432` |

With the included HTTPS ingress, Web/API requests and native gateway traffic share one public hostname. The ingress chooses the private destination by route. You do not publish those private ports directly to users.

## Choose sign-in separately

[Local](/docs/identity/local/) uses email and password. [OIDC](/docs/identity/oidc/) uses your identity provider. [Hybrid](/docs/identity/hybrid/) offers both. Set the chosen mode on API and Web; the supplied bundle maps one `.env` setting to both services.

HTTP MCP adds its own host and client configuration. It is optional and can be added after the console and native clients work.

## Keep the instance state

Plan persistent storage for PostgreSQL, API bootstrap/application state, Data Protection keys and the ES256 signing key. Treat them as one backup and restore set. The standard bundle creates named volumes and mounts your signing key read-only.

For a first installation, start with one server and [Docker Compose](/docs/deployment/docker-compose/). Use the [upgrade guide](/docs/deployment/upgrades/) for later release changes.
