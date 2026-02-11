

export interface Tournament {
  id: number;
  name: string;
  status: 'draft' | 'in_progress' | 'completed';
  date?: string;      
  location?: string;
  max_players: number;
  winner_player_id?: number;
}

export interface Match {
  id: number;
  tournament_id: number;
  round_name: string;
  player1_id: number | null;
  player2_id: number | null;
  player1_score: number;
  player2_score: number;
  status: 'pending' | 'completed';
  player1_name?: string;
  player2_name?: string;
}