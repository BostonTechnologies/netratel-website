---
title: Windows computer use
description: Understand and evaluate the optional MCP interface for a selected Windows application.
---

Computer use lets an authorised MCP operator observe and act on one selected Windows application through its enrolled client. It is disabled by default on both API and endpoint. The v0.1.2 release documentation records interactive Windows acceptance as pending; use the supplied evaluation procedure before a wider deployment.

## What is supported

| Provider | Scope |
| --- | --- |
| `cua_driver` | The pinned optional Cua Driver sidecar; discover its available semantic and screenshot-based actions at runtime. |
| `native_windows` | A limited Win32 fallback for supported standard controls and application-rendered screenshots. |

Linux and macOS desktop providers are not included. The native fallback does not provide general browser, WPF or WinUI automation, nor pixel, key or scroll input. Providers are selected explicitly; a failed action does not switch providers automatically.

## Prepare a Windows evaluation

1. Use an independently enrolled Windows 11 x64 client with an ordinary user logged in.
2. Follow the [release-pinned endpoint setup](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/client/computer-use.md) to install the optional verified sidecar and enable `ComputerUse:Enabled` in the client's configuration.
3. Enable `NetRatel__ComputerUse__Enabled=true` on the API and apply its saved deployment.
4. Grant the required `remote-support.access` and `computer-use.view` / `computer-use.control` permissions, together with matching MCP policies.
5. Use one API replica, or route the requests to the node holding that client's control stream.

Use the [HTTP MCP connection](/docs/integrations/http-mcp/) already configured for the operator. Terminal permission alone does not grant computer-use control.

## Observe, act and verify

Discover the client and current logged-in session. Call `capabilities`, then `list_windows` for the selected provider. Use the returned session, process and window identifiers rather than a guessed title or coordinate.

Open a view lease for observation. For control, preview and confirm a control lease. Observe the window, preview one action using that observation, confirm it and observe again to check the result.

`verified` means the provider established its supported effect. `applied_unverified` means input may have arrived without proving the application result. An uncertain result needs a fresh observation before another action. Close the lease when finished.

The API records operation identity and outcomes; desktop text and screenshots are transient. The driver has no public listener in this design.

[v0.1.2 computer-use protocol](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/mcp-http/computer-use.md) · [Windows setup and evaluation](https://github.com/BostonTechnologies/netratel/blob/v0.1.2/docs/client/computer-use.md)
