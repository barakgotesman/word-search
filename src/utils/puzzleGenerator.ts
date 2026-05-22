import type { Grid, PlacedWord, Puzzle, GameConfig, DirectionKey, CellCoord } from '../types/game';

export const DIRECTION_VECTORS: Record<DirectionKey, { dr: number; dc: number; label: string }> = {
  right:          { dr: 0,  dc: 1,  label: 'ימינה →'  },
  left:           { dr: 0,  dc: -1, label: '← שמאלה'  },
  down:           { dr: 1,  dc: 0,  label: 'למטה ↓'   },
  up:             { dr: -1, dc: 0,  label: 'למעלה ↑'  },
  'down-right':   { dr: 1,  dc: 1,  label: 'אלכסון ↘' },
  'down-left':    { dr: 1,  dc: -1, label: 'אלכסון ↙' },
  'up-right':     { dr: -1, dc: 1,  label: 'אלכסון ↗' },
  'up-left':      { dr: -1, dc: -1, label: 'אלכסון ↖' },
};

const WORD_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#F7DC6F', '#DDA0DD', '#98D8C8', '#F0B27A',
  '#BB8FCE', '#85C1E9', '#82E0AA', '#F1948A',
];

// Hebrew letters (no final forms to avoid confusing young readers)
const HEBREW_FILLERS = 'אבגדהוזחטיכלמנסעפצקרשת';

// Maps final-form (sofit) letters to their standard equivalents
const FINAL_FORM_MAP: Record<string, string> = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ',
};

/** Replaces any final-form Hebrew letters in a word with their base forms */
function normalizeFinalForms(word: string): string {
  return word.split('').map(ch => FINAL_FORM_MAP[ch] ?? ch).join('');
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function canPlace(
  grid: Grid,
  word: string,
  row: number,
  col: number,
  dr: number,
  dc: number,
  size: number,
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = row + i * dr;
    const c = col + i * dc;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(
  grid: Grid,
  word: string,
  row: number,
  col: number,
  dr: number,
  dc: number,
): CellCoord[] {
  const cells: CellCoord[] = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + i * dr;
    const c = col + i * dc;
    grid[r][c] = word[i];
    cells.push({ row: r, col: c });
  }
  return cells;
}

export function generatePuzzle(config: GameConfig): Puzzle {
  const { gridSize, words, allowedDirections } = config;

  const grid: Grid = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(''),
  );

  const placedWords: PlacedWord[] = [];
  const shuffledWords = shuffle(words);

  for (let wi = 0; wi < shuffledWords.length; wi++) {
    const word = shuffledWords[wi];
    let placed = false;

    const dirs = shuffle([...allowedDirections]);

    for (const dirKey of dirs) {
      if (placed) break;
      const { dr, dc } = DIRECTION_VECTORS[dirKey];

      const positions = shuffle(
        Array.from({ length: gridSize * gridSize }, (_, idx) => ({
          row: Math.floor(idx / gridSize),
          col: idx % gridSize,
        })),
      );

      // Normalize final-form letters for grid placement only — display word stays original
      const gridWord = normalizeFinalForms(word);

      for (const { row, col } of positions) {
        if (canPlace(grid, gridWord, row, col, dr, dc, gridSize)) {
          const cells = placeWord(grid, gridWord, row, col, dr, dc);
          placedWords.push({
            word,
            cells,
            found: false,
            color: WORD_COLORS[wi % WORD_COLORS.length],
          });
          placed = true;
          break;
        }
      }
    }

    if (!placed) {
      console.warn(`Could not place word: ${word}`);
    }
  }

  // Fill remaining cells with random Hebrew letters
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = HEBREW_FILLERS[Math.floor(Math.random() * HEBREW_FILLERS.length)];
      }
    }
  }

  return { grid, placedWords, gridSize };
}
