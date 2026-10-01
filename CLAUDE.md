# CLAUDE

**Product**  
A web-based habit tracker for two equal partners that maintains one shared streak which either person can extend by logging a day.

**Source of Truth**  
Before non-trivial changes, read:

- docs/idea.md
- docs/specification.md
- docs/architecture.md
- docs/decisions.md
- docs/invariants.md
- docs/coding-standards.md
- docs/development-plan.md

**Critical Rules**

- Respect docs/invariants.md
- Never hardcode secrets
- Keep layers separated as defined in docs/architecture.md
- Record new architectural decisions in docs/decisions.md
- Never credit an AI agent in commits
- Stay inside MVP scope

**Working Style**

- Make small focused changes
- Work only within the current step
- Verify before marking work done
- Keep docs up to date when decisions or behavior change

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
