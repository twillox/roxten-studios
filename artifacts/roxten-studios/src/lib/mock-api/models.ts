export type UserRole = "partner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  company?: string;
  website?: string;
  bio?: string;
  role: UserRole;
  referralCode: string;
  createdAt: string;
  taxDetails?: {
    panNumber?: string;
    gstNumber?: string;
  };
  paymentPreferences?: {
    method: "bank" | "upi" | "paypal";
    details: string; // Account number, UPI ID, or PayPal email
  };
}

export type ReferralStatus = "Pending" | "Contacted" | "Proposal Sent" | "Negotiation" | "Won" | "Lost" | "Paid";

export interface Referral {
  id: string;
  partnerId?: string; // Optional if we move to referralCode mostly
  referralCode?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  businessName?: string; // Legacy
  company?: string; // New
  projectType: string;
  description?: string;
  projectValue?: number; // In USD
  commissionRate?: number; // e.g., 0.1 for 10%
  commissionEarned?: number; // In USD
  status: ReferralStatus;
  createdAt: any;
  updatedAt?: any;
  notes?: string;
}

export type CommissionStatus = "Pending" | "Approved" | "Paid";

export interface Commission {
  id: string;
  referralId: string;
  partnerId: string;
  amount: number;
  status: CommissionStatus;
  createdAt: string;
  paidAt?: string;
}

export type PayoutStatus = "Processing" | "Completed" | "Failed";

export interface Payout {
  id: string;
  partnerId: string;
  amount: number;
  method: "bank" | "upi" | "paypal";
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  transactionRef?: string;
}

export interface ActivityLog {
  id: string;
  partnerId: string;
  action: string;
  details: string;
  timestamp: string;
}
