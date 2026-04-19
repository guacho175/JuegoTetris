import React, { useRef, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { inputHandler } from '../inputHandler';
import { COLS, ROWS } from '../constants';
import { DIFFICULTIES } from '../constants';
import { Difficulty } from '../types';

interface NeonTetrisProps {
  grid: any[][];
  activePiece: any;
  nextPiece: any;
  gameState: {
    score: number;
    level: number;
    lines: number;
    gameOver: boolean;
    paused: boolean;
    difficulty: Difficulty;
  };
  onMove: (dir: { x: number; y: number }) => void;
  onRotate: () => void;
  onDrop: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  onRestart: () => void;
}

const CELL = 28;
const GRID_W = COLS * CELL;
const GRID_H = ROWS * CELL;

export const GameBoard: React.FC<NeonTetrisProps> = ({
  grid,
  activePiece,
  nextPiece,
  gameState,
  onMove,
  onRotate,
  onDrop,
  onHardDrop,
  onPause,
  onRestart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const diff = DIFFICULTIES[gameState.difficulty];

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, GRID_W, GRID_H);

    ctx.strokeStyle = '#0f1525';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, GRID_H);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(GRID_W, i * CELL);
      ctx.stroke();
    }

    const displayGrid = grid.map(row => [...row]);
    if (activePiece) {
      activePiece.shape.forEach((row: number[], y: number) => {
        row.forEach((value: number, x: number) => {
          if (value !== 0) {
            const gy = activePiece.pos.y + y;
            const gx = activePiece.pos.x + x;
            if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
              displayGrid[gy][gx] = activePiece.color;
            }
          }
        });
      });
    }

    displayGrid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const px = x * CELL + 1;
          const py = y * CELL + 1;
          const sz = CELL - 2;
          ctx.fillStyle = cell;
          ctx.fillRect(px, py, sz, sz);
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(px, py, sz, 2);
          ctx.fillRect(px, py, 2, sz);
        }
      });
    });

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, GRID_H, GRID_W, 4);
    ctx.fillRect(GRID_W, 0, 4, GRID_H);
    ctx.fillStyle = diff.color;
    ctx.fillRect(0, GRID_H, GRID_W, 2);
    ctx.fillRect(GRID_W, 0, 2, GRID_H);

    for (let sy = 0; sy < GRID_H; sy += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, sy, GRID_W, 1);
    }

    const vig = ctx.createRadialGradient(GRID_W / 2, GRID_H / 2, GRID_H * 0.3, GRID_W / 2, GRID_H / 2, GRID_H * 0.8);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, GRID_W, GRID_H);
  }, [grid, activePiece, gameState.difficulty]);

  useEffect(() => {
    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const moveSub = (dir: { x: number; y: number }) => onMove(dir);
    const rotateSub = () => onRotate();
    const accelerateSub = () => onDrop();

    const unsubMove = inputHandler.onMove(moveSub);
    const unsubRotate = inputHandler.onRotate(rotateSub);
    const unsubAccel = inputHandler.onAccelerate(accelerateSub);

    const onKey = (e: KeyboardEvent) => {
      if (['p', 'P', 'r', 'R'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'p' || e.key === 'P') onPause();
        if (e.key === 'r' || e.key === 'R') onRestart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unsubMove();
      unsubRotate();
      unsubAccel();
      window.removeEventListener('keydown', onKey);
    };
  }, [onMove, onRotate, onDrop, onPause, onRestart]);

  // Manejo del hard drop con la barra espaciadora (solo teclado)
  useEffect(() => {
    const onSpace = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        onHardDrop();
      }
    };
    window.addEventListener('keydown', onSpace);
    return () => window.removeEventListener('keydown', onSpace);
  }, [onHardDrop]);

  const diff = DIFFICULTIES[gameState.difficulty];

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        width={GRID_W}
        height={GRID_H}
        className="rounded-lg"
        style={{
          boxShadow: `0 0 30px ${diff.color}44, 0 0 60px ${diff.color}22, inset 0 0 0 2px ${diff.color}44`,
        }}
      />
      {/* Mobile D‑pad */}
      <div className="sm:hidden mt-1 flex flex-col items-center gap-1.5">
        <button
          onPointerDown={(e) => { e.preventDefault(); onRotate(); }}
          className="w-14 h-14 flex items-center justify-center bg-slate-800/70 border border-slate-700 rounded-xl text-slate-300 active:bg-cyan-400 active:text-slate-950 transition-colors"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5">
          {([[-1, 0, ArrowLeft], [0, 1, ArrowDown], [1, 0, ArrowRight]] as [number, number, any][]).map(([nx, ny, Icon], idx) => (
            <button
              key={idx}
              onPointerDown={(e) => {
                e.preventDefault();
                if (ny === 1) onDrop();
                else onMove({ x: nx, y: 0 });
              }}
              className="w-14 h-14 flex items-center justify-center bg-slate-800/70 border border-slate-700 rounded-xl text-slate-300 active:bg-cyan-400 active:text-slate-950 transition-colors"
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-[10px] font-mono text-slate-500 uppercase">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: diff.color, boxShadow: `0 0 6px ${diff.color}` }} />
          {diff.name}
        </div>
      </div>
    </div>
  );
};