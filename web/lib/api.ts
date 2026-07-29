import { getPb } from "./pb";
import type { Business, InvestmentType, Interest, Message, SavedBusiness } from "./types";
import { PB_URL } from "./types";

// ── Businesses ──────────────────────────────────────────────────────────

export async function listBusinesses(opts?: {
  type?: InvestmentType;
  search?: string;
  city?: string;
  page?: number;
  perPage?: number;
}): Promise<{ items: Business[]; totalPages: number; page: number }> {
  const pb = getPb();
  const page = opts?.page ?? 1;
  const perPage = opts?.perPage ?? 12;
  const filters: string[] = ["published = true && status = 'open'"];
  if (opts?.type) filters.push(`investmentType = "${opts.type}"`);
  if (opts?.city) filters.push(`city = "${opts.city.replace(/"/g, '\\"')}"`);
  if (opts?.search) {
    const q = opts.search.replace(/"/g, '\\"');
    filters.push(`(name ~ "${q}" || location ~ "${q}" || pitch ~ "${q}")`);
  }
  const res = await pb
    .collection("businesses")
    .getList<Business>(page, perPage, {
      filter: filters.join(" && "),
      sort: "-featured,-created",
      expand: "owner",
    });
  return { items: res.items as unknown as Business[], totalPages: res.totalPages, page: res.page };
}

export async function listCities(): Promise<string[]> {
  const pb = getPb();
  const all = await pb.collection("businesses").getFullList<Business>({
    filter: "published = true && status = 'open'",
    fields: "city,country",
  });
  const cities = (all as unknown as Business[])
    .filter((b) => b.city)
    .map((b) => b.city as string);
  return [...new Set(cities)].sort();
}

export async function getBusiness(id: string): Promise<Business | null> {
  const pb = getPb();
  try {
    return (await pb.collection("businesses").getOne<Business>(id, {
      expand: "owner",
    })) as unknown as Business;
  } catch {
    return null;
  }
}

export function imageUrl(business: Business): string | null {
  const names = imageFilenames(business);
  if (!names.length) return null;
  const pb = getPb();
  return pb.files.getURL(business as never, names[0]);
}

export function imageFilenames(business: Pick<Business, "image">): string[] {
  if (!business.image) return [];
  return Array.isArray(business.image) ? business.image.filter(Boolean) : [business.image];
}

export function imageUrls(business: Business): string[] {
  const names = imageFilenames(business);
  if (!names.length) return [];
  const pb = getPb();
  return names.map((name) => pb.files.getURL(business as never, name));
}

export function businessImageUrl(business: Pick<Business, "id" | "image">, filename: string, thumb?: string): string {
  const base = `${PB_URL}/api/files/businesses/${business.id}/${filename}`;
  return thumb ? `${base}?thumb=${thumb}` : base;
}

// ── Interests ───────────────────────────────────────────────────────────

export async function expressInterest(opts: {
  businessId: string;
  message?: string;
  ticketSize?: string;
}): Promise<Interest> {
  const pb = getPb();
  const user = pb.authStore.model as { id: string } | null;
  if (!user) throw new Error("Not authenticated");

  // Check for existing interest
  try {
    const existing = await pb.collection("interests").getFirstListItem<Interest>(
      `investor = "${user.id}" && business = "${opts.businessId}"`
    );
    return existing as unknown as Interest;
  } catch {
    // Not found - create new
  }

  const created = await pb.collection("interests").create<Interest>({
    investor: user.id,
    business: opts.businessId,
    status: "pending",
    message: opts.message ?? "",
    ticketSize: opts.ticketSize ?? "",
  });
  return created as unknown as Interest;
}

export async function getMyInterests(): Promise<Interest[]> {
  const pb = getPb();
  const user = pb.authStore.model as { id: string } | null;
  if (!user) return [];
  const res = await pb.collection("interests").getFullList<Interest>({
    filter: `investor = "${user.id}"`,
    sort: "-created",
    expand: "business",
  });
  return res as unknown as Interest[];
}

export async function getInterestsForBusiness(businessId: string): Promise<Interest[]> {
  const pb = getPb();
  const res = await pb.collection("interests").getFullList<Interest>({
    filter: `business = "${businessId}"`,
    sort: "-created",
    expand: "investor",
  });
  return res as unknown as Interest[];
}

export async function getInterestsForOwner(ownerId: string): Promise<Interest[]> {
  const pb = getPb();
  const res = await pb.collection("interests").getList<Interest>(1, 50, {
    filter: `business.owner = "${ownerId}"`,
    sort: "-created",
    expand: "investor,business",
  });
  return res.items as unknown as Interest[];
}

export async function updateInterestStatus(
  interestId: string,
  status: "accepted" | "declined" | "withdrawn"
): Promise<void> {
  const pb = getPb();
  await pb.collection("interests").update(interestId, { status });
}

export async function checkInterest(businessId: string): Promise<Interest | null> {
  const pb = getPb();
  const user = pb.authStore.model as { id: string } | null;
  if (!user) return null;
  try {
    const res = await pb.collection("interests").getFirstListItem<Interest>(
      `investor = "${user.id}" && business = "${businessId}"`
    );
    return res as unknown as Interest;
  } catch {
    return null;
  }
}

// ── Messages ────────────────────────────────────────────────────────────

export async function getMessages(interestId: string): Promise<Message[]> {
  const pb = getPb();
  const res = await pb.collection("messages").getFullList<Message>({
    filter: `interest = "${interestId}"`,
    sort: "created",
    expand: "sender,recipient",
  });
  return res as unknown as Message[];
}

export async function sendMessage(opts: {
  interestId: string;
  recipientId: string;
  body: string;
  type?: "text" | "document" | "financial" | "deck";
  attachmentUrl?: string;
  attachmentLabel?: string;
}): Promise<Message> {
  const pb = getPb();
  const user = pb.authStore.model as { id: string } | null;
  if (!user) throw new Error("Not authenticated");

  const created = await pb.collection("messages").create<Message>({
    interest: opts.interestId,
    sender: user.id,
    recipient: opts.recipientId,
    body: opts.body,
    type: opts.type ?? "text",
    attachmentUrl: opts.attachmentUrl ?? "",
    attachmentLabel: opts.attachmentLabel ?? "",
    read: false,
  });
  return created as unknown as Message;
}

export async function markMessageRead(messageId: string): Promise<void> {
  const pb = getPb();
  await pb.collection("messages").update(messageId, { read: true });
}

// ── Saved businesses ────────────────────────────────────────────────────

export async function saveBusiness(businessId: string): Promise<void> {
  const pb = getPb();
  const user = pb.authStore.model as { id: string } | null;
  if (!user) throw new Error("Not authenticated");

  // Check if already saved
  try {
    await pb.collection("saved_businesses").getFirstListItem(
      `investor = "${user.id}" && business = "${businessId}"`
    );
    return; // Already saved
  } catch {
    // Not found - create new
  }

  await pb.collection("saved_businesses").create({
    investor: user.id,
    business: businessId,
  });
}

export async function unsaveBusiness(businessId: string): Promise<void> {
  const pb = getPb();
  const user = pb.authStore.model as { id: string } | null;
  if (!user) return;

  try {
    const record = await pb.collection("saved_businesses").getFirstListItem<{ id: string }>(
      `investor = "${user.id}" && business = "${businessId}"`
    );
    await pb.collection("saved_businesses").delete(record.id);
  } catch {
    // Not found
  }
}

export async function getSavedBusinesses(): Promise<SavedBusiness[]> {
  const pb = getPb();
  const user = pb.authStore.model as { id: string } | null;
  if (!user) return [];
  const res = await pb.collection("saved_businesses").getFullList<SavedBusiness>({
    filter: `investor = "${user.id}"`,
    sort: "-created",
    expand: "business",
  });
  return res as unknown as SavedBusiness[];
}

export async function isBusinessSaved(businessId: string): Promise<boolean> {
  const pb = getPb();
  const user = pb.authStore.model as { id: string } | null;
  if (!user) return false;
  try {
    await pb.collection("saved_businesses").getFirstListItem(
      `investor = "${user.id}" && business = "${businessId}"`
    );
    return true;
  } catch {
    return false;
  }
}
