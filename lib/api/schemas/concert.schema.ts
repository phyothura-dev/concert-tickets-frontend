import { z } from "zod";
import { isValid, parseISO } from "date-fns";
import { categorySchema } from "./category.schema";
import { singerSchema } from "./singer.schema";

export const concertSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  imageUrl: z.string().url().nullable().optional().transform((value) => value ?? null),
  categoryIds: z.array(z.string().uuid()),
  categories: z.array(categorySchema),
  availableStock: z.number().int().nonnegative(),
  totalStock: z.number().int().nonnegative(),
  singerIds: z.array(z.string().uuid()),
  singers: z.array(singerSchema),
});

export const concertInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(500, "Title is too long"),
  venue: z.string().trim().min(1, "Venue is required").max(500, "Venue is too long"),
  startsAt: z.string().trim().min(1, "Start date and time are required").refine((value) => isValid(parseISO(value)), "Enter a valid start date and time"),
  categoryIds: z.array(z.string().uuid()).max(50, "Select no more than 50 categories").optional(),
  singerIds: z.array(z.string().uuid()).max(50, "Select no more than 50 artists").optional(),
});
