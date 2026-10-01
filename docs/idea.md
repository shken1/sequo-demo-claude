# Product Idea

## One-liner

A web-based habit tracker for two equal partners that maintains one shared streak which either person can extend by logging a day.

## Who it is for

The product is for two people who want to build a habit together. Both partners are equal users of the tracker. They both see the same current streak length at all times, and either of them can log the current day to extend the shared streak. The goal is to keep a joint streak alive through mutual accountability without any hierarchy or separate data.

## Core concepts

- **Shared streak**: A single record that holds the current length of the joint streak. This is the only persistent data in the system.
- **Logging a day**: The action either partner takes to increment the shared streak by one when they both (or one on behalf of both) complete the habit for that day.

These two concepts directly capture everything the product needs to manage.

## MVP scope

- Display the current shared streak length to whoever opens the app.
- Allow either partner to log the current day, which extends the shared streak by one.
- Deliver the entire experience as a simple web app that runs in a browser.

## Out of scope

- Individual streaks or any private per-person data.
- History of past logged days.
- Any features beyond the shared streak display and the ability to log the current day.
