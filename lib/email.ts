import nodemailer from "nodemailer";
import type { LeadInput } from "@/lib/validation";
import type { Order } from "@/types/admin";
import { formatAmount, lineTotal } from "@/lib/money";

const RECIPIENT_EMAIL = process.env.NOTIFICATION_EMAIL || "info.designhubpk@gmail.com";

// A stalled provider must not hold a request (or an after() task) open until
// the platform kills it, so every network call here is bounded.
const RESEND_TIMEOUT_MS = 10_000;

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  const isSecure = port === 465 || process.env.SMTP_SECURE === "true";

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    // Since nodemailer 10.1 the wait for the greeting also counts against
    // connectionTimeout; socketTimeout bounds any later stall.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

// Every value interpolated into the HTML templates goes through this, numbers
// and currency codes included: all of it comes from form input or the database.
function escapeHtml(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Send email notification for incoming leads (Quote, Contact Form, Service Inquiry)
 */
export async function sendLeadNotificationEmail(lead: LeadInput) {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "info.designhubpk@gmail.com";

  let subject = "New Inquiry - Design Hub";
  let title = "New Website Lead";
  let rowsHtml = "";

  const waDigits = cleanDigits(lead.phone);
  const waLink = waDigits ? `https://wa.me/${waDigits}` : "";

  if (lead.kind === "quote") {
    subject = `New Quote Request: ${lead.service} - ${lead.name}`;
    title = `Quote Request: ${lead.service}`;
    rowsHtml = `
      <tr><td style="padding: 8px 12px; font-weight: bold; width: 140px; color: #555;">Name:</td><td style="padding: 8px 12px; color: #111;">${escapeHtml(lead.name)}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Phone / WhatsApp:</td><td style="padding: 8px 12px; color: #111;"><a href="tel:${escapeHtml(lead.phone)}" style="color: #111; text-decoration: none;">${escapeHtml(lead.phone)}</a> ${waLink ? `&nbsp;(<a href="${escapeHtml(waLink)}" style="color: #16a34a; font-weight: bold;" target="_blank">Chat on WhatsApp</a>)` : ""}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px 12px; color: #111;">${lead.email ? `<a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a>` : "Not provided"}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Business:</td><td style="padding: 8px 12px; color: #111;">${escapeHtml(lead.business) || "Not provided"}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px 12px; font-weight: bold; color: #111;">${escapeHtml(lead.service)}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Estimated Budget:</td><td style="padding: 8px 12px; color: #111;">${escapeHtml(lead.budget) || "Not specified"}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Timeline:</td><td style="padding: 8px 12px; color: #111;">${escapeHtml(lead.timeline) || "Not specified"}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555; vertical-align: top;">Project Details:</td><td style="padding: 8px 12px; color: #111; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(lead.details)}</td></tr>
    `;
  } else if (lead.kind === "service") {
    subject = `New Service Inquiry: ${lead.service} - ${lead.name}`;
    title = `Service Inquiry: ${lead.service}`;
    rowsHtml = `
      <tr><td style="padding: 8px 12px; font-weight: bold; width: 140px; color: #555;">Name:</td><td style="padding: 8px 12px; color: #111;">${escapeHtml(lead.name)}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Phone / WhatsApp:</td><td style="padding: 8px 12px; color: #111;"><a href="tel:${escapeHtml(lead.phone)}" style="color: #111; text-decoration: none;">${escapeHtml(lead.phone)}</a> ${waLink ? `&nbsp;(<a href="${escapeHtml(waLink)}" style="color: #16a34a; font-weight: bold;" target="_blank">Chat on WhatsApp</a>)` : ""}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px 12px; font-weight: bold; color: #111;">${escapeHtml(lead.service)}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555; vertical-align: top;">Brief:</td><td style="padding: 8px 12px; color: #111; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(lead.brief)}</td></tr>
    `;
  } else {
    subject = `New Contact Form Message from ${lead.name}`;
    title = "Contact Form Message";
    rowsHtml = `
      <tr><td style="padding: 8px 12px; font-weight: bold; width: 140px; color: #555;">Name:</td><td style="padding: 8px 12px; color: #111;">${escapeHtml(lead.name)}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Phone / WhatsApp:</td><td style="padding: 8px 12px; color: #111;"><a href="tel:${escapeHtml(lead.phone)}" style="color: #111; text-decoration: none;">${escapeHtml(lead.phone)}</a> ${waLink ? `&nbsp;(<a href="${escapeHtml(waLink)}" style="color: #16a34a; font-weight: bold;" target="_blank">Chat on WhatsApp</a>)` : ""}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px 12px; color: #111;">${lead.email ? `<a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a>` : "Not provided"}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; color: #555; vertical-align: top;">Message:</td><td style="padding: 8px 12px; color: #111; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(lead.message)}</td></tr>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f5; margin: 0; padding: 24px; color: #1a1a1a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e6e6e6; overflow: hidden;">
          <div style="background-color: #111111; padding: 20px 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">Design Hub — ${escapeHtml(title)}</h1>
          </div>
          <div style="padding: 24px;">
            <p style="margin-top: 0; margin-bottom: 20px; font-size: 15px; color: #444;">
              A new lead has been submitted on <strong>designhub.com.pk</strong>.
            </p>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #eeeeee; font-size: 14px; background: #fafafa; border-radius: 8px; margin-bottom: 24px;">
              ${rowsHtml}
            </table>
            ${waLink ? `
              <div style="text-align: center; margin: 24px 0 10px 0;">
                <a href="${escapeHtml(waLink)}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 30px; font-size: 15px;" target="_blank">
                  Reply via WhatsApp
                </a>
              </div>
            ` : ""}
          </div>
          <div style="background: #f7f7f5; padding: 12px 24px; border-top: 1px solid #e6e6e6; font-size: 12px; color: #888; text-align: center;">
            Design Hub Automated Notification • Received at ${escapeHtml(new Date().toLocaleString())}
          </div>
        </div>
      </body>
    </html>
  `;

  const replyTo = "email" in lead && typeof lead.email === "string" && lead.email ? lead.email : undefined;

  // Try Resend API if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Design Hub <onboarding@resend.dev>",
          to: [RECIPIENT_EMAIL],
          reply_to: replyTo,
          subject,
          html,
        }),
        signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      });
      if (resendRes.ok) {
        return { success: true, provider: "resend" };
      }
      console.error("[email] Resend error:", await resendRes.text());
    } catch (err) {
      console.error("[email] Resend request failed:", err);
    }
  }

  // Fallback / Primary SMTP (Gmail / Custom SMTP)
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `Design Hub <${fromEmail}>`,
        to: RECIPIENT_EMAIL,
        replyTo,
        subject,
        html,
      });
      return { success: true, provider: "smtp" };
    } catch (err) {
      console.error("[email] SMTP sendMail failed:", err);
    }
  } else {
    console.warn(`[email] No SMTP_USER/SMTP_PASS or RESEND_API_KEY configured. Lead for ${lead.name} (${lead.phone}) was not sent via email.`);
  }

  return { success: false };
}

