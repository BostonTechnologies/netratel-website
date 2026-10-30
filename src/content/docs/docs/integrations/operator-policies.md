---
title: MCP operator policies
description: Control which MCP operations can run, on which systems and within which limits.
---

An operator policy defines where and how an MCP connection may act. It works alongside the account's permissions and the credential's grants, so a connection can authenticate successfully while a particular operation is denied.

New HTTP credentials created through the [browser wizard](/docs/integrations/credentials/) receive one reviewed base policy per selected tenant, plus a separate Server access base when needed. Use the policy workspace to inspect those bounds or add specific exceptions.

## Find a policy

Open **Admin → MCP Policies** at `/admin/operator-policies`. Your account needs current `mcp.policy.admin` authority. Editing also requires an independently assigned policy that permits administration of the selected environment and target.

The default list shows active base policies, grouped by integration and tenant. Expand a base to see its child exceptions. Search by policy, principal, tenant, client, tag or operation; use **Lifecycle** to include inactive history.

Choose **Inspect** to open the policy dialog. It shows the selected identity, target, operations, path grants, limits, expiry and audit history. Filters and pagination remain in place when you close it.

## Change the allowed bounds

1. Inspect the current policy and its version.
2. Select **Edit** and change only the required operations, targets, paths, limits or expiry.
3. Choose **Preview exact change**.
4. Read the complete proposed result, acknowledge the review and confirm.
5. Check the saved version and audit readback.

Working-directory grants are exact: permission for `/tmp` does not include `/tmp/example`. Add each required directory deliberately. Policy expiry must stay within the associated credential's expiry.

If a policy or target changes while you are reviewing, obtain a fresh preview. After an interrupted response, use the saved result or **Refresh accepted receipt** to inspect what was accepted before preparing another change.

## Add an exception

Use **Add exception** on a base policy to select particular clients, tags, operations, classifications and an Allow or Deny effect.

Exceptions remain within the parent's tenant, identity, operation ceiling and limits. An explicit Deny wins over a matching Allow. When the base expires or is disabled, its children cannot authorize work.

A useful pattern is a read-oriented tenant base with a narrower exception for a specific operation or client group. Inspect the resulting bounds rather than assuming an exception widens access.

## Verify access from the credential

In the policy dialog, use **Check an owned credential's current admission** and select your HTTP MCP credential and exact tool/operation. Alternatively, open the credential's **Details → Refresh admission**.

Then perform a permitted read from the actual connected consumer. The admission view checks authorization; a live operation also checks the target's current availability and capabilities.

## Retire old policies

| Action | Result |
| --- | --- |
| **Disable** | Stops authorization while retaining the inactive record. |
| **Revoke** | Permanently retires the policy. |
| **Delete** | Removes it and its child exceptions from normal management; a minimal deleted record remains for existing audits. |

Batch deletion previews the selected count and impact, then reports each result separately. Use lifecycle filters when you need to inspect retained history.

For older installations, **Consolidate legacy integration policies** can group eligible rules under a base while preserving their existing bounds. It does not convert narrow rules into unrestricted access.

[Policy reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/mcp-http/authentication.md#bounded-operator-policies-in-the-web-ui)
