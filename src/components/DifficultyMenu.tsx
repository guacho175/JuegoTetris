import React from 'react';
import { Difficulty } from '../types';
import { DIFFICULTIES } from '../constants';
import { motion } from 'motion/react';

interface DifficultyMenuProps {
  onSelect: (difficulty: Difficulty) => void;
}

export const DifficultyMenu: React.FC<DifficultyMenuProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center max-w-md mx-auto">
      <div className="space-y-4">
        <h1 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600 tracking-tighter uppercase mb-2">
          Neon Tetris
        </h1>
        <p className="text-slate-400 font-medium">Selecciona tu nivel de desafío</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {(Object.keys(DIFFICULTIES) as Difficulty[]).map((key) => {
          const setting = DIFFICULTIES[key];
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(key)}
              className="group relative bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-all text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-4xl font-black italic">{key[0]}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{setting.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-mono">Multiplicador</span>
                <span className="text-cyan-500 font-bold">x{setting.multiplier}</span>
              </div>
              <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500" 
                  style={{ width: `${(Object.keys(DIFFICULTIES).indexOf(key) + 1) * 25}%` }} 
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
