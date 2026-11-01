---
title: Build and schedule a job
description: Combine repeatable steps, collect inputs and follow each run to its result.
---

A job is a reusable definition with a tenant, target, inputs and ordered steps. Each execution creates its own run, so you can inspect a failure without changing the definition.

## Create the definition

1. Open **Orchestration → Jobs** at `/jobs` and choose **New Job**.
2. Enter a name and short description. Select the tenant, environment and client, then choose a folder if useful.
3. Add the required input parameters. The run form supports strings, numbers, booleans, selections, JSON and secret inputs.
4. Add steps. Use **RunCommand** for a command, **LibraryScript** for a reusable script, or **HttpAction** for a configured HTTP request.
5. Set the expected runtime and grace period, then save the definition.

Start with a small job whose output you can recognise. Test its scripts individually before combining them into a longer sequence.

## Run it manually

Choose the job's **Run** action. Review the tenant, target and environment, fill in the inputs and select **Start Run**. NetRatel opens the run detail page.

Follow the active step and inspect its output. The job run is the overall execution; a task created by an individual step is one part of that run. Use the run's final state and each step's result when checking success.

The **Recent Runs** tab lets you search runs and filter by status. Keep the run ID when reporting an issue so another operator can open the same execution.

## Add a schedule

Edit the job and open **Schedule**. Enable **Run on a schedule**, choose every day or selected days, and review the time shown by the editor. Save the completed definition to enable the schedule. Leave scheduling off while you are still testing the steps.

Schedules belong to Jobs. [Monitoring flows](/docs/guides/flows/) are a separate feature that reacts to alert events.

## When a run cannot start

Confirm that the target is available, your tenant permissions still allow the work, and the current script revision and input values are valid. If parameters fail to load, use **Retry parameters** before submitting. If a run exists, inspect that run before starting another execution.

[v0.1.3 job workspace](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/src/NetRatel/NetRatel.Web/Components/Pages/Jobs/JobsPage.razor) · [Job editor](https://github.com/BostonTechnologies/netratel/blob/v0.1.3/src/NetRatel/NetRatel.Web/Components/Pages/Jobs/JobEditDialog.razor)
