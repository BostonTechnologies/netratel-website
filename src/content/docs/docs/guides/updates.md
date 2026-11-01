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

Open **Agent Installers & Updates** at `/clients/mgmt`, then **GitHub releases**. Import the desired complete client pack. NetRatel verifies the publication record and checksums before activating the local pack.

Open **Local imports** to inspect downloaded packs, source checks and their
approval, retry/cancel or cleanup state. This tab remains available independently
of GitHub discovery. **Packages** holds the imported artifacts used for installer
generation. Expand tenant eligibility or release-automation details when needed;
the compact header keeps their attention indicators visible.

The catalogue and management lists offer 20, 50 or 100 rows per page. The GitHub
view reports upstream availability and scan limits rather than promising an
unbounded catalogue.

Importing makes the pack available for review. **Approve and publish for deployment** is the separate action that offers it through enabled tenant update policies.

## Roll out deliberately

Review tenant channel settings, target-version pins and eligible clients before publication. Use a small initial cohort, confirm its running version and update result, then widen the rollout. Preserve each machine's installed identity and rollback material.

The **Activity** view shows rollout progress and failures. **Suspended** lists paused updates. A downloaded package is not the same as an accepted running update; inspect the recorded outcome.

## Automate release checks

Instance-wide automation starts off. Administrators can enable 12-hour or 24-hour UTC checks. Stable downloads, prerelease downloads, automatic publication and automatic prerelease deployment are separate choices.

**Check now** schedules a check using the saved policy. Clients fetch approved updates from their NetRatel instance and do not need direct access to GitHub.

[v0.1.3 upgrade guidance](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/deployment/SELF_HOSTING.md#6-restart-upgrade-and-troubleshoot) · [Client release import](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/client/CLIENT.md#release-import-and-instance-automation)
