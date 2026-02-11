import { z } from 'zod';

export const playerSchema = z.object({
  id: z.number(),
  first_name: z.string().min(1, 'Nome richiesto'),
  last_name: z.string(),
  country: z.string().length(2, 'Codice nazione a 2 caratteri'),
  tournament_id: z.number().optional()
});

export const createPlayerSchema = playerSchema.omit({ id: true });

export type Player = z.infer<typeof playerSchema>;
export type CreatePlayer = z.infer<typeof createPlayerSchema>;
