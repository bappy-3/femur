import type { Money } from "@/types/common";

/** Amounts are integer poisha (1 BDT = 100 poisha), matching the API contract. */
/** Bangladeshi digit grouping (12,34,567) without Intl, so SSR and browser output always match. */
export function groupBdt(value: number): string {
  const negative = value < 0;
  const [intPart, frac] = Math.abs(value).toFixed(2).split(".") as [string, string];
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = rest ? `${rest},${last3}` : last3;
  return `${negative ? "-" : ""}${grouped}${frac === "00" ? "" : `.${frac}`}`;
}

export function formatMoney(money: Money | null | undefined, fallback = "Price on request"): string {
  if (!money) return fallback;
  return `৳${groupBdt(money.amount / 100)}`;
}

export function bdt(taka: number): Money {
  return { amount: Math.round(taka * 100), currency: "BDT" };
}

export function sumMoney(values: Money[]): Money {
  return { amount: values.reduce((acc, m) => acc + m.amount, 0), currency: "BDT" };
}

/** Percentage of an amount, half-up rounded to the nearest poisha. */
export function percentOf(money: Money, percent: number): Money {
  return { amount: Math.round((money.amount * percent) / 100), currency: money.currency };
}
