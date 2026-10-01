import { NextResponse } from "next/server";

import { clearSession } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";

export async function POST(): Promise<NextResponse<AuthResponse>> {
  const response = NextResponse.json<AuthResponse>({ ok: true, message: null });
  await clearSession(response);
  return response;
}
