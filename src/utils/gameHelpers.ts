import type { CellCoord, PlacedWord } from '../types/game';

export function getCellsBetween(start: CellCoord, end: CellCoord): CellCoord[] | null {
  const dr = end.row - start.row;
  const dc = end.col - start.col;

  // Must be horizontal, vertical, or 45° diagonal
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  if (dr === 0 && dc === 0) return [{ ...start }];

  const len = Math.max(Math.abs(dr), Math.abs(dc));
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

  return Array.from({ length: len + 1 }, (_, i) => ({
    row: start.row + i * stepR,
    col: start.col + i * stepC,
  }));
}

export function coordsEqual(a: CellCoord, b: CellCoord): boolean {
  return a.row === b.row && a.col === b.col;
}

function cellArraysMatch(a: CellCoord[], b: CellCoord[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((cell, i) => coordsEqual(cell, b[i]));
}

export function selectionMatchesWord(selection: CellCoord[], wordCells: CellCoord[]): boolean {
  return (
    cellArraysMatch(selection, wordCells) ||
    cellArraysMatch(selection, [...wordCells].reverse())
  );
}

export function getFoundCellsMap(placedWords: PlacedWord[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const word of placedWords) {
    if (word.found) {
      for (const cell of word.cells) {
        map.set(`${cell.row},${cell.col}`, word.color);
      }
    }
  }
  return map;
}
