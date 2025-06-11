# Getting Started

Getting started with this RealWorld project is as easy as installing a few prerequisites, running a few commands, and opening your favorite text editor. We'd love to have you [contribute](https://github.com/agnyz/bedstack/blob/main/CONTRIBUTING.md) to this project. If you have any questions, please reach out on [Discord](https://discord.gg/8UcP9QB5AV) or [GitHub Discussions](https://github.com/agnyz/bedstack/discussions)!

## Installation

### Prerequisites

- [Bun](https://bun.sh/) version 1.0.6 or higher.
- Terminal for accessing Bun via its command-line interface (CLI).
- Text Editor with TypeScript support.
  - We recommend [Visual Studio Code](https://code.visualstudio.com/); other IDEs have been reported to cause issues with ElysiaJS's type inference system.

### Setup

1. **Clone and install dependencies**

```sh
$ gh repo clone agnyz/bedstack
$ cd bedstack
$ bun i
```

2. **Ensure Docker daemon is running and spin up the Postgres+Bun container**

```sh
$ bun db
```

3. **Migrate the schema to the database**

```sh
$ bun db:migrate
```

4. **Run the app**

```sh
$ bun dev
```

## What's Next?

- Once you're ready to contribute, check out our [contributing guide](https://github.com/agnyz/bedstack/blob/main/CONTRIBUTING.md). We're excited to have you!
- If you're looking for a place to start, check out our [good first issues](https://github.com/agnyz/bedstack/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
- If you need support, check out our [support page](https://github.com/agnyz/bedstack/blob/main/SUPPORT.md).
- If have any questions or just want to chat, join our [Discord server](https://discord.gg/8UcP9QB5AV) or [GitHub Discussions](https://github.com/agnyz/bedstack/discussions).
