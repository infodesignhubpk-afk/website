import { z } from "zod";

const phoneRegex = /^(?:\+92|0092|92|0)3\d{9}$|^(?:\+92|0092|92)?\s?3\d{2}[\s-]?\d{7}$/;

export const phoneSchema = z
  .string()
  .min(7, "Please enter a valid phone number")
  .refine((v) => phoneRegex.test(v.replace(/\s|-/g, "")), {
    message: "Use +92 3xx xxx xxxx or 03xx xxx xxxx",
  });

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a bit more").max(2000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const serviceInquirySchema = z.object({
  name: z.string().min(2).max(80),
  phone: phoneSchema,
  service: z.string().min(2),
  brief: z.string().min(10).max(2000),
  website: z.string().max(0).optional().or(z.literal("")),
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
  website: z.string().max(0).optional().or(z.literal("")),
});

export const leadSchema = z.union([
  contactSchema.extend({ kind: z.literal("contact") }),
  serviceInquirySchema.extend({ kind: z.literal("service") }),
  quoteSchema.extend({ kind: z.literal("quote") }),
]);

export type ContactInput = z.infer<typeof contactSchema>;
export type ServiceInquiryInput = z.infer<typeof serviceInquirySchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
