---
title: Seed Bible Extensions
description: 'API reference for building Seed Bible extensions: the packages an extension imports, and every type, function and component they export.'
---

# Seed Bible Extensions

<AgentBootstrap>

```text
Help me build a Seed Bible extension.

What I want it to do: <describe your idea here, or leave this line and ask me>

## Background

Seed Bible (https://seedbible.org) is an open Bible reader. An extension adds something to it: a toolbar button, a pane, a source of study content, a chat assistant. It runs in its own sandboxed iframe, and reaches the app only through the `sb` object, using only the permissions declared in its extension.json and approved by the user.

## Steps

1. If I haven't said what the extension should do, ask me before writing any code. Then propose a short plan: what it adds to the reader, which `sb` APIs and permissions it needs, and anything that isn't possible with the API.
2. Create the project, with a short kebab-case name (it becomes the extension's id):
   npm create seed-bible-extension@latest <name>
   cd <name>
   npm install
   This needs Node.js 22 or newer and npm 11 or newer (npm 10 crashes while installing the project's tools). pnpm works too.
3. Read these before writing code:
   - README.md in the new project: its commands, permissions and hosting.
   - extension.json, src/init.tsx (the starter extension) and src/init.test.tsx (how tests run it).
   - The API's type declarations, which are the source of truth for what exists: node_modules/seed-bible/dist/extensions/index.d.ts (`SandboxContext` is `sb`), node_modules/seed-bible/dist/extensions/testing.d.ts and node_modules/seed-bible/dist/components/index.d.ts.
   - The API reference, with every `sb` call, permission, error and limit: https://raw.githubusercontent.com/HelloAOLab/seed-bible/develop/docs/extension-api.md
   - When you need more context, the developer guide: https://raw.githubusercontent.com/HelloAOLab/seed-bible/develop/docs/developer-guide.md
   - Browsable reference pages: https://bible.helloao.org/docs/seed-bible/
4. Build it, following these rules:
   - The module's default export must be what `defineExtension` (from "seed-bible/extensions") returns. Register tools and providers in `main`. Views are Preact components, shown in panes, dialogs or the settings tab.
   - Nearly every `sb` call returns a promise that rejects with a `SandboxError` when the app refuses it. Await it or catch it, and handle the error codes that matter (for example `unavailable` when the user is signed out).
   - Values that change, such as the reading position, are Preact signals: read `.value`.
   - Some calls only work from `main`, and some only right after the user interacts with the extension (in a tool's `onSelect`, or a click in one of its views). The reference marks which.
   - Declare every permission the code uses in extension.json: `permissions` for what it can't work without, `optionalPermissions` for what only some features need (request those with `sb.permissions.request(...)` when the feature is used). List every host it contacts under `network`.
   - Put user-facing text in the `translations` section of extension.json and show it with `sb.i18n.t`.
   - Build the interface from "seed-bible/components" where one fits, and style the rest with the app's `--sb-*` CSS variables, so it matches Seed Bible and its dark mode.
5. Test it with `createTestHost` from "seed-bible/extensions/testing": cover each thing it does, and what happens when a permission is refused or a call fails.
6. Check your work, and fix everything these report:
   npm run check
   npm run lint
   npm test
7. Tell me how to try it: `npm run dev` runs it in a real copy of Seed Bible at http://localhost:3002. It needs git, pnpm and Bun, takes a few minutes the first time, and keeps running, so start it in the background or ask me to run it.
8. When it's done, summarize what you built and the permissions it asks for. To share it, `npm run publish` prints a link anyone can install it from, and `npm run package` writes the files to host it yourself (see the project's README.md).
```

</AgentBootstrap>

[Seed Bible](https://seedbible.org) is an open Bible reader that anyone can extend. An extension adds something to the reader: a toolbar button, a pane, a source of study content, a chat assistant. You build it in your own project and share it as a link; users install it from that link.

This section has the guides to building one, and an API reference with every package an extension imports and every type, function and component in them. Both come from the Seed Bible release named in the sidebar, so they match what you install.

## Start here

New to extensions? Create a project and run it in Seed Bible in a few minutes:

```bash
npm create seed-bible-extension@latest my-extension
```

The [developer guide](./guide/developer-guide.md) walks through what that project contains and how to build on it. Keep the [extension API guide](./guide/extension-api.md) open while you write code: it covers every `sb` call, `extension.json` field, error and limit, with examples. The [security model](./guide/extension-security.md) explains why extensions run in their own sandbox and how permissions work.

## Packages

An extension imports from three entry points of the `seed-bible` package:

- **[`seed-bible/extensions`](./reference/extensions/README.md)**: writing the extension. [`defineExtension`](./reference/extensions/functions/defineExtension.md) declares it, and the [`SandboxContext`](./reference/extensions/interfaces/SandboxContext.md) it hands you (`sb`) is how you reach the reader.
- **[`seed-bible/extensions/testing`](./reference/extensions/testing/README.md)**: testing it. [`createTestHost`](./reference/extensions/testing/functions/createTestHost.md) runs your extension in a unit test against a stand-in for Seed Bible.
- **[`seed-bible/components`](./reference/components/README.md)**: building its interface. Buttons, bottom sheets, menus and icons that look and behave like Seed Bible's own, in the user's theme.

```ts
import { defineExtension, SandboxError } from 'seed-bible/extensions';
import { Button } from 'seed-bible/components';
import { createTestHost } from 'seed-bible/extensions/testing'; // tests only
```

## Reading the reference

- **Most of the API lives on `sb`.** Every `sb.*` call (`sb.tools`, `sb.reading`, `sb.notes`, …) is a property of [`SandboxContext`](./reference/extensions/interfaces/SandboxContext.md). Its page says what each call takes and returns, and which permission it needs.
- **Almost every call returns a promise.** Your extension runs in its own frame and each call is a message to the app, which can refuse it. A refused call rejects with a [`SandboxError`](./reference/extensions/classes/SandboxError.md) whose `code` says why.
- **Values that change are signals.** Things like the reading position are [Preact signals](https://preactjs.com/guide/v10/signals/): read `.value` for the latest value.
- **Unexported types.** Each package has an "Unexported types" page for types its exports use but that the package doesn't export by name, such as the error codes in `SandboxError.code`. They're listed so every type in the reference links somewhere, but you can't import them; use the value directly (`"permission_denied"`) or derive the type (`SandboxError["code"]`).

<!--
The pages under reference/ and guide/ are generated (and git ignored), so
edit nothing there. `pnpm generate:seed-bible` rebuilds them for the
seed-bible version in docs/package.json, and `pnpm dev` / `pnpm build` run it
first. To document a newer release of Seed Bible, update that dependency.
-->
