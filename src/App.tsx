import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import { Dashboard, BracketPage } from './features/tournament';
import { PlayersPage } from './features/player';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* La Navbar ora è fuori da Routes, quindi resta fissa in alto */}
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/bracket/:id" element={<BracketPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;