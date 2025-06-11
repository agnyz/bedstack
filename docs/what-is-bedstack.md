# What is Bedstack?

Bedstack is a bleeding-edge tech stack for building backend applications with TypeScript. It's an acronym for [**B**un](https://bun.sh/) + [**E**lysiaJS](https://elysiajs.com/) + [**D**rizzle](https://orm.drizzle.team/).

Its core philosophy is simplicity on the surface with immense power underneath; it will make you [fall into the pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/). It is typesafe by default, and flexible enough to handle complex use cases as demonstrated by this [RealWorld](https://github.com/gothinkster/realworld) example project.

This project is an implementation of the [RealWorld backend spec](https://realworld-docs.netlify.app/specifications/backend/introduction/). By design, it is completely interchangeable with any of the other [backend implementations](https://codebase.show/projects/realworld?category=backend&language=typescript) in the RealWorld family, and can be used with any of the RealWorld [frontend implementations](https://codebase.show/projects/realworld?category=frontend).

## Core technologies

We carefully chose some of the latest and greatest technologies from the bleeding edge that share our core philosophy. They are:

- **[Bun](https://bun.sh/)** - All-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.

- **[ElysiaJS](https://elysiajs.com/)** - TypeScript framework supercharged by Bun with End-to-End Type Safety, unified type system and outstanding developer experience.

- **[Drizzle](https://orm.drizzle.team/)** - Lightweight, performant, typesafe, non lactose, gluten-free, flexible, serverless-ready, and headless TypeScript ORM with both relational and SQL-like query APIs.

## Why RealWorld?

The RealWorld project is fantastic because it's suitable for developers across the entire spectrum of experience.

**Beginners** will find the dozens of implementations in different languages and frameworks to be a great way to learn new technologies, and to compare their work to the best practices of similar tools. Not sure how to implement a feature? Just look at how [other implementations](https://codebase.show/projects/realworld?category=backend&language=typescript) have done it! They all implement the exact same API, so you can compare them side-by-side.

**Experts** will find satisfaction in contributing best practice examples to the community, and in helping beginners learn the ropes. They'll also find that the RealWorld spec is a great way to test out new technologies, and to compare them to other tools in the same space. A new tool came out that is all the rage? Just follow the well-defined spec and see how it holds up in the RealWorld!

## Why Bun, ElysiaJS, and Drizzle?

When [Bun](https://bun.sh/) was announced, the community expectedly touted it as a [Node.js killer](https://levelup.gitconnected.com/is-bun-js-the-node-js-killer-ffeb0f89196a). It promised to eliminate many of the hassles that come with TypeScript development, and provide an ecosystem that is unified, performant, and easy to use.

We wanted to put it to the test. We thought:

> What better way to test a new tool than to implement a RealWorld app with it?

We chose other tools on the bleeding edge that have been specifically designed with Bun in mind, like [ElysiaJS](https://elysiajs.com/) and [Drizzle](https://orm.drizzle.team/). We wanted to see how they would work together, and how they compare to other implementations in the RealWorld family.
