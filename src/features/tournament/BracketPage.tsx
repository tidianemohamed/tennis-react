import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Check, UserPlus, Trophy, Loader2, RefreshCcw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { TournamentService } from './tournament.service';

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  country: string;
  tournament_id?: number;
}

interface Match {
  id: number;
  tournament_id: number;
  round_name?: string;
  round?: string;
  player1_id: number | null;
  player2_id: number | null;
  player1_score: number;
  player2_score: number;
  status: 'pending' | 'completed';
  player1?: string;
  player2?: string;
  p1_country?: string;
  p2_country?: string;
  winner_id?: number;
}

interface Tournament {
  id: number;
  name: string;
  status: string;
} 

export default function BracketPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const [newPlayer, setNewPlayer] = useState({ firstName: '', lastName: '', country: 'IT' });
  const [scores, setScores] = useState<Record<number, { p1: number, p2: number }>>({});
  

  // Query per caricare i dati del torneo
  const { isPending: tournamentPending, isError: tournamentError, data: tournament } = useQuery<Tournament>({
    queryKey: ['tournament', id],
    queryFn: () => TournamentService.getById(id!),
    enabled: !!id
  });

  // Query per i match
  const { isPending: matchesPending, data: matches = [] } = useQuery<Match[]>({
    queryKey: ['matches', id],
    queryFn: () => TournamentService.getMatches(id!),
    enabled: !!id
  });

  // Query per i giocatori iscritti
  const { isPending: playersPending, data: players = [] } = useQuery<Player[]>({
    queryKey: ['players', id],
    queryFn: () => TournamentService.getPlayers(id!),
    enabled: !!id
  });

  // Query per l'anagrafica globale
  const { data: playerHistory = [] } = useQuery<Player[]>({
    queryKey: ['playerHistory'],
    queryFn: TournamentService.getPlayerHistory
  });

  const isLoading = tournamentPending || matchesPending || playersPending;
  const isError = tournamentError;

  // Mutations
  const addPlayerMutation = useMutation({
    mutationFn: (payload: { first_name: string; last_name: string; country: string; tournament_id: number }) =>
      TournamentService.addPlayer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', id] });
      setNewPlayer({ firstName: '', lastName: '', country: 'IT' });
    }
  });

  const deletePlayerMutation = useMutation({
    mutationFn: (playerId: number) => TournamentService.deletePlayer(playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', id] });
    }
  });

  const generateBracketMutation = useMutation({
    mutationFn: () => TournamentService.generateBracket(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', id] });
    }
  });

  const updateScoreMutation = useMutation({
    mutationFn: ({ matchId, scores }: { matchId: number; scores: { player1_score: number; player2_score: number } }) =>
      TournamentService.updateMatchScore(matchId, scores),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', id] });
    }
  });

  /**
   * HELPER: FLAGS
   * Restituisce l'emoji della bandiera in base al codice nazione
   */
  const getFlag = (code: string) => {
    const flags: any = { 
        IT: '🇮🇹', FR: '🇫🇷', ES: '🇪🇸', US: '🇺🇸', 
        RS: '🇷🇸', CH: '🇨🇭', GB: '🇬🇧', DE: '🇩🇪' 
    };
    return flags[code?.toUpperCase()] || '🏳️';
  };

  /**
   * GESTIONE AUTO-COMPILAZIONE
   */
  const handleSelectChange = (fullName: string) => {
    if (!fullName) {
      setNewPlayer({ firstName: '', lastName: '', country: 'IT' });
      return;
    }
    const existing = playerHistory.find((p: Player) => `${p.first_name} ${p.last_name || ''}`.trim() === fullName);
    if (existing) {
      setNewPlayer({ 
        firstName: existing.first_name, 
        lastName: existing.last_name || '', 
        country: existing.country || 'IT' 
      });
    }
  };

  /**
   * AZIONI
   */
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length >= 8 || !newPlayer.firstName) return;
    await addPlayerMutation.mutateAsync({
      first_name: newPlayer.firstName,
      last_name: newPlayer.lastName,
      country: newPlayer.country,
      tournament_id: parseInt(id!)
    });
  };

  const handleDeletePlayer = async (pId: number) => {
    try {
      await deletePlayerMutation.mutateAsync(pId);
    } catch (err: any) {
      console.error("Errore eliminazione:", err.response?.data?.error);
    }
  };

  const handleSaveScore = async (matchId: number) => {
    await updateScoreMutation.mutateAsync({
      matchId,
      scores: {
        player1_score: scores[matchId].p1,
        player2_score: scores[matchId].p2
      }
    });
  };

  const handleGenerateBracket = async () => {
    await generateBracketMutation.mutateAsync();
  };

  const availableOptions = playerHistory.filter((h: Player) => 
    !players.some((p: Player) => p.first_name === h.first_name && p.last_name === h.last_name)
  );

  const roundConfigs = [
    { label: "Quarti di Finale", key: "Quart" },
    { label: "Semifinali", key: "Semi" },
    { label: "Finale", key: "Final" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      
      {/* NAVIGATION HEADER */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-green-400 hover:text-green-300 font-bold uppercase text-xs transition-colors">
          <ArrowLeft size={18}/> Dashboard
        </Link>
        <div className="text-right">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 justify-end"
              >
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm text-slate-400">Caricamento...</span>
              </motion.div>
            )}
            {isError && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-red-400"
              >
                <RefreshCcw size={18} />
                <span className="text-sm">Errore caricamento</span>
              </motion.div>
            )}
            {!isLoading && !isError && tournament && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">{tournament.name}</h1>
                <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Official Bracket</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <Loader2 className="animate-spin text-green-400" size={48} />
          </motion.div>
        )}
        {!isLoading && !isError && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto space-y-10"
          >
        
        {/* BLOCCO 1: ISCRIZIONE */}
        {matches.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl"
          >
            <h2 className="text-xl font-bold text-slate-400 uppercase italic mb-6">Entry List ({players.length}/8)</h2>
            
            {/* Form iscrizione */}
            <form onSubmit={handleAddPlayer} className="flex gap-3 mb-8">
              <select 
                required
                className="flex-1 bg-slate-800 p-3 h-[52px] rounded-lg border border-slate-700 outline-none focus:border-green-400 text-white cursor-pointer transition-all"
                value={newPlayer.firstName ? `${newPlayer.firstName} ${newPlayer.lastName}`.trim() : ""}
                onChange={(e) => handleSelectChange(e.target.value)}
                disabled={players.length >= 8 || addPlayerMutation.isPending}
              >
                <option value="">-- Seleziona Giocatore dall'Anagrafica --</option>
                {availableOptions.map((p: Player, i: number) => (
                  <option key={i} value={`${p.first_name} ${p.last_name || ''}`.trim()}>
                    {p.first_name} {p.last_name} ({p.country})
                  </option>
                ))}
              </select>

              <motion.button 
                type="submit" 
                disabled={players.length >= 8 || !newPlayer.firstName || addPlayerMutation.isPending}
                whileHover={{ scale: players.length < 8 && newPlayer.firstName ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`w-[150px] h-[52px] font-black rounded-lg transition-all uppercase flex items-center justify-center gap-2 ${
                  players.length >= 8 || !newPlayer.firstName || addPlayerMutation.isPending
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-green-500 text-slate-950 hover:bg-green-400 shadow-lg shadow-green-500/20'
                }`}
              >
                {addPlayerMutation.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <UserPlus size={18} /> Iscrivi
                  </>
                )}
              </motion.button>
            </form>

            {/* Lista iscritti */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {players.map((p: Player) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                    className="bg-slate-800/30 p-4 rounded-xl flex items-center justify-between border border-slate-800 group transition-all hover:border-slate-600"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl drop-shadow-sm">{getFlag(p.country)}</span>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-none">{p.country}</p>
                        <p className="font-bold text-slate-200">{p.first_name} <span className="uppercase">{p.last_name}</span></p>
                      </div>
                    </div>
                    <motion.button 
                      onClick={() => handleDeletePlayer(p.id)} 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                      disabled={deletePlayerMutation.isPending}
                    >
                      {deletePlayerMutation.isPending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16}/>
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottone genera tabellone */}
            <AnimatePresence>
              {players.length === 8 && (
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={handleGenerateBracket}
                  disabled={generateBracketMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 w-full bg-indigo-600 p-5 rounded-2xl font-black text-white hover:bg-indigo-500 shadow-xl uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                >
                  {generateBracketMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generazione...
                    </>
                  ) : (
                    <>
                      <Trophy size={20}/> Genera Tabellone
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

       {/* BLOCCO 2: TABELLONE */}
{matches.length > 0 && roundConfigs.map((round, roundIndex) => {
  // FILTRO INTELLIGENTE: Evita che "Semifinale" appaia dentro "Finale"
  const roundMatches = matches.filter((m: Match) => {
    const name = (m.round_name || m.round || "").toLowerCase();
    const key = round.key.toLowerCase();
    
    if (key === 'final') {
      // Prende solo la finale vera (esclude le semi)
      return name === 'finale' || (name.includes('final') && !name.includes('semi'));
    }
    return name.includes(key);
  });

  if (roundMatches.length === 0) return null;
  
  return (
    <motion.div 
      key={round.key}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: roundIndex * 0.1 }}
      className="space-y-4"
    >
      <h2 className="text-green-500 font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
        <span className="w-8 h-[1px] bg-green-500"></span> {round.label}
      </h2>
      
      {/* Se è la finale, usiamo grid-cols-1 per centrarla, altrimenti md:grid-cols-2 */}
      <div className={`grid grid-cols-1 ${round.key === 'Final' ? 'md:grid-cols-1 max-w-md mx-auto' : 'md:grid-cols-2'} gap-4`}>
        <AnimatePresence mode="popLayout">
          {roundMatches.map((match: Match, matchIndex: number) => (
            <motion.div 
              key={match.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: matchIndex * 0.05 }}
              layout
              className={`bg-slate-900 border ${match.round_name?.toLowerCase().includes('final') && !match.round_name?.toLowerCase().includes('semi') ? 'border-yellow-500/50' : 'border-slate-800'} rounded-2xl overflow-hidden shadow-2xl hover:border-slate-700 transition-all`}
            >
              <div className="p-4 space-y-3">
                {/* Giocatore 1 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-2xl">{getFlag(match.p1_country || '')}</span>
                    <span className={`font-bold truncate ${match.winner_id === match.player1_id && match.status === 'completed' ? 'text-green-400' : 'text-slate-300'}`}>
                      {match.player1 || 'TBD'}
                    </span>
                  </div>
                  <input 
                    type="number" 
                    className="w-12 bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-black outline-none focus:border-green-500 transition-all" 
                    value={match.status === 'completed' ? match.player1_score : (scores[match.id]?.p1 ?? 0)} 
                    onChange={(e) => setScores({...scores, [match.id]: {...scores[match.id], p1: parseInt(e.target.value) || 0}})} 
                    disabled={match.status === 'completed'} 
                  />
                </div>

                {/* Giocatore 2 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-2xl">{getFlag(match.p2_country || '')}</span>
                    <span className={`font-bold truncate ${match.winner_id === match.player2_id && match.status === 'completed' ? 'text-green-400' : 'text-slate-300'}`}>
                      {match.player2 || 'TBD'}
                    </span>
                  </div>
                  <input 
                    type="number" 
                    className="w-12 bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-black outline-none focus:border-green-500 transition-all" 
                    value={match.status === 'completed' ? match.player2_score : (scores[match.id]?.p2 ?? 0)} 
                    onChange={(e) => setScores({...scores, [match.id]: {...scores[match.id], p2: parseInt(e.target.value) || 0}})} 
                    disabled={match.status === 'completed'} 
                  />
                </div>
              </div>

              {/* Bottone Conferma */}
              {(!match.status || match.status !== 'completed') && match.player1_id && match.player2_id && (
                <motion.button 
                  onClick={() => handleSaveScore(match.id)}
                  disabled={updateScoreMutation.isPending}
                  whileHover={{ backgroundColor: 'rgb(34 197 94)', color: 'rgb(2 6 23)' }}
                  className="w-full bg-slate-800 py-2 text-[10px] font-black uppercase border-t border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={14}/> Conferma Risultato
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
})}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}