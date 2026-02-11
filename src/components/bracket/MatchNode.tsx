import { Handle, Position } from '@xyflow/react';

export function MatchNode({ data }: { data: any }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden min-w-[180px] shadow-xl">
      {/* Giocatore 1 */}
      <div className={`px-3 py-2 flex justify-between items-center ${data.p1_win ? 'bg-emerald-900/30' : ''}`}>
        <span className="text-sm text-slate-200">{data.player1 || 'TBD'}</span>
        <span className="text-sm font-bold text-tennis-green">{data.score1}</span>
      </div>
      <div className="h-[1px] bg-slate-700" />
      {/* Giocatore 2 */}
      <div className={`px-3 py-2 flex justify-between items-center ${data.p2_win ? 'bg-emerald-900/30' : ''}`}>
        <span className="text-sm text-slate-200">{data.player2 || 'TBD'}</span>
        <span className="text-sm font-bold text-tennis-green">{data.score2}</span>
      </div>

      {/* Punti di connessione per le linee */}
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-500" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-tennis-green" />
    </div>
  );
}