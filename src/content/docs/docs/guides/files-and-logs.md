---
title: Browse files and investigate logs
description: Work with a selected client's files and inspect a bounded log history or live stream.
---

Use the client file browser and log explorer for targeted investigation. Both operate on an enrolled client and reflect its capabilities and your current permissions.

## Browse files

1. Open **Clients**, find the intended computer and select its file-browser action.
2. Enter the **Remote path** or open a listed folder. Use **Up** to return to its parent.
3. Filter the current directory by name. Open a file to inspect it, or choose **Download**.
4. Use **Upload** or **New folder** when your access allows it. The delete-folder action applies to empty folders.

Directory listings show immediate entries, not a recursive scan or calculated folder sizes. Creation and modification times can be missing when a platform or older client does not report them.

The read, write and delete permissions are independent. Tooling additionally requires a matching operation policy and permitted path root.

## Browse through the CLI

After [connecting the CLI](/docs/reference/cli/), substitute your discovered IDs and an approved path:

```sh
netratel files-v2 browse --tenant-id 7 --agent-id "$AGENT_ID" \
  --path /var/log --page-size 50
```

When the response includes `nextCursor`, repeat the command with that value as `--cursor`. Keep the identity, target, path and page size unchanged. A stale or expired cursor means start again without it.

File mutations have separate preview and confirmation commands. Use the operation's `--help` for its exact plan-token and idempotency-key arguments.

## Inspect logs

Open a client's **Logs** action and select an available **Source**. Choose **Log history** to investigate a past event, or **Live logs** to follow new records.

Expand filters to search text, severity and category. Sources that support them also offer provider, event ID and UTC time filters. Apply a narrow time range around the event, then load older records if needed.

Check the displayed stream state and any dropped-record or resynchronisation message before concluding a history is complete. Clearing displayed records only clears the view. For MCP investigations, discover available log sources first and retain the returned cursor when paging.

[v0.1.2 file-operation reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/integrations/CLI_AND_MCP.md#folder-browsing-and-mutations) · [Log explorer](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/src/NetRatel/NetRatel.Web/Components/Dialogs/GatewayClientLogExplorerDialog.razor)
