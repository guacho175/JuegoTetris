import React, { useState, useEffect, useCallback } from 'react';
import { useTetris } from './hooks/useTetris';
import { GameBoard } from './components/GameBoard';
import { Sidebar } from './components/Sidebar';
import { DifficultyMenu } from './components/DifficultyMenu';
import { GameOverModal } from './components/GameOverModal';
import { Difficulty, RankingEntry } from './types';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const { 
    grid, activePiece, nextPiece, gameState, 
    movePiece, rotatePiece, hardDrop, resetGame, togglePause, drop 
  } = useTetris(selectedDifficulty || 'EASY');

  const fetchRanking = async () => {
    try {
      const res = await fetch('/api/ranking');
      const data = await res.json();
      setRanking(data);
    } catch (err) {
      console.error('Error fetching ranking:', err);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const handleDifficultySelect = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedDifficulty || gameState.gameOver || gameState.paused) {
      if (e.key === 'p' || e.key === 'P') togglePause();
      if (e.key === 'r' || e.key === 'R') resetGame();
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        movePiece({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        movePiece({ x: 1, y: 0 });
        break;
      case 'ArrowDown':
        drop();
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        hardDrop();
        break;
      case 'p':
      case 'P':
        togglePause();
        break;
      case 'r':
      case 'R':
        resetGame();
        break;
    }
  }, [selectedDifficulty, gameState, movePiece, rotatePiece, hardDrop, drop, togglePause, resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const saveScore = async (name: string) => {
    try {
      await fetch('/api/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          score: gameState.score,
          difficulty: gameState.difficulty
        })
      });
      await fetchRanking();
      setSelectedDifficulty(null);
    } catch (err) {
      console.error('Error saving score:', err);
      setSelectedDifficulty(null);
    }
  };

  const isTop10 = ranking.length < 10 || gameState.score > (ranking[9]?.score || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-cyan-500/30">
      <AnimatePresence mode="wait">
        {!selectedDifficulty ? (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <DifficultyMenu onSelect={handleDifficultySelect} />
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row gap-12 items-start"
          >
            <div className="relative">
              <GameBoard grid={grid} activePiece={activePiece} />
              
              <AnimatePresence>
                {gameState.paused && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center">
                      <p className="text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Pausa</p>
                      <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-widest">Presiona P para continuar</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Sidebar 
              gameState={gameState} 
              nextPiece={nextPiece}
              ranking={ranking}
              onReset={resetGame}
              onTogglePause={togglePause}
            />

            {gameState.gameOver && (
              <GameOverModal 
                score={gameState.score}
                isTop10={isTop10}
                onSubmit={saveScore}
                onRestart={resetGame}
                onGoHome={() => setSelectedDifficulty(null)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
