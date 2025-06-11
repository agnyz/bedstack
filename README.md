<div align='center'>

<img src="docs/public/logo-mini.png" alt="Logo for Bedstack RealWorld example" width=200>
<h1>Bedstack</h1>

[bedstack.js.org](https://bedstack.js.org)

[RealWorld](https://realworld-docs.netlify.app/) example app for [Bun](https://bun.sh/) + [ElysiaJS](https://elysiajs.com/) + [Drizzle](https://orm.drizzle.team/)

[![Tests Status](https://github.com/agnyz/bedstack/actions/workflows/tests.yml/badge.svg?event=push&branch=main)](https://github.com/agnyz/bedstack/actions/workflows/tests.yml?query=branch%3Amain) [![Fully compliant with the RealWorld API spec](https://img.shields.io/badge/RealWorld%20API-compatible-success?labelColor=2f1c42)](https://realworld-docs.netlify.app/specifications/backend/endpoints) [![Featured on CodebaseShow](https://img.shields.io/badge/CodebaseShow-approved-success?labelColor=2c3669)](https://codebase.show/projects/realworld?category=backend&language=typescript) [![GitHub License](https://img.shields.io/github/license/agnyz/bedstack)](https://github.com/agnyz/bedstack/blob/main/LICENSE) [![Star bedstack on GitHub](https://img.shields.io/github/stars/agnyz/bedstack)](https://github.com/agnyz/bedstack)

## Let's share a BED - join our [Discord server](https://discord.gg/8UcP9QB5AV)

</div>

### Quickstart

1. **Clone and install dependencies**

   ```sh
   gh repo clone agnyz/bedstack
   cd bedstack
   bun i
   ```

2. **Create a `.env` file**

   ```sh
   cp .env.example .env
   ```

   Use the provided example values or replace them with your own.

3. **Ensure Docker daemon is running and spin up the Postgres container**

   ```sh
   bun db
   ```

4. **Migrate the schema to the database**

   ```sh
   bun db:migrate
   ```

5. **Run the development server**

   ```sh
   bun dev
   ```

6. **Run the API tests**

   ```sh
   bun run test # not `bun test`!
   ```

### Building for production

> [!TIP]
> See more info in ElysiaJS's [Building for production](https://elysiajs.com/tutorial.html#build-for-production) guide.

1. **Build the app**

   ```sh
   bun run build # not `bun build`!
   ```

2. **Run the server**

   ```sh
   bun preview
   ```

### Contributing

See [Developer's Guide](CONTRIBUTING.md).
