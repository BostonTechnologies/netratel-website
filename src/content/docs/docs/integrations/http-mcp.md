---
title: HTTP MCP
description: Deploy the optional HTTP MCP service, connect it to NetRatel and give each consumer its own access.
---

HTTP MCP lets compatible assistants connect to NetRatel over HTTPS. Set up the **MCP service's connection to the API** once, then configure **each client connection** separately.

The public endpoint is usually `https://netratel.example.com/mcp`, routed through the existing Web origin. Keep the MCP service's internal listener private.

## Choose authentication

| Mode | Client uses | Compose settings |
| --- | --- | --- |
| NetRatel credentials | An HTTP MCP-purpose integration credential | `NETRATEL_MCP_LOCAL_CREDENTIAL_MODE=true` and `NETRATEL_MCP_AUTHENTICATION_MODE=LocalCredential` |
| External OIDC | A token from your configured provider | `NETRATEL_MCP_LOCAL_CREDENTIAL_MODE=false` and `NETRATEL_MCP_AUTHENTICATION_MODE=Oidc` |

Local credential mode also needs the same canonical resource and delegation settings on API and MCP. OIDC needs its HTTPS authority, audience equal to that resource, and required groups/scopes. Browser Local/OIDC/Hybrid sign-in is configured independently.

## Prepare the deployment

Use the matching v0.1.3 API, Web and MCP images from the verified release bundle. The bundle includes `compose.mcp-http.yaml` and `setup-http-mcp.sh`.

On a new MCP deployment, add the MCP overlay and routing to the saved stack through the manager that already owns it. Pull the matching MCP image. Keep all existing database, ingress and storage definitions. Set the canonical endpoint through `NETRATEL_MCP_PUBLIC_RESOURCE_URI` or the trusted public origin used by setup.

The guided host launcher needs a Linux Docker host with Bash, Python 3, GNU coreutils and Docker Compose supporting `config --no-env-resolution` (upstream Compose v2.35.0 or later).

## Connect the MCP service to the API

For an existing MCP container, run this on the **Docker host**:

```sh
docker ps --filter label=com.docker.compose.service=mcp-http \
  --format 'table {{.Names}}\t{{.Image}}'

mkdir -p netratel-mcp-tools
cd netratel-mcp-tools
mcp_container=YOUR_MCP_CONTAINER
docker cp "$mcp_container:/app/setup-http-mcp.sh" ./setup-http-mcp.sh
bash ./setup-http-mcp.sh --container "$mcp_container"
```

Replace `YOUR_MCP_CONTAINER` with the listed name. For first-time enablement before that container exists, run the bundle's launcher with the actual saved source paths:

```sh
bash ./setup-http-mcp.sh \
  --compose-file /absolute/path/to/compose.images.yaml \
  --compose-file /absolute/path/to/compose.mcp-http.yaml \
  --env-file /absolute/path/to/.env \
  --project YOUR_EXISTING_PROJECT \
  --manager release-compose
```

Include every real overlay in its merge order. Use `external-compose` when an external manager owns the deployment; its saved document may be a single file.

1. Enter the NetRatel Web URL and check the displayed Web, MCP and API addresses.
2. Open the approval link, sign in as the installation administrator and choose **Review host**.
3. Save the reviewed configuration. For an external manager, **Export and exit**, import the complete reviewed document into that same manager, then deploy. For release-owned Compose, run the printed apply command.
4. Run the printed host-side verification command. For the existing-container path:

   ```sh
   bash ./setup-http-mcp.sh --container "$mcp_container" --verify
   ```

5. In local credential mode, approve the short-lived **Temporary verification client** when requested. Finish when setup reports **End-to-end verified**.

Retain the setup directory and persistent volumes. **Saved — apply pending** means the running deployment has not yet received the configuration.

## Connect a consumer

Create a separate [HTTP MCP credential](/docs/integrations/credentials/) for the consumer. Configure its canonical `/mcp` URL and protected bearer storage in that consumer. [Netclaw setup](/docs/integrations/netclaw/) provides an example; a consumer limited to local processes can use the [HTTP-to-stdio bridge](/docs/integrations/stdio/#use-a-stdio-only-client-with-http-mcp).

In an already prepared MCP container, `dotnet /app/NetRatel.Mcp.Http.dll setup` configures a **personal client profile**. It does not provision the host or install a connection on another computer.

## Check the connection

Once connected, `netratel_software` exposes saved software inventory, installations,
prevalence, changes and tenant collection policy. Reads do not start a scan;
refresh and policy changes use the existing preview and confirmation flow. See
[software inventory](/docs/guides/software-inventory/#use-an-assistant-or-api) for
scope, freshness and supported platforms.

After the client initializes and lists tools, call `netratel_auth` with `{"operation":"status"}`. Then call an approved tenant read, such as `netratel_flows` with `{"operation":"list","request":{"tenantId":17}}`, replacing `17` with your tenant ID.

| Result | Next check |
| --- | --- |
| HTML instead of MCP | `/mcp` routing and the configured backend. |
| 401 | Credential purpose, canonical resource, expiry and authentication mode. |
| Authenticated, but tenant read denied | Owner permissions, tenant grant and matching operator policy. |
| Service cannot reach the API | Host service identity, selected API URL, DNS and TLS. |

[Detailed host settings](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/mcp-http/configuration.md) · [Host recovery and storage](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/mcp-http/hosting-reference.md)
