# Gigs

Concert-history tracker. Monorepo with Expo mobile app, Next.js web app and shared TypeScript domain contracts.

## Structure
- `apps/mobile`: Expo / React Native
- `apps/web`: Next.js App Router
- `packages/shared`: shared domain types, translations and API contracts

## Requirements
Node.js 22.13+ and npm 10+.

Run `npm install`, then `npm run dev:web` or `npm run dev:mobile`.

Configure `apps/web/.env.local` with `GIGS_API_URL=https://springboot-backend-513726246973.europe-west1.run.app` (or your local Spring API URL). Public pages are indexable; personal account pages are noindex and private.