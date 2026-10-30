---
title: Netclaw and AI Ops
description: Pair a tenant with Netclaw, start general chats and investigations, and grant tool access separately.
---

Netclaw brings conversational assistance into NetRatel. General chat starts with a question; an investigation starts with selected systems and keeps that scope alongside its transcript.

Two connections make this work:

| Connection | What it enables |
| --- | --- |
| NetRatel → Netclaw daemon | Native chat, investigation messages and approvals. |
| Netclaw → NetRatel MCP | The tools Netclaw can use to read or operate your systems. |

Pairing the chat connection does not create the MCP connection or grant its tools.

## Pair a tenant

Your account needs `telemetry.read` to discover the tenant and `tenant.admin` to configure its connection.

1. In NetRatel, select the intended tenant and open **AI Ops → Connect Netclaw**, or the **Netclaw** tab at `/account/integration-credentials`.
2. On that tenant's Netclaw host, run:

   ```sh
   netclaw daemon pair
   ```

3. Enter the printed daemon address and one-time code in NetRatel, then choose **Pair & connect**.
4. Check the authenticated connection result. If verification fails after the credential was saved, correct connectivity and choose **Test connection**. After an interrupted request, use **Reload saved connection** first.
5. Choose **Open Chat** or open **Investigations**.

NetRatel stores the device credential on the server, protected by the deployment's Data Protection keys. Retain those keys when replacing containers.

## Start a conversation

Open **AI Ops → Chat**, select the tenant and send your first question. No system selection or prompt library is required. You can ask for a script draft, review notifications or discuss a flow. Welcome cards fill the composer; you decide when to send.

Use **Ctrl+Enter**, or **⌘+Enter** on macOS, to send. Enter adds a new line. Conversation history is scoped to the selected tenant.

For a scoped investigation, open **AI Ops → Investigations**, choose a title and 1–20 systems, then ask your question. Optional tenant prompts can supply runbook guidance. The selected systems provide context; actual tool access still follows the daemon's credentials and policies.

Reading chats needs `telemetry.read`. Creating them also needs `client.manage`; sending messages, approvals and recovery additionally need `secret.use`.

## Give Netclaw access to NetRatel tools

First complete [HTTP MCP hosting](/docs/integrations/http-mcp/) and create a [credential](/docs/integrations/credentials/) limited to the intended tenant.

On the Netclaw host, as the account running that daemon, register the canonical endpoint:

```sh
netclaw mcp add customer-netratel https://netratel.example.com/mcp --transport http
```

In Bash on the same host, store its HTTP MCP bearer in Netclaw's encrypted secret store:

```bash
set +x
IFS= read -r -s -p 'Paste the HTTP MCP credential: ' netratel_credential
printf '\n'
netclaw secrets set McpServers.customer-netratel.Headers.Authorization "Bearer $netratel_credential"
unset netratel_credential
```

Use the daemon's own protected configuration; a NetRatel container profile is a separate client.

Restart the daemon through its existing supervisor, then inspect:

```sh
netclaw mcp list
netclaw mcp permissions
netclaw mcp tools customer-netratel --audience personal
```

Select the intended server and tools in the audience permissions and retain the approval behavior you want for write actions. Verify one permitted tenant read through the connection.

## Deploy for tenant isolation

For tenant-isolated AI Ops, use a separate Netclaw daemon and endpoint for each tenant, with its own state and only that tenant's MCP credential. Native SignalR turns currently use Netclaw's Personal audience; device names and prompts do not partition one daemon's available tools.

Use one NetRatel API replica for interactive Netclaw chat in v0.1.2. Approval responses and explicit recovery need the API instance that owns the conversation transport.

If a turn shows **Outcome unconfirmed**, choose **Recover session** to read the saved remote history. Recovery does not resend the question. Review any pending approval and its exact proposed action before responding.

[AI Ops reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/integrations/netclaw-ai-operations.md) · [Netclaw credential and isolation setup](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/integrations/netclaw-http-mcp.md)
