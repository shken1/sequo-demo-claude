import { randomBytes } from "node:crypto";

import type { NextConfig } from "next";

// Signing key for session cookies (lib/session-token.ts). The app runs with no environment
// variables, so a fresh random key is generated per build or dev-server start and inlined into
// the server bundles; setting it on process.env first keeps every build worker on the same key.
process.env.SESSION_SECRET ??= randomBytes(32).toString("hex");

const nextConfig: NextConfig = {
  env: { SESSION_SECRET: process.env.SESSION_SECRET },
};

export default nextConfig;
