import type { PocketBase } from "./pb-admin";
import { adminPb } from "./pb-admin";
import type { User } from "@/lib/types";

// Reads the PB auth cookie from the request and returns the verified user,
// or null. We use the admin PB client to validate the token server-side.
// PocketBase stores auth cookies as 'pb_auth' on the request.
export async function getCurrentUser(req: Request): Promise<User | null> {
  const cookie = req.headers.get("cookie") ?? "";
  if (!cookie) return null;
  const pb = await adminPb();

  // Load the cookie into the admin client's authStore (it's the same shape).
  // pb.authStore.loadFromCookie expects the full cookie header value.
  try {
    pb.authStore.loadFromCookie(cookie);
    if (!pb.authStore.isValid) return null;
    // Re-validate by fetching the user record. The token model carries the
    // user id; pb.authStore.model is the cached user record.
    const model = pb.authStore.model as unknown as { id?: string } | null;
    if (!model?.id) return null;
    const user = await pb.collection("users").getOne<User>(model.id);
    return user;
  } catch {
    return null;
  }
}

export async function requireUser(req: Request): Promise<User> {
  const user = await getCurrentUser(req);
  if (!user) throw new UnauthorizedError();
  return user;
}

export class UnauthorizedError extends Error {
  status = 401 as const;
  constructor() {
    super("Unauthorized");
  }
}
