---
title: Connect your first client
description: Import a native client release, generate a tenant-specific installer, and verify the enrolled computer.
---

Install the native Client on a computer you want to manage. Generate its installation link from NetRatel so the selected tenant, release and server addresses travel together.

## Before you begin

Sign in as an operator with client-management access to the intended tenant. Have a supported Windows x64, Linux x64 or macOS arm64 computer and the permissions needed to install its service.

Your instance needs reachable HTTPS addresses for both the console/API and native gateway. Finish [Public HTTPS](/docs/deployment/public-https/) if you started with the loopback quickstart.

## 1. Confirm the server addresses

Open **Branding** at `/admin/branding` and check **Site URL** and **Gateway URL**. For the included single-host ingress, both are the same public origin:

```text
Site URL:    https://netratel.example.com
Gateway URL: https://netratel.example.com
```

Use your own hostname. These are HTTPS origins on port 443, without a path, query or fragment. A separate gateway hostname is supported when your ingress routes it to the native HTTP/2 listener.

Deployment-provided addresses appear locked in the editor. Change their source in `.env` and recreate the affected containers rather than trying to override them in Web.

## 2. Import the client pack

An instance administrator opens **Agent Installers & Updates**, reviews the GitHub release and imports its client pack. Select **v0.1.2** for this guide.

Import checks the pack's artifacts before making them available locally. Importing a pack and publishing it for automatic updates are separate actions. You only need the appropriate verified artifact available to generate your first installer.

## 3. Generate the installer

Open **Clients → Artifacts → Generate script**. Choose the tenant, runtime and available client version. Review the public addresses, installation options, expiry and enrollment-use limit, then generate the link.

The result lets you inspect the script, copy the installation command or download the script. Copy the actual command from your instance. It contains the protected link for this enrollment.

Run it on the target computer:

| Platform | Terminal |
| --- | --- |
| Windows x64 | Elevated PowerShell |
| Linux x64 | A root shell on the systemd host |
| macOS arm64 | A root shell for the launchd installation |

Each computer enrolls separately. An already-enrolled installation contains its own device identity and should not be copied into a machine image.

## 4. Verify the result

Return to **Clients** in the selected tenant. Confirm the hostname, reported version and online presence. Open its inventory or services to check that the computer is responding.

If the service runs but the client stays offline, check that the target can reach both public addresses. The gateway needs HTTPS with HTTP/2; a working browser page alone does not verify that route. See [Reverse proxies and split hosts](/docs/deployment/reverse-proxy/).

If you change an address or installer setting, revoke the previous link and generate a new one. Issued links retain their original script and addresses.

## Related pages

- [Requirements](/docs/getting-started/requirements/)
- [Public HTTPS](/docs/deployment/public-https/)
- [Upgrade NetRatel](/docs/deployment/upgrades/)
