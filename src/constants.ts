import { TetrominoType, Difficulty, DifficultySettings } from './types';

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export const TETROMINOS: Record<TetrominoType, { shape: number[][]; color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0', // Cyan
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0', // Blue
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000', // Orange
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000', // Yellow
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000', // Green
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0', // Purple
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000', // Red
  },
};

// Speed = starting drop interval in ms
// minSpeed = floor — the fastest interval allowed (higher = more playable)
// The drop interval decreases by 35ms per level, but never below minSpeed
export const DIFFICULTIES: Record<Difficulty, DifficultySettings> = {
  EASY: {
    name: 'Fácil',
    label: 'Ideal para empezar',
    speed: 800,
    minSpeed: 350,
    multiplier: 1,
    color: '#00ffff',
  },
  MEDIUM: {
    name: 'Medio',
    label: 'Equilibrio perfecto',
    speed: 550,
    minSpeed: 220,
    multiplier: 2,
    color: '#a78bfa',
  },
  HARD: {
    name: 'Difícil',
    label: 'Solo para expertos',
    speed: 380,
    minSpeed: 140,
    multiplier: 4,
    color: '#fb923c',
  },
  EXTREME: {
    name: 'Extremo',
    label: 'Velocidad demencial',
    speed: 250,
    minSpeed: 90,
    multiplier: 8,
    color: '#f43f5e',
  },
};
