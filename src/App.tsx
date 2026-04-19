import React, { useState, useEffect, useCallback } from 'react';
import { useTetris } from './hooks/useTetris';
import { GameBoard } from './components/GameBoard';
import { DifficultyMenu } from './components/DifficultyMenu';
import { GameOverModal } from './components/GameOverModal';
import { Difficulty, RankingEntry, GameState } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { ListOrdered, Pause, Play, RotateCcw, Trophy } from 'lucide-react';
import { fetchRanking, saveScore } from './utils/ranking';
import NeonMusicPlayer from './components/NeonMusicPlayer';

export default function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [playLoseTrack, setPlayLoseTrack] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showMobileRanking, setShowMobileRanking] = useState(false);

  const {
    grid, activePiece, nextPiece, gameState,
    movePiece, rotatePiece, hardDrop, resetGame, togglePause, drop
  } = useTetris(selectedDifficulty || 'EASY');

  // Prevenir recarga accidental en medio de una partida
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGameStarted && !gameState.gameOver && !gameState.paused) {
        e.preventDefault();
        e.returnValue = ''; // Necesario para Chrome
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isGameStarted, gameState.gameOver, gameState.paused]);

  const loadRanking = useCallback(async () => {
    console.log('[App] Loading ranking...');
    const data = await fetchRanking();
    console.log('[App] Ranking loaded:', data.length, 'entries');
    setRanking(data);
  }, []);

  useEffect(() => {
    loadRanking();
    window.addEventListener('rankingUpdated', loadRanking);
    return () => window.removeEventListener('rankingUpdated', loadRanking);
  }, [loadRanking]);

  const handleDifficultySelect = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
  };

  const handleRestart = () => {
    setPlayLoseTrack(false);
    setIsGameStarted(false);
    resetGame();
  };

  const handleGameOver = () => {
    setPlayLoseTrack(true);
    setIsGameStarted(false);
  };

  const handleStart = () => {
    setIsGameStarted(true);
    setPlayLoseTrack(false);
  };

  const handleSaveScore = async (name: string) => {
    await saveScore(name, gameState.score, gameState.difficulty);
    await loadRanking();
    setSelectedDifficulty(null);
  };

  const isTop10 = ranking.length < 10 || gameState.score > (ranking[9]?.score || 0);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0c0c0e] flex flex-col font-sans selection:bg-cyan-500/30 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/20 rounded-full blur-[120px]" />
      </div>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full pt-1.5 sm:pt-3 pb-1 px-4 flex flex-col items-center z-50 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-slate-900 flex-shrink-0"
      >
        <div className="flex items-baseline gap-2 sm:gap-3">
          <h1 className="text-lg sm:text-2xl font-black italic text-slate-100 tracking-tighter uppercase relative">
            Tetris
            <span className="text-cyan-400 text-neon-cyan">Neón</span>
          </h1>
        </div>
        <p className="text-slate-500 font-mono tracking-[0.3em] text-[6px] sm:text-[8px] uppercase text-center leading-none">
          Hecho por <span className="text-cyan-400 font-bold">Galindez</span>
        </p>
      </motion.header>

      <div className="flex-1 flex flex-col lg:flex-row w-full z-10 relative min-h-0">
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-full lg:w-44 xl:w-52 p-2 sm:p-3 lg:border-r border-slate-800 bg-slate-900/30 backdrop-blur-md order-2 lg:order-1 flex-col flex-shrink-0 ${showMobileRanking ? 'flex' : 'hidden'} lg:flex`}
        >
          <div className="flex items-center gap-2 mb-2">
            <ListOrdered className="w-3.5 h-3.5 text-magenta-500" />
            <h2 className="text-[10px] sm:text-xs font-bold text-slate-100 uppercase tracking-widest italic">Ranking</h2>
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
            {ranking.length > 0 ? (
              ranking.map((entry, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-1 bg-slate-800/20 border border-slate-700/30 rounded hover:border-magenta-500/50 transition-all"
                >
                  <div className="flex items-center gap-1">
                    <span className={`font-mono font-black italic text-[10px] ${index < 3 ? 'text-cyan-400' : 'text-slate-600'}`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[8px] sm:text-[9px] font-bold text-slate-100 uppercase truncate max-w-[50px] sm:max-w-[70px]">{entry.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] sm:text-[10px] font-black text-magenta-500 leading-none">{entry.score}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-2 border border-dashed border-slate-800 rounded">
                <p className="text-[7px] font-mono text-slate-600 uppercase">Vacío</p>
              </div>
            )}
          </div>
        </motion.aside>

        {!isGameStarted && (
          <div className="lg:hidden w-full px-4 mb-2 order-2 shrink-0 z-50">
            <button
              onClick={() => setShowMobileRanking(!showMobileRanking)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-slate-300 font-bold uppercase text-[10px] tracking-widest transition-colors"
            >
              <ListOrdered className="w-4 h-4 text-magenta-500" />
              {showMobileRanking ? 'Ocultar Ranking' : 'Ver Ranking Global'}
            </button>
          </div>
        )}

        <main className="flex-1 flex flex-col items-center justify-start sm:justify-center p-0.5 sm:p-2 lg:p-4 order-1 lg:order-2 overflow-y-auto sm:overflow-hidden relative bg-[radial-gradient(#1e1e24_1px,transparent_1px)] [background-size:40px_40px] custom-scrollbar">
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
                className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center lg:items-start w-full max-w-7xl mx-auto justify-center"
              >
                <div className="relative mt-2 lg:mt-0">
                  <GameBoard
                    grid={grid}
                    activePiece={activePiece}
                    nextPiece={nextPiece}
                    gameState={gameState}
                    onMove={movePiece}
                    onRotate={rotatePiece}
                    onDrop={drop}
                    onHardDrop={hardDrop}
                    onPause={togglePause}
                    onRestart={handleRestart}
                  />
                  <AnimatePresence>
                    {gameState.paused && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center rounded-lg"
                        style={{ background: 'rgba(4,8,15,0.88)', backdropFilter: 'blur(4px)' }}
                      >
                        <div className="text-center space-y-4">
                          <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-slate-500">Sistema suspendido</p>
                          <h2 className="text-4xl font-black uppercase tracking-[0.15em] text-cyan-400"
                            style={{ textShadow: '0 0 24px #00ffff88' }}>Pausa</h2>
                          <button onClick={togglePause}
                            className="flex items-center gap-2 px-6 py-2 border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 hover:text-slate-950 transition-all">
                            <Play className="w-4 h-4" /> Continuar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {gameState.gameOver && (
                    <GameOverModal
                      score={gameState.score}
                      difficulty={gameState.difficulty}
                      isTop10={isTop10}
                      onSubmit={handleSaveScore}
                      onRestart={handleRestart}
                      onGoHome={() => setSelectedDifficulty(null)}
                    />
                  )}
                </div>

                <div className="flex flex-row lg:flex-col gap-2 lg:gap-4 w-full lg:w-40 px-4 lg:px-0 justify-center">
                  <div className="bg-slate-900/50 p-2 lg:p-4 border border-slate-800 rounded-xl backdrop-blur-sm flex-1 lg:flex-none flex lg:flex-col items-center lg:items-stretch justify-between lg:justify-start gap-4 lg:gap-0">
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="flex items-center gap-1.5 lg:gap-2 lg:mb-2 text-cyan-400">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline text-xs font-mono uppercase text-slate-500">Puntaje</span>
                      </div>
                      <p className="text-xl lg:text-2xl font-black text-cyan-400 tabular-nums leading-none lg:leading-normal">{gameState.score}</p>
                    </div>
                    
                    <div className="flex gap-4 lg:flex-col lg:gap-0 text-left lg:mt-3">
                      <div className="flex lg:justify-between items-center gap-1 lg:gap-0 text-[9px] lg:text-[10px] font-mono text-slate-600 uppercase">
                        <span className="text-slate-500">Nivel</span>
                        <span className="font-bold text-slate-300">{gameState.level}</span>
                      </div>
                      <div className="flex lg:justify-between items-center gap-1 lg:gap-0 text-[9px] lg:text-[10px] font-mono text-slate-600 uppercase">
                        <span className="text-slate-500">Líneas</span>
                        <span className="font-bold text-slate-300">{gameState.lines}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 w-auto lg:w-full">
                    <button onClick={togglePause} className="flex items-center justify-center gap-1 p-3 lg:p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors text-xs font-mono uppercase aspect-square lg:aspect-auto lg:flex-1">
                      {gameState.paused ? <Play className="w-4 h-4 lg:w-3 lg:h-3" /> : <Pause className="w-4 h-4 lg:w-3 lg:h-3" />}
                    </button>
                    <button onClick={handleRestart} className="flex items-center justify-center gap-1 p-3 lg:p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors text-xs font-mono uppercase aspect-square lg:aspect-auto lg:flex-1">
                      <RotateCcw className="w-4 h-4 lg:w-3 lg:h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <div className="w-full flex-shrink-0 bg-[#0c0c0e]/95 backdrop-blur-md border-t border-slate-900 z-50 sm:fixed sm:bottom-4 sm:right-4 sm:w-72 lg:w-80 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:flex-shrink">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="max-w-md mx-auto sm:max-w-none"
        >
          <NeonMusicPlayer isGameStarted={isGameStarted} playLoseTrack={playLoseTrack} />
        </motion.div>
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}