import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(120, "Category name is too long"),
  slug: z.union([
    z.literal(""),
    z.string().trim().max(120, "Slug is too long").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  ]).optional().transform((value) => value || undefined),
});
