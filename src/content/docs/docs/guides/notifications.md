---
title: Connect Slack and Discord
description: Configure a tenant notification destination and use it in an alert flow.
---

NetRatel can send monitoring-flow notifications to Slack and Discord incoming webhooks. Each destination belongs to one tenant and is selected explicitly in a flow.

## Add a destination

1. Create an incoming webhook for the intended Slack or Discord channel using that provider's administration tools.
2. In NetRatel, open **Admin → Integration → Notifications** at `/account/integration-credentials?tab=notifications`.
3. Select the tenant and choose **Add Slack** or **Add Discord**.
4. Give the destination a recognisable name, paste its webhook URL and enable it.
5. Save, then choose **Send test notification**. Confirm the message appeared in the intended channel.

Discord destinations can override the sender name and target an existing thread. Slack uses the identity and channel configured by its incoming webhook.

Saving a destination does not send a message. The explicit test verifies delivery separately from saving the settings.

## Use it in a flow

Open **Signals → Flows**, select the same tenant and add a notification action. Select the saved destination. For several channels, use an action group; it can contain Slack, Discord and RatelDesk actions.

The mapping node supplies the title and description. Validate, preview and publish the flow, then choose its published version in the monitoring rule. See [Send alerts through a flow](/docs/guides/flows/) for the complete path.

## Change a webhook

When editing a destination, leave the webhook field blank to retain its stored value. Enter a replacement to rotate it. Saved webhook values are not returned to the browser.

A changed destination has a new configuration revision. Choose **Use updated target** in affected flow drafts and publish a new version before expecting those flows to use the change.

## Check delivery

Run history records the outcome for each destination. A successful action is not resent just because another action failed. Rate-limit responses can be retried within the run's retry budget. An interrupted or ambiguous send is marked **DeliveryUnknown**.

Notifications shown inside NetRatel and outbound channel messages have separate lifecycles. Marking an application notification as read does not resolve the underlying monitoring alert.

[v0.1.3 notification reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/integrations/NOTIFICATION-CONNECTORS.md)
