---
title: Reverse proxies and split hosts
description: Route browser traffic, REST requests and native HTTP/2 streams through an existing ingress.
---

Keep browser/API traffic and native gateway streams on their correct private listeners. Use your existing ingress when you need a different proxy, separate hosts or a deployment-managed network.

The [bundled HTTPS overlay](/docs/deployment/public-https/) provides a complete single-host Nginx example.

## Route the right protocol

| Public traffic | Private destination | Requirements |
| --- | --- | --- |
| Web and supported REST paths | `http://web:9111` | Preserve host, scheme and WebSocket upgrades |
| `/netratel.gateway.v1.*` | `h2c://api:9223` | HTTP/2 upstream, complete path, long-running streams |
| Optional `/mcp` | Web's configured MCP route | Preserve authorization and incremental delivery |

Web forwards its supported REST routes to `ApiBaseUrl`, normally `http://api:9222`. The native gateway does not pass through that REST listener.

## Configure public addresses and trust

Set the API's installer addresses to the public origins:

```dotenv
Branding__SiteUrl=https://netratel.example.com
Branding__GatewayUrl=https://gateway.example.com
```

For supplied Compose files, use `NETRATEL_PUBLIC_ORIGIN` and `NETRATEL_PUBLIC_GATEWAY_ORIGIN` in `.env`. Use the same origin for both when sharing a hostname.

In your custom deployment, inject these Web settings with the actual proxy address:

```dotenv
AllowedHosts=netratel.example.com
PublicBaseUrl=https://netratel.example.com/
ForwardedHeaders__KnownProxies__0=172.29.20.10
ForwardedHeaders__AllowedHosts__0=netratel.example.com
Authentication__Local__AllowInsecureLocalhost=false
DataProtection__ApplicationName=NetRatel-Keyring
```

API needs the matching public bootstrap origin, secure-cookie setting and shared key-ring identity:

```dotenv
Bootstrap__AllowedOrigins__0=https://netratel.example.com
Authentication__Local__AllowInsecureLocalhost=false
DataProtection__ApplicationName=NetRatel-Keyring
```

API and Web must use their persistent shared Data Protection key storage. Trust the real ingress addresses or networks, rather than all forwarded hosts.

## Put Web and API on different hosts

Set Web's private REST destination explicitly:

```dotenv
ApiBaseUrl=https://api.internal.example.com
WebGateway__Topology=SplitHost
```

That address must be reachable and trusted from the Web container. `SplitHost` describes the topology; it does not discover or fail over to another server. Container-local `localhost` points back to the same container.

Keep NetRatel's generated API route allowlist. Broad catch-all routes can expose paths that the supplied gateway intentionally leaves private.

## Keep gateway streams connected

Native clients hold an authenticated HTTP/2 request open for heartbeats and work. A proxy's total request-body timeout can close this connection even while heartbeats arrive.

For Traefik, the documented sustained-stream configuration uses a **dedicated gateway entrypoint** with this static setting:

```yaml
entryPoints:
  netratel-gateway:
    address: ":8443"
    transport:
      respondingTimeouts:
        readTimeout: 0s
```

Merge it with your TLS and router configuration. Keep the public client gateway on HTTPS port 443, using your load balancer or port mapping to reach that listener. A separate hostname on an unchanged listener does not change its static timeout.

Route the entire `/netratel.gateway.v1.` prefix to the private h2c listener without path rewriting. Nginx users can follow the `grpc_pass` and timeout settings in the release's `nginx.public-https.conf`.

## Verify the deployment

Open the console, sign in and load `/api/docs/`. Then enroll a client and verify that it remains online beyond the previous timeout window. For optional HTTP MCP, complete initialization and a permitted read through the public `/mcp` endpoint.

Environment changes require container recreation. Use the full deployment file set when applying them.
