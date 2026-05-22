import { useNavigate } from 'react-router-dom';
import { Play, Settings, Puzzle, Pencil } from '../ui/icons';
import { playHover, playClick } from '../../utils/sounds';
import { useGame } from '../../context/GameContext';

const WORDS = [
  'כלב','חתול','ארי','פיל','ציפור','דג','סוס','פרה','ארנב',
  'אמא','אבא','ילד','ילדה','אח','אחות','סבא','סבתא',
  'בית','שמש','ירח','כוכב','ענן','גשם','פרח','עץ','ים',
  'לחם','גבינה','תפוח','מים','חלב','ביצה','סוכר','מלח',
  'אדום','כחול','ירוק','צהוב','סגול','כתום','ורוד','לבן',
  'יד','רגל','עין','אוזן','לב','ראש','אף','פה',
];

// Build a wide repeating text string for one row
function rowText(offset: number): string {
  const rotated = [...WORDS.slice(offset % WORDS.length), ...WORDS.slice(0, offset % WORDS.length)];
  const once = rotated.join('  ·  ') + '  ·  ';
  return once + once + once; // triple so seamless
}

// 18 rows, alternating scroll direction, slightly varied speed
const ROWS = Array.from({ length: 18 }, (_, i) => ({
  offset: (i * 5) % WORDS.length,
  dir: i % 2 === 0 ? 'L' : 'R' as 'L' | 'R',
  duration: 35 + (i % 5) * 8, // 35–67s
  opacity: 0.13 + (i % 3) * 0.04, // 0.13–0.21
  size: i % 3 === 0 ? '1rem' : i % 3 === 1 ? '0.8rem' : '0.9rem',
}));

export default function MainMenu() {
  const navigate = useNavigate();
  const { startGame } = useGame();

  function handleAutoGame() {
    playClick();
    startGame();
    navigate('/game');
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
      dir="rtl"
    >
      {/*
        Full-bleed diagonal ticker:
        A huge rotated container fills the entire screen.
        Inside it, rows of text scroll straight left/right.
        The container's rotation makes them appear diagonal.
      */}
      <div
        className="absolute pointer-events-none select-none"
        aria-hidden
        style={{
          width: '300vw',
          height: '300vh',
          top: '-100vh',
          left: '-100vw',
          transform: 'rotate(-20deg)',
          transformOrigin: 'center center',
          overflow: 'hidden',
        }}
      >
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="absolute w-full overflow-hidden"
            style={{ top: `${i * (100 / ROWS.length)}%`, height: `${100 / ROWS.length}%` }}
          >
            <div
              className="whitespace-nowrap font-black text-white absolute"
              style={{
                fontSize: row.size,
                opacity: row.opacity,
                animation: `ticker${row.dir} ${row.duration}s linear infinite`,
                top: '50%',
                transform: 'translateY(-50%)',
                left: 0,
              }}
            >
              {rowText(row.offset)}
            </div>
          </div>
        ))}
      </div>

      {/* Frosted glass backdrop — makes text readable over the moving background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(80,60,160,0.45) 0%, transparent 100%)' }}
      />

      {/* Side-by-side layout: menu left, image right (stacks on mobile) */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 w-full max-w-5xl px-4">

        {/* Left column: title + buttons */}
        <div className="flex flex-col items-center gap-6 w-full max-w-xs flex-shrink-0">

          <div className="text-center">
            <Puzzle size={64} className="mx-auto mb-2 text-white/90" />
            <h1 className="text-6xl font-black text-white drop-shadow-lg tracking-wide">תפזורת</h1>
            <p className="text-white/70 text-lg mt-1 font-medium">מצא את המילות הנסתרות</p>
          </div>

          <div className="flex flex-col gap-4 w-full">

        {/* Primary CTA — pulses gently to draw attention */}
        <button
          onClick={handleAutoGame}
          onMouseEnter={playHover}
          className="
            bg-white text-purple-700 font-black text-xl
            py-5 rounded-2xl
            flex items-center justify-center gap-3
            active:scale-95
          "
          style={{ animation: 'ctaPulse 2.6s ease-in-out infinite' }}
        >
          משחק מהיר
          <Play size={24} className="text-purple-500" />
        </button>

        <button
          onClick={() => { playClick(); navigate('/my-puzzles'); }}
          onMouseEnter={playHover}
          className="
            bg-white/20 text-white font-black text-lg
            py-4 rounded-2xl border-2 border-white/40
            flex items-center justify-center gap-3
            hover:bg-white/30 active:scale-95
            transition-all duration-150
          "
        >
          התפזורת שלי
          <Pencil size={20} className="text-white/80" />
        </button>

        <button
          onClick={() => { playClick(); navigate('/settings'); }}
          onMouseEnter={playHover}
          className="
            bg-white/10 text-white/70 font-semibold text-base
            py-3 rounded-2xl border border-white/20
            flex items-center justify-center gap-2
            hover:bg-white/20 active:scale-95
            transition-all duration-150
          "
        >
          הגדרות
          <Settings size={18} className="text-white/60" />
        </button>

          </div>
        </div>

        {/* Right column: illustration — hidden on small screens */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <img
            src="/assets/menu-illustration.png"
            alt="תפזורת עברית"
            className="w-full max-w-md rounded-3xl shadow-2xl"
            style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }}
          />
        </div>

      </div>
    </div>
  );
}
