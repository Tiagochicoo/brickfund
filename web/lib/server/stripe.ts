import Stripe from "stripe";
import { serverEnv } from "./env";

export const stripe = new Stripe(serverEnv.stripe.secretKey, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});

export const calculatePlatformFee = (
  priceCents: number,
  percent = serverEnv.platformFeePercent
) => Math.max(Math.round((priceCents * percent) / 100), 50);
