# Coding Standards

## Language and types

- Use TypeScript with strict mode enabled (`"strict": true` in tsconfig.json).
- All functions, components, and variables must have explicit types; avoid `any`.
- Use descriptive names: `currentStreak`, `logDay`, `streakRecord` (nouns for data, verbs for actions).
- Prefer interfaces for object shapes and type aliases for primitives/unions.
- Keep files under 200 lines; extract small, focused functions and components.
- All numeric values representing streak length must be non-negative integers.

## Framework conventions

- Use Next.js App Router with React Server Components by default.
- Colocate UI components with their pages when possible; extract only when reused.
- Define all styles with Tailwind CSS classes; no custom CSS files.
- Use server-side data fetching and mutations via API routes for all Supabase operations.
- API route handlers must be placed in `app/api/` and return typed JSON responses.
- Pages and components must be functional React components with proper TypeScript props.

## File and code organization

- Follow the layer separation in architecture.md: UI in `app/`, API routes in `app/api/`, shared types in `types/` or colocated with data logic.
- One React component per file.
- Name files using kebab-case for routes (`app/streak/page.tsx`) and PascalCase for components (`StreakDisplay.tsx`).
- Place the single shared Supabase table schema and row type in `lib/supabase.ts` or `types/streak.ts`.
- Keep business logic inside API route handlers; UI remains presentational.
- Use index files only for barrel exports of related types.

## State and data handling

- Maintain zero client-side state for streak data; always fetch from Supabase on page load.
- Use Supabase real-time subscriptions in the UI layer to update the displayed streak instantly when changed.
- All data mutations (incrementing streak) must occur through dedicated API routes.
- Validate inputs on the server: streak length must be a positive integer.
- Never cache streak values; read the single shared record for every view.
- Handle Supabase errors by returning clear error messages to the UI.

## Security

- Store Supabase URL and anon key in Vercel environment variables only; never commit them.
- Use Supabase Row Level Security (RLS) to allow public read and update on the single streak row.
- Validate all API inputs server-side before writing to Supabase.
- Do not implement user authentication or sessions in the MVP.
- Ensure API routes reject malformed requests with 400 status codes.

## Git and commits

- Follow Conventional Commits specification exactly: `type(scope): subject`.
- Use types: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`.
- Never credit an AI agent as author or co-author in commit messages.
- Keep commit subjects under 50 characters; body used only for complex changes.
- Create a branch for each development-plan.md step and merge via pull request.

## Testing and verification

- A step is not complete until manually verified in a deployed Vercel preview.
- After each major change: verify streak display updates, logging increments the value, and real-time sync works in two browser tabs.
- Run `npm run build` successfully before every commit.
- Test both success and error paths for the log-day flow.
- Confirm the single shared record is the only table used in Supabase.
