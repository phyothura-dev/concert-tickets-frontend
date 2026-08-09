import { z } from "zod";

export function envelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    status: z.literal("success").optional(),
    message: z.string(),
    data: dataSchema,
  });
}

export const deletedResultSchema = z.object({
  deleted: z.literal(true),
});
