# Architecture

## Tech stack

- **TypeScript**: Provides type safety for a small, maintainable codebase handling shared state updates.
- **Next.js**: Delivers the web app with server-side rendering, API routes, and simple deployment to Vercel.
- **Tailwind CSS**: Enables rapid styling of the cyberpunk vintage UI without additional CSS overhead.
- **Supabase**: Serves as both database and data access layer, providing a single shared table with real-time updates.
- **Vercel**: Handles instant hosting and deployment of the Next.js application.
- **npm**: Manages all project dependencies consistently.

## Main data entities

The system manages one core entity: a shared streak record.  
This record holds the current streak length (an integer).  
Either partner can read the current value or update it by incrementing the length when logging the current day.  
No additional fields, history, or related records are maintained.

## Key flows

1. **View streak**: The app loads the current streak length from the shared record and displays it to the user.
2. **Log day**: The user triggers an update that reads the current streak length, increments it by one, and writes the new value back to the shared record. Both partners see the updated length immediately.

## Layer separation

- **UI layer**: Next.js React components and Tailwind-styled pages that render the streak display and log button.
- **API layer**: Next.js API routes that handle read and update operations, keeping business logic server-side.
- **Data layer**: Supabase client used directly from API routes to read from and write to the single shared record.
- **Hosting layer**: Vercel serves the built Next.js application and provides the public URL.

This separation keeps the codebase small: UI remains purely presentational, data operations are centralized in a few API endpoints, and no complex service or domain layer is required for the MVP.

## Design principles

- Implement exactly the MVP scope: shared streak display and single-button day logging.
- Use a single Supabase table with one row representing the shared streak.
- Keep both partners completely equal with identical read and write access.
- Prefer server-side data operations via API routes over client-side direct database calls.
- Leverage Supabase real-time capabilities so updates appear instantly for both users.
- Maintain minimal state: no local caching, no user sessions, no extra tables.
- Ensure the architecture stays simple enough for rapid iteration by a solo founder.
- All code must follow TypeScript strict typing and the project's coding standards.
