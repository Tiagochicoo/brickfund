import { serverEnv } from "./env";

const API = `${serverEnv.documenso.baseUrl}/api/v1`;

type RecipientInput = {
  name: string;
  email: string;
  role?: "SIGNER" | "APPROVER" | "CC" | "VIEWER" | "ASSISTANT";
  signingOrder?: number;
};

type CreateFromTemplateArgs = {
  templateId: number;
  title: string;
  recipients: RecipientInput[];
  meta?: {
    subject?: string;
    message?: string;
    redirectUrl?: string;
    signingOrder?: "PARALLEL" | "SEQUENTIAL";
  };
  distributeDocument?: boolean;
  externalId?: string;
};

export type DocumensoRecipient = {
  id: number;
  email: string;
  name: string;
  signingUrl?: string;
  signingStatus: string;
  signedAt?: string | null;
  rejectionReason?: string | null;
};

export type DocumensoDocument = {
  id: number;
  status: "DRAFT" | "PENDING" | "COMPLETED" | "REJECTED";
  title: string;
  recipients: DocumensoRecipient[];
  Recipient?: DocumensoRecipient[];
};

async function docFetch(path: string, init: RequestInit): Promise<Response> {
  const token = serverEnv.documenso.apiToken;
  if (!token) throw new Error("DOCUMENSO_API_TOKEN not set");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Documenso ${path} failed (${res.status}): ${text}`);
  }
  return res;
}

export async function createDocumentFromTemplate(
  args: CreateFromTemplateArgs
): Promise<{ documentId: number; document: DocumensoDocument }> {
  const res = await docFetch(`/templates/${args.templateId}/generate-document`, {
    method: "POST",
    body: JSON.stringify({
      recipients: args.recipients,
      meta: args.meta,
      distributeDocument: args.distributeDocument ?? true,
      externalId: args.externalId,
    }),
  });
  const document = (await res.json()) as DocumensoDocument;
  return { documentId: document.id, document };
}

export async function getDocument(documentId: number): Promise<DocumensoDocument> {
  const res = await docFetch(`/documents/${documentId}`, { method: "GET" });
  return (await res.json()) as DocumensoDocument;
}

export async function getSigningUrlFor(
  documentId: number,
  email: string
): Promise<string | null> {
  const doc = await getDocument(documentId);
  const recipients = doc.recipients ?? doc.Recipient ?? [];
  return recipients.find((r) => r.email.toLowerCase() === email.toLowerCase())?.signingUrl ?? null;
}

export type DocumensoWebhookPayload = {
  event:
    | "DOCUMENT_CREATED"
    | "DOCUMENT_SENT"
    | "DOCUMENT_OPENED"
    | "DOCUMENT_SIGNED"
    | "DOCUMENT_RECIPIENT_COMPLETED"
    | "DOCUMENT_COMPLETED"
    | "DOCUMENT_REJECTED"
    | "DOCUMENT_CANCELLED"
    | "DOCUMENT_REMINDER_SENT"
    | "TEMPLATE_USED";
  payload: {
    id: number;
    externalId?: string | null;
    title: string;
    status: string;
    completedAt?: string | null;
    recipients?: DocumensoRecipient[];
    Recipient?: DocumensoRecipient[];
  };
  createdAt: string;
  webhookEndpoint?: string;
};

export function recipientsOf(payload: DocumensoWebhookPayload["payload"]): DocumensoRecipient[] {
  return payload.recipients ?? payload.Recipient ?? [];
}
