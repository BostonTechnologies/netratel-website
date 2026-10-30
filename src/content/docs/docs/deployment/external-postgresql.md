---
title: Use external PostgreSQL
description: Connect the release bundle to an existing PostgreSQL database instead of starting the bundled database.
---

Add the external-database overlay when you already operate PostgreSQL. It replaces the database connection for migrations, API and Web and leaves the bundled PostgreSQL service inactive.

## Prepare the database

Provision a dedicated NetRatel database and a role that can connect and apply its schema migrations. The database must be reachable from the application containers, with your chosen PostgreSQL TLS configuration available there.

Keep the release bundle's signing key, application storage and Data Protection volumes. An external database replaces only the database service.

## Set the connection string

In the extracted bundle's `.env`, set:

```dotenv
NETRATEL_EXTERNAL_DATABASE_CONNECTION_STRING='Host=postgres.example.com;Port=5432;Database=netratel;Username=netratel;Password=replace-with-your-database-password;SSL Mode=VerifyFull'
```

Use your actual host, database, credentials and TLS settings. For `VerifyFull`, the container must trust the database certificate's issuing CA and its name must match the server. Keep the rest of `.env`, including the published image digests and signing-key path.

The base Compose file still validates its `POSTGRES_PASSWORD` input while merging overlays. Keep a nonempty value in that field even though the effective external deployment uses the connection string above.

## Start with both files

Run on the Docker host from the bundle directory:

```bash
docker compose --env-file .env -f compose.images.yaml \
  -f compose.external-postgres.yaml config --quiet

docker compose --env-file .env -f compose.images.yaml \
  -f compose.external-postgres.yaml pull

docker compose --env-file .env -f compose.images.yaml \
  -f compose.external-postgres.yaml up -d

docker compose --env-file .env -f compose.images.yaml \
  -f compose.external-postgres.yaml ps -a
```

Expect migrations and volume initialization to finish with exit code 0. API and Web should then run. A bundled PostgreSQL container is not needed for this profile.

For public HTTPS, add `-f compose.public-https.yaml` after the external overlay. Keep the complete file set for future commands, including setup-code retrieval, logs and upgrades.

## Verify and finish setup

On a new instance, open Web and complete the [first-run wizard](/docs/getting-started/quickstart/#5-create-the-administrator). Add the external overlay when retrieving the code from API.

If migrations fail, inspect their logs:

```bash
docker compose --env-file .env -f compose.images.yaml \
  -f compose.external-postgres.yaml logs migrations
```

Check database reachability from the container network, credentials, certificate trust and schema permissions. Changing a connection string on an established installation points it at another database; it does not transfer its data. Plan a coordinated database-and-key restore when moving an existing instance.

## Related pages

- [Choose a deployment](/docs/deployment/overview/)
- [Public HTTPS](/docs/deployment/public-https/)
- [Upgrade NetRatel](/docs/deployment/upgrades/)
