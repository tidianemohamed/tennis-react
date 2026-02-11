import { tournamentApi } from "../../lib/api"
import { useMutation } from "@tanstack/react-query"
import { Loader2, PlusIcon, RefreshCcw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from 'motion/react'
import type { Tournament } from "../../lib/types"

const TournamentCreateButton = () => {
    const navigate = useNavigate();

    const mutation = useMutation<Tournament, unknown, { name: string; max_players: number }>({
        mutationFn: (data: { name: string; max_players: number }) => tournamentApi.create(data),
        onSuccess: (newTournament: Tournament) => {
            navigate(`/bracket/${newTournament.id}`);
        },
        onError: (error: unknown) => {
            console.error("Errore creazione torneo:", error);
        }
    })

    const isDisabled = mutation.isPending;

    return (
        <motion.button 
            disabled={isDisabled}
            layout
            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isDisabled ? 1 : 0.98 }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 overflow-hidden shadow-lg"
            style={{ borderRadius: 8 }}
            onClick={() => mutation.mutate({
                name: 'Nuovo Torneo Open',
                max_players: 8
            })}
        >
            <AnimatePresence mode="popLayout">
                {mutation.isPending && (
                    <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2 } }}
                        exit={{ opacity: 0 }}
                    >
                        <Loader2 className="animate-spin" size={18} />
                    </motion.span>
                )}
                {mutation.isError && (
                    <motion.span
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2 } }}
                        exit={{ opacity: 0 }}
                    >
                        <RefreshCcw size={18} className="text-red-400" />
                    </motion.span>
                )}
                {!mutation.isPending && !mutation.isError && (
                    <motion.span
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2 } }}
                        exit={{ opacity: 0 }}
                    >
                        <PlusIcon size={18} className="text-tennis-green" />
                    </motion.span>
                )}
            </AnimatePresence>
            <span>Nuovo Torneo</span>
        </motion.button>
    )
}

export default TournamentCreateButton