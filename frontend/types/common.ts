export type ID = string;
/** ISO-8601 UTC instant, e.g. 2026-11-12T04:30:00.000Z */
export type ISODateTime = string;
/** Business calendar date in Asia/Dhaka, "YYYY-MM-DD" */
export type ISODate = string;

export type Currency = "BDT";
/** Money in minor units (poisha). 150000 = ৳1,500 */
export interface Money {
  amount: number;
  currency: Currency;
}

export type Gender = "MALE" | "FEMALE";

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Delivery result reported by the backend's notification module. */
export type DeliveryStatus = "QUEUED" | "SENT" | "FAILED" | "NOT_CONFIGURED";
