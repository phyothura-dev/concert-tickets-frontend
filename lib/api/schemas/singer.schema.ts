import { z } from "zod";

// Placeholders for future singer schema implementation
export const singerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createSingerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
});
