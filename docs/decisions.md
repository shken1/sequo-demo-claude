# Decisions

1. **Tech Stack Selection**  
   The project uses TypeScript, Next.js, Tailwind CSS, Supabase for database and data access, and Vercel for hosting with npm as the package manager. This stack was chosen for rapid web development, real-time capabilities, and simple deployment.

2. **Data Storage Approach**  
   A single shared streak record will be stored in Supabase and updated by either partner. This directly implements the clarifying answer “Shared single record updated by both” and the structured idea’s core object of one shared streak.

3. **Authentication Approach**  
   No authentication in MVP. The MVP scope requires only that both equal partners can view the shared streak and log days; no user-specific data, roles, or access controls are needed.

4. **Product Scope**  
   The MVP is limited to displaying the current shared streak length and allowing either partner to log the current day to extend it via a browser-based web app. Individual streaks, private data, and history of past logged days are out of scope per the structured idea.

5. **Access Method**  
   The tracker is delivered as a web app accessed in the browser. This follows the clarifying answer that selected “Web app accessed in browser” over a mobile app.

6. **Equal Partners Model**  
   Both users are equal partners with identical capabilities to view and extend the shared streak. This implements the structured idea and the clarifying answer “Both of us as equal partners.”

7. **In-memory persistence for this build**  
   This build runs with no external database: wherever the plan calls for Supabase (data, data access, auth, real-time), the app uses in-memory server state instead, so it runs with `npm run dev` and nothing else. The shared record lives in a module-level store in `lib/`, reached only from Next.js API routes in `app/api/`, where the Supabase calls would sit. State resets when the server restarts. No migration tooling or `DATABASE_URL` is set up.

8. **Foundation tooling**  
   ESLint (next config + eslint-config-prettier), Prettier, Husky with lint-staged on pre-commit, and commitlint with the Conventional Commits config on commit-msg. Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`next typegen` then `tsc --noEmit`), `format`, `format:check`. Styling is Tailwind CSS v4 through `app/globals.css`, as the architecture names it; the design tokens and fonts are left for the first design prompt, as docs/design-system.md says.

9. **Shared streak record without Supabase (step 1)**  
   The `streaks` table is a single in-memory row in `lib/streak-store.ts` with the step's columns: `id`, `streakLength`, `lastLoggedDate` and `createdAt`. The initial insert (length 0, last logged date set to today, as the step's prompt asks) happens on first use. `GET /api/streak` reads the row. A development-only `PATCH /api/streak` with `{ "streakLength": n }` stands in for editing the row in the database dashboard; it rejects anything but a non-negative integer with 400, and production returns 404. The prompt's RLS policy ("any authenticated user") has no in-memory equivalent; access rules are left to step 2. The step adds `lastLoggedDate`, which the data model in architecture.md and invariant 5 do not list; the step's prompt and the development plan both ask for it.

10. **Sign-in without Supabase (step 2)**  
    Step 2 of the development plan adds authentication, while decision 3, invariant 4 and the coding standards say the MVP has none. The step's prompt and the plan are followed here, so this decision supersedes decision 3 for sign-in. The streak itself stays one shared record that both partners read and update equally. Supabase Auth is replaced by an in-memory store (`lib/auth-store.ts`): passwords are hashed with scrypt and a random salt, sessions are random tokens in an httpOnly, SameSite=Lax `session` cookie (30 days), and magic links are one-time tokens valid for 15 minutes. Using a link creates the account on first use. There is no mail server, so the link is printed to the server console (`[magic link] <email>: <url>`). Auth runs through API routes (`/api/auth/sign-up`, `sign-in`, `magic-link`, `sign-out`), as invariant 2 requires; `/auth/magic` redeems a link. `/signin` holds the three forms. `proxy.ts` sends any request without a session cookie to `/signin` (pages) or answers 401 (API), except the sign-in routes, and pages also check the session on the server with `requireUser()`.

11. **Streak display (step 3)**  
    The root page reads the shared record through `GET /api/streak` (invariant 2: data reads go through API routes). `lib/streak-api.ts` makes that request from the server, forwarding the visitor's cookies so the route sees the same session, with `cache: "no-store"` so every view shows the live value. `app/StreakLength.tsx` shows the length in large VT323 in the primary (neon cyan) colour, as the step's prompt asks. `app/loading.tsx` is the loading state, and `app/error.tsx` is the error state, with a "Try again" button that calls the route segment's `reset()`.

12. **Log Today (step 4)**  
    `POST /api/streak/log` (a route handler, as invariant 2 requires) answers 401 without a session. Otherwise it calls `logToday()` in `lib/streak-store.ts`, which adds one to the streak and sets the last logged date to today, unless today is already logged. Today is the server's local date. `app/LogTodayButton.tsx` posts to the route, shows the outcome ("Today is logged…" or "Today is already logged."), and refreshes the page so the displayed value is re-read from `GET /api/streak`. Two changes outside this step's files were needed:
    - **Seed date.** Step 1 seeded the row's last logged date with today, so on the first day "Log Today" could never count. The seed now leaves it empty.
    - **Dev PATCH.** The development-only `PATCH /api/streak` also accepts `lastLoggedDate`, so a later day can be simulated by hand.

    The step's done-when asks for the second partner to "increment it again" right after the first, but the prompt allows one log per day. The once-per-day rule is kept, and the second increment happens on the next day.

13. **Signed session tokens for serverless hosting**  
    On Vercel, pages and API routes can run in separate processes, so an in-memory session store made by an API route was invisible to the root page. Signed-in partners were sent back to `/signin`. A session is now a signed token in the `session` cookie (`lib/session-token.ts`): the user's id and email, plus an expiry 30 days out, signed with HMAC-SHA256. Any process can check it without a shared store. The app runs with no environment variables, so `next.config.ts` generates a random signing key per build (and per dev-server start) and inlines it into the server bundles; nothing secret is committed. Every redeploy therefore signs everyone out, which matches the in-memory data being reset anyway. Sign-out deletes the cookie; a token cannot be revoked before it expires. `lib/streak-api.ts` now takes the protocol for its own API call from `x-forwarded-proto` instead of assuming https in production.
