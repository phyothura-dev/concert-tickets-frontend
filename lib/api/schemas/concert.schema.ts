import { z } from "zod";
import { categorySchema } from "./category.schema";
import { singerSchema } from "./singer.schema";

export const concertSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  categoryId: z.string().uuid().nullable(),
  category: categorySchema.nullable(),
  availableStock: z.number().int().nonnegative(),
  totalStock: z.number().int().nonnegative(),
  singerIds: z.array(z.string().uuid()),
  singers: z.array(singerSchema),
});

export const createConcertSchema = z.object({
  title: z.string().min(1, "title is required").max(500, "title is too long"),
  venue: z.string().min(1, "venue is required").max(500, "venue is too long"),
  startsAt: z.string().min(1, "startsAt is required"),
  categoryId: z.string().uuid().nullable().optional(),
  singerIds: z.array(z.string().uuid()).max(50).optional(),
});
