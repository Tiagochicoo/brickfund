"use client";

import type PocketBase from "pocketbase";

const COOKIE_NAME = "pb_auth";

/** Sync PocketBase authStore → document cookie for server routes. */
export function syncAuthCookie(pb: PocketBase): void {
  if (typeof document === "undefined") return;
  if (!pb.authStore.isValid || !pb.authStore.token) {
    clearAuthCookie();
    return;
  }
  // PocketBase cookie payload: { token, model }
  const payload = JSON.stringify({
    token: pb.authStore.token,
    model: pb.authStore.model,
  });
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(payload)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
