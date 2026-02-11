import axios from 'axios';

const api = axios.create({
  // Nota: Assicurati che la porta 8080 sia quella corretta del tuo server PHP
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const playerApi = {
  // Recupera i giocatori di un torneo specifico
  getByTournament: (tournamentId: number) => 
    api.get(`/players?tournament_id=${tournamentId}`).then(res => res.data),
  
  // NUOVO: Recupera la cronologia per il menu a tendina
  getHistory: () => 
    api.get('/players/history').then(res => res.data),
  
  // Crea un nuovo giocatore (ora riceve first_name, last_name, country)
  create: (data: { first_name: string; last_name: string; country: string; tournament_id: number }) => 
    api.post('/players', data).then(res => res.data),
};

export const tournamentApi = {
  getAll: () => api.get('/tournaments').then(res => res.data),
  getById: (id: number) => api.get(`/tournaments/${id}`).then(res => res.data),
  create: (data: any) => api.post('/tournaments', data).then(res => res.data),
  // NUOVO: Genera il tabellone
  generateBracket: (id: number) => 
    api.post(`/tournaments/${id}/generate`).then(res => res.data),
};

export const matchApi = {       
  getByTournament: (id: number) => api.get(`/matches?tournament_id=${id}`).then(res => res.data),
  // NUOVO: Salva il punteggio di un match
  updateScore: (matchId: number, data: { player1_score: number; player2_score: number }) => 
    api.put(`/matches/${matchId}`, data).then(res => res.data),
};

export default api;