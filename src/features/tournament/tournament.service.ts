import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const TournamentService = {
  getById: async (id: string) => {
    const { data } = await axios.get(`${BASE_URL}/tournaments/${id}`);
    return data;
  },

  getMatches: async (id: string) => {
    const { data } = await axios.get(`${BASE_URL}/matches?tournament_id=${id}`);
    return Array.isArray(data) ? data : [];
  },

  getPlayers: async (id: string) => {
    const { data } = await axios.get(`${BASE_URL}/players?tournament_id=${id}`);
    return Array.isArray(data) ? data : [];
  },

  getPlayerHistory: async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/players/history`);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  addPlayer: async (payload: { first_name: string; last_name: string; country: string; tournament_id: number }) => {
    const { data } = await axios.post(`${BASE_URL}/players`, payload);
    return data;
  },

  deletePlayer: async (playerId: number) => {
    await axios.delete(`${BASE_URL}/players/${playerId}`);
  },

  generateBracket: async (id: string) => {
    const { data } = await axios.post(`${BASE_URL}/tournaments/${id}/generate`);
    return data;
  },

  updateMatchScore: async (matchId: number, scores: { player1_score: number; player2_score: number }) => {
    const { data } = await axios.post(`${BASE_URL}/matches/${matchId}`, scores);
    return data;
  }
};
