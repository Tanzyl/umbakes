// End-to-end smoke test against a running app (npm run dev or npm start).
// Covers: admin auth, settings, category + product CRUD with uploads, upload validation,
// public pages, product modal, WhatsApp message content, hiding, deletion and file cleanup.
// Usage: BASE_URL=http://localhost:3000 npm run test:e2e   (uses installed Edge or Chrome)
import "dotenv/config";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CHANNEL = process.env.BROWSER_CHANNEL || (process.platform === "win32" ? "msedge" : "chrome");
const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
const tmp = mkdtempSync(path.join(tmpdir(), "umb-e2e-"));

const makeJpg = async (name, color) => {
  const p = path.join(tmp, name);
  await sharp({ create: { width: 900, height: 1100, channels: 3, background: color } }).jpeg().toFile(p);
  return p;
};
const img1 = await makeJpg("a.jpg", "#d9a7a0");
const img2 = await makeJpg("b.jpg", "#a7c9d9");
const fake = path.join(tmp, "fake.jpg");
writeFileSync(fake, "this is not an image");

const step = (name) => console.log(`• ${name}`);
const toast = (page, text) => page.getByText(text, { exact: false }).first().waitFor({ timeout: 15000 });
const filesIn = (dir) => (existsSync(dir) ? readdirSync(dir) : []);

const browser = await chromium.launch({ channel: CHANNEL });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

try {
  step("admin pages require login");
  await page.goto(`${BASE}/admin/products`);
  assert.match(page.url(), /\/admin\/login$/);

  step("wrong password is rejected");
  await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL);
  await page.getByLabel("Password").fill("wrong-password-123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await toast(page, "incorrect");

  step("login");
  await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("heading", { name: "Welcome back" }).waitFor();

  step("set WhatsApp number in settings");
  await page.goto(`${BASE}/admin/settings`);
  const waField = page.getByLabel("WhatsApp number");
  const previousWa = await waField.inputValue();
  await waField.fill("+92 300 1234567");
  await page.getByRole("button", { name: "Save settings" }).click();
  await toast(page, "Settings saved");

  step("create category with image");
  const catFilesBefore = filesIn(path.join(uploadDir, "categories")).length;
  await page.goto(`${BASE}/admin/categories/new`);
  await page.getByLabel("Name", { exact: true }).fill("E2E Test Cakes");
  await page.locator('input[name="imageFile"]').setInputFiles(img1);
  await page.getByRole("button", { name: "Create category" }).click();
  await page.waitForURL(/\/admin\/categories$/);
  await page.getByRole("link", { name: "E2E Test Cakes", exact: true }).waitFor();
  assert.equal(filesIn(path.join(uploadDir, "categories")).length, catFilesBefore + 1);

  step("create product with two photos");
  await page.goto(`${BASE}/admin/products/new`);
  await page.getByLabel("Name", { exact: true }).fill("E2E Floral Cake");
  await page.getByLabel("Category").selectOption({ label: "E2E Test Cakes (Custom Cakes)" });
  await page.getByLabel("Price (PKR)").fill("4,500");
  await page.getByText("This is a starting price").click();
  await page.getByText("Featured", { exact: true }).click();
  await page.locator('input[name="newImages"]').setInputFiles([img1, img2]);
  await page.getByRole("button", { name: "Create product" }).click();
  await page.waitForURL(/\/admin\/products\/(?!new)[^/?]+/);
  await page.getByRole("heading", { name: "E2E Floral Cake" }).waitFor();
  assert.equal(await page.locator("ul img").count() >= 2, true, "two photos shown in editor");

  step("invalid upload is rejected");
  await page.locator('input[name="newImages"]').setInputFiles(fake);
  await page.getByRole("button", { name: "Save changes" }).click();
  await toast(page, "isn't a valid image");

  step("public category page shows product with correct WhatsApp message");
  await page.goto(`${BASE}/cakes/e2e-test-cakes`);
  await page.getByRole("heading", { name: "E2E Floral Cake" }).waitFor();
  const href = await page.getByRole("link", { name: "Order E2E Floral Cake on WhatsApp" }).getAttribute("href");
  const url = new URL(href);
  assert.equal(url.pathname, "/923001234567");
  const msg = url.searchParams.get("text");
  assert.match(msg, /Product: E2E Floral Cake/);
  assert.match(msg, /Category: E2E Test Cakes/);
  assert.match(msg, /Reference ID: CAKE-\d+/);
  assert.match(msg, /Reference Link: http.*\/cakes\/e2e-test-cakes\/e2e-floral-cake/);
  assert.match(msg, /Price: From PKR 4,500/);

  step("product modal opens and closes with Escape");
  await page.getByRole("button", { name: "View E2E Floral Cake" }).click();
  const dialog = page.getByRole("dialog", { name: "E2E Floral Cake" });
  await dialog.waitFor();
  await dialog.getByRole("button", { name: "Next photo" }).click();
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });

  step("product page has its own URL");
  const res = await page.goto(`${BASE}/cakes/e2e-test-cakes/e2e-floral-cake`);
  assert.equal(res.status(), 200);
  await page.getByRole("heading", { name: "E2E Floral Cake", level: 2 }).waitFor();

  step("hiding a product removes it from the site");
  await page.goto(`${BASE}/admin/products?q=E2E`);
  await page.getByRole("button", { name: "Hide" }).click();
  await page.getByText("Hidden", { exact: true }).waitFor();
  assert.equal((await page.request.get(`${BASE}/cakes/e2e-test-cakes/e2e-floral-cake`)).status(), 404);

  step("category with products can't be deleted");
  await page.goto(`${BASE}/admin/categories`);
  const catRow = page.locator("li", { hasText: "E2E Test Cakes" });
  await catRow.locator("button:has(svg.lucide-trash2), button:has([aria-label='Delete'])").first().click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await toast(page, "Move or delete the 1 product");

  step("delete product, then category; files are cleaned up");
  const productFilesBefore = filesIn(path.join(uploadDir, "products")).length;
  await page.goto(`${BASE}/admin/products?q=E2E`);
  await page.locator("li", { hasText: "E2E Floral Cake" }).locator("button:has([aria-label='Delete'])").click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await toast(page, "Product deleted");
  assert.equal(filesIn(path.join(uploadDir, "products")).length, productFilesBefore - 2);
  await page.goto(`${BASE}/admin/categories`);
  await page.locator("li", { hasText: "E2E Test Cakes" }).locator("button:has([aria-label='Delete'])").click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await toast(page, "Category deleted");
  assert.equal(filesIn(path.join(uploadDir, "categories")).length, catFilesBefore);

  step("restore WhatsApp number");
  await page.goto(`${BASE}/admin/settings`);
  await page.getByLabel("WhatsApp number").fill(previousWa);
  await page.getByRole("button", { name: "Save settings" }).click();
  await toast(page, "Settings saved");

  step("sign out ends the session");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL(/\/admin\/login$/);
  await page.goto(`${BASE}/admin`);
  assert.match(page.url(), /\/admin\/login$/);

  assert.deepEqual(errors, [], "no uncaught page errors");
  console.log("\n✔ e2e smoke passed");
} catch (e) {
  await page.screenshot({ path: path.join(tmp, "failure.png"), fullPage: true });
  console.error(`\n✖ e2e failed. Screenshot: ${path.join(tmp, "failure.png")}`);
  throw e;
} finally {
  await browser.close();
}
