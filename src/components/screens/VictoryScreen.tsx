import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { Trophy, Star, Play, Home } from '../ui/icons';

export default function VictoryScreen() {
  const navigate = useNavigate();
  const { startGame, startGameFromPreset, currentPreset } = useGame();

  const handlePlayAgain = () => {
    if (currentPreset) {
      startGameFromPreset(currentPreset);
    } else {
      startGame();
    }
    navigate('/game');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 text-center"
      style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}
      dir="rtl"
    >
      <Trophy size={96} className="text-white drop-shadow-lg animate-bounce" />

      <div>
        <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">כל הכבוד!</h1>
        <p className="text-white/90 text-2xl font-semibold">מצאת את כל המילים</p>
        <p className="text-white/70 text-lg mt-2">אתה אלוף התפזורות</p>
      </div>

      <div className="flex gap-3">
        <Star size={40} className="text-white" />
        <Star size={40} className="text-white" />
        <Star size={40} className="text-white" />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handlePlayAgain}
          className="
            bg-white text-orange-500 font-black text-xl
            py-5 rounded-2xl shadow-xl
            flex items-center justify-center gap-3
            hover:scale-105 active:scale-95 transition-transform duration-150
          "
        >
          <Play size={22} className="text-orange-400" />
          שחק שוב
        </button>
        <button
          onClick={() => navigate('/')}
          className="
            bg-white/20 text-white font-bold text-lg
            py-4 rounded-2xl border-2 border-white/40
            flex items-center justify-center gap-3
            hover:bg-white/30 active:scale-95 transition-all duration-150
          "
        >
          <Home size={20} className="text-white/80" />
          תפריט ראשי
        </button>
      </div>
    </div>
  );
}
