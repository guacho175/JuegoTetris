import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  isTop10: boolean;
  onSubmit: (name: string) => void;
  onRestart: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ 
  score, isTop10, onSubmit, onRestart, onGoHome 
}) => {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center"
      >
        <Trophy size={64} className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
        
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Game Over</h2>
        <p className="text-slate-400 mb-8">Has conseguido <span className="text-white font-bold">{score}</span> puntos</p>

        {isTop10 ? (
          <div className="mb-8 space-y-4">
            <p className="text-cyan-400 font-bold animate-pulse">¡NUEVO RÉCORD! Entras en el Top 10</p>
            <input 
              type="text" 
              placeholder="Tu nombre" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border-2 border-slate-700 p-3 rounded-xl text-white text-center focus:border-cyan-500 outline-none transition-colors"
              autoFocus
            />
            <button 
              onClick={() => onSubmit(name || 'Anónimo')}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-900/40 transition-all active:scale-95"
            >
              Guardar y Salir
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-8">
            <button 
              onClick={onRestart}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
            >
              <RotateCcw size={18} /> Intentar de nuevo
            </button>
            <button 
              onClick={onGoHome}
              className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-800 text-slate-400 font-bold py-3 rounded-xl transition-all"
            >
              <Home size={18} /> Menú principal
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
