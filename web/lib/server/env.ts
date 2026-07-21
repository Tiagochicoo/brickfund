function read(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

function ensure(key: string, value: string): string {
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

const isProd = process.env.NODE_ENV === "production";

const _appUrl = read("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
const _sessionSecret = read("SESSION_SECRET", "dev-only-secret-change-me-32-chars-min");
// Prefer internal URL for server-side admin (localhost), public URL only as fallback
const _pbUrl = read("PB_URL", read("NEXT_PUBLIC_PB_URL", "http://127.0.0.1:8093"));
const _pbAdminEmail = read("PB_ADMIN_EMAIL");
const _pbAdminPassword = read("PB_ADMIN_PASSWORD");
const _stripeSecretKey = read("STRIPE_SECRET_KEY");
const _stripePublishableKey = read("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", read("STRIPE_PUBLISHABLE_KEY"));
const _stripeWebhookSecret = read("STRIPE_WEBHOOK_SECRET");
// Avoid 3001 — production Next often binds PORT=3001
const _documensoBaseUrl = read("DOCUMENSO_BASE_URL", "http://localhost:3100");
const _documensoApiToken = read("DOCUMENSO_API_TOKEN");
const _documensoWebhookSecret = read("DOCUMENSO_WEBHOOK_SECRET");
const _documensoLoiTemplateId = read("DOCUMENSO_LOI_TEMPLATE_ID");
const _documensoApaTemplateId = read("DOCUMENSO_APA_TEMPLATE_ID");

/** Soft warn once at module load when prod is missing critical deal-path env. */
function warnProdGaps() {
  if (!isProd) return;
  const missing: string[] = [];
  if (!_pbAdminEmail) missing.push("PB_ADMIN_EMAIL");
  if (!_pbAdminPassword) missing.push("PB_ADMIN_PASSWORD");
  if (!_stripeSecretKey) missing.push("STRIPE_SECRET_KEY");
  if (!_stripeWebhookSecret) missing.push("STRIPE_WEBHOOK_SECRET");
  if (!_stripePublishableKey) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  if (!_appUrl || _appUrl.includes("localhost")) missing.push("NEXT_PUBLIC_APP_URL");
  if (missing.length) {
    console.warn(`[brickfund] production env incomplete: ${missing.join(", ")} — deal/money routes may fail`);
  }
}
warnProdGaps();

export const serverEnv = {
  get appUrl() { return _appUrl; },
  sessionSecret: _sessionSecret,
  isProd,
  pb: {
    get url() { return _pbUrl; },
    get adminEmail() {
      if (isProd) return ensure("PB_ADMIN_EMAIL", _pbAdminEmail);
      return _pbAdminEmail;
    },
    get adminPassword() {
      if (isProd) return ensure("PB_ADMIN_PASSWORD", _pbAdminPassword);
      return _pbAdminPassword;
    },
  },
  stripe: {
    get secretKey() { return ensure("STRIPE_SECRET_KEY", _stripeSecretKey); },
    get publishableKey() { return _stripePublishableKey; },
    get webhookSecret() { return ensure("STRIPE_WEBHOOK_SECRET", _stripeWebhookSecret); },
  },
  platformFeePercent: Number(process.env.PLATFORM_FEE_PERCENT ?? "3"),
  documenso: {
    get baseUrl() { return _documensoBaseUrl; },
    get apiToken() { return _documensoApiToken; },
    get webhookSecret() { return _documensoWebhookSecret; },
    get loiTemplateId() { return Number(_documensoLoiTemplateId || "0"); },
    get apaTemplateId() { return Number(_documensoApaTemplateId || "0"); },
  },
};
