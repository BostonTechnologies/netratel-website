---
title: Back up and restore an instance
description: Keep the database, protected state and keys together so an instance can recover.
---

A NetRatel backup is a matching set of application data and cryptographic material. The database alone cannot recover protected credentials, job inputs or installation links.

## Include these items

| Item | What it preserves |
| --- | --- |
| PostgreSQL | Accounts, tenants, configuration, work history and durable application records. |
| API bootstrap state | Instance lifecycle, setup continuity and recovery information. |
| Data Protection key ring | Protected application state, credentials, inputs and session material. |
| Native-agent signing key | The instance's agent-token signing identity. |
| Application and client-artifact storage | Uploaded artifacts and client packs used by the instance. |
| Deployment configuration and secret references | Image versions, endpoints, mounts and the settings needed to recreate the stack. |

The supplied Compose bundle uses `postgres-data`, `api-data` and `web-keys` named volumes, plus an externally mounted agent signing key. Preserve the actual volume names and key path from your deployment.

## Create a recovery point

1. Record the release version, image digests and active Compose files.
2. Arrange a consistent backup window. Quiesce application writes or use your database and storage tooling's coordinated snapshot process.
3. Back up PostgreSQL using its supported backup tools, and capture the matching API state, Data Protection keys, artifacts and signing key.
4. Store the set together with a timestamp and deployment configuration. Record how its protected secrets can be restored.
5. Restore the set into an isolated test environment to check it.

Use the same method for bundled or external PostgreSQL; your database operator may already provide point-in-time recovery and managed snapshots.

## Restore

Recreate the recorded release and restore the complete set before starting the application. Retain file ownership and access permissions on state and key volumes. Start the required database/migration services, then API and Web.

Verify that the instance reports **Ready**, the expected accounts and tenants exist, and protected integrations and client records can be read. Confirm a controlled client connection before returning the instance to service.

An unexpected **Recovery** state usually means an existing database, bootstrap marker or key set is missing or inconsistent. Restore the matching state instead of repeating first-run setup.

[v0.1.2 persistent-state reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/deployment/CONFIGURATION.md#required-persistent-state) · [Recovery behaviour](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/deployment/FIRST_RUN_SETUP.md)
