# Developer's Guide

Hey there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great and we truly appreciate your time and effort.

> [!IMPORTANT]
> Before submitting your contribution, please take a moment and read through the following guidelines.

## 👨‍💻 Repository Setup

This project uses [Bun](https://bun.sh) as a runtime as well as a package manager. It's a modern, fast, and lightweight alternative to [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/). To install Bun on POSIX systems (like Ubuntu or macOS), run the following command:

```sh
curl -fsSL https://bun.sh/install | bash
```

Otherwise, visit the [Bun installation page](https://bun.sh/docs/installation) for installation options.

## 💡 Commands

### `bun dev`

Start the development environment in watch mode.

### `bun run build`

Build the project for production. The result is under `dist/`.

### `bun check`

We use [Biome](https://biomejs.dev/) for **both linting and formatting**. It is an ultra-fast, Rust based linter and formatter.
It also lints JSON.

You can also run `bun fix` to apply any safe fixes automatically.

### `bun run test`

Run the API tests.

### `bun docs`

Start the documentation dev server. Use `bun docs:build` to build the docs for production.

### `bun run`

Print a full list of available scripts.

## 🙌 The Road to a Great Pull Request

### Discuss First

Before you start to work on a feature pull request, it's always better to open a feature request (FR) issue first to discuss with the maintainers whether the feature is desired and the design of those features. This would help save time for both the maintainers and the contributors and help features to be shipped faster.

For typo fixes, it's recommended to batch multiple typo fixes into one pull request to maintain a cleaner commit history.

### Pull Request

If you don't know how to send a Pull Request, we recommend reading [the guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

If your PR fixes or resolves an existing issue, please add the following line in your PR description according to the following example:

```markdown
Fixes #123
```

Where the template is:

```markdown
<keyword> #<issue-number>
```

Replacing:

- `<keyword>` with one of `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, `resolved`
- `<issue-number>`: the issue number you are fixing

This will let GitHub know the issues are linked, and automatically close them once the PR gets merged. Learn more at [the guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword).

It's ok to have multiple commits in a single PR, you don't need to rebase or force push for your changes as we will use `Squash and Merge` to squash the commits into one commit when merging.

## 📖 References

### Lint

We use [Biome](https://biomejs.dev/) for both linting and formatting with [a few custom rules](./biome.json). It is an ultra-fast, Rust based linter and formatter.

<table><tr><td>

#### IDE Setup

We recommend using [VS Code](https://code.visualstudio.com/) along with the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome).

With the settings on the right, you can have auto fix and formatting when you save the code you are editing.

</td><td><br>

VS Code's `settings.json`

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": true
  }
}
```

</td></tr></table>

## 💖 Thanks / Inspiration

This guide is inspired by [`antfu/contribute`](https://github.com/antfu/contribute).
