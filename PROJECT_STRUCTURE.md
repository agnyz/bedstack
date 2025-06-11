# Project Structure

This document describes the file structure and organization of the codebase. The layout is flat and feature-sliced, with each domain feature (e.g., articles, comments) self-contained.

We follow a **one file per thing** rule to maintain clear organization.

## Top-Level Overview

```plaintext
src/
├── app.module.ts         # Main module that composes all features
├── database.providers.ts # Database providers
├── main.ts               # Entry point
├── ...resources/         # All resource modules directly under `src/`
├── common/               # Common constants, interfaces, and utilities\
scripts/                  # Scripts managed by `package.json`
drizzle/                  # Drizzle migrations and scripts
drizzle.config.ts         # Drizzle configuration
biome.json                # Biome configuration
package.json              # Package metadata
bun.lockb                 # Bun lockfile
tsconfig.json             # TypeScript configuration
...markdown files         # Documentation
...git files              # `.git/`, `.gitignore`, etc.
...docker files           # `docker-compose.yml`, `Dockerfile`, etc.
.env*                     # `.env`, `.env.example`, etc.
env.config.ts             # Environment variables configuration
```

> [!NOTE]
> The `app.module.ts` file is named in the spirit of NestJS, where the app module is the device in charge of putting together all the pieces of the application. See [NestJS Modules](https://docs.nestjs.com/modules) for more details.

## Folders Inside `src/`

### Resource Modules (`articles/`, `comments/`, etc.)

Each resource module uses this layout:

```plaintext
resource/
├── resources.controller.ts       # REST handler logic
├── resources.service.ts          # Business logic
├── resources.repository.ts       # DB access logic
├── resources.mapper.ts           # Converts DB to DTO
├── schema/
│   └── resource.schema.ts       # Drizzle schema + optional relations
├── dto/
│   ├── create-resource.dto.ts   # Input shape (TypeBox)
│   ├── update-resource.dto.ts   # Input shape (if needed)
│   └── resource.dto.ts          # Output DTO for response
├── interfaces/
│   ├── resource.interface.ts    # Domain model
│   └── resource-row.interface.ts# Drizzle-inferred DB shape
```

> [!NOTE]
> Note the filename is written in plural form (`resources.controller.ts`, e.g. `articles.controller.ts`) in the spirit of NestJS.

### Other Folders Inside `src/`

#### `database/`

- Exports the db instance through `database.providers.ts`
- Does **not** export db tables, these are found as schemas inside feature folders
- Does **not** export Drizzle config and migrations, these are found in `drizzle.config.ts` and `drizzle/` (from the root of the project) respectively

#### `common/`

Global utilities, middleware, and common concerns.

```plaintext
common/
├── constants/                 # All global constants, grouped by domain
│   ├── auth.constants.ts
│   ├── validation.constants.ts
│   └── realworld.constants.ts
├── errors/                   # Global error types and helpers
│   ├── realworld.error.ts    # RealWorld API-compliant base error class
│   └── error.factory.ts      # Helpers for throwing structured errors
├── interfaces/               # Global interfaces (not feature-specific)
│   └── pagination.interface.ts
├── utils/                    # Pure utility functions used app-wide
│   ├── slugify.ts
│   └── date.utils.ts
```

> [!NOTE]
> The `common/` folder is a catch-all for things that are not specific to a single feature. It's organized by purpose, not by type/domain. That's why it can have both `errors/` (domain) and `utils/` (type) folders.

> [!WARNING]
> Avoid dumping everything into `common/` by default. If a util, constant, or interface is only used in one feature - keep it inside that feature's folder. Promote it to `common/` only when it's reused.

> [!TIP]
> Only one `constants/` folder exists across the project - do not spread constants into individual features unless strictly private to that feature.

## Naming Conventions

### DTO Naming

- `CreateThingDto` – used for `POST` requests
- `UpdateThingDto` – used for `PATCH`/`PUT` requests
- `ThingResponseDto` or `ThingsResponseDto` – response structure (singular or plural, depending on the request)
- Each DTO is defined via TypeBox and typed via `Static<typeof schema>`
- DTO files live in `dto/` and share name with their schema

### Interface Naming

- `IThing` – the core domain interface used in services
- `ThingRow` – the shape returned by Drizzle ORM (via InferSelectModel)
- Stored in `interfaces/` and always one interface per file

### Schema Naming

- `feature.schema.ts` – contains Drizzle `pgTable()` definitions
- May also define `relations()` in the same file unless very large
- If split, name the second file `feature-relations.schema.ts`

## See Also

- More on **Architecture** - see [Architecture](ARCHITECTURE.md)
- **Contributing** - see [Developer's Guide](CONTRIBUTING.md)
- **API Documentation** - see [RealWorld Backend Specifications](https://realworld-docs.netlify.app/specifications/backend/introduction/)
- **Drizzle ORM Documentation** - see [Drizzle ORM](https://orm.drizzle.team/)
