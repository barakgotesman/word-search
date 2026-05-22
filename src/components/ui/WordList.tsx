import { useState } from 'react';
import type { PlacedWord } from '../../types/game';
import { Check } from '../ui/icons';
import { useGame } from '../../context/GameContext';

interface Props {
  placedWords: PlacedWord[];
}

export default function WordList({ placedWords }: Props) {
  const { revealWord } = useGame();
  const [pendingWord, setPendingWord] = useState<string | null>(null);

  const found = placedWords.filter(w => w.found).length;
  const total = placedWords.length;

  function handleWordClick(word: string, isFound: boolean) {
    if (isFound) return;
    setPendingWord(word);
  }

  function confirmReveal() {
    if (pendingWord) revealWord(pendingWord);
    setPendingWord(null);
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md print:shadow-none p-4 w-full h-full flex flex-col" dir="rtl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-600">מילים למצוא</h2>
          <span className="text-sm font-semibold text-gray-400 print:hidden">{found}/{total}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 print:hidden">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: total > 0 ? `${(found / total) * 100}%` : '0%',
              backgroundColor: '#4ECDC4',
            }}
          />
        </div>

        {/* Word list — 2 columns when ≥8 words so all fit without scrolling */}
        <div
          className={`flex-1 grid gap-1.5 content-start ${placedWords.length >= 8 ? 'grid-cols-2' : 'grid-cols-1'}`}
        >
          {placedWords.map(({ word, found, color }) => (
            <button
              key={word}
              onClick={() => handleWordClick(word, found)}
              disabled={found}
              className={`flex items-center justify-between px-2 py-1.5 rounded-xl transition-all duration-300 w-full text-right ${
                found ? 'cursor-default' : 'cursor-pointer hover:brightness-95 active:scale-95'
              }`}
              style={{
                backgroundColor: found ? color + '22' : '#F9FAFB',
                borderRight: `3px solid ${found ? color : 'transparent'}`,
              }}
            >
              <span
                className={`text-sm font-bold transition-all duration-300 ${found ? 'line-through opacity-50' : 'opacity-100'}`}
                style={{ color: found ? color : '#374151' }}
              >
                {word}
              </span>
              {found && <Check size={14} style={{ color }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation popup */}
      {pendingWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 print:hidden"
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
