import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MatchNode } from './MatchNode';
import type { Match } from '../../lib/types';

const nodeTypes = { match: MatchNode };

export default function BracketFlow({ matches }: { matches: Match[] }) {
  
  // Creazione dei NODI (i rettangoli dei match)
  const nodes = matches.map((match, index) => {
    let x = 0;
    let y = 0;

    // Posizionamento orizzontale per round
    if (match.round_name.toLowerCase().includes('quart')) x = 50;
    else if (match.round_name.toLowerCase().includes('semi')) x = 350;
    else if (match.round_name.toLowerCase().includes('final')) x = 650;

    // Posizionamento verticale (distribuzione base)
    // Usiamo l'indice per distanziarli (0, 1, 2, 3...)
    y = (index % 4) * 160 + 50; 
    
    // Correzione per centrare semi e finale rispetto ai quarti
    if (x === 350) y = (index % 2) * 320 + 130;
    if (x === 650) y = 290;

    return {
      id: match.id.toString(),
      type: 'match',
      position: { x, y },
      data: {
        player1_name: match.player1_name || 'TBD',
        player2_name: match.player2_name || 'TBD',
        player1_score: match.player1_score,
        player2_score: match.player2_score,
      },
    };
  });

  // Creazione delle LINEE (Edges)
  // Qui creiamo i collegamenti basandoci sulla logica del torneo
  const edges = [
    // Collegamenti Quarti -> Semifinali
    { id: 'e1-5', source: '1', target: '5', type: 'smoothstep', animated: true },
    { id: 'e2-5', source: '2', target: '5', type: 'smoothstep', animated: true },
    { id: 'e3-6', source: '3', target: '6', type: 'smoothstep', animated: true },
    { id: 'e4-6', source: '4', target: '6', type: 'smoothstep', animated: true },
    // Collegamenti Semifinali -> Finale
    { id: 'e5-7', source: '5', target: '7', type: 'smoothstep', animated: true },
    { id: 'e6-7', source: '6', target: '7', type: 'smoothstep', animated: true },
  ];

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