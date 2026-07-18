"use client";

import { loadStripe as load, type Stripe } from "@stripe/stripe-js";

let cached: Promise<Stripe | null> | null = null;

export function loadStripe(publishableKey: string): Promise<Stripe | null> {
  if (!cached) cached = load(publishableKey);
  return cached;
}
