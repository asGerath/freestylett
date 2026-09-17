# FreeStyle Total — Repository Instructions

## Project goal

FreeStyle Total (FT) is a Spanish-language hub for the freestyle ecosystem. It
centralizes events, leagues, freestylers, rankings, battles, editorial content,
and creators that are otherwise scattered across social networks and official
channels.

The initial markets are Mexico, Argentina, Spain, Colombia, Peru, and Chile.
The product architecture must allow adding countries without restructuring the
application.

FT is not only a blog. Prioritize discovery, organized information, navigation,
and useful context before social or community features.

## Sources of truth

- The current repository is the technical source of truth for versions,
  structure, routes, components, and implementation status.
- This file is the source of truth for repository-level working conventions.
- Product documentation under `docs/`, when present, is the source of truth for
  product intent, branding, roadmap, and decisions.
- Before changing a module, inspect its current code, types, mocks, and related
  routes. Do not assume old documentation exactly matches the implementation.

## Current stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9
- npm and `package-lock.json`

Planned services, not yet assumed to be implemented:

- Supabase for PostgreSQL, Auth, Storage, and Row Level Security
- Vercel for deployment
- YouTube API and official embeds for video

Do not introduce Redux, Zustand, React Query, GraphQL, another CMS, or another
styling system unless a concrete requirement justifies it.

## Product priorities

When priorities are unclear, use this order:

1. Useful and accurate information
2. Navigation and content discovery
3. Events
4. Leagues
5. Freestylers
6. Blog and editorial content
7. Rankings
8. Battles
9. Creators
10. User accounts and favorites
11. Community and experimental features

Do not let authentication, gamification, ecommerce, fantasy, voting, or complex
community features block the informational MVP.

## Architecture

- Keep domain code grouped under `src/features/<feature>`.
- Keep broadly reusable UI primitives under `src/components/ui`.
- Keep structural components under `src/components/layout`.
- Keep routes under `src/app` and follow App Router conventions.
- Use Server Components by default. Add `"use client"` only for localized
  interaction, browser APIs, forms, modals, carousels, filters, or client state.
- Prefer a clear data boundary: UI -> feature service/repository -> mock or real
  provider. Do not scatter Supabase queries across presentation components.
- Add abstractions only when they solve current duplication or complexity.

Before creating a component, search for an existing component that can be reused
or extended. Do not create suffix variants such as `New`, `Final`, `V2`, or
`Fixed` to avoid reconciling similar components.

## Code conventions

- Use English names for code, files, types, components, and functions.
- User-facing interface copy may be in Spanish.
- Use strict TypeScript types and avoid `any`.
- Keep components focused, but do not split trivial markup without a clear
  responsibility or reuse case.
- Use Tailwind as the primary styling solution. Do not add Sass, CSS Modules, or
  styled-components without a repository-specific need.
- Preserve responsive behavior across mobile, tablet, and desktop.
- Prefer accessible semantic HTML, keyboard-friendly interaction, useful alt
  text, visible focus states, and sufficient color contrast.
- Use `next/image` for production images when applicable and keep consistent
  aspect ratios.
- Never commit secrets, tokens, passwords, Supabase service-role keys, or private
  environment values.

## Branding and UX

FT should feel competitive, urban, modern, strong, and related to battles and
live stages. Avoid generic corporate, generic blog, or overloaded graffiti
styles.

Current core palette:

- Black: `#111111`
- Off-white: `#F5F5F5`
- Primary yellow: `#F2C230`
- Secondary blue: `#2563EB`

The selected identity is the dark logo with a fist and microphone. Inspect the
current code and assets before changing colors, typography, or logos.

Keep cards scannable, dates visible, calls to action clear, and the Home page
focused on previews rather than complete listings.

## Content and data

- Preserve mocks until the corresponding real-data integration is stable.
- Migrate data sources one feature at a time.
- Do not invent historical results or present demonstration content as verified
  fact.
- Prefer official sources for real event, league, participant, and video data.
- Store YouTube video IDs and use official embeds rather than copying video
  files.
- Public detail pages should use readable slugs and, when implemented, Next.js
  Metadata API with titles, descriptions, canonical URLs, and Open Graph data.

## Working process

Before implementation:

1. Read the relevant route, feature, types, mocks, and reusable UI components.
2. Check `package.json`, scripts, and the current Git state.
3. Identify whether the requested behavior already exists partially.
4. Keep the change scoped to the request; avoid unrelated mass refactors.

During implementation:

1. Work incrementally.
2. Preserve existing user changes and do not overwrite unrelated work.
3. Update types and states together with UI behavior.
4. Consider loading, empty, and error states when data fetching is involved.
5. Verify links, images, responsive layouts, and accessibility basics.

Before handoff, run the relevant available checks, normally:

```bash
npm run lint
npm run build
```

If a check cannot run, report the exact reason. Do not claim a feature is done
only because it renders locally.

## Git conventions

- Keep commits small and cohesive.
- Use Conventional Commit-style messages, for example:
  - `feat(events): add events listing page`
  - `fix(navbar): improve mobile navigation`
  - `refactor(events): isolate event data access`
- Do not mix design changes, dependency upgrades, data migrations, and unrelated
  features in one commit.
- Do not update dependencies automatically while diagnosing an existing issue.
- Do not commit generated directories such as `.next` or `node_modules`.
- Do not commit, push, create branches, or open pull requests unless the user
  explicitly requests that Git action.

## Definition of done

A change is complete when the applicable items are true:

- Requested behavior works and existing routes remain functional.
- TypeScript, lint, and production build checks pass.
- Mobile, tablet, and desktop layouts remain usable.
- Existing components are reused where reasonable.
- Loading, empty, and error states exist where relevant.
- Public pages have appropriate metadata when that scope is being implemented.
- Links and images work.
- Accessibility basics are preserved.
- No unnecessary hardcoding, secrets, generated files, or unrelated refactors
  were introduced.

