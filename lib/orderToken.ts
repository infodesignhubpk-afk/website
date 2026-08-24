import "server-only";
import crypto from "crypto";

/**
 * Access tokens for the order confirmation page.
 *
 * The order reference is printed on receipts, quoted over WhatsApp and read out
 * on the phone, so it cannot be treated as a secret. The confirmation page
 * shows the customer's name, phone number and delivery address, so it is gated
 * on a token derived from the reference instead — issued once, when the order
 * is created, and verifiable without storing anything.
 */

function secret(): string {
  // ADMIN_PASSCODE is a deliberate fallback so the gate is live in every
  // environment that already has one configured. Set ORDER_TOKEN_SECRET to
  // rotate order tokens without changing the admin passcode.
  return process.env.ORDER_TOKEN_SECRET || process.env.ADMIN_PASSCODE || "";
}

export function signOrderToken(reference: string): string {
  const s = secret();
  if (!s || !reference) return "";
  return crypto.createHmac("sha256", s).update(`order:${reference}`).digest("hex").slice(0, 32);
}

export function verifyOrderToken(reference: string, token: string | undefined | null): boolean {
  // No secret configured means no token can be trusted — fail closed rather
  // than fall back to showing the order to anyone who asks for it.
  const expected = signOrderToken(reference);
  if (!expected || !token) return false;
  if (token.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
