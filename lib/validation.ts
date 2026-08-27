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

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a bit more").max(2000),
  website: z.string().max(0).optional().default(""),
});

export const serviceInquirySchema = z.object({
  name: z.string().min(2).max(80),
  phone: phoneSchema,
  service: z.string().min(2),
  brief: z.string().min(10).max(2000),
  website: z.string().max(0).optional().default(""),
});

export const quoteSchema = z.object({
  service: z.string().min(2),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  details: z.string().min(10).max(2000),
  name: z.string().min(2).max(80),
  phone: phoneSchema,
  email: z.string().email().optional().or(z.literal("")),
  business: z.string().max(120).optional().or(z.literal("")),
  website: z.string().max(0).optional().default(""),
});

export const leadSchema = z.union([
  contactSchema.extend({ kind: z.literal("contact") }),
  serviceInquirySchema.extend({ kind: z.literal("service") }),
  quoteSchema.extend({ kind: z.literal("quote") }),
]);

export type ContactInput = z.input<typeof contactSchema>;
export type ServiceInquiryInput = z.input<typeof serviceInquirySchema>;
export type QuoteInput = z.input<typeof quoteSchema>;
export type LeadInput = z.input<typeof leadSchema>;
