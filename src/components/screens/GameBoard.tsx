import { useEffect, useState } from 'react';
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

      {/* ── Mobile layout: word strip above, grid fills remaining space ── */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 px-3 pb-3 gap-2">
        {/* Word strip — compact, sits naturally at top */}
        <div className="flex-shrink-0 bg-white rounded-2xl shadow-md px-3 py-2">
          <MobileWordStrip placedWords={placedWords} />
        </div>

        {/* Grid — fills remaining space, centered */}
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-md p-2">
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
      </div>
    </div>
  );
}

// Number of word chips shown per page in the mobile strip
const WORDS_PER_PAGE = 5;

/** Compact paginated word strip for mobile — shows arrows so kids know there are more words */
function MobileWordStrip({ placedWords }: { placedWords: ReturnType<typeof useGame>['placedWords'] }) {
  const { revealWord } = useGame();
  const [pendingWord, setPendingWord] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const found = placedWords.filter(w => w.found).length;
  const total = placedWords.length;
  const totalPages = Math.ceil(total / WORDS_PER_PAGE);
  // Clamp page in case word count changes
  const safePage = Math.min(page, totalPages - 1);
  const pageWords = placedWords.slice(safePage * WORDS_PER_PAGE, (safePage + 1) * WORDS_PER_PAGE);

  function confirmReveal() {
    if (pendingWord) revealWord(pendingWord);
    setPendingWord(null);
  }

  return (
    <>
      <div dir="rtl">
        {/* Header row */}
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

        {/* Paginated word chips with arrow buttons — left=previous, right=next */}
        <div className="flex items-center gap-1">
          {/* Left arrow — previous page */}
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 font-bold text-base disabled:opacity-20 active:scale-90 transition"
            aria-label="עמוד קודם"
          >
            ‹
          </button>

          {/* Word chips for current page */}
          <div className="flex-1 flex gap-1.5 justify-center flex-wrap">
            {pageWords.map(({ word, found: isFound, color }) => (
              <button
                key={word}
                onClick={() => !isFound && setPendingWord(word)}
                disabled={isFound}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
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

          {/* Right arrow — next page */}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 font-bold text-base disabled:opacity-20 active:scale-90 transition"
            aria-label="עמוד הבא"
          >
            ›
          </button>
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1 mt-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ backgroundColor: i === safePage ? '#6366f1' : '#d1d5db' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmation popup */}
      {pendingWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setPendingWord(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full mx-4 text-center"
            dir="rtl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-3xl mb-3">🤔</div>
            <p className="text-gray-700 font-semibold text-base mb-1">
              נראה שקשה לך למצוא את המילה
            </p>
            <p className="text-gray-500 text-sm mb-5">
              רוצה שאני אמצא את <span className="font-bold text-indigo-600">{pendingWord}</span> בשבילך?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmReveal}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-5 py-2 rounded-xl transition"
              >
                כן, תמצא
              </button>
              <button
                onClick={() => setPendingWord(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-5 py-2 rounded-xl transition"
              >
                אני ממשיך לנסות
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
