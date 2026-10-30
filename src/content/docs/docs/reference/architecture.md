---
title: Architecture
description: Understand the services, data and trust boundaries in a NetRatel deployment.
---

NetRatel is a self-hosted control plane for enrolled computers. Its Web application, API and PostgreSQL database run in your environment. Native clients connect back to the authenticated gateway for telemetry and operational work.

## The core components

| Component | Responsibility |
| --- | --- |
| Web | Blazor operator interface, browser sessions and selected same-origin API routes. |
| API | Authorisation, tenants, enrolment, persistence, orchestration and the native gateway. |
| PostgreSQL | Durable identity, configuration, work, monitoring and audit state. |
| Native Client | Host inventory, telemetry and admitted operations on an enrolled computer. |
| Migrations | Applies the release's database schema before the application starts. |

The application uses .NET 10 and Akka.NET. PostgreSQL is the supported application and identity database. The API remains the authority for access checks even when a request comes through the Web application.

## How a request travels

A browser signs into Web with Local, OIDC or Hybrid authentication. Web calls the protected API. For work on a computer, the API checks the caller and target, then uses the client's authenticated gateway connection. The result returns through the control plane and is attached to the relevant task, run or operation.

Native clients use HTTPS and HTTP/2 at the public gateway. A reverse proxy can terminate TLS and forward the protobuf service namespace to the API's private h2c listener. REST and gRPC are separate backend listeners, even when they share one public hostname.

## Optional interfaces

| Interface | Connection |
| --- | --- |
| CLI | An explicitly configured operator client calling the API. |
| stdio MCP | A local MCP process using its own API credential and profile. |
| HTTP MCP | A separately deployed service with its own ingress authentication and outbound identity. |
| NetClaw | A tenant connection for general chat, investigations and optional AI steps in flows. |
| RatelDesk, Slack and Discord | Explicitly configured integration destinations. |

Web, API and native clients work without MCP or NetClaw. Add those interfaces when the workflow needs them.

## State and deployment shape

Keep PostgreSQL, API bootstrap state, Data Protection keys, signing keys and artifact storage persistent. Restore them as a matching set.

Use a single API instance as the straightforward deployment baseline. Some live operation paths hold connection state on the serving API node; shared PostgreSQL and Akka presence do not make every interactive path portable across replicas. In particular, AI Ops and opt-in computer use need their documented node-affinity assumptions respected.

Next: [configuration](/docs/reference/configuration/), [security and access](/docs/reference/security/) and [backup and restore](/docs/guides/backup-and-restore/).

[v0.1.2 architecture reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/implementation/ARCHITECTURE.md)
