import PocketBase from "pocketbase";
import { serverEnv } from "./env";
import type { User } from "@/lib/types";

export async function getCurrentUser(req: Request): Promise<User | null> {
  const token = extractToken(req);
  if (!token) return null;

  const pb = new PocketBase(serverEnv.pb.url);
  pb.autoCancellation(false);

  try {
    pb.authStore.save(token, null);
    if (!pb.authStore.isValid) return null;
    const auth = await pb.collection("users").authRefresh<User>();
    return auth.record as unknown as User;
  } catch {
    return null;
  } finally {
    pb.authStore.clear();
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth) {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m?.[1]) return m[1].trim();
    if (!auth.includes(" ") && auth.length > 20) return auth.trim();
  }

  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)pb_auth=([^;]+)/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as { token?: string };
    return parsed.token ?? null;
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
