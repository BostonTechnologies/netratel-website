---
title: Start with NetRatel
description: Choose a first task, deploy NetRatel, and connect the first computer you want to manage.
---

NetRatel brings your clients, scripts, jobs and operational work into one self-hosted console. Start by deploying the server, choose how people sign in, then enroll a computer in a tenant.

These guides describe **v0.1.3**. Server images, native clients and command-line tools are published together on [GitHub Releases](https://github.com/BostonTechnologies/netratel/releases/tag/v0.1.3).

## Choose your first task

| I want to… | Start here |
| --- | --- |
| Try NetRatel on a Linux server | [Quickstart](/docs/getting-started/quickstart/) |
| Check platform and software requirements | [Requirements](/docs/getting-started/requirements/) |
| Put the console on a public HTTPS address | [Public HTTPS](/docs/deployment/public-https/) |
| Use my existing PostgreSQL service | [External PostgreSQL](/docs/deployment/external-postgresql/) |
| Use company single sign-on | [OIDC sign-in](/docs/identity/oidc/) |
| Offer passwords and single sign-on | [Hybrid sign-in](/docs/identity/hybrid/) |
| Install the first managed client | [Connect a client](/docs/getting-started/first-client/) |

## What you deploy

The server bundle runs the Web console, API and database migration tool with Docker Compose. It includes PostgreSQL by default. The API keeps application state and communicates with enrolled native clients. Web provides the browser interface and forwards supported API requests.

The native Client runs on each computer you manage. It enrolls into a tenant and opens an authenticated connection to your server. A CLI or MCP connection is an operator interface to the server; it does not replace the native Client.

Tenants group managed computers and access. Select the intended tenant before creating installation links or working with a client. The first-run wizard creates your initial tenant and administrator.

## A useful first session

1. [Start the server](/docs/getting-started/quickstart/) and sign in with a local administrator account.
2. [Configure HTTPS](/docs/deployment/public-https/) and the public Web and gateway addresses.
3. [Install one client](/docs/getting-started/first-client/) and confirm that its hostname appears in the expected tenant.
4. Explore its inventory and services before building scripts or scheduled work.

Local accounts need neither an identity provider nor SMTP. You can configure [OIDC](/docs/identity/oidc/) or [Hybrid](/docs/identity/hybrid/) sign-in when you are ready to connect your existing identity system.
