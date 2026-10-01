# Development Plan

## MVP Goal

A web-based habit tracker for two equal partners that maintains one shared streak which either person can extend by logging a day. The MVP displays the current shared streak length to both partners and allows either to log the current day to extend it. Access is provided through a browser-based Next.js web app using Supabase for the single shared record.

## Plan

- [x] Foundation (Init Prompt): Next.js App Router, TypeScript strict, Tailwind CSS, ESLint, Prettier, Husky, lint-staged, commitlint. Persistence is in-memory (see decisions.md #7).

### Foundation

- [x] Create shared streak record
      Set up the Supabase table for the single shared streak record that holds current length and last logged date.

- [x] Add Supabase authentication
      Implement sign-in so the two equal partners can both access the shared tracker with their own accounts.

### Core Product

- [x] Display current shared streak
      Build the main tracker view that shows the current streak length using the shared record.

- [x] Implement streak logging
      Add the ability for either partner to log today and extend the shared streak.

### Deployment

- [ ] Deploy to Vercel
      Prepare the codebase for production and deploy the habit tracker live so both partners can use the public URL.

## Definition of done

- Single Supabase table exists with one shared streak record containing current length and last logged date
- Both partners can sign in via Supabase and view the identical current streak length in the browser
- Either partner can click to log the current day, which correctly increments the shared streak
- Updates appear instantly for both users via Supabase real-time
- Application is deployed to Vercel and accessible at a public URL with the cyberpunk vintage UI applied
