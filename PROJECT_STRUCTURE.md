# Project Structure

This document describes the file structure and organization of the codebase. The layout is flat and feature-sliced, with each domain feature (e.g., articles, comments) self-contained.

We favor **separation of concerns** over minimalism, and follow a **one file per thing** rule.

This layout is built to scale while staying clear, testable, and aligned with RealWorld API expectations.

## Top-Level Overview

```
src/
├── app.ts                   # Initializes and mounts the app
├── routes/                  # Aggregates and mounts feature routers
├── db/                      # Drizzle ORM config and database init
├── shared/                  # Common utilities and helpers
├── articles/                # Full article feature module
├── comments/                # Full comment feature module
├── tags/                    # Tag-related logic and schema
├── users/                   # User logic (repo, profile dto)
```

## Feature Folder Layout

Each feature (e.g. `articles/`, `comments/`) uses this layout:

```
feature/
├── feature.controller.ts       # REST handler logic
├── feature.service.ts          # Business logic
├── feature.repository.ts       # DB access logic
├── feature.mapper.ts           # Converts DB to DTO
├── schema/
│   └── feature.schema.ts       # Drizzle schema + optional relations
├── dto/
│   ├── create-feature.dto.ts   # Input shape (TypeBox)
│   ├── update-feature.dto.ts   # Input shape (if needed)
│   └── feature.dto.ts          # Output DTO for response
├── interfaces/
│   ├── feature.interface.ts    # Domain model
│   └── feature-row.interface.ts# Drizzle-inferred DB shape
```

## Folder-Level Purpose

### `/db/`

* Drizzle config and init
* Exports the db instance
* Does **not** export db tables, these are found as schemas inside feature folders

### `/shared/`

Global utilities, middleware, and shared concerns.

The following is a suggestion of what files might be found here:

```
shared/
├── auth-middleware.ts     # Extracts auth context
├── http-errors.ts         # Shared error classes
├── slugify.ts             # Utility for slug generation
```

## DTO Naming

* `CreateThingDto` – used for `POST` requests
* `UpdateThingDto` – used for `PATCH`/`PUT` requests
* `ThingDto` – response structure
* Each DTO is defined via TypeBox and typed via `Static<typeof schema>`
* DTO files live in `dto/` and share name with their schema

### Interface Naming

* `Thing` (or `ThingEntity`) – the core domain interface used in services
* `ThingRow` – the shape returned by Drizzle ORM (via InferSelectModel)
* Stored in `interfaces/` and always one interface per file

### Schema Naming

* `feature.schema.ts` – contains Drizzle `pgTable()` definitions
* May also define `relations()` in the same file unless very large
* If split, name the second file `feature-relations.schema.ts`

## See also

- More on **Architecture** - see [Architecture](ARCHITECTURE.md)
- **Contributing** - see [Developer's Guide](CONTRIBUTING.md)
- **API Documentation** - see [RealWorld Backend Specifications](https://realworld-docs.netlify.app/specifications/backend/introduction/)
- **Drizzle ORM Documentation** - see [Drizzle ORM](https://orm.drizzle.team/)

