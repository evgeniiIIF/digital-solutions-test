import { z } from 'zod';

export const getItemsFilterSchema = z.object({
  min: z.coerce.number().int().positive().nullable().default(null),
  max: z.coerce.number().int().positive().nullable().default(null),
  cursor: z.coerce.number().int().min(0).default(0),
});

export type GetItemsFilterDto = z.infer<typeof getItemsFilterSchema>;
