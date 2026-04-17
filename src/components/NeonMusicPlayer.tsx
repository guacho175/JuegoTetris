import React, { useState, useRef, useEffect } from 'react';
import { MUSIC } from '../constants/music';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion } from 'motion/react';

interface NeonMusicPlayerProps {
  isGameStarted: boolean;
  playLoseTrack: boolean;
}

export default function NeonMusicPlayer({ isGameStarted, playLoseTrack }: NeonMusicPlayerProps) {
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const loseAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!gameAudioRef.current) {
      gameAudioRef.current = new Audio(MUSIC.game);
      gameAudioRef.current.loop = true;
      gameAudioRef.current.volume = 0.3;
    }
    if (!loseAudioRef.current) {
      loseAudioRef.current = new Audio(MUSIC.gameOver);
      loseAudioRef.current.volume = 0.4;
    }
    return () => {
      gameAudioRef.current?.pause();
      loseAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!gameAudioRef.current || !loseAudioRef.current) return;
    if (muted) {
      gameAudioRef.current.pause();
      loseAudioRef.current.pause();
      return;
    }
    if (playLoseTrack && !paused) {
      gameAudioRef.current.pause();
      gameAudioRef.current.currentTime = 0;
      loseAudioRef.current.play().catch(() => {});
    } else if (isGameStarted && !paused) {
      loseAudioRef.current?.pause();
      loseAudioRef.current!.currentTime = 0;
      gameAudioRef.current.play().catch(() => {});
    } else {
      gameAudioRef.current?.pause();
      loseAudioRef.current?.pause();
    }
  }, [isGameStarted, playLoseTrack, muted, paused]);

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setPaused(false);
    } else {
      setMuted(true);
    }
  };

  const togglePlay = () => {
    if (paused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg">
      <button
        onClick={toggleMute}
        className="p-1.5 rounded-md hover:bg-slate-800 transition-colors"
      >
        {muted ? (
          <VolumeX className="w-4 h-4 text-slate-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      <div className="flex flex-col leading-none">
        <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">
          {playLoseTrack ? 'DERROTA' : isGameStarted ? 'JUGANDO' : 'TETRIS NEÓN'}
        </span>
        <span className="text-[7px] font-mono text-slate-600 uppercase">
          {playLoseTrack ? '0:30' : isGameStarted ? 'loop' : 'Hecho por Galindez'}
        </span>
      </div>

      {isGameStarted && !playLoseTrack && (
        <button onClick={togglePlay} className="p-1.5 rounded-md hover:bg-slate-800 transition-colors ml-1">
          {paused ? (
            <Play className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Pause className="w-3.5 h-3.5 text-cyan-400" />
          )}
        </button>
      )}
    </div>
  );
}