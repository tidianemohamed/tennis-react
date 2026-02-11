import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { tournamentApi } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewTournamentModal({ isOpen, onClose, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('8');

  const mutation = useMutation({
    mutationFn: (data: { name: string; max_players: number }) => 
      tournamentApi.create({ ...data, status: 'draft' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      onSuccess();
      onClose();
      setName('');
      setMaxPlayers('8');
    },
    onError: (error: unknown) => {
      console.error("Errore durante la creazione:", error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      max_players: parseInt(maxPlayers)
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl"
          >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Crea Nuovo Torneo</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nome Torneo</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-tennis-green"
              placeholder="es. Open Roma 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Numero Giocatori</label>
            <select 
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-tennis-green"
            >
              <option value="4">4 Giocatori</option>
              <option value="8">8 Giocatori</option>
              <option value="16">16 Giocatori</option>
            </select>
          </div>

          <motion.button 
            type="submit" 
            disabled={mutation.isPending}
            whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
            whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
            className="w-full bg-tennis-green text-slate-950 font-bold py-3 rounded-lg hover:bg-green-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <AnimatePresence mode="wait">
              {mutation.isPending ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="animate-spin" size={20} />
                  Creazione in corso...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Crea Torneo
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}