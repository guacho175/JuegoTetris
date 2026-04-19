import React from 'react';
import { Difficulty } from '../types';
import { DIFFICULTIES } from '../constants';
import { motion } from 'motion/react';
import { Play, Zap, Shield, Skull, Rocket } from 'lucide-react';

interface DifficultyMenuProps {
  onSelect: (difficulty: Difficulty) => void;
}

const ICONS = [Zap, Rocket, Shield, Skull];

export const DifficultyMenu: React.FC<DifficultyMenuProps> = ({ onSelect }) => {
  const keys = Object.keys(DIFFICULTIES) as Difficulty[];

  return (
    <div className="flex flex-col items-center justify-center gap-6 lg:gap-10 p-4 w-full max-w-sm lg:max-w-xl">
      <div className="space-y-3 lg:space-y-5 text-center">
        <h2 className="text-4xl lg:text-7xl font-black italic text-cyan-400 tracking-tighter uppercase"
          style={{ textShadow: '0 0 20px #00ffff66, 0 0 40px #00ffff22' }}>
          Tetris Neón
        </h2>
        <p className="text-slate-500 font-mono tracking-[0.2em] text-[10px] lg:text-sm uppercase">
          Elige tu nivel
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {keys.map((key, i) => {
          const diff = DIFFICULTIES[key];
          const Icon = ICONS[i];
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(key)}
              className="relative group flex flex-col items-center gap-2 lg:gap-4 p-4 lg:p-8 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-cyan-500/40 transition-all"
              style={{
                boxShadow: `0 0 20px ${diff.color}11, inset 0 0 30px ${diff.color}05`,
              }}
            >
              <Icon className="w-6 h-6 lg:w-12 lg:h-12" style={{ color: diff.color }} />
              <span className="text-xs lg:text-xl font-bold uppercase" style={{ color: diff.color }}>
                {diff.name}
              </span>
              <span className="text-[9px] lg:text-xs font-mono text-slate-600 uppercase">
                x{diff.multiplier}
              </span>
              <span className="text-[8px] lg:text-[10px] font-mono text-slate-700 uppercase">
                {diff.speed}ms
              </span>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={() => onSelect('EASY')}
        className="flex items-center gap-2 px-6 lg:px-10 py-3 lg:py-5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold uppercase text-xs lg:text-base tracking-widest hover:bg-cyan-500/20 transition-all"
        style={{ boxShadow: '0 0 20px #00ffff22' }}
      >
        <Play className="w-4 h-4 lg:w-5 lg:h-5" />
        Iniciar juego
      </button>
    </div>
  );
};