export interface SessionUser {
  readonly id: string;
  readonly email: string;
}

/** JSON body every auth API route answers with. */
export interface AuthResponse {
  readonly ok: boolean;
  readonly message: string | null;
}
