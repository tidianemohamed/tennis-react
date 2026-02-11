import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Plus, Star, Activity, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface Tournament {
  id: number;
  name: string;
  date: string;
  location: string;
  status: string;
  winner_name?: string;
}

export default function Dashboard() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [formData, setFormData] = useState({ name: '', date: '', location: '' });
  const [loading, setLoading] = useState(true);
  
  // STATO PER LE TABS
  const [activeTab, setActiveTab] = useState<'attivi' | 'conclusi'>('attivi');

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/tournaments');
      setTournaments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/tournaments', formData);
      setFormData({ name: '', date: '', location: '' }); 
      loadTournaments(); 
    } catch (err) {
      alert("Errore nella creazione del torneo");
    }
  };

  // LOGICA DI FILTRAGGIO
  const filteredTournaments = tournaments.filter(t => {
    if (activeTab === 'attivi') return t.status !== 'completed';
    return t.status === 'completed';
  });

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* HEADER CON LINK ANAGRAFICA */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-green-500">Pro Bracket</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Tournament Manager</p>
        </div>
        
      </div>

      {/* 1. SEZIONE CREAZIONE */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trophy size={120} />
        </div>
        <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-green-400 uppercase tracking-widest relative z-10">
          <Plus size={24} strokeWidth={3} /> Crea Nuovo Torneo
        </h2>
        
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative z-10">
          <div className="space-y-2">
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-black">Nome Torneo</label>
            <input 
              type="text" placeholder="Es: Roland Garros" required
              value={formData.name}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-green-400 outline-none transition-all"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-black">Data Inizio</label>
            <input 
              type="date" required
              value={formData.date}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-green-400 outline-none transition-all"
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-black">Località</label>
            <input 
              type="text" placeholder="Es: Parigi" required
              value={formData.location}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-green-400 outline-none transition-all"
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="bg-green-500 text-slate-950 font-black py-3 px-6 rounded-xl hover:bg-green-400 transition-all uppercase text-sm"
          >
            Genera Torneo
          </button>
        </form>
      </div>

      {/* 2. TABS NAVIGATION (TAILWIND STYLE) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">I Miei Tornei</h2>
        
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab('attivi')}
            className={`flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'attivi' 
              ? 'bg-green-500 text-slate-950 shadow-lg' 
              : 'text-slate-500 hover:text-white'
            }`}
          >
            <Activity size={16} /> Attivi
          </button>
          <button
            onClick={() => setActiveTab('conclusi')}
            className={`flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'conclusi' 
              ? 'bg-amber-500 text-slate-950 shadow-lg' 
              : 'text-slate-500 hover:text-white'
            }`}
          >
            <CheckCircle2 size={16} /> Conclusi
          </button>
        </div>
      </div>

      {/* 3. GRIGLIA TORNEI FILTRATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((t) => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all shadow-lg group relative overflow-hidden">
              
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl ${activeTab === 'attivi' ? 'bg-green-400/10 text-green-400' : 'bg-amber-400/10 text-amber-400'}`}>
                  <Trophy size={24} />
                </div>
                {activeTab === 'attivi' && (
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-green-400 transition-colors uppercase italic tracking-tight">
                {t.name || 'Senza Nome'}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <Calendar size={16} className="text-slate-600" />
                  <span>{t.date || 'TBD'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <MapPin size={16} className="text-slate-600" />
                  <span>{t.location || 'N/A'}</span>
                </div>
              </div>

              {/* Box Vincitore Tornei Conclusi */}
              {activeTab === 'conclusi' && (
                <div className="flex items-center gap-3 text-amber-500 text-xs font-black mb-6 bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 uppercase tracking-widest">
                  <Star size={14} fill="currentColor" />
                  <span>Vincitore: {t.winner_name || 'TBD'}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Link 
                  to={`/bracket/${t.id}`}
                  className={`w-full text-center font-black py-4 rounded-xl transition-all text-[10px] uppercase tracking-[0.2em] border shadow-sm ${
                    activeTab === 'attivi' 
                    ? 'bg-slate-800 hover:bg-green-500 hover:text-slate-950 text-white border-slate-700' 
                    : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white border-slate-700'
                  }`}
                >
                  Gestisci Tabellone
                </Link>
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <Trophy size={48} className="mx-auto text-slate-800 mb-4 opacity-20" />
            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs">Nessun torneo {activeTab}</p>
          </div>
        )}
      </div>
    </div>
  );
}