import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPrice, inquiryMessage, normalizeWhatsAppNumber, orderMessage, waLink } from "./whatsapp";

test("normalizes numbers to international digits", () => {
  assert.equal(normalizeWhatsAppNumber("+92 300-1234567"), "923001234567");
  assert.equal(normalizeWhatsAppNumber("0300 1234567"), "923001234567");
  assert.equal(normalizeWhatsAppNumber("0092 300 1234567"), "923001234567");
});

test("order message identifies the exact product", () => {
  const msg = orderMessage({
    name: "Floral Birthday Cake",
    category: "Birthday Cakes",
    ref: "CAKE-102",
    url: "https://umbakes.pk/cakes/birthday/floral-birthday-cake",
    price: 4500,
    priceIsStarting: true,
  });
  assert.match(msg, /Product: Floral Birthday Cake/);
  assert.match(msg, /Category: Birthday Cakes/);
  assert.match(msg, /Reference ID: CAKE-102/);
  assert.match(msg, /Reference Link: https:\/\/umbakes\.pk\/cakes\/birthday\/floral-birthday-cake/);
  assert.match(msg, /Price: From PKR 4,500/);
});

test("order message omits price when not set", () => {
  const msg = orderMessage({ name: "X", ref: "R-1", url: "https://a.b/x", price: null });
  assert.doesNotMatch(msg, /Price:/);
});

test("wa.me link encodes message and survives round-trip", () => {
  const link = waLink("+92 300 1234567", "Hi & hello\nline 2");
  const url = new URL(link);
  assert.equal(url.origin + url.pathname, "https://wa.me/923001234567");
  assert.equal(url.searchParams.get("text"), "Hi & hello\nline 2");
});

test("inquiry message only includes filled fields", () => {
  const msg = inquiryMessage({ occasion: "Birthday", flavor: " ", date: "2026-12-01" });
  assert.match(msg, /Occasion: Birthday/);
  assert.match(msg, /Desired date: 2026-12-01/);
  assert.doesNotMatch(msg, /Flavour/);
});

test("formatPrice", () => {
  assert.equal(formatPrice(null), null);
  assert.equal(formatPrice(1200), "PKR 1,200");
});
