# Gigs

Gigs helps concert-goers keep a personal history of the live shows they have attended: artists, dates, venues, cities, countries, ticket prices and listening-history-style statistics.

This repository is a workspace monorepo. The existing Expo app remains the mobile application; the Next.js app provides a responsive web experience on top of the same Spring Boot API.

## Workspace structure

- `apps/mobile`: Expo / React Native application.
- `apps/web`: Next.js App Router application (public landing page, authentication and private dashboard).
- `packages/shared`: shared concert types, API contracts, API client factory and translations.

## Requirements and setup

- Node.js 22.13 or newer.
- npm 10 or newer.

Install workspace dependencies from the repository root:

```sh
npm install
```

Configure the web API origin in `apps/web/.env.local`:

```sh
GIGS_API_URL=https://springboot-backend-513726246973.europe-west1.run.app
NEXT_PUBLIC_SITE_URL=https://your-public-domain.example
```

Start the web application with `npm run dev:web`, or the mobile application with `npm run dev:mobile`.

## Quality checks

```sh
npm run typecheck:web
npm run typecheck:mobile
npm run build:web
```

The pull-request workflow runs both TypeScript checks and the production web build. Personal pages and authenticated API responses are not indexed or cached. The browser never receives the JWT: Next.js stores it in an HttpOnly, SameSite cookie and forwards it server-side as a Bearer token.
