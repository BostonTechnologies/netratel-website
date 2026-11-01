---
title: Save scripts and run a task
description: Keep reusable scripts in the library and run one on a selected client.
---

Use the **Script Library** for code you expect to run again. Use **New Task** for one command or one library script on an online client. A [job](/docs/guides/jobs/) combines multiple steps and can run on a schedule.

## Create a library script

1. Open **Script Library** at `/scriptlibrary`, then choose **New Script**.
2. Give it a clear name and select its script type.
3. Pick an existing folder, or enter a logical path such as `/operations/linux/`.
4. Create the entry, edit its contents and choose **Save**.

Keep the script focused on a specific job. Put the operating-system requirement and expected inputs near the top so another operator can review it quickly.

For a first Linux shell check, the complete script can be:

```sh
hostname
uptime
df -h
```

For PowerShell, a simple identity and service check is:

```powershell
$env:COMPUTERNAME
Get-Service | Select-Object -First 10 Name, Status
```

These examples read information; use a client with the matching interpreter.

## Edit without losing your draft

Click the script name above the editor to rename it. **Save** stores the name and
content together. **Delete** sits beside Save and still requires confirmation.
Use the full-screen editor when you need more room; moving between normal and
full-screen views preserves unsaved changes. A failed save retains the draft so
you can resolve the error before trying again.

## Run it

1. Open **Orchestration → New Task** at `/tasks/new`.
2. Select the tenant, environment and online target. Check the hostname and operating system shown in the target panel.
3. Select **Library Script**, choose **Browse**, then pick the saved script. For a one-off command, select **Shell Command** instead.
4. Add the script's required parameters. Under **Advanced**, review the preferred PowerShell interpreter if applicable.
5. Submit the task and follow its recorded result. Open **Task History** at `/tasks/history` to return to it later.

## Check the result

Read the final task state, exit code and output. Submission means NetRatel accepted the request; the execution result establishes what happened on the computer.

In **Task History**, expand a run for its target, tenant, timing, status and a
scrolling console preview. Details load when expanded. The preview is bounded to
60 lines and 12,288 characters; **Full output** opens the complete task view.
Refresh the preview for a later result, or use the full view for live logs.

Scripts run under the native client's account. PowerShell requires an installed interpreter: `Auto` prefers `pwsh`, with Windows PowerShell as a Windows fallback. Linux and macOS PowerShell scripts require `pwsh`. NetRatel reports an unavailable interpreter as a task failure without stopping the client.

[v0.1.3 task interface](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/src/NetRatel/NetRatel.Web/Components/Pages/Tasks/NewTask.razor) · [Interpreter behaviour](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/docs/client/CLIENT.md#script-interpreters)
