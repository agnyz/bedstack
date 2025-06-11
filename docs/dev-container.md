# Developing in a Dev Container

This project provides partial support for developing in a [dev container](https://code.visualstudio.com/docs/remote/containers). We are still working on this feature, but once it is ready, it should make the onboarding process much easier. At that point, it would be **the recommended way to develop this project**.

## Why use a dev container?

The main reason to use a dev container is to **make the onboarding process as easy as possible**. With a dev container, you can get started with this project with just a few clicks. You don't need to install any dependencies on your machine, and you don't need to worry about setting up your environment. Everything is already set up for you.

## Getting started

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) version 1.60.0 or higher.
- [Docker](https://www.docker.com/) version 20.10.8 or higher.
- [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for Visual Studio Code.

::: info
For now, you must change "file sharing implementation" from **VirtioFS** to **gRPC fuse** in the _Docker settings_. See [oven-sh/bun#4923](https://github.com/oven-sh/bun/issues/4923#issuecomment-1715677390) for more details.
:::

<!-- ::: info
For now, you must _rebuild_ the container using `⌘` `⇧` `P` → `Dev Containers: Rebuild Container` after building the container the first time. See [#55](https://github.com/agnyz/bedstack/issues/55) for details; PRs welcome.
::: -->

::: info
For now, you must _rebuild_ the container using `⌘` `⇧` `P`
→ `Dev Containers: Rebuild Container` after building the container the first time. See [#55](https://github.com/agnyz/bedstack/issues/55) for details; PRs welcome.
:::

### Setup

1. **Clone the repository**

```sh
$ gh repo clone agnyz/bedstack
$ cd bedstack
```

2. **Open the project in a dev container**

   1. Open the command palette (Cmd+Shift+P on macOS, Ctrl+Shift+P on Windows/Linux) and select **Remote-Containers: Open Folder in Container...**.
   2. Select the project folder.
   3. Wait for the container to build and open the project in a new window.

3. :tada: **You're ready to go!**

## What's Next?

- Please report any issues you encounter with the dev container in [GitHub Issues, with the `devcontainers` label](https://github.com/agnyz/bedstack/labels/devcontainers).
