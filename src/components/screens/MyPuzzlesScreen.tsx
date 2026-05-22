import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '../ui/icons';
import { playClick, playHover } from '../../utils/sounds';
import { PRESETS_KEY, type PuzzlePreset } from '../../context/GameContext';
import { useGame } from '../../context/GameContext';

export default function MyPuzzlesScreen() {
  const navigate = useNavigate();
  const { startGameFromPreset } = useGame();

  // All saved presets loaded from localStorage
  const [presets, setPresets] = useState<PuzzlePreset[]>([]);

  useEffect(() => {
    try {
      const loaded: PuzzlePreset[] = JSON.parse(localStorage.getItem(PRESETS_KEY) ?? '[]');
      setPresets(loaded);
    } catch {
      setPresets([]);
    }
  }, []);

  /**
   * Starts a game from the selected preset and navigates to the game board.
   * @param preset - The preset the user tapped
   */
  function handlePlay(preset: PuzzlePreset) {
    playClick();
    startGameFromPreset(preset);
    navigate('/game');
  }

  // Helper: human-readable grid size label
  function sizeLabel(n: number): string {
    if (n === 8) return 'קטנה';
    if (n === 12) return 'גדולה';
    return 'רגילה';
  }

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-6"
      style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
      dir="rtl"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full mb-8">
        <button
          onClick={() => { playClick(); navigate('/'); }}
          onMouseEnter={playHover}
          className="flex items-center gap-1 text-white/80 hover:text-white font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/20 transition"
        >
          <ArrowLeft size={16} />
          חזרה
        </button>
        <h1 className="text-2xl font-black text-white drop-shadow">התפזורות שלי</h1>
        <div className="w-16" />
      </div>

      <div className="max-w-lg mx-auto w-full flex-1">

        {/* Empty state */}
        {presets.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
            <span className="text-6xl">📭</span>
            <p className="text-white font-bold text-lg">אין תפזורות שמורות עדיין</p>
            <p className="text-white/70 text-sm">צור תפזורת חדשה בהגדרות</p>
            <button
              onClick={() => { playClick(); navigate('/settings'); }}
              onMouseEnter={playHover}
              className="mt-2 bg-white text-pink-600 font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              לך להגדרות
            </button>
          </div>
        )}

        {/* Preset cards grid */}
        {presets.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {presets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePlay(preset)}
                  onMouseEnter={playHover}
                  className="bg-white rounded-2xl p-5 shadow-lg text-center hover:scale-105 active:scale-95 transition-transform duration-150 flex flex-col items-center gap-2"
                >
                  {/* Large emoji representing the preset */}
                  <span className="text-4xl">{preset.emoji}</span>
                  <span className="font-black text-gray-800 text-base leading-tight">{preset.name}</span>
                  <span className="text-xs text-gray-400 font-medium">
                    {preset.gridSize}×{preset.gridSize} · {sizeLabel(preset.gridSize)}
                  </span>
                </button>
              ))}
            </div>

            {/* Link to settings to add more */}
            <button
              onClick={() => { playClick(); navigate('/settings'); }}
              onMouseEnter={playHover}
              className="w-full py-3 rounded-2xl border-2 border-white/50 text-white font-bold text-sm hover:bg-white/20 transition flex items-center justify-center gap-2"
            >
              + צור תפזורת חדשה
            </button>
          </>
        )}

      </div>
    </div>
  );
}
