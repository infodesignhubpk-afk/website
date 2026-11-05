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
 *
 * Every buyer receives a reference and its token, i.e. a known message and its
 * HMAC, so the key must be a dedicated high-entropy secret that guards nothing
 * else. It used to fall back to ADMIN_PASSCODE, which turned every order into an
 * offline brute-force oracle for the admin login. Without ORDER_TOKEN_SECRET (32+
 * characters) no token is issued and none verifies: customers still get their
 * reference, just not the detailed summary.
 */

const MIN_SECRET_LENGTH = 32;

let warned = false;

function secret(): string {
  const s = process.env.ORDER_TOKEN_SECRET ?? "";
  if (s.length >= MIN_SECRET_LENGTH) return s;
  if (!warned) {
    warned = true;
    console.error(
      `[orderToken] ORDER_TOKEN_SECRET is missing or shorter than ${MIN_SECRET_LENGTH} characters; order confirmation tokens are disabled.`,
    );
  }
  return "";
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
