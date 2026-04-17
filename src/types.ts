export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Position {
  x: number;
  y: number;
}

export interface DifficultySettings {
  name: string;
  speed: number;
  minSpeed: number;
  multiplier: number;
  color: string;
  label: string;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';

export interface RankingEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
  date: string;
}

export interface GameState {
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  paused: boolean;
  difficulty: Difficulty;
}
