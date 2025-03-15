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

[**We don't use Prettier**](#no-prettier).

### `bun test`

> [!NOTE]
> This is just a placeholder for now. We will add more details later once tests are formally added.

Run the tests. We mostly using [Vitest](https://vitest.dev/) - a replacement of [Jest](https://jestjs.io/).

You can filter the tests to be run by `bun test [match]`, for example, `bun test foo` will only run test files that contain `foo`.

Config options are often under the `test` field of `vitest.config.ts` or `vite.config.ts`.

Vitest runs in [watch mode by default](https://vitest.dev/guide/features.html#watch-mode), so you can modify the code and see the test result automatically, which is great for [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development). To run the test only once, you can do `bun test --run`.

For some projects, we might have multiple types of tests set up. For example `bun test:unit` for unit tests, `bun test:e2e` for end-to-end tests. `bun test` commonly run them together, you can run them separately as needed.

### `bun docs`

Start the documentation dev server. Use `bun docs:build` to build the docs for production.

### `bun run`

Print a full list of available scripts.

## 🙌 The Road to a Great Pull Request

### Discuss First

Before you start to work on a feature pull request, it's always better to open a feature request (FR) issue first to discuss with the maintainers whether the feature is desired and the design of those features. This would help save time for both the maintainers and the contributors and help features to be shipped faster.

For typo fixes, it's recommended to batch multiple typo fixes into one pull request to maintain a cleaner commit history.

### Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, which allows the changelog to be auto-generated based on the commits. Please read the guide through if you aren't familiar with it already. 

> [!NOTE]
> A full specification can be found in [the AngularJS Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

Only `perf:`, `fix:`, and `feat:` will be present in the changelog.

Note that `perf:`, `fix:`, and `feat:` are for **actual code changes** (that might affect logic).
For typo fixes or document changes, use `docs:` or `chore:` instead:

- ~~`fix: typo`~~ -> `docs: fix typo`

### Pull Request

If you don't know how to send a Pull Request, we recommend reading [the guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

When sending a pull request, make sure your PR's title also follows the [Commit Convention](#commit-conventions).

If your PR fixes or resolves an existing issue, please add the following line in your PR description according to the following example:

```markdown
Fixes #123
```

Where the template is:

```markdown
<keyword> #<issue-number>
```

Replacing:
* `<keyword>` with one of `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, `resolved`
* `<issue-number>`: the issue number you are fixing

This will let GitHub know the issues are linked, and automatically close them once the PR gets merged. Learn more at [the guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword).

It's ok to have multiple commits in a single PR, you don't need to rebase or force push for your changes as we will use `Squash and Merge` to squash the commits into one commit when merging.

## 🧑‍🔧 Maintenance

This section is for maintainers with write access, or if you want to maintain your own forks.

<table><tr><td>

#### Build Locally

For this type of setup, the building and publishing process is done on your local machine. Make sure you have your local [`npm` logged in](http://npm.github.io/installation-setup-docs/installing/logging-in-and-out.html) before doing that.

In `package.json`, we usually have:

```json
{
  "scripts": {
    "prepack": "bun run build"
  }
}
```

So whenever you run `npm publish`, it will make sure you have the latest change in the distribution.

</td><td>

#### Build on CI

For complex projects that take long time to build, we might move the building and publishing process to CI. So it doesn't block your local workflow.

They will be triggered by the `v` prefixed git tag added by `bumpp`. The action is usually defined under `.github/workflows/release.yml`

> When maintaining your own fork, you might need to see `NPM_TOKEN` secret to your repository for it to publish the packages.

</td></tr></table>

Changelogs are always generated by GitHub Actions.

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

*This guide is **heavily** inspired by [`antfu/contribute`](https://github.com/antfu/contribute).*
