import { NextResponse } from "next/server";

import { clearSession } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";

export function POST(): NextResponse<AuthResponse> {
  const response = NextResponse.json<AuthResponse>({ ok: true, message: null });
  clearSession(response);
  return response;
}
