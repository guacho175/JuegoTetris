import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Save, User, RotateCcw, Home } from 'lucide-react';
import { Difficulty } from '../types';
import { DIFFICULTIES } from '../constants';

interface GameOverModalProps {
  score: number;
  difficulty: Difficulty;
  isTop10: boolean;
  onSubmit: (name: string) => void;
  onRestart: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  difficulty,
  isTop10,
  onSubmit,
  onRestart,
  onGoHome,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const diff = DIFFICULTIES[difficulty];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    onSubmit(playerName.trim().toUpperCase());
    setHasSaved(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 flex items-center justify-center p-4"
        style={{ background: 'rgba(4,8,15,0.9)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-xs space-y-4 text-center"
        >
          <div>
            <Trophy className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-500">
              Sistema desconectado
            </p>
            <h3 className="text-3xl font-black uppercase text-rose-500 tracking-widest"
              style={{ textShadow: '0 0 20px #f43f5e88' }}>
              Fin
            </h3>
            <p className="text-slate-400 font-mono text-sm mt-1">
              Puntuación: <span className="text-white font-bold">{score}</span>
            </p>
            <p className="font-mono text-[10px] mt-1" style={{ color: diff.color + 'aa' }}>
              {diff.name}
            </p>
          </div>

          {!hasSaved ? (
            <form onSubmit={handleSave} className="space-y-3 text-left">
              <p className="text-[9px] uppercase font-mono text-slate-500 pl-1">
                Nombre para el ranking
              </p>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="TU NOMBRE"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-9 py-2 rounded-lg text-slate-100 placeholder:text-slate-600 font-mono uppercase text-xs focus:outline-none transition-colors"
                  maxLength={12}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!playerName.trim()}
                className="w-full flex items-center justify-center gap-2 py-2 font-bold uppercase tracking-widest rounded-lg text-xs text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#f43f5e' }}
              >
                <Save className="w-3.5 h-3.5" /> Guardar en Ranking
              </button>
            </form>
          ) : (
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-mono text-xs uppercase text-emerald-400 py-1"
            >
              ✓ ¡Puntuación guardada!
            </motion.p>
          )}

          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest rounded-lg text-xs hover:bg-cyan-400 hover:text-slate-950 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
          </button>

          <button
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-800 text-slate-500 font-mono uppercase text-[10px] tracking-widest rounded-lg hover:border-slate-700 hover:text-slate-400 transition-all"
          >
            <Home className="w-3.5 h-3.5" /> Menú principal
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};