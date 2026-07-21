"use client";

import { getPb } from "./pb";

/** Authenticated fetch for /api/* — sends PB token + cookies. */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const pb = getPb();
  const headers = new Headers(init.headers);
  if (pb.authStore.token) {
    headers.set("Authorization", pb.authStore.token);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });
}
