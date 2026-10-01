# Invariants

1. **Single Source of Truth**  
   All product requirements, architecture, and implementation rules must be derived exclusively from docs/idea.md, docs/specification.md, docs/architecture.md, docs/development-plan.md, docs/decisions.md, docs/invariants.md, docs/coding-standards.md, and CLAUDE.md/AGENTS.md. Any deviation or addition violates this invariant.

2. **Architectural Layer Boundaries**  
   UI logic must remain in Next.js React components using Tailwind CSS. All data reads and writes must occur exclusively through Next.js API routes. Supabase client calls are permitted only inside those API routes. Direct client-to-Supabase calls are forbidden.

3. **MVP Scope Adherence**  
   The application must implement exactly one shared streak record containing only the current streak length. It must support displaying this length and incrementing it by one when either partner logs the current day. No history, individual streaks, private data, editing, or deletion capabilities may be added.

4. **Equal Partners Model**  
   Both users must have identical read and write access to the single shared streak record. No user-specific data, roles, authentication, or differentiated behavior may be introduced in the MVP.

5. **Data Model Simplicity**  
   The Supabase table must contain exactly one row representing the shared streak with a single integer field for current length. All operations must read this value, increment by one on log actions, and write the new value back.

6. **Real-Time Updates**  
   Updates made by one partner must become visible to the other partner immediately using Supabase real-time subscriptions on the shared streak record.

7. **Security Fundamentals**  
   No secrets may be hardcoded. All inputs to API routes must be validated. Privileged database operations must be protected at the API boundary. The application must not rely on client-side authentication for the MVP.

8. **Decision Integrity**  
   All settled decisions recorded in docs/decisions.md are non-negotiable. Implementation must match exactly what is stated there regarding tech stack, data storage, lack of authentication, and MVP boundaries.

9. **Current Plan Step Discipline**  
   Implementation work must be limited strictly to the active step defined in docs/development-plan.md. No code for future steps may be written until the current step is complete.

10. **Commit Authorship**  
    The AI coding agent must never set itself as commit author. All commits must use the configured git identity of the solo founder.
