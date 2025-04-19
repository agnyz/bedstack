# Architecture

## Overview

This service uses a modular, flat, feature-sliced, **Layered Architecture** inspired by the [NestJS philosophy](https://docs.nestjs.com/#philosophy).

We separate the system into 3 main layers:

1.	**Controller** – Talks to the client
2.	**Service** – Handles the business logic
3.	**Repository** – Interacts with the database

Each domain feature (e.g. `articles`, `profiles`, `tags`) is isolated into a top-level module folder, containing the above layers, and also:

* **Mapper** - Transforms data between layers
* **Schema** - Defines database tables and relations

```mermaid
graph TD
  subgraph Controller Layer
    C1[articles.controller.ts]
    C2[comments.controller.ts]
    C3[tags.controller.ts]
  end

  subgraph Service Layer
    S1[articles.service.ts]
    S2[comments.service.ts]
    S3[tags.service.ts]
  end

  subgraph Repository Layer
    R1[articles.repository.ts]
    R2[comments.repository.ts]
    R3[tags.repository.ts]
  end

  subgraph Schema Layer
    SC1[articles.schema.ts]
    SC2[comments.schema.ts]
    SC3[tags.schema.ts]
    SC4[article-tags.schema.ts]
  end

  subgraph Mapper Layer
    M1[articles.mapper.ts]
    M2[comments.mapper.ts]
    M3[tags.mapper.ts]
  end

  C1 --> S1 --> R1 --> SC1
  C2 --> S2 --> R2 --> SC2
  C3 --> S3 --> R3 --> SC3

  S1 --> M1
  S2 --> M2
  S3 --> M3

  SC1 --> SC4
  SC3 --> SC4
```

## Layer Responsibilities

### 1. Controller Layer (Client-facing)

- Handles HTTP routes, request params, and responses
- Validates data transfer objects (DTOs)
- Thin, delegates to the service layer
- Shapes requests and responses, without performing any business logic

### 2. Service Layer (Business Logic)

- Implements the use cases
- Contains the business logic
- Delegates data formatting to mappers
- Validates logic rules (e.g., checking if a user can register)
- Calls the repository layer to get or save data
- Contains logic that remains valid even if the transport layer changes (e.g. REST, GraphQL, RPC)

### 3. Repository Layer (Database Access)

- Talks to the database
- Only responsible for saving and retrieving data
- **No** assumptions about validation
- **No** business logic should go here
- Handles pagination, sorting, and other database-specific operations
- Returns raw database rows, not domain entities

### Additional Layers

#### Mapper (Data Transformation)

- Transforms Row types from the database to domain entities or DTOs
- Performs camelCase vs. snake_case mapping if needed
- Convers Date to ISO strings for output, etc.

#### Schema (Database Definitions)

- Defines schemas using an ORM (e.g. `pgTable()` with Drizzle ORM and PostgreSQL)
- Optionally defines table relations (e.g. `relations()` with Drizzle ORM)

## Type Conventions

| Type                                                | Layer | Purpose                                        |
| --------------------------------------------------- | ----- | ---------------------------------------------- |
| `CreateThingDto`, `UpdateThingDto` | Controller       | Validates incoming input (e.g. via TypeBox)                   |
| `ThingDto`                                             | Controller              | Shapes outgoing responses          |
| `Thing`                                              | Service (Domain)       | Represents the business entity |
| `ThingRow`                                           | Repository            | Represents the database row, can be inferred from schema (e.g. using `InferSelectModel` with Drizzle ORM) |

## Design Principles

### 1. Flat, feature-sliced folder layout

* Each feature (e.g. `articles/`, `comments/`) contains all its layers in one folder
* No deep nesting, no shared `controllers/`, `services/` folders

### 2. One thing per file

* DTOs are defined in `dto/` folder, one file per DTO
* Domain entities are interfaces in `interfaces/`, one per file
* Row types are colocated in `interfaces/` and inferred from Drizzle schema

### 3. Relation-aware schema layer

Table relations are colocated with their schema definition unless they grow large.

### 4. Public API is shaped at the controller level

DTOs match the RealWorld spec (e.g., `{ article: ... }`) but this wrapping is handled in the controller, not baked into types.

## See also

- More on **Project structure** - see [Project Structure](PROJECT_STRUCTURE.md)
- **Contributing** - see [Developer's Guide](CONTRIBUTING.md)
- **API Documentation** - see [RealWorld Backend Specifications](https://realworld-docs.netlify.app/specifications/backend/introduction/)
- **Drizzle ORM Documentation** - see [Drizzle ORM](https://orm.drizzle.team/)
