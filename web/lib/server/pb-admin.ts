import PocketBase from "pocketbase";
import { serverEnv } from "./env";

let _admin: PocketBase | null = null;
let _authAt = 0;
const AUTH_TTL_MS = 1000 * 60 * 30;

// Server-side PocketBase client authed as admin. Used by API routes to read/write
// deal records on behalf of authenticated users. The CLIENT still uses its own
// authStore (cookie); we re-verify the user via pb-admin here.
export function getPbAdmin(): PocketBase {
  if (!_admin) {
    _admin = new PocketBase(serverEnv.pb.url);
    _admin.autoCancellation(false);
  }
  return _admin;
}

export async function adminPb(): Promise<PocketBase> {
  const pb = getPbAdmin();
  if (!pb.authStore.isValid || Date.now() - _authAt > AUTH_TTL_MS) {
    await pb.collection("_superusers").authWithPassword(
      serverEnv.pb.adminEmail,
      serverEnv.pb.adminPassword
    );
    _authAt = Date.now();
  }
  return pb;
}

export type { PocketBase };
