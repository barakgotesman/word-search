/**
 * Lightweight sound engine built on the Web Audio API.
 * No external files — all sounds are synthesized in the browser.
 * A single AudioContext is reused across all calls to avoid resource leaks.
 */

/** Lazily created shared audio context — created on first user interaction */
let ctx: AudioContext | null = null;

/** Returns the shared AudioContext, creating it on first call */
function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  // Resume in case the browser auto-suspended it (common on mobile)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/**
 * Plays a simple sine-wave tone.
 *
 * @param frequency - Pitch in Hz
 * @param duration  - How long the tone lasts in seconds
 * @param volume    - Gain level 0–1
 * @param type      - Oscillator waveform ('sine' | 'triangle' | 'square')
 */
function playTone(
  frequency: number,
  duration: number,
  volume = 0.3,
  type: OscillatorType = 'sine',
) {
  const ac = getCtx();

  // Oscillator generates the raw waveform at the given pitch
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ac.currentTime);

  // GainNode controls volume and applies a quick fade-out to avoid clicks
  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

/**
 * Subtle high tick played when the mouse hovers a menu button.
 * Very short and quiet so it doesn't feel intrusive.
 */
export function playHover() {
  playTone(880, 0.06, 0.12, 'sine');
}

/**
 * Satisfying click pop played when a menu button is pressed.
 * Slightly lower pitch than hover to feel like a real press.
 */
export function playClick() {
  playTone(520, 0.1, 0.25, 'sine');
}

/**
 * Cheerful two-note chime played when the player finds a hidden word.
 * Two ascending notes give a "success" feeling without being annoying.
 */
export function playWordFound() {
  playTone(660, 0.15, 0.3, 'sine');
  // Second note delayed by 120ms for a two-tone "ding-ding" effect
  setTimeout(() => playTone(880, 0.2, 0.3, 'sine'), 120);
}
