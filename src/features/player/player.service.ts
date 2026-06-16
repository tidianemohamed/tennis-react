import axios from 'axios';

const BASE_URL = 'https://tennis-php-production.up.railway.app/api';

export const PlayerService = {


  getByTournament: async (tournamentId: number) => {
    const { data } = await axios.get(`${BASE_URL}/players?tournament_id=${tournamentId}`);
    return Array.isArray(data) ? data : [];
  },

  getHistory: async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/players/history`);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  create: async (payload: { first_name: string; last_name: string; country: string; tournament_id: number }) => {
    const { data } = await axios.post(`${BASE_URL}/players`, payload);
    return data;
  },

  delete: async (playerId: number) => {
    await axios.delete(`${BASE_URL}/players/${playerId}`);
  }
};
