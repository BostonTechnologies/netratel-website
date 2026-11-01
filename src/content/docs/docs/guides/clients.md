---
title: Enrol and manage clients
description: Install a native client, confirm its connection and keep each computer identifiable.
---

Enrol each computer into a tenant before running work on it. NetRatel v0.1.3 provides native clients for Windows x64, Linux x64 and macOS Apple Silicon.

## Install your first client

You need an administrator account, a configured public Web URL and Gateway URL, and a verified client pack imported into your instance.

1. Open **Agent Installers & Updates** at `/clients/mgmt`, select the target tenant and open **Packages**.
2. Select the matching operating system and approved client version.
3. Choose **Generate script**. Review the tenant, public endpoints, expiry and permitted enrolments.
4. Copy the generated command or download and inspect its script. Run it on the target computer, using an elevated PowerShell session for a Windows service or root for Linux/macOS service installation.
5. Open **Estate Management → Clients**. Confirm the expected hostname, tenant, version and online state.

The generated command contains a private installation link. Its script and endpoints are fixed when created; generate a new link after changing the package or public URLs.

For an existing extracted client package, an operator can instead supply a short-lived enrolment code:

```sh
NetRatel.Client --enroll replace-with-short-lived-code \
  --api https://netratel.example.com
```

Every computer needs its own enrolment. A copied installation credential creates a duplicate identity, even when the hostname changes.

## Add useful labels

On **Clients**, choose **Edit client** to set a friendly name and tags. Use a name people recognise, such as `Warehouse application server`, with tags such as `production, warehouse, linux`. The reported hostname stays read-only. Names, tags and reported IP addresses are searchable, and labels can be edited while a client is offline.

## Remove a client

**Remove from platform** revokes access and removes the active record while leaving the installed software in place. It also works for an obsolete offline record.

**Uninstall and remove** is offered only for an eligible online Windows or Linux managed installation. NetRatel waits for the native helper's removal receipt before removing the record. Use the operation's status to distinguish a pending request from a completed uninstall.

Next: [read client telemetry](/docs/guides/inventory/), [inspect installed software](/docs/guides/software-inventory/) or [manage updates](/docs/guides/updates/).

[v0.1.3 client reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/client/CLIENT.md)
