import React from 'react';
import { COLS, ROWS } from '../constants';

interface GameBoardProps {
  grid: any[][];
  activePiece: any;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, activePiece }) => {
  // Merge active piece into grid for rendering
  const displayGrid = grid.map(row => [...row]);
  
  if (activePiece) {
    activePiece.shape.forEach((row: number[], y: number) => {
      row.forEach((value: number, x: number) => {
        if (value !== 0) {
          const gridY = activePiece.pos.y + y;
          const gridX = activePiece.pos.x + x;
          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            displayGrid[gridY][gridX] = activePiece.color;
          }
        }
      });
    });
  }

  return (
    <div 
      className="grid gap-[1px] bg-slate-800 border-4 border-slate-700 shadow-2xl relative overflow-hidden rounded-lg"
      style={{ 
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        width: '300px',
        height: '600px'
      }}
    >
      {displayGrid.flat().map((cell, i) => (
        <div 
          key={i} 
          className="relative transition-colors duration-100"
          style={{ 
            backgroundColor: cell || '#0f172a',
            boxShadow: cell ? `inset 0 0 10px rgba(0,0,0,0.5), 0 0 5px ${cell}` : 'none',
            border: cell ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}
        >
          {cell && (
            <div className="absolute inset-x-0 top-0 h-[2px] bg-white opacity-20" />
          )}
        </div>
      ))}
    </div>
  );
};
