// Single source of truth for every wa.me link on the site (spec §5).

export function formatPrice(price: number | null | undefined, isStarting = false): string | null {
  if (price == null) return null;
  const amount = `PKR ${price.toLocaleString("en-US")}`;
  return isStarting ? `From ${amount}` : amount;
}

/** Keeps digits only. "+92 311-1234567" -> "923111234567". A local "03xx" number becomes "923xx". */
export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `92${digits.slice(1)}`; // ponytail: assumes Pakistan local format, store intl numbers for other countries
  return digits;
}

/** Without a number wa.me opens WhatsApp's contact picker, so links still work before the owner sets one. */
export function waLink(number: string, message: string): string {
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}

export type OrderItem = {
  name: string;
  category?: string | null;
  ref: string;
  url: string; // absolute
  price?: number | null;
  priceIsStarting?: boolean;
  note?: string | null;
};

export function orderMessage(item: OrderItem, businessName = "UMBAKES"): string {
  const price = formatPrice(item.price, item.priceIsStarting);
  return [
    `Hi ${businessName}! I am interested in ordering the following item.`,
    "",
    `Product: ${item.name}`,
    item.category ? `Category: ${item.category}` : null,
    `Reference ID: ${item.ref}`,
    `Reference Link: ${item.url}`,
    price ? `Price: ${price}` : null,
    item.note ? `\n${item.note}` : null,
    "",
    "I would like to discuss availability, customization and the details of this order.",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export type CustomInquiry = {
  occasion?: string;
  theme?: string;
  design?: string;
  size?: string;
  flavor?: string;
  date?: string;
  notes?: string;
};

const INQUIRY_LABELS: [keyof CustomInquiry, string][] = [
  ["occasion", "Occasion"],
  ["theme", "Cake theme"],
  ["design", "Preferred design"],
  ["size", "Size / servings"],
  ["flavor", "Flavour"],
  ["date", "Desired date"],
  ["notes", "Additional instructions"],
];

export function inquiryMessage(data: CustomInquiry, businessName = "UMBAKES"): string {
  const lines = INQUIRY_LABELS.filter(([k]) => data[k]?.trim()).map(([k, label]) => `${label}: ${data[k]!.trim()}`);
  return [`Hi ${businessName}! I'd like to order a custom cake.`, "", ...lines, "", "Could you let me know availability and pricing?"].join("\n");
}

export function absoluteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
