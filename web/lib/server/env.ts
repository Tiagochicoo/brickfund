function read(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

function ensure(key: string, value: string): string {
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

const _appUrl = read("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
const _sessionSecret = read("SESSION_SECRET", "dev-only-secret-change-me-32-chars-min");
const _pbUrl = read("NEXT_PUBLIC_PB_URL", "http://127.0.0.1:8090");
const _pbAdminEmail = read("PB_ADMIN_EMAIL");
const _pbAdminPassword = read("PB_ADMIN_PASSWORD");
const _stripeSecretKey = read("STRIPE_SECRET_KEY");
const _stripePublishableKey = read("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", read("STRIPE_PUBLISHABLE_KEY"));
const _stripeWebhookSecret = read("STRIPE_WEBHOOK_SECRET");
const _documensoBaseUrl = read("DOCUMENSO_BASE_URL", "http://localhost:3001");
const _documensoApiToken = read("DOCUMENSO_API_TOKEN");
const _documensoWebhookSecret = read("DOCUMENSO_WEBHOOK_SECRET");
const _documensoLoiTemplateId = read("DOCUMENSO_LOI_TEMPLATE_ID");
const _documensoApaTemplateId = read("DOCUMENSO_APA_TEMPLATE_ID");

export const serverEnv = {
  get appUrl() { return _appUrl; },
  sessionSecret: _sessionSecret,
  pb: {
    get url() { return _pbUrl; },
    get adminEmail() { return _pbAdminEmail; },
    get adminPassword() { return _pbAdminPassword; },
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
