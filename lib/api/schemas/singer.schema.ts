import { z } from "zod";
import { categorySchema } from "./category.schema";

export const singerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  title: z.string(),
  categoryId: z.string().uuid().nullable(),
  category: categorySchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const singerInputSchema = z.object({
  name: z.string().trim().min(1, "Singer name is required").max(160, "Singer name is too long"),
  title: z.string().trim().min(1, "Artist title is required").max(160, "Artist title is too long"),
  categoryId: z.string().uuid("Please select a category"),
});
