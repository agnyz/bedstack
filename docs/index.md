---
title: "Bedstack: Bun + ElysiaJS + Drizzle"
titleTemplate: false
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Bedstack
  text: Bun + ElysiaJS + Drizzle
  tagline: RealWorld example app for the stack you don't want to sleep on
  actions:
    - theme: brand
      text: What is Bedstack?
      link: /what-is-bedstack
    - theme: alt
      text: Quickstart
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/agnyz/bedstack
  image: /logo-mini.png

features:
  - title: Bun
    details: All-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.
    link: https://bun.sh/
    icon:
      src: /bun-press-kit/logo-centered.svg

  - title: ElysiaJS
    details: TypeScript framework supercharged by Bun with End-to-End Type Safety, unified type system and outstanding developer experience.
    link: https://elysiajs.com/
    icon:
      src: /elysiajs-logo.png

  - title: Drizzle
    details: Lightweight, performant, typesafe, non lactose, gluten-free, flexible, serverless-ready, and headless TypeScript ORM with both relational and SQL-like query APIs.
    link: https://orm.drizzle.team/
    icon:
      src: /drizzle-logo.png
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(-60deg, var(--vp-c-brand-1) 30%, var(--vp-c-brand-2));
  --vp-home-hero-image-background-image: linear-gradient(-45deg, 
    rgb(from var(--vp-c-brand-1) r g b / 0.25) 20%,
    rgb(from var(--vp-c-brand-2) r g b / 0.5) 20%
  );
  --vp-home-hero-image-filter: blur(80px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
}

.VPButton.brand {
  background-image: linear-gradient(160deg, var(--vp-c-brand-1), var(--vp-c-brand-2)) !important;
  opacity: 0.8;
  transition: opacity 0.25s;
  border: 0;
}

.VPButton.brand:hover {
  opacity: 1;
}
</style>
