import { z } from 'zod';

export const responseSchema = z.object({
  ok: z.boolean(),
  reason: z.string().optional(),
});

export type ResponseDto = z.infer<typeof responseSchema>;
