import { z } from "zod";

// Permits international formats (+44..., +1..., +92...), local formats (03..., landlines), and standard punctuation
const phoneRegex = /^\+?[\d\s\-().]{7,25}$/;

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter your phone number")
  .refine(
    (v) => {
      const digits = v.replace(/\D/g, "");
      return phoneRegex.test(v) && digits.length >= 7 && digits.length <= 16;
    },
    {
      message: "Please enter a valid phone number",
    },
  );

// Google Analytics 4 measurement ID, e.g. G-ABC123XYZ. Nothing else is ever
// written into the inline gtag script.
export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/;

// Every lead field has a length cap, so one request cannot carry pages of text.
const tooLong = (max: number) => `Please keep this to ${max} characters or fewer`;

// Honeypot: a hidden field real visitors never fill. Any short value passes
// here; /api/lead answers a filled one with a silent fake success, so a bot
// learns nothing about the rule.
const honeypot = z.string().max(200).optional().default("");

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120, tooLong(120)),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email").max(200, tooLong(200)).optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a bit more").max(5000, tooLong(5000)),
  website: honeypot,
});

export const serviceInquirySchema = z.object({
  name: z.string().min(2).max(120, tooLong(120)),
  phone: phoneSchema,
  service: z.string().min(2).max(120),
  brief: z.string().min(10).max(5000, tooLong(5000)),
  website: honeypot,
});

export const quoteSchema = z.object({
  service: z.string().min(2).max(120),
  budget: z.string().max(120).optional(),
  timeline: z.string().max(120).optional(),
  details: z.string().min(10).max(5000, tooLong(5000)),
  name: z.string().min(2).max(120, tooLong(120)),
  phone: phoneSchema,
  email: z.string().email().max(200, tooLong(200)).optional().or(z.literal("")),
  business: z.string().max(120, tooLong(120)).optional().or(z.literal("")),
  website: honeypot,
});

// Discriminated on "kind" so a failure names the fields of the form that was
// sent instead of one nested error per union member.
export const leadSchema = z.discriminatedUnion("kind", [
  contactSchema.extend({ kind: z.literal("contact") }),
  serviceInquirySchema.extend({ kind: z.literal("service") }),
  quoteSchema.extend({ kind: z.literal("quote") }),
]);

export type ContactInput = z.input<typeof contactSchema>;
export type ServiceInquiryInput = z.input<typeof serviceInquirySchema>;
export type QuoteInput = z.input<typeof quoteSchema>;
export type LeadInput = z.input<typeof leadSchema>;
