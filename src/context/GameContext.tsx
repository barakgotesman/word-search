import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { GameConfig, Puzzle, PlacedWord, CellCoord } from '../types/game';
import { generatePuzzle } from '../utils/puzzleGenerator';
import { getCellsBetween, selectionMatchesWord, coordsEqual } from '../utils/gameHelpers';
import { getRandomAutoWords, WORD_CATEGORIES } from '../data/wordBank';
import { playWordFound } from '../utils/sounds';
import type { DirectionKey } from '../types/game';

/** localStorage key for the array of user-created puzzle presets */
export const PRESETS_KEY = 'wordSearch_presets';

/**
 * A named puzzle preset created and saved by the user.
 * Stored as a JSON array in localStorage under PRESETS_KEY.
 */
export interface PuzzlePreset {
  id: string;                    // unique id: Date.now().toString()
  name: string;                  // user-given display name e.g. "חיות"
  emoji: string;                 // auto-picked from first selected category, fallback "✏️"
  gridSize: number;              // N for N×N grid
  selectedCategories: string[];  // category label strings e.g. ["חיות", "אוכל"]
  customWords: string;           // raw textarea value — parsed at game-start time
  directions: DirectionKey[];    // allowed word placement directions
}

// All 8 directions enabled by default
const DEFAULT_DIRECTIONS: DirectionKey[] = [
  'right', 'left', 'down', 'up',
  'down-right', 'down-left', 'up-right', 'up-left',
];

/**
 * Builds a fresh auto-mode config with a new random word set every call.
 * Called at game start so each auto session gets a different puzzle.
 */
function buildDefaultConfig(): GameConfig {
  return {
    gridSize: 10,
    words: getRandomAutoWords(10),
    allowedDirections: DEFAULT_DIRECTIONS,
  };
}

/**
 * Converts a PuzzlePreset into a GameConfig ready for puzzle generation.
 * Merges custom typed words with words from selected categories, deduplicates, shuffles.
 *
 * @param preset - The preset to convert
 * @returns GameConfig with resolved word list capped at 15 words
 */
function buildConfigFromPreset(preset: PuzzlePreset): GameConfig {
  // Parse the raw textarea into individual words
  const customWords = [...new Set(
    preset.customWords
      .split(/[\n,،\s]+/)
      .map(w => w.trim())
      .filter(w => w.length >= 2)
  )];

  // Gather all words from selected categories
  const categoryWords = WORD_CATEGORIES
    .filter(cat => preset.selectedCategories.includes(cat.label))
    .flatMap(cat => cat.words);

  // Merge, deduplicate, drop words that can't fit in the grid, Fisher-Yates shuffle
  const pool = [...new Set([...customWords, ...categoryWords])]
    .filter(w => w.length <= preset.gridSize);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return {
    gridSize: preset.gridSize,
    words: pool.slice(0, 15),
    allowedDirections: preset.directions,
  };
}

interface GameContextValue {
  puzzle: Puzzle | null;
  placedWords: PlacedWord[];
  selectionStart: CellCoord | null;
  selectionEnd: CellCoord | null;
  lastFoundWord: string | null;
  /** Name of the preset this game was started from; null for auto-mode games */
  currentPresetName: string | null;
  /** The preset used for the current game; null for auto-mode games */
  currentPreset: PuzzlePreset | null;
  /** Starts a new auto-mode game with random words */
  startGame: (config?: GameConfig) => void;
  /** Builds a GameConfig from a saved preset and starts a game */
  startGameFromPreset: (preset: PuzzlePreset) => void;
  handleCellClick: (cell: CellCoord) => void;
  handleCellHover: (cell: CellCoord) => void;
  /** Marks a word as found without user selection (hint feature) */
  revealWord: (word: string) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectionStart, setSelectionStart] = useState<CellCoord | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<CellCoord | null>(null);
  const [lastFoundWord, setLastFoundWord] = useState<string | null>(null);
  /** Null for auto-mode games; set to the preset's name when started from a preset */
  const [currentPresetName, setCurrentPresetName] = useState<string | null>(null);
  const [currentPreset, setCurrentPreset] = useState<PuzzlePreset | null>(null);

  const startGame = useCallback((config: GameConfig = buildDefaultConfig()) => {
    const newPuzzle = generatePuzzle(config);
    setPuzzle(newPuzzle);
    setPlacedWords(newPuzzle.placedWords);
    setSelectionStart(null);
    setSelectionEnd(null);
    setLastFoundWord(null);
    setCurrentPresetName(null);
    setCurrentPreset(null);
  }, []);

  /** Converts the preset to a GameConfig and starts a game with it */
  const startGameFromPreset = useCallback((preset: PuzzlePreset) => {
    const config = buildConfigFromPreset(preset);
    const newPuzzle = generatePuzzle(config);
    setPuzzle(newPuzzle);
    setPlacedWords(newPuzzle.placedWords);
    setSelectionStart(null);
    setSelectionEnd(null);
    setLastFoundWord(null);
    setCurrentPresetName(preset.name);
    setCurrentPreset(preset);
  }, []);

  const handleCellClick = useCallback((cell: CellCoord) => {
    // No selection yet → set start
    if (!selectionStart) {
      setSelectionStart(cell);
      setSelectionEnd(cell);
      return;
    }

    // Tapped same cell → cancel selection
    if (coordsEqual(selectionStart, cell)) {
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    // Second cell → validate path and check word
    const path = getCellsBetween(selectionStart, cell);
    if (path && path.length >= 2) {
      setPlacedWords(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(
          w => !w.found && selectionMatchesWord(path, w.cells),
        );
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], found: true };
          setLastFoundWord(updated[idx].word);
          playWordFound();
        }
        return updated;
      });
    }

    setSelectionStart(null);
    setSelectionEnd(null);
  }, [selectionStart]);

  const handleCellHover = useCallback((cell: CellCoord) => {
    if (selectionStart) setSelectionEnd(cell);
  }, [selectionStart]);

  const revealWord = useCallback((word: string) => {
    setPlacedWords(prev =>
      prev.map(w => w.word === word ? { ...w, found: true } : w)
    );
    setLastFoundWord(word);
    playWordFound();
    setSelectionStart(null);
    setSelectionEnd(null);
  }, []);

  return (
    <GameContext.Provider value={{
      puzzle,
      placedWords,
      selectionStart,
      selectionEnd,
      lastFoundWord,
      currentPresetName,
      currentPreset,
      startGame,
      startGameFromPreset,
      handleCellClick,
      handleCellHover,
      revealWord,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
