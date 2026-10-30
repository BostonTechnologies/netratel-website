---
title: Upgrade the server and clients
description: Use the published release bundle and approve client rollouts separately.
---

Upgrade the server and native clients as two related changes. The server uses the release's verified container bundle. Clients receive an imported and published pack through their tenant update policy.

## Upgrade the server

1. Take a matching [backup](/docs/guides/backup-and-restore/) of the database, keys, bootstrap state and application storage.
2. Download the completed release's Compose bundle, checksums and publication record from [GitHub Releases](https://github.com/BostonTechnologies/netratel/releases).
3. Verify the bundle and review its release notes. Retain your deployment's environment, public endpoints and secret mounts.
4. Apply the new bundle's image digests, run its migration service, then recreate the API and Web services using the same Compose files and project identity.
5. Check the displayed version, sign in, inspect a connected client and complete a small read-only check.

Keep the existing persistent volumes and signing material. An upgraded installation continues from its current state; it does not need first-run setup again.

## Import a client pack

Open **Agent Installers** at `/clients/mgmt`, then **GitHub releases**. Import the desired complete client pack. NetRatel verifies the publication record and checksums before activating the local pack.

Importing makes the pack available for review. **Approve and publish for deployment** is the separate action that offers it through enabled tenant update policies.

## Roll out deliberately

Review tenant channel settings, target-version pins and eligible clients before publication. Use a small initial cohort, confirm its running version and update result, then widen the rollout. Preserve each machine's installed identity and rollback material.

The **update attempts** view shows rollout progress and failures. A downloaded package is not the same as an accepted running update; inspect the recorded outcome.

## Automate release checks

Instance-wide automation starts off. Administrators can enable 12-hour or 24-hour UTC checks. Stable downloads, prerelease downloads, automatic publication and automatic prerelease deployment are separate choices.

**Check now** schedules a check using the saved policy. Clients fetch approved updates from their NetRatel instance and do not need direct access to GitHub.

[v0.1.2 upgrade guidance](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/deployment/SELF_HOSTING.md#6-restart-upgrade-and-troubleshoot) · [Client release import](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/client/CLIENT.md#release-import-and-instance-automation)
