---
title: Send alerts through a flow
description: Turn a monitoring occurrence into a RatelDesk incident, a notification or an AI investigation.
---

A flow defines what happens when a monitoring alert arrives. You edit a draft, preview it, publish a version and select that version in a rule.

## Build the path

1. Configure the required [notification destinations](/docs/guides/notifications/), [RatelDesk connection](/docs/integrations/rateldesk/) or [NetClaw connection](/docs/integrations/netclaw/).
2. Open **Signals → Flows** at `/flows` and choose the same tenant.
3. Create a flow from the available template. Start with **Alert raised**, map the alert fields, and add the required action.
4. Add a condition if the flow should only handle some events. Add **AI: Investigate alert** if a NetClaw investigation should run before delivery.
5. Validate and dry-run with a sample event. Check the resulting title, description and selected targets.
6. Publish the flow, then select its published version in your monitoring rule.

Saving, validating and dry-running do not send notifications or create an incident. Actual execution begins when monitoring hands off an admitted event.

## Write useful messages

Start with the affected system and problem. Available placeholders include `{ruleName}`, `{clientName}`, `{resource}`, `{metric}`, `{severity}`, `{value}` and `{occurredAt}`. Grouped offline alerts also provide `{offlineSummary}`, `{offlineCount}` and `{offlineClients}`.

For example:

```text
Title: {clientName}: {ruleName}
Description: {resource} reported {value} at {occurredAt}.
```

An AI step can add investigation summary, evidence and recommendations. Choose whether an unsuccessful investigation stops delivery or continues with the original alert.

## Deliver to several places

Use **Add more actions** on an incident action, or add an **Action group**, to combine up to eight supported destinations. Each child has its own result, so a successful ticket remains visible even if a notification fails.

Inspect run history for each action's receipt. **DeliveryUnknown** means a send may have occurred without a conclusive response; inspect the destination before repeating it.

## Update a published flow

A published version is immutable. After changing a connector, choose **Use updated target** in the draft, publish again and update rules that should use it. Editing a draft does not silently change an existing published version.

Flows support a bounded path through supported nodes. For scheduled command execution, use [Jobs](/docs/guides/jobs/).

[v0.1.2 flow reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/operations/FLOWS.md)
