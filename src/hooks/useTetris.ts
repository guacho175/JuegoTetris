import { useState, useEffect, useCallback, useRef } from 'react';
import { COLS, ROWS, TETROMINOS, DIFFICULTIES } from '../constants';
import { TetrominoType, Position, Difficulty, GameState } from '../types';

const getRandomTetromino = () => {
  const keys = Object.keys(TETROMINOS) as TetrominoType[];
  const type = keys[Math.floor(Math.random() * keys.length)];
  return { type, ...TETROMINOS[type] };
};

const createEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export const useTetris = (difficulty: Difficulty) => {
  const [grid, setGrid] = useState<any[][]>(createEmptyGrid());
  const [activePiece, setActivePiece] = useState<any>(null);
  const [nextPiece, setNextPiece] = useState<any>(getRandomTetromino());
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    paused: false,
    difficulty,
  });

  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);
  const dropCounterRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setActivePiece(null);
    setNextPiece(getRandomTetromino());
    setGameState({
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      paused: false,
      difficulty,
    });
  }, [difficulty]);

  const spawnPiece = useCallback(() => {
    const piece = nextPiece;
    const newNext = getRandomTetromino();
    
    const pos = { x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2), y: 0 };
    
    if (checkCollision(pos, piece.shape, grid)) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      return;
    }

    setActivePiece({ ...piece, pos });
    setNextPiece(newNext);
  }, [nextPiece, grid]);

  const checkCollision = (pos: Position, shape: number[][], currentGrid: any[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (
            newX < 0 || 
            newX >= COLS || 
            newY >= ROWS || 
            (newY >= 0 && currentGrid[newY][newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotatePiece = useCallback(() => {
    if (!activePiece || gameState.gameOver || gameState.paused) return;

    const rotatedShape = activePiece.shape[0].map((_: any, index: number) =>
      activePiece.shape.map((col: any) => col[index]).reverse()
    );

    if (!checkCollision(activePiece.pos, rotatedShape, grid)) {
      setActivePiece((prev: any) => ({ ...prev, shape: rotatedShape }));
    }
  }, [activePiece, grid, gameState.gameOver, gameState.paused]);

  const movePiece = useCallback((dir: { x: number; y: number }) => {
    if (!activePiece || gameState.gameOver || gameState.paused) return false;

    const newPos = { x: activePiece.pos.x + dir.x, y: activePiece.pos.y + dir.y };
    if (!checkCollision(newPos, activePiece.shape, grid)) {
      setActivePiece((prev: any) => ({ ...prev, pos: newPos }));
      return true;
    }
    return false;
  }, [activePiece, grid, gameState.gameOver, gameState.paused]);

  const lockPiece = useCallback(() => {
    if (!activePiece) return;

    const newGrid = grid.map(row => [...row]);
    activePiece.shape.forEach((row: number[], y: number) => {
      row.forEach((value: number, x: number) => {
        if (value !== 0) {
          const gridY = activePiece.pos.y + y;
          const gridX = activePiece.pos.x + x;
          if (gridY >= 0) {
            newGrid[gridY][gridX] = activePiece.color;
          }
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    const finalGrid = newGrid.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (finalGrid.length < ROWS) {
      finalGrid.unshift(Array(COLS).fill(0));
    }

    if (linesCleared > 0) {
      setGameState(prev => {
        const newLines = prev.lines + linesCleared;
        const multiplier = DIFFICULTIES[difficulty].multiplier;
        const linePoints = [0, 100, 300, 500, 800];
        const addedScore = linePoints[linesCleared] * multiplier;
        return {
          ...prev,
          lines: newLines,
          score: prev.score + addedScore,
          level: Math.floor(newLines / 10) + 1,
        };
      });
    }

    setGrid(finalGrid);
    setActivePiece(null);
  }, [activePiece, grid, difficulty]);

  const drop = useCallback(() => {
    if (!movePiece({ x: 0, y: 1 })) {
      lockPiece();
    }
  }, [movePiece, lockPiece]);

  const hardDrop = useCallback(() => {
    if (!activePiece || gameState.gameOver || gameState.paused) return;
    let currentPos = { ...activePiece.pos };
    while (!checkCollision({ x: currentPos.x, y: currentPos.y + 1 }, activePiece.shape, grid)) {
      currentPos.y += 1;
    }
    setActivePiece((prev: any) => ({ ...prev, pos: currentPos }));
    lockPiece();
  }, [activePiece, grid, gameState.gameOver, gameState.paused, lockPiece]);

  const update = useCallback((time: number) => {
    if (gameState.gameOver || gameState.paused) return;

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropCounterRef.current += deltaTime;

    const dropInterval = DIFFICULTIES[difficulty].speed / gameState.level;

    if (dropCounterRef.current > dropInterval) {
      if (!activePiece) {
        spawnPiece();
      } else {
        drop();
      }
      dropCounterRef.current = 0;
    }

    requestRef.current = requestAnimationFrame(update);
  }, [activePiece, spawnPiece, drop, difficulty, gameState.level, gameState.gameOver, gameState.paused]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  }, []);

  return {
    grid,
    activePiece,
    nextPiece,
    gameState,
    movePiece,
    rotatePiece,
    drop,
    hardDrop,
    resetGame,
    togglePause,
  };
};
