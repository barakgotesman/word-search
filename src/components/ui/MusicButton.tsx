import { useState, useEffect } from 'react';
import { SpeakerOn, SpeakerOff } from './icons';
import { isMusicMuted, toggleMusic, startMusic } from '../../utils/music';

export default function MusicButton() {
  const [muted, setMuted] = useState(isMusicMuted);

  // Start music on first user interaction with the page
  useEffect(() => {
    function handleFirstInteraction() {
      startMusic();
      window.removeEventListener('pointerdown', handleFirstInteraction);
    }
    window.addEventListener('pointerdown', handleFirstInteraction);
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, []);

  function handleToggle() {
    const nowMuted = toggleMusic();
    setMuted(nowMuted);
  }

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'הפעל מוזיקה' : 'השתק מוזיקה'}
      className="
        fixed bottom-4 left-4 z-50
        w-11 h-11 rounded-full
        bg-black/30 hover:bg-black/50
        backdrop-blur-md border border-white/20
        flex items-center justify-center
        text-white transition-all duration-200
        shadow-xl hover:scale-110 active:scale-95
        print:hidden
      "
    >
      {muted ? <SpeakerOff size={20} /> : <SpeakerOn size={20} />}
    </button>
  );
}
