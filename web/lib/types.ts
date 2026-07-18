export const PB_URL =
  process.env.NEXT_PUBLIC_PB_URL || "https://api.brickfund.t-pereira.com";

export type Role = "business" | "investor";

export type InvestmentType =
  | "seed"
  | "growth"
  | "loan"
  | "equity"
  | "revenue_share"
  | "convertible_note";

export type Category =
  | "restaurant"
  | "barber"
  | "gym"
  | "cafe"
  | "retail"
  | "salon"
  | "bakery"
  | "bar"
  | "other";

export interface BaseRecord {
  id: string;
  created: string;
  updated: string;
}

export interface User extends BaseRecord {
  email: string;
  emailVisibility?: boolean;
  verified: boolean;
  name: string;
  role: Role;
  company?: string;
  investorType?: "individual" | "firm" | "fund";
  accredited?: boolean;
  budgetMin?: number;
  budgetMax?: number;
  phone?: string;
  location?: string;
  avatar?: string;
}

export interface Business extends BaseRecord {
  owner: string;
  name: string;
  category: Category;
  investmentType: InvestmentType;
  location: string;
  pitch: string;
  description?: string;
  fundingGoal: number;
  fundingRaised: number;
  image?: string;
  published: boolean;
  expand?: { owner?: User };
}
