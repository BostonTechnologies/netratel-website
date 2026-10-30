---
title: Deploy your first instance
description: Download the verified v0.1.2 Compose bundle, start NetRatel, and create your first administrator.
---

Start a local-account installation with the published Docker images and bundled PostgreSQL. Run these commands in a **terminal on your Linux x64 Docker host**. Have Docker Compose v2, OpenSSL, `curl`, `tar` and `sha256sum` installed.

## 1. Download and verify

Use a new directory for the release downloads:

```bash
mkdir netratel-downloads
cd netratel-downloads
curl -fLO https://github.com/BostonTechnologies/netratel/releases/download/v0.1.2/netratel-compose-0.1.2.tar.gz
curl -fLO https://github.com/BostonTechnologies/netratel/releases/download/v0.1.2/SHA256SUMS
sha256sum -c --ignore-missing SHA256SUMS
```

The checksum result for `netratel-compose-0.1.2.tar.gz` must be `OK`. Then extract the bundle:

```bash
mkdir ../netratel-instance
tar -xzf netratel-compose-0.1.2.tar.gz -C ../netratel-instance
cd ../netratel-instance
umask 077
cp .env.images.example .env
```

The archive extracts directly into that directory. Its `.env.images.example` already contains the release's immutable image digests. Keep those values.

## 2. Set the password and login mode

Generate a database password:

```bash
openssl rand -hex 32
```

Open `.env` in your editor. Set `POSTGRES_PASSWORD` to the generated value and set these entries:

```dotenv
NETRATEL_AUTHENTICATION_MODE=Local
NETRATEL_AGENT_AUTH_PRIVATE_KEY=./.netratel-agent-es256-private.pem
NETRATEL_PUBLIC_ORIGIN=
NETRATEL_PUBLIC_GATEWAY_ORIGIN=
```

Leave OIDC settings empty. Clear both example public origins for this loopback setup. The database password is separate from the administrator passphrase you choose later.

## 3. Create the signing key

```bash
openssl ecparam -name prime256v1 -genkey -noout \
  -out .netratel-agent-es256-private.pem
sudo chown 1654:1654 .netratel-agent-es256-private.pem
sudo chmod 600 .netratel-agent-es256-private.pem
```

The API runs as UID 1654. The key path is relative to the Compose file.

## 4. Start NetRatel

```bash
docker compose --env-file .env -f compose.images.yaml config --quiet
docker compose --env-file .env -f compose.images.yaml pull
docker compose --env-file .env -f compose.images.yaml up -d
docker compose --env-file .env -f compose.images.yaml ps -a
```

Expect PostgreSQL to be healthy, `migrations` and `volume-init` to exit with code 0, and API and Web to run. To inspect a failed migration:

```bash
docker compose --env-file .env -f compose.images.yaml logs migrations
```

## 5. Create the administrator

Open **http://127.0.0.1:8080** in a browser on the Docker host. On a remote server, open an SSH tunnel from your own computer first:

```bash
ssh -L 8080:127.0.0.1:8080 admin@your-server
```

Keep the tunnel open and browse to the same local address. Retrieve the one-time setup code in the Docker-host terminal:

```bash
docker compose --env-file .env -f compose.images.yaml exec -T api \
  cat /var/netratel/bootstrap/setup-proof
```

Enter the code, initial tenant, administrator name, email and a passphrase of at least 15 characters. Sign in with that email and passphrase. There is no default administrator password.

The API restarts once as setup finishes. If the code is unavailable, inspect its state:

```bash
docker compose --env-file .env -f compose.images.yaml exec -T api \
  dotnet NetRatel.API.dll --setup-status
```

## Connect a computer

Your console is ready when you can sign in and see the initial tenant. [Add public HTTPS](/docs/deployment/public-https/) before [generating your first client installer](/docs/getting-started/first-client/).

For a different database or sign-in method, use [External PostgreSQL](/docs/deployment/external-postgresql/), [OIDC](/docs/identity/oidc/) or [Hybrid](/docs/identity/hybrid/).