/**
 * Send email notification for new product orders
 */
export async function sendOrderNotificationEmail(order: Order) {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "info.designhubpk@gmail.com";

  const subject = `New Order #${order.reference} from ${order.customerName}`;
  const waDigits = cleanDigits(order.customerPhone);
  const waLink = waDigits ? `https://wa.me/${waDigits}` : "";

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(item.productName)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: center;">${escapeHtml(item.quantity)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${escapeHtml(item.currency)} ${escapeHtml(formatAmount(item.unitPrice))}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${escapeHtml(item.currency)} ${escapeHtml(formatAmount(lineTotal(item.quantity, item.unitPrice)))}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f5; margin: 0; padding: 24px; color: #1a1a1a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e6e6e6; overflow: hidden;">
          <div style="background-color: #111111; padding: 20px 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">Design Hub — New Order #${escapeHtml(order.reference)}</h1>
          </div>
          <div style="padding: 24px;">
            <h2 style="font-size: 16px; margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 8px;">Customer Details</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <tr><td style="padding: 6px 0; font-weight: bold; width: 140px; color: #555;">Customer Name:</td><td>${escapeHtml(order.customerName)}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Phone / WhatsApp:</td><td><a href="tel:${escapeHtml(order.customerPhone)}">${escapeHtml(order.customerPhone)}</a> ${waLink ? `&nbsp;(<a href="${escapeHtml(waLink)}" style="color: #16a34a; font-weight: bold;" target="_blank">WhatsApp</a>)` : ""}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Email:</td><td>${order.customerEmail ? `<a href="mailto:${escapeHtml(order.customerEmail)}">${escapeHtml(order.customerEmail)}</a>` : "Not provided"}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Business:</td><td>${escapeHtml(order.customerBusiness) || "Not provided"}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Delivery Method:</td><td>${escapeHtml(order.deliveryMethod)}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Payment Method:</td><td>${escapeHtml(order.paymentMethod)}</td></tr>
              ${order.notes ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #555; vertical-align: top;">Notes:</td><td style="white-space: pre-wrap;">${escapeHtml(order.notes)}</td></tr>` : ""}
            </table>

            <h2 style="font-size: 16px; margin-top: 20px; border-bottom: 2px solid #eee; padding-bottom: 8px;">Ordered Items</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <thead>
                <tr style="background: #fafafa;">
                  <th style="padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                  <th style="padding: 8px 12px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
                  <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #ddd;">Unit Price</th>
                  <th style="padding: 8px 12px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 8px 12px; text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 8px 12px; text-align: right; font-weight: bold;">${escapeHtml(order.currency)} ${escapeHtml(formatAmount(order.subtotal))}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 8px 12px; text-align: right; color: #666;">Delivery Fee:</td>
                  <td style="padding: 8px 12px; text-align: right; color: #666;">${escapeHtml(order.currency)} ${escapeHtml(formatAmount(order.deliveryFee))}</td>
                </tr>
                <tr style="font-size: 16px;">
                  <td colspan="3" style="padding: 10px 12px; text-align: right; font-weight: bold; border-top: 2px solid #111;">Total Amount:</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: bold; border-top: 2px solid #111; color: #f5a732;">${escapeHtml(order.currency)} ${escapeHtml(formatAmount(order.totalAmount))}</td>
                </tr>
              </tfoot>
            </table>

            ${waLink ? `
              <div style="text-align: center; margin: 24px 0 10px 0;">
                <a href="${escapeHtml(waLink)}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 30px; font-size: 15px;" target="_blank">
                  Message Customer on WhatsApp
                </a>
              </div>
            ` : ""}
          </div>
          <div style="background: #f7f7f5; padding: 12px 24px; border-top: 1px solid #e6e6e6; font-size: 12px; color: #888; text-align: center;">
            Design Hub Automated Order Notification • Order Reference #${escapeHtml(order.reference)}
          </div>
        </div>
      </body>
    </html>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Design Hub <onboarding@resend.dev>",
          to: [RECIPIENT_EMAIL],
          reply_to: order.customerEmail || undefined,
          subject,
          html,
        }),
        signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      });
      if (resendRes.ok) {
        return { success: true, provider: "resend" };
      }
    } catch (err) {
      console.error("[order-email] Resend failed:", err);
    }
  }

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `Design Hub Orders <${fromEmail}>`,
        to: RECIPIENT_EMAIL,
        replyTo: order.customerEmail || undefined,
        subject,
        html,
      });
      return { success: true, provider: "smtp" };
    } catch (err) {
      console.error("[order-email] SMTP failed:", err);
    }
  }

  return { success: false };
}
