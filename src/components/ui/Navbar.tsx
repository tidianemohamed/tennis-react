import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isPlayers = location.pathname === '/players';

  return (
    <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 backdrop-blur-lg bg-slate-900/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-green-400 font-bold text-xl group">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Trophy size={24} className="text-green-400" />
          </motion.div>
          <span className="text-white tracking-tight group-hover:text-green-400 transition">TennisManager</span>
        </Link>

        {/* BOTTONI AZIONE */}
        <div className="flex items-center gap-3">
          
          {/* Link alla Dashboard */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition text-sm border shadow-lg relative overflow-hidden ${
                isHome 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              }`}
            >
              {isHome && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-slate-700"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Home size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </span>
            </motion.div>
          </Link>

          {/* Link ai Giocatori */}
          <Link to="/players">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition text-sm border shadow-lg relative overflow-hidden ${
                isPlayers
                  ? 'bg-green-600 border-green-500 text-white shadow-green-500/30'
                  : 'bg-green-600 hover:bg-green-500 text-white border-green-500 shadow-green-500/20'
              }`}
            >
              {isPlayers && (
                <motion.div
                  layoutId="activeTabPlayers"
                  className="absolute inset-0 bg-green-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Users size={18} />
                <span className="hidden sm:inline">Giocatori</span>
              </span>
            </motion.div>
          </Link>

        </div>
      </div>
    </nav>
  );
}