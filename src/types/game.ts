export type DirectionKey =
  | 'right'
  | 'left'
  | 'down'
  | 'up'
  | 'down-right'
  | 'down-left'
  | 'up-right'
  | 'up-left';

export interface CellCoord {
  row: number;
  col: number;
}

export interface PlacedWord {
  word: string;
  cells: CellCoord[];
  found: boolean;
  color: string;
}

export type Grid = string[][];

export interface Puzzle {
  grid: Grid;
  placedWords: PlacedWord[];
  gridSize: number;
}

export interface GameConfig {
  gridSize: number;
  words: string[];
  allowedDirections: DirectionKey[];
}
