import { useState, useEffect } from "react";
import { playerApi } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus, X, RefreshCcw } from "lucide-react";
import { AnimatePresence, motion } from 'motion/react';

interface HistoryPlayer {
    first_name: string;
    last_name: string;
    country: string;
}

const PlayerCreateButton = ({ tournamentId }: { tournamentId: number }) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<HistoryPlayer[]>([]);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        country: 'IT'
    });

    // Usiamo playerApi.getHistory() invece di axios.get diretto
    useEffect(() => {
        if (isOpen) {
            playerApi.getHistory()
                .then(data => setHistory(data))
                .catch(err => console.error("Errore cronologia", err));
        }
    }, [isOpen]);

    const { mutate, isPending, isError } = useMutation({
        // Assicuriamoci di passare i campi separati come si aspetta il nuovo Controller
        mutationFn: (data: typeof formData) => playerApi.create({ 
            ...data, 
            tournament_id: tournamentId 
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
            setIsOpen(false);
            setFormData({ first_name: '', last_name: '', country: 'IT' });
        },
        onError: (error: any) => {
            console.error("Errore durante la creazione:", error.response?.data?.message || error);
        }
    });

    const handleFirstNameChange = (val: string) => {
        setFormData({ ...formData, first_name: val });
        // Cerchiamo nella storia se il nome corrisponde esattamente
        const existing = history.find(p => p.first_name.toLowerCase() === val.toLowerCase());
        if (existing) {
            setFormData({
                first_name: existing.first_name,
                last_name: existing.last_name,
                country: existing.country
            });
        }
    };

    return (
        <div className="relative">
            <motion.button 
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition shadow-lg"
            >
                <UserPlus size={18} className="text-tennis-green" />
                <span>{isOpen ? "Annulla" : "Aggiungi Giocatore"}</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-12 right-0 w-80 bg-white border border-slate-200 shadow-2xl rounded-xl p-5 z-50 text-slate-800"
                    >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Iscrivi Giocatore</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Nome</label>
                            <input 
                                list="history-names"
                                placeholder="Esempio: Roger"
                                className="w-full border border-slate-300 p-2 rounded-md focus:ring-2 focus:ring-tennis-green outline-none"
                                value={formData.first_name}
                                onChange={(e) => handleFirstNameChange(e.target.value)}
                            />
                            <datalist id="history-names">
                                {history.map((p, i) => (
                                    <option key={i} value={p.first_name}>{p.last_name} ({p.country})</option>
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Cognome</label>
                            <input 
                                placeholder="Esempio: Federer"
                                className="w-full border border-slate-300 p-2 rounded-md focus:ring-2 focus:ring-tennis-green outline-none"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Nazione (ISO)</label>
                            <input 
                                placeholder="IT, FR, US..."
                                className="w-full border border-slate-300 p-2 rounded-md focus:ring-2 focus:ring-tennis-green outline-none"
                                value={formData.country}
                                onChange={(e) => setFormData({...formData, country: e.target.value.toUpperCase().slice(0, 2)})}
                            />
                        </div>

                        <motion.button 
                            disabled={isPending || !formData.first_name || !formData.last_name}
                            onClick={() => mutate(formData)}
                            whileHover={{ scale: isPending ? 1 : 1.02 }}
                            whileTap={{ scale: isPending ? 1 : 0.98 }}
                            className="w-full bg-tennis-green text-slate-900 font-bold py-2.5 rounded-md hover:brightness-110 transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <AnimatePresence mode="wait">
                                {isPending && (
                                    <motion.span
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { delay: 0.1 } }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 className="animate-spin" size={20} />
                                        Iscrizione...
                                    </motion.span>
                                )}
                                {isError && (
                                    <motion.span
                                        key="error"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { delay: 0.1 } }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <RefreshCcw size={20} />
                                        Riprova
                                    </motion.span>
                                )}
                                {!isPending && !isError && (
                                    <motion.span
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { delay: 0.1 } }}
                                        exit={{ opacity: 0 }}
                                    >
                                        Conferma Iscrizione
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayerCreateButton;