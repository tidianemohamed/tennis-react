import { z } from 'zod';

export const tournamentSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Nome torneo richiesto'),
  status: z.enum(['draft', 'in_progress', 'completed']),
  date: z.string().optional(),
  location: z.string().optional(),
  max_players: z.number().default(8),
  winner_player_id: z.number().optional()
});

export const matchSchema = z.object({
  id: z.number(),
  tournament_id: z.number(),
  round_name: z.string().optional(),
  round: z.string().optional(),
  player1_id: z.number().nullable(),
  player2_id: z.number().nullable(),
  player1_score: z.number(),
  player2_score: z.number(),
  status: z.enum(['pending', 'completed']),
  player1: z.string().optional(),
  player2: z.string().optional(),
  p1_country: z.string().optional(),
  p2_country: z.string().optional(),
  winner_id: z.number().optional()
});

export const createTournamentSchema = tournamentSchema.omit({ id: true, status: true });

export type Tournament = z.infer<typeof tournamentSchema>;
export type Match = z.infer<typeof matchSchema>;
export type CreateTournament = z.infer<typeof createTournamentSchema>;
