export const PB_URL =
  process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8093";

export type Role = "business" | "investor";

export type InvestmentType =
  | "seed"
  | "growth"
  | "loan"
  | "equity"
  | "revenue_share"
  | "convertible_note"
  | "trespasse";

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

export type ListingStatus = "open" | "paused" | "closed";

export type InterestStatus = "pending" | "accepted" | "declined" | "withdrawn";

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
  termsAccepted?: boolean;
  termsVersion?: string;
  ticketMin?: string;
  ticketMax?: string;
  bio?: string;
  experience?: string;
  phone?: string;
  location?: string;
  city?: string;
  country?: string;
  avatar?: string;
}

export interface Business extends BaseRecord {
  owner: string;
  name: string;
  category: Category;
  investmentType: InvestmentType;
  location: string;
  city?: string;
  country?: string;
  pitch: string;
  description?: string;
  status: ListingStatus;
  capitalSought?: string;
  useOfFunds?: string;
  revenueRange?: string;
  // Private fields - only visible after interest
  privateDescription?: string;
  privateFinancials?: string;
  privateDeckUrl?: string;
  vetted?: boolean;
  featured?: boolean;
  published: boolean;
  image?: string | string[];
  expand?: { owner?: User };
}

export interface Interest extends BaseRecord {
  investor: string;
  business: string;
  status: InterestStatus;
  message?: string;
  ticketSize?: string;
  expand?: {
    investor?: User;
    business?: Business;
  };
}

export interface Message extends BaseRecord {
  interest: string;
  sender: string;
  recipient: string;
  body: string;
  type: "text" | "document" | "financial" | "deck";
  attachmentUrl?: string;
  attachmentLabel?: string;
  read?: boolean;
  expand?: {
    sender?: User;
    recipient?: User;
  };
}

export interface SavedBusiness extends BaseRecord {
  investor: string;
  business: string;
  expand?: { business?: Business };
}
