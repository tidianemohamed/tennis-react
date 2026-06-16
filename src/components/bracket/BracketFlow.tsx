import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MatchNode } from './MatchNode';
import type { Match } from '../../lib/types';

const nodeTypes = { match: MatchNode };

export default function BracketFlow({ matches }: { matches: Match[] }) {
  
  // 1. ORDINAMENTO E CREAZIONE DEI NODI
  // Ordiniamo i match in modo da posizionarli correttamente
  const nodes = matches.map((match, index) => {
    let x = 0;
    let y = 0;

    const round = match.round_name.toLowerCase();

    // Posizionamento orizzontale basato sulla fase del torneo
    if (round.includes('quart')) x = 50;
    else if (round.includes('semi')) x = 350;
    else if (round.includes('final')) x = 650;

    // Posizionamento verticale iniziale (distribuzione base)
    y = (index % 4) * 160 + 50; 
    
    // Correzione per centrare perfettamente semifinali e finale rispetto ai quarti
    if (x === 350) y = (index % 2) * 320 + 130;
    if (x === 650) y = 290;

    return {
      id: match.id.toString(),
      type: 'match',
      position: { x, y },
      data: {
        id: match.id, // ✅ Passiamo l'ID reale per consentire il salvataggio dei punteggi
        player1_name: match.player1_name || 'TBD',
        player2_name: match.player2_name || 'TBD',
        player1_score: match.player1_score,
        player2_score: match.player2_score,
      },
    };
  });

  // 2. GENERAZIONE AUTOMATICA DELLE LINEE (EDGES) DINAMICHE
  const edges: any[] = [];

  // Separiamo i nodi per colonne (asse X) per capire come collegarli
  const quarti = nodes.filter(n => n.position.x === 50).sort((a, b) => a.position.y - b.position.y);
  const semi = nodes.filter(n => n.position.x === 350).sort((a, b) => a.position.y - b.position.y);
  const finale = nodes.filter(n => n.position.x === 650);

  // Collega i Quarti alle Semifinali (I primi due vanno alla prima semi, gli altri due alla seconda)
  if (quarti.length === 4 && semi.length === 2) {
    edges.push(
      { id: `e-${quarti[0].id}-${semi[0].id}`, source: quarti[0].id, target: semi[0].id, type: 'smoothstep', animated: true },
      { id: `e-${quarti[1].id}-${semi[0].id}`, source: quarti[1].id, target: semi[0].id, type: 'smoothstep', animated: true },
      { id: `e-${quarti[2].id}-${semi[1].id}`, source: quarti[2].id, target: semi[1].id, type: 'smoothstep', animated: true },
      { id: `e-${quarti[3].id}-${semi[1].id}`, source: quarti[3].id, target: semi[1].id, type: 'smoothstep', animated: true }
    );
  }

  // Collega le Semifinali alla Finale
  if (semi.length === 2 && finale.length === 1) {
    edges.push(
      { id: `e-${semi[0].id}-${finale[0].id}`, source: semi[0].id, target: finale[0].id, type: 'smoothstep', animated: true },
      { id: `e-${semi[1].id}-${finale[0].id}`, source: semi[1].id, target: finale[0].id, type: 'smoothstep', animated: true }
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#1e293b" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}