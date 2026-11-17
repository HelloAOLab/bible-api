---
title: Seed Bible Extensions
description: 'API reference for building Seed Bible extensions: the packages an extension imports, and every type, function and component they export.'
---

# Seed Bible Extensions

[Seed Bible](https://seedbible.org) is an open Bible reader that anyone can extend. An extension adds something to the reader: a toolbar button, a pane, a source of study content, a chat assistant. You build it in your own project and share it as a link; users install it from that link.

This section is the API reference for extensions: every package an extension imports, and every type, function and component in them. Each page is generated from the `seed-bible` npm package itself, so it always matches what you install.

## Start here

New to extensions? Create a project and run it in Seed Bible in a few minutes:

```bash
npm create seed-bible-extension@latest my-extension
```

The [developer guide](https://github.com/HelloAOLab/seed-bible/blob/develop/docs/developer-guide.md) walks through what that project contains and how to build on it. The [extension security model](https://github.com/HelloAOLab/seed-bible/blob/develop/docs/extension-security.md) explains why extensions run in their own sandbox and how permissions work.

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
The pages under reference/ are generated (and git ignored), so edit nothing
there. `pnpm generate:seed-bible-reference` rebuilds them from the seed-bible
package in docs/package.json, and `pnpm dev` / `pnpm build` run it first. To
document a newer release of Seed Bible, update that dependency.
-->
