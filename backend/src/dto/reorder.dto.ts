import { z } from 'zod';

export const reorderSchema = z.object({
  order: z.array(z.number().int().positive()),
});
