import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import PuzzleGrid from '../ui/PuzzleGrid';
import WordList from '../ui/WordList';
import { ArrowLeft, Printer } from '../ui/icons';

export default function GameBoard() {
  const navigate = useNavigate();
  const {
    puzzle,
    placedWords,
    selectionStart,
    selectionEnd,
    currentPresetName,
    handleCellClick,
    handleCellHover,
  } = useGame();

  useEffect(() => {
    if (!puzzle) navigate('/');
  }, [puzzle, navigate]);

  useEffect(() => {
    if (placedWords.length > 0 && placedWords.every(w => w.found)) {
      const t = setTimeout(() => navigate('/victory'), 600);
      return () => clearTimeout(t);
    }
  }, [placedWords, navigate]);

  if (!puzzle) return null;

  return (
    <div
      className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-sky-100 to-indigo-100"
      dir="rtl"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto w-full flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/60 transition print:hidden"
        >
          <ArrowLeft size={16} />
          תפריט
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-black text-indigo-700">תפזורת</h1>
          {currentPresetName && (
            <p className="text-sm font-semibold text-indigo-400 mt-0.5">{currentPresetName}</p>
          )}
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/60 transition print:hidden"
          title="הדפסה"
        >
          <Printer size={16} />
          <span className="hidden sm:inline">הדפס</span>
        </button>
      </div>

      {/* ── Desktop layout: grid + word list side by side ── */}
      <div className="hidden lg:flex items-start justify-center gap-4 px-4 pb-4 max-w-4xl mx-auto w-full flex-1 min-h-0 print-area">
        <div className="bg-white rounded-2xl shadow-md p-3 print:shadow-none flex-shrink-0 self-start lg:self-stretch flex items-center justify-center">
          <PuzzleGrid
            grid={puzzle.grid}
            gridSize={puzzle.gridSize}
            placedWords={placedWords}
            selectionStart={selectionStart}
            selectionEnd={selectionEnd}
            onCellClick={handleCellClick}
            onCellHover={handleCellHover}
          />
        </div>
        <div className="w-56 flex-shrink-0 lg:self-stretch lg:flex lg:flex-col">
          <WordList placedWords={placedWords} />
        </div>
      </div>

      {/* ── Mobile layout: grid on top, compact word strip at bottom ── */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 px-3 pb-3 gap-2">
        {/* Grid — scrollable if it overflows */}
        <div className="flex-1 min-h-0 flex items-center justify-center overflow-auto">
          <div className="bg-white rounded-2xl shadow-md p-2 flex-shrink-0">
            <PuzzleGrid
              grid={puzzle.grid}
              gridSize={puzzle.gridSize}
              placedWords={placedWords}
              selectionStart={selectionStart}
              selectionEnd={selectionEnd}
              onCellClick={handleCellClick}
              onCellHover={handleCellHover}
            />
          </div>
        </div>

        {/* Word list — compact horizontal strip */}
        <div className="flex-shrink-0 bg-white rounded-2xl shadow-md px-3 py-2">
          <MobileWordStrip placedWords={placedWords} />
        </div>
      </div>
    </div>
  );
}

/** Compact horizontal word chip strip for mobile */
function MobileWordStrip({ placedWords }: { placedWords: ReturnType<typeof useGame>['placedWords'] }) {
  const { revealWord } = useGame();
  const found = placedWords.filter(w => w.found).length;
  const total = placedWords.length;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-gray-500">מילים למצוא</span>
        <span className="text-xs text-gray-400">{found}/{total}</span>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1 mb-2">
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: total > 0 ? `${(found / total) * 100}%` : '0%', backgroundColor: '#4ECDC4' }}
        />
      </div>
      {/* Horizontal scrollable word chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {placedWords.map(({ word, found: isFound, color }) => (
          <button
            key={word}
            onClick={() => !isFound && revealWord(word)}
            disabled={isFound}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isFound ? 'opacity-50 cursor-default line-through' : 'cursor-pointer active:scale-95'
            }`}
            style={{
              backgroundColor: isFound ? color + '33' : '#F3F4F6',
              color: isFound ? color : '#374151',
              borderRight: `3px solid ${isFound ? color : 'transparent'}`,
            }}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
