import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserPlus, ArrowLeft, Trash2, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// URL base per le chiamate API verso il backend Go/Node
const BASE_URL = 'https://tennis-php-production.up.railway.app/api';

const PlayersPage = () => {
  // --- STATI (STATE MANAGEMENT) ---
  const [players, setPlayers] = useState([]); // Lista di tutti i giocatori
  const [newPlayer, setNewPlayer] = useState({ firstName: '', lastName: '', country: 'IT' }); // Stato per il form di creazione
  const [editingId, setEditingId] = useState<number | null>(null); // ID del giocatore che stiamo modificando (null se nessuno)
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', country: '' }); // Dati temporanei per la modifica
  
  // Stato fondamentale per la UX: memorizza l'ID del giocatore che ha dato errore durante l'eliminazione
  const [deleteErrorId, setDeleteErrorId] = useState<number | null>(null);
  
  const navigate = useNavigate(); // Hook per navigare tra le pagine della dashboard

  // --- LOGICA API (CRUD) ---

  // READ: Recupera la lista completa dei giocatori dall'anagrafica
  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/players/history`);
      setPlayers(res.data);
    } catch (err) { 
      console.error("Errore nel recupero giocatori:", err); 
    }
  };

  // Carica i dati al primo rendering del componente
  useEffect(() => { fetchPlayers(); }, []);

  // CREATE: Invia i dati del nuovo giocatore al backend
  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.firstName || !newPlayer.lastName) return; // Validazione minima
    try {
      await axios.post(`${BASE_URL}/players`, {
        first_name: newPlayer.firstName,
        last_name: newPlayer.lastName,
        country: newPlayer.country,
        tournament_id: null // Un nuovo giocatore nasce libero da tornei
      });
      setNewPlayer({ firstName: '', lastName: '', country: 'IT' }); // Reset form
      fetchPlayers(); // Refresh della lista
    } catch (err) { console.error("Errore creazione:", err); }
  };

  // DELETE: Rimuove un giocatore (senza alert invasivi)
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/players/${id}`);
      fetchPlayers();
      setDeleteErrorId(null);
    } catch (err: any) {
      // Se il backend restituisce errore (es. il giocatore è in un torneo), mostriamo il feedback rosso sulla card
      setDeleteErrorId(id);
      // Rimuove il messaggio rosso dopo 2 secondi automaticamente
      setTimeout(() => setDeleteErrorId(null), 2000);
    }
  };

  // UPDATE (Fase 1): Prepara il form di modifica con i dati attuali del giocatore
  const startEdit = (player: any) => {
    setEditingId(player.id);
    setEditForm({ first_name: player.first_name, last_name: player.last_name, country: player.country });
  };

  // UPDATE (Fase 2): Invia le modifiche effettive al database
  const handleUpdate = async (id: number) => {
    try {
      await axios.put(`${BASE_URL}/players/${id}`, editForm);
      setEditingId(null); // Esce dalla modalità modifica
      fetchPlayers();
    } catch (err) { console.error("Errore aggiornamento:", err); }
  };

  // HELPER: Gestione grafica delle bandiere
  const getFlag = (code: string) => {
    const flags: any = { IT: '🇮🇹', FR: '🇫🇷', ES: '🇪🇸', US: '🇺🇸', RS: '🇷🇸', CH: '🇨🇭', GB: '🇬🇧', DE: '🇩🇪' };
    return flags[code?.toUpperCase()] || '🏳️';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER AREA */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-green-500">Gestione Anagrafica</h1>
        </div>

        {/* FORM DI CREAZIONE GIOCATORE */}
        <form onSubmit={handleCreatePlayer} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-12 shadow-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
            <UserPlus size={14}/> Aggiungi nuovo profilo
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome</label>
              <input type="text" value={newPlayer.firstName} onChange={(e) => setNewPlayer({...newPlayer, firstName: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg focus:border-green-500 outline-none" placeholder="Es: Jannik" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cognome</label>
              <input type="text" value={newPlayer.lastName} onChange={(e) => setNewPlayer({...newPlayer, lastName: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg focus:border-green-500 outline-none" placeholder="Es: Sinner" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nazione</label>
              <select value={newPlayer.country} onChange={(e) => setNewPlayer({...newPlayer, country: e.target.value})} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg focus:border-green-500 outline-none">
                <option value="IT">ITALIA 🇮🇹</option>
                <option value="FR">FRANCIA 🇫🇷</option>
                <option value="ES">SPAGNA 🇪🇸</option>
                <option value="RS">SERBIA 🇷🇸</option>
                <option value="US">USA 🇺🇸</option>
                <option value="CH">SVIZZERA 🇨🇭</option>
              </select>
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-slate-950 px-6 py-3 rounded-lg font-black uppercase transition-all h-[52px]">
              Salva Giocatore
            </button>
          </div>
        </form>

        {/* GRIGLIA DEI GIOCATORI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((p: any) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-600 transition-colors shadow-lg relative overflow-hidden group">
              
              {/* OVERLAY DI ERRORE (Feedback silenzioso per tornei attivi) */}
              {deleteErrorId === p.id && (
                <div className="absolute inset-0 bg-red-600/90 z-20 flex flex-col items-center justify-center p-2 text-center animate-in fade-in duration-200">
                  <X size={24} className="mb-1" />
                  <p className="text-[10px] font-black uppercase leading-tight">Impossibile eliminare:<br/>Giocatore impegnato in un torneo</p>
                </div>
              )}

              {/* LOGICA DI RENDERING CONDIZIONALE: Modifica vs Visualizzazione */}
              {editingId === p.id ? (
                // --- VISTA EDITING ---
                <div className="space-y-3 animate-in fade-in duration-300">
                  <input type="text" value={editForm.first_name} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} className="w-full bg-slate-800 p-2 rounded border border-green-500 text-sm" />
                  <input type="text" value={editForm.last_name} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} className="w-full bg-slate-800 p-2 rounded border border-green-500 text-sm" />
                  <select value={editForm.country} onChange={(e) => setEditForm({...editForm, country: e.target.value})} className="w-full bg-slate-800 p-2 rounded border border-green-500 text-sm">
                    <option value="IT">IT</option><option value="FR">FR</option><option value="ES">ES</option><option value="RS">RS</option><option value="US">US</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(p.id)} className="flex-1 bg-green-600 p-2 rounded text-slate-950 font-bold"><Check size={16} className="mx-auto"/></button>
                    <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-700 p-2 rounded"><X size={16} className="mx-auto"/></button>
                  </div>
                </div>
              ) : (
                // --- VISTA NORMALE ---
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
                      {getFlag(p.country)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{p.first_name}</h3>
                      <p className="text-xl font-black uppercase text-slate-500 tracking-tighter leading-none">{p.last_name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => startEdit(p)} className="p-2 text-slate-500 hover:text-blue-400 transition-colors bg-slate-800/50 rounded-lg hover:bg-slate-800">
                      <Edit2 size={16}/>
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors bg-slate-800/50 rounded-lg hover:bg-slate-800"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayersPage;