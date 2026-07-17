import { getPb } from "./pb";
import type { Business, InvestmentType } from "./types";

export async function listBusinesses(opts?: {
  type?: InvestmentType;
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<{ items: Business[]; totalPages: number; page: number }> {
  const pb = getPb();
  const page = opts?.page ?? 1;
  const perPage = opts?.perPage ?? 12;
  const filters: string[] = ["published = true"];
  if (opts?.type) filters.push(`investmentType = "${opts.type}"`);
  if (opts?.search) {
    const q = opts.search.replace(/"/g, '\\"');
    filters.push(`(name ~ "${q}" || location ~ "${q}" || pitch ~ "${q}")`);
  }
  const res = await pb
    .collection("businesses")
    .getList<Business>(page, perPage, {
      filter: filters.join(" && "),
      sort: "-fundingRaised,-created",
      expand: "owner",
    });
  return { items: res.items as unknown as Business[], totalPages: res.totalPages, page: res.page };
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
  if (!business.image) return null;
  const pb = getPb();
  return pb.files.getURL(business as never, business.image);
}
