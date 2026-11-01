---
title: Connect RatelDesk
description: Pair NetRatel with RatelDesk and select incident creation, automation or both for an explicit tenant mapping.
---

Connect NetRatel and RatelDesk to create incidents from operations workflows and run automation from the helpdesk. Enable each direction independently for a specific NetRatel tenant and RatelDesk organization.

Use compatible releases of both products and sign in with authority to configure the resources you intend to connect.

## Pair and save the connection

1. Open **Integration credentials → System connections** in either product. In NetRatel, the page is `/account/integration-credentials`.
2. Select **Generate a Pairing Code**. The code lasts five minutes, can be used once, and is replaced when you generate another.
3. In the other product, select **Create Connection**. Enter the first product's **Address** and **Pairing code**, then choose **Pair & connect**.
4. After **Systems paired**, select the actual **NetRatel tenant** and **RatelDesk organization**. Select the organization's customer when enabling incident creation. Give the connection a recognizable name.
5. Choose **Create incidents**, **Run automation**, or both.
6. Select **Save**. Confirm that the list shows the intended mapping, capabilities and **Connected** status.

The pairing exchange provides the setup connection. Business capabilities become active only after you save the mapping. Pairing creates no tenants, organizations or customers; those resources must already exist and be accessible to the configuring accounts.

## Check each direction

Use **Test connection** to check authenticated access, mapping and selected capabilities. It does not create an incident or run a task.

Then exercise the business workflow you enabled:

- For **Create incidents**, select the connection in the relevant NetRatel flow and check the resulting incident in the mapped RatelDesk organization/customer.
- For **Run automation**, select the paired automation capability in RatelDesk and follow the resulting NetRatel work to its outcome.

Selecting incident creation does not implicitly enable automation in the opposite direction.

## Connect a request form to a job

A RatelDesk automation target is a NetRatel job definition. Its inputs become the parameters your request form supplies when it starts the job.

1. In RatelDesk, open **Service Explorer** at `/admin/requests/services`, select a service and edit its request form.
2. Select the form's organization. Add or select an **Automation** task, then choose the saved **Automation system connection** for that organization.
3. Use **Browse Library** to select a reviewed job in the mapped NetRatel tenant. To create one, choose **Create External orchestration Target**, enter its name, folder and an actual enrolled **Client Identity**. A new target has no executable steps or input parameters: open it in NetRatel **Jobs** and configure both, then reopen the RatelDesk form to reload the catalog before mapping inputs.
4. Under **Payload Mapping**, map each **Helpdesk Field** to its **Job Param**. Keep **Binding Enabled** selected and save the form.
5. Check the save result. Saving also attempts to synchronize mapped input definitions with NetRatel. A form can save while input synchronization fails; resolve the connection error and save again before running it.
6. Submit a test request and follow its NetRatel request and job run to completion. Check both the parameter values and the resulting task status before making the form available to users.

When job inputs change in NetRatel, reopen the binding and use **Refresh**, then **Drift** to review the differences. **Mark Import** and **Import** bring the reviewed input changes into the form. Review shared job parameters before saving form-side changes: input synchronization replaces the job's input definitions.

See RatelDesk's [job-binding guide](https://rateldesk.hello43031.chatgpt.site/docs/automation/job-bindings/) for the complete field-mapping workflow and its [NetRatel pairing guide](https://rateldesk.hello43031.chatgpt.site/docs/automation/netratel-pairing/) for the helpdesk side of connection setup.

## Maintain the mapping

The connection list shows the peer address, mapped tenants, enabled directions and latest test result. Choose **View** to inspect its saved configuration.

If Save fails, correct the inline error and retry the same form. Refreshing reopens an existing unconfigured pairing. If the peer is unreachable, check the address from the product server's network, including DNS, TLS and proxy routing.

**Delete connection** removes that mapping and revokes its local authority immediately. Other mappings between the installations continue to work. Removing the last mapping also removes the pair credentials. Existing incidents, tasks and flow history remain available.

## Upgrade an older connection

Upgrade both products before moving from the previous pairing protocol. The forward migration retires the old setup and disables its old connector/provider bindings. Pair again and save the mappings and directions you want to retain.

Netclaw connections, unrelated API/MCP credentials and existing business history are separate from this pairing.

[System pairing reference](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/integrations/rateldesk-pairing.md)

[NetRatel request-definition contract](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/src/NetRatel/NetRatel.API/Endpoints/Internal/InternalEndpoints.Authoring.cs) · [RatelDesk request builder](https://github.com/BostonTechnologies/rateldesk/blob/487052fab83d8d81cb41ae5b073fd75ab61e42ae/src/HelpDesk.NewWeb/Components/Pages/Admin/Requests/RequestFormBuilder.razor)
