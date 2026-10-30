---
title: Add public HTTPS
description: Publish the console, API and native gateway through the release bundle's Nginx ingress.
---

Use the included HTTPS overlay to serve Web, supported API paths and the native client gateway from one hostname. Start with the extracted [Compose bundle](/docs/getting-started/quickstart/), a DNS name pointing to your host and a certificate trusted by your browsers and clients.

Make TCP port 443 reachable on the Docker host through your firewall and any upstream NAT or load balancer. The included ingress listens on HTTPS; it does not add an HTTP-to-HTTPS listener on port 80.

## 1. Place the certificate

From the bundle directory, create `tls/` and place the certificate chain and private key at:

```text
tls/fullchain.pem
tls/privkey.pem
```

The overlay mounts them into Nginx. Obtain and renew them through your existing certificate process; this overlay does not issue certificates.

## 2. Set the public address

Edit these entries in `.env`, replacing the hostname and choosing an unused Docker subnet:

```dotenv
NETRATEL_PUBLIC_HOST=netratel.example.com
NETRATEL_PUBLIC_ORIGIN=https://netratel.example.com
NETRATEL_PUBLIC_GATEWAY_ORIGIN=https://netratel.example.com
NETRATEL_HTTPS_CERTIFICATE=./tls/fullchain.pem
NETRATEL_HTTPS_PRIVATE_KEY=./tls/privkey.pem
NETRATEL_INGRESS_SUBNET=172.29.20.0/24
NETRATEL_INGRESS_PROXY_IP=172.29.20.10
NETRATEL_ALLOW_INSECURE_LOCALHOST=false
```

Set both origins even though they share a hostname. **Site URL** is used for Web, installation links and the default REST address. **Gateway URL** is the native client's public HTTP/2 address. Both are origins without a path.

The proxy IP must be inside the selected subnet and match the actual ingress container. The overlay applies that address as Web's trusted proxy and gives API the exact allowed bootstrap origin.

## 3. Apply the overlay

Run these commands on the Docker host:

```bash
docker compose --env-file .env -f compose.images.yaml \
  -f compose.public-https.yaml config --quiet

docker compose --env-file .env -f compose.images.yaml \
  -f compose.public-https.yaml pull

docker compose --env-file .env -f compose.images.yaml \
  -f compose.public-https.yaml up -d

docker compose --env-file .env -f compose.images.yaml \
  -f compose.public-https.yaml ps -a
```

For external PostgreSQL, insert `-f compose.external-postgres.yaml` before the HTTPS overlay in every command.

## 4. Open the console

Browse to your configured HTTPS origin. On a fresh instance, retrieve the setup code with the same Compose files:

```bash
docker compose --env-file .env -f compose.images.yaml \
  -f compose.public-https.yaml exec -T api \
  cat /var/netratel/bootstrap/setup-proof
```

Finish the wizard and sign in. For an existing instance, use its existing account. Check **Site URL** and **Gateway URL** under **Branding**, then [generate a client installer](/docs/getting-started/first-client/).

## How traffic is routed

Nginx forwards ordinary Web and REST requests to `web:9111`. Requests under `/netratel.gateway.v1.` go directly to the private h2c gateway at `api:9223`. It preserves the complete gateway path and supports long-running streams.

If setup returns 403, compare the browser's origin with `NETRATEL_PUBLIC_ORIGIN` and check the configured proxy IP. Recreate API and Web after changing their environment. If clients enroll but cannot stay online, inspect the gateway route and its stream timeouts.

## Related pages

- [Reverse proxies and split hosts](/docs/deployment/reverse-proxy/)
- [Connect your first client](/docs/getting-started/first-client/)
- [OIDC sign-in](/docs/identity/oidc/)
