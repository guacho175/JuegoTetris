import React from 'react';
import { GameState, RankingEntry } from '../types';
import { DIFFICULTIES } from '../constants';
import { Trophy, Play, Pause, RotateCcw, Keyboard } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  gameState: GameState;
  nextPiece: any;
  ranking: RankingEntry[];
  onReset: () => void;
  onTogglePause: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  gameState, nextPiece, ranking, onReset, onTogglePause 
}) => {
  return (
    <div className="w-64 flex flex-col gap-6 text-slate-200">
      {/* Next Piece */}
      <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl backdrop-blur-sm">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          Siguiente
        </h3>
        <div className="flex justify-center items-center h-20">
          <div className="grid grid-cols-4 grid-rows-4 gap-1">
            {nextPiece.shape.map((row: any, y: number) => 
              row.map((cell: any, x: number) => (
                <div 
                  key={`${x}-${y}`} 
                  className="w-4 h-4 rounded-sm"
                  style={{ 
                    backgroundColor: cell ? nextPiece.color : 'transparent',
                    boxShadow: cell ? `0 0 10px ${nextPiece.color}` : 'none'
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl backdrop-blur-sm space-y-4">
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-slate-500">Puntaje</label>
          <p className="text-3xl font-black text-white tabular-nums">{gameState.score}</p>
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-slate-500">Líneas</label>
          <p className="text-xl font-bold text-slate-300 tabular-nums">{gameState.lines}</p>
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-slate-500">Dificultad</label>
          <p className="text-sm font-medium text-cyan-400">{DIFFICULTIES[gameState.difficulty].name}</p>
        </div>
      </div>

      {/* Ranking */}
      <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl backdrop-blur-sm flex-1 overflow-hidden flex flex-col">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Trophy size={14} className="text-yellow-500" /> Ranking Top 10
        </h3>
        <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-1">
          {ranking.length === 0 ? (
            <p className="text-xs text-slate-600 italic">No hay récords aún</p>
          ) : (
            ranking.map((entry, i) => (
              <div key={i} className="flex justify-between items-center text-xs group">
                <span className="text-slate-500 w-4">{i + 1}.</span>
                <span className="flex-1 truncate font-medium text-slate-300 group-hover:text-white transition-colors">{entry.name}</span>
                <span className="font-mono text-cyan-500">{entry.score}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Controls Help */}
      <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl backdrop-blur-sm">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <Keyboard size={14} /> Controles
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400 uppercase font-mono">
          <span>Flechas</span> <span>Mover</span>
          <span>Arriba</span> <span>Rotar</span>
          <span>Espacio</span> <span>Hard Drop</span>
          <span>P</span> <span>Pausa</span>
          <span>R</span> <span>Reiniciar</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={onTogglePause}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all active:scale-95"
          title={gameState.paused ? 'Reanudar' : 'Pausar'}
        >
          {gameState.paused ? <Play size={20} /> : <Pause size={20} />}
        </button>
        <button 
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 p-3 rounded-xl transition-all active:scale-95"
          title="Reiniciar"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};
