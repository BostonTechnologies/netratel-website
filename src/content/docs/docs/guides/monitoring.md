---
title: Create a monitoring rule
description: Alert on CPU, disk space, selected services or a group of disconnected clients.
---

Monitoring evaluates client evidence and keeps each alert's history. A rule can stay visible in NetRatel or trigger a published [flow](/docs/guides/flows/) to notify a team or open an incident.

## Configure a rule

1. Open **Signals → Monitoring** at `/monitoring` and select a tenant.
2. Create a rule for CPU usage, disk free space or an exact service name.
3. Select its clients directly, through a static group, or across all eligible tenant clients if your permissions allow it.
4. Set the threshold, breach hold, recovery threshold and recovery hold. For disk rules, choose the unit explicitly.
5. Review the target selection, add a published flow if needed, and save with a reason.

Memory remains available in telemetry, but is not a rule type in v0.1.2. Discovering a service in inventory does not automatically monitor it; select it in a service rule.

## Understand alert state

| State | Meaning |
| --- | --- |
| Healthy | Current evidence is within the rule's conditions. |
| Pending | The threshold is breached; the breach hold is still running. |
| Firing | Fresh evidence has satisfied the full breach hold. |
| Recovering | Recovery evidence is present; the recovery hold is still running. |
| Resolved | Fresh evidence has completed the recovery hold. |
| Unknown | Evidence is missing, stale, incomplete or unsupported. |

Unknown does not mean zero usage or recovery. Check the client's connection and observation age when a series becomes Unknown.

## Alert when clients go offline

In the rule's side panel, enable **Alert if Offline** and set **Offline grace**. The default is 60 seconds; accepted values are 1–3,600 seconds.

This condition uses the rule's full target selection. One outage affecting several selected clients produces a grouped occurrence for that rule, with membership updated as clients disconnect and return. A selected flow runs for that occurrence rather than once per disconnected client.

## Respond to an occurrence

**Acknowledge** records that someone is handling it. **Clear** ends the current occurrence with an operator reason. A new occurrence needs fresh evidence and a new breach hold. Use a reasoned suppression with an expiry for planned maintenance; evaluation continues while outbound action is suppressed.

Reading or deleting an item under **Notifications** does not acknowledge or resolve its monitoring occurrence.

[v0.1.2 monitoring reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/operations/MONITORING.md)
