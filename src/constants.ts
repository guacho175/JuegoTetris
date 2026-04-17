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

export const DIFFICULTIES: Record<Difficulty, DifficultySettings> = {
  EASY: {
    name: 'Fácil',
    speed: 800,
    multiplier: 1,
  },
  MEDIUM: {
    name: 'Medio',
    speed: 500,
    multiplier: 2,
  },
  HARD: {
    name: 'Difícil',
    speed: 300,
    multiplier: 4,
  },
  EXTREME: {
    name: 'Extremo',
    speed: 150,
    multiplier: 8,
  },
};
