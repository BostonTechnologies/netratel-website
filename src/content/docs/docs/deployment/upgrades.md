---
title: Upgrade NetRatel
description: Upgrade the server and native clients while keeping the database, keys and enrolled identities.
---

Upgrade the server from a verified release bundle, preserve its state, then roll out the matching native client pack. Keep server deployment and client-update decisions separate.

## 1. Prepare the release

Read the target release notes and download its matching Compose archive and `SHA256SUMS` from [GitHub Releases](https://github.com/BostonTechnologies/netratel/releases). Verify the checksum before extracting it into a separate review directory.

Compare the new bundle with your running deployment. Carry forward your database credentials, origins, authentication settings, secret mounts and selected overlays. Retain the new release's image digests together as a set. Keep the current Compose project name so its named volumes remain attached.

Do not replace your working `.env` with the new example: merge the changed release values into it. Keep a copy of the previous configuration and release bundle.

## 2. Back up one matching state set

Arrange a maintenance window and stop new operational work before taking the final backup. Include:

| State | Why it belongs in the backup |
| --- | --- |
| PostgreSQL | Application data, identities and protected records |
| API application and bootstrap storage | Instance lifecycle and stored artifacts |
| Shared Data Protection key ring | Cookies and protected application values |
| ES256 signing key | Native-agent token signing |
| Deployment configuration and referenced secret files | Recreating the same instance and its configured credentials |
| Optional MCP setup/client storage and delegation keys | Preserving host setup, saved profiles and the API/MCP trust connection |

For external PostgreSQL, use your database backup process. Keep keys and application state associated with that database backup.

## 3. Apply the server update

Run the following in the existing instance directory after merging the target release files and settings. These commands show the base bundle. Add every ingress, external-database and MCP overlay used by your deployment.

```bash
docker compose --env-file .env -f compose.images.yaml config --quiet
docker compose --env-file .env -f compose.images.yaml pull
docker compose --env-file .env -f compose.images.yaml stop api web
docker compose --env-file .env -f compose.images.yaml run --rm migrations
docker compose --env-file .env -f compose.images.yaml up -d
docker compose --env-file .env -f compose.images.yaml ps -a
```

Continue to `up -d` only after migrations exit successfully. If migrations fail, inspect the error and leave API and Web stopped while resolving it.

Sign in with an existing account. Confirm the expected tenant and clients, inspect service logs and perform a read-only inventory check. An upgrade should keep the existing owner and enrolled identities.

## 4. Update native clients

Open **Agent Installers & Updates** and import the target release's client pack. Review the tenant update policies before publishing it for updates.

Publishing makes that pack available to enabled tenant policies. Use a dedicated tenant for an initial canary when the other clients must remain on their current version. Check the reported installed version and update result before widening the rollout.

Preserve each client's existing credentials and device identity. Generate a fresh protected installer link if a repair needs an updated package or script. Existing links retain their original content.

## Recovery

Restore the matching database, application state, key ring and signing key if recovery requires returning to the previous installation. Changing an image digest alone does not undo database migrations.

## Related pages

- [Run with Docker Compose](/docs/deployment/docker-compose/)
- [Connect your first client](/docs/getting-started/first-client/)
- [Reverse proxies and split hosts](/docs/deployment/reverse-proxy/)
