// Singleton audio element for background music — shared across the whole app
let audio: HTMLAudioElement | null = null;

// Persisted mute preference
const MUTED_KEY = 'wordSearch_musicMuted';

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio('/assets/background-music.mp3');
    audio.loop = true;
    audio.volume = 0.35;
  }
  return audio;
}

export function isMusicMuted(): boolean {
  return localStorage.getItem(MUTED_KEY) === 'true';
}

export function startMusic() {
  if (isMusicMuted()) return;
  const a = getAudio();
  if (a.paused) a.play().catch(() => {});
}

export function stopMusic() {
  audio?.pause();
}

export function toggleMusic(): boolean {
  const nowMuted = !isMusicMuted();
  localStorage.setItem(MUTED_KEY, String(nowMuted));
  if (nowMuted) {
    stopMusic();
  } else {
    startMusic();
  }
  return nowMuted;
}
