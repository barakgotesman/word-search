import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WORD_CATEGORIES } from '../../data/wordBank';
import { ArrowLeft, Pencil, Trash } from '../ui/icons';
import { playClick, playHover } from '../../utils/sounds';
import type { DirectionKey } from '../../types/game';
import { PRESETS_KEY, type PuzzlePreset } from '../../context/GameContext';

interface SizeOption {
  size: number;
  label: string;
  desc: string;
}

const SIZE_OPTIONS: SizeOption[] = [
  { size: 8,  label: 'קטנה',  desc: '8×8' },
  { size: 10, label: 'רגילה', desc: '10×10' },
  { size: 12, label: 'גדולה', desc: '12×12' },
];


const MAX_CUSTOM_WORDS = 15;

// 3×3 compass matrix — null = center origin cell, others map to a DirectionKey
const COMPASS_CELLS: ({ key: DirectionKey; arrow: string; label: string } | null)[] = [
  { key: 'up-right',   arrow: '↗', label: 'אלכסון ↗' },
  { key: 'up',         arrow: '↑', label: 'למעלה'    },
  { key: 'up-left',    arrow: '↖', label: 'אלכסון ↖' },
  { key: 'right',      arrow: '→', label: 'ימינה'    },
  null,
  { key: 'left',       arrow: '←', label: 'שמאלה'   },
  { key: 'down-right', arrow: '↘', label: 'אלכסון ↘' },
  { key: 'down',       arrow: '↓', label: 'למטה'     },
  { key: 'down-left',  arrow: '↙', label: 'אלכסון ↙' },
];

const DEFAULT_DIRECTIONS: DirectionKey[] = [
  'right', 'left', 'down', 'up',
  'down-right', 'down-left', 'up-right', 'up-left',
];

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth={2.5} strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"  stroke="currentColor" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" />
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={2.5} strokeLinecap="round">
      <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" />
      <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" />
    </svg>
  );
}

function loadPresets(): PuzzlePreset[] {
  try { return JSON.parse(localStorage.getItem(PRESETS_KEY) ?? '[]'); }
  catch { return []; }
}

function savePresets(presets: PuzzlePreset[]) {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export default function SettingsScreen() {
  const navigate = useNavigate();

  const [presets, setPresets] = useState<PuzzlePreset[]>([]);

  // Which preset is selected in the sidebar — null means "new preset" mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mobile: drawer open state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Editor fields
  const [name, setName] = useState('');
  const [gridSize, setGridSize] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [directions, setDirections] = useState<DirectionKey[]>(DEFAULT_DIRECTIONS);

  const [saved, setSaved] = useState(false);

  // ID of preset awaiting delete confirmation
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadPresets();
    setPresets(loaded);
    clearEditor(); // always start in "new preset" mode
  }, []);

  /** Loads a preset's data into the editor form */
  function openEditor(preset: PuzzlePreset) {
    setEditingId(preset.id);
    setName(preset.name);
    setGridSize(preset.gridSize);
    setSelectedCategories(preset.selectedCategories);
    setCustomInput(preset.customWords);
    setDirections(preset.directions);
    setSaved(false);
    setDrawerOpen(false); // close drawer on mobile after selecting
  }

  /** Resets the editor to blank "new preset" state */
  function clearEditor() {
    setEditingId(null);
    setName('');
    setGridSize(10);
    setSelectedCategories([]);
    setCustomInput('');
    setDirections(DEFAULT_DIRECTIONS);
    setSaved(false);
    setDrawerOpen(false);
  }

  function toggleCategory(label: string) {
    setSelectedCategories(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  }

  function toggleDirection(key: DirectionKey) {
    setDirections(prev => {
      if (prev.includes(key) && prev.length === 1) return prev;
      return prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key];
    });
  }

  function parsedCustomWords(): string[] {
    return [...new Set(
      customInput.split(/[\n,،\s]+/).map(w => w.trim()).filter(w => w.length >= 2)
    )].slice(0, MAX_CUSTOM_WORDS);
  }

  // Words that are too long to fit in the selected grid size
  function tooLongWords(): string[] {
    return parsedCustomWords().filter(w => w.length > gridSize);
  }

  function handleSave() {
    const emoji = WORD_CATEGORIES.find(c => selectedCategories.includes(c.label))?.emoji ?? '✏️';

    let updated: PuzzlePreset[];
    let savedId = editingId;

    if (editingId) {
      updated = presets.map(p =>
        p.id === editingId
          ? { ...p, name, emoji, gridSize, selectedCategories, customWords: customInput, directions }
          : p
      );
    } else {
      const newPreset: PuzzlePreset = {
        id: Date.now().toString(),
        name, emoji, gridSize,
        selectedCategories,
        customWords: customInput,
        directions,
      };
      updated = [...presets, newPreset];
      savedId = newPreset.id;
    }

    setPresets(updated);
    savePresets(updated);
    setEditingId(savedId);
    playClick();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function confirmDelete() {
    if (!pendingDeleteId) return;
    const updated = presets.filter(p => p.id !== pendingDeleteId);
    setPresets(updated);
    savePresets(updated);
    if (editingId === pendingDeleteId) {
      if (updated.length > 0) openEditor(updated[0]);
      else clearEditor();
    }
    setPendingDeleteId(null);
    playClick();
  }

  const totalWords = [...new Set([
    ...parsedCustomWords(),
    ...WORD_CATEGORIES
      .filter(cat => selectedCategories.includes(cat.label))
      .flatMap(cat => cat.words),
  ])].length;

  const canSave = name.trim().length > 0 && totalWords > 0;
  const pendingDeleteName = presets.find(p => p.id === pendingDeleteId)?.name;
  const isNewMode = editingId === null;

  /** The preset list content — shared between sidebar and drawer */
  const PresetList = () => (
    <>
      <button
        onClick={() => { playClick(); clearEditor(); }}
        onMouseEnter={playHover}
        className={`flex items-center gap-2 px-4 py-3.5 text-sm font-bold border-b border-orange-100 transition-all w-full ${
          isNewMode
            ? 'bg-orange-500 text-white'
            : 'text-orange-500 hover:bg-orange-50'
        }`}
      >
        <span className="text-lg leading-none">+</span>
        תפזורת חדשה
      </button>

      {presets.length === 0 && (
        <p className="text-xs text-gray-400 text-center px-4 py-6">עדיין אין תפזורות — צור את הראשונה!</p>
      )}

      {presets.map(preset => (
        <div
          key={preset.id}
          className={`group flex items-center gap-2 px-3 py-3 border-b border-orange-50 transition-all cursor-pointer ${
            editingId === preset.id
              ? 'bg-orange-50 border-r-4 border-r-orange-400'
              : 'hover:bg-orange-50/60'
          }`}
          onClick={() => { playClick(); openEditor(preset); }}
        >
          <span className="text-xl flex-shrink-0">{preset.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-800 text-sm truncate">{preset.name}</div>
            <div className="text-xs text-gray-400">{preset.gridSize}×{preset.gridSize}</div>
          </div>
          <div className={`flex gap-0.5 flex-shrink-0 transition-opacity ${editingId === preset.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <button
              onClick={e => { e.stopPropagation(); playClick(); openEditor(preset); }}
              onMouseEnter={playHover}
              className="p-1.5 rounded hover:bg-orange-100 text-orange-400"
              title="ערוך"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); playClick(); setPendingDeleteId(preset.id); }}
              onMouseEnter={playHover}
              className="p-1.5 rounded hover:bg-red-100 text-red-400"
              title="מחק"
            >
              <Trash size={14} />
            </button>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-orange-100 to-pink-100" dir="rtl">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <button
          onClick={() => { playClick(); navigate('/'); }}
          onMouseEnter={playHover}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/60 transition"
        >
          <ArrowLeft size={16} />
          חזרה
        </button>

        <h1 className="text-xl font-black text-orange-600">הגדרות תפזורת</h1>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => { playClick(); setDrawerOpen(o => !o); }}
          onMouseEnter={playHover}
          className="md:hidden flex items-center gap-1 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-white/60 transition"
          aria-label="תפריט תפזורות"
        >
          {drawerOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>

        {/* Spacer to balance layout on desktop */}
        <div className="hidden md:block w-20" />
      </div>

      {/* Two-panel layout — desktop */}
      <div className="flex flex-1 min-h-0 gap-0 relative">

        {/* ── Sidebar: preset list (desktop only) ── */}
        <div className="hidden md:flex w-56 flex-shrink-0 flex-col bg-white/70 border-l border-orange-100 overflow-y-auto">
          <PresetList />
        </div>

        {/* ── Mobile drawer: slides down from top bar ── */}
        {drawerOpen && (
          <div
            className="md:hidden absolute inset-0 z-40"
            onClick={() => setDrawerOpen(false)}
          >
            <div
              className="absolute top-0 right-0 w-full max-w-xs bg-white shadow-2xl rounded-bl-2xl overflow-y-auto max-h-full border-l border-orange-100"
              onClick={e => e.stopPropagation()}
            >
              <PresetList />
            </div>
          </div>
        )}

        {/* ── Editor panel ── */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 flex justify-center">
          <div className="w-full max-w-md">

            {/* Mobile: show which preset is active */}
            <div className="md:hidden flex items-center gap-2 mb-4 px-1">
              <span className="text-orange-400 text-sm font-bold">
                {isNewMode ? '✨ תפזורת חדשה' : `עורך: ${name || '...'}`}
              </span>
              {presets.length > 0 && (
                <button
                  onClick={() => { playClick(); setDrawerOpen(true); }}
                  className="text-xs text-orange-500 underline"
                >
                  החלף תפזורת
                </button>
              )}
            </div>

            {/* Panel header — desktop */}
            <h2 className="hidden md:block text-lg font-black text-gray-700 mb-5 pb-3 border-b border-orange-200">
              {isNewMode ? '✨ תפזורת חדשה' : `עריכה: ${name || '...'}`}
            </h2>

            {/* Name */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-600 block mb-1.5">שם התפזורת</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='למשל: "חיות" או "שיעור אנגלית"'
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-700 focus:outline-none focus:border-orange-400 bg-white"
              />
            </div>

            {/* Grid size */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-600 block mb-2">גודל לוח</label>
              <div className="grid grid-cols-3 gap-2">
                {SIZE_OPTIONS.map(opt => (
                  <button
                    key={opt.size}
                    onClick={() => { playClick(); setGridSize(opt.size); }}
                    onMouseEnter={playHover}
                    className={`rounded-xl p-2.5 text-center border-2 transition-all bg-white ${
                      gridSize === opt.size ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <div className="font-black text-base text-gray-800">{opt.label}</div>
                    <div className="text-xs text-gray-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-600 block mb-2">קטגוריות מילים</label>
              <div className="flex flex-wrap gap-2">
                {WORD_CATEGORIES.map(cat => {
                  const active = selectedCategories.includes(cat.label);
                  return (
                    <button
                      key={cat.label}
                      onClick={() => { playClick(); toggleCategory(cat.label); }}
                      onMouseEnter={playHover}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-bold text-sm transition-all ${
                        active ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom words */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-600 block mb-1">מילים משלי</label>
              <p className="text-xs text-gray-400 mb-2">מופרדות בפסיק או שורה חדשה (עד {MAX_CUSTOM_WORDS})</p>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="למשל: שלום, עולם, ילד..."
                rows={3}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:border-orange-400 resize-none bg-white"
              />
              {parsedCustomWords().length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {parsedCustomWords().map(w => {
                    const tooLong = w.length > gridSize;
                    return (
                      <span
                        key={w}
                        title={tooLong ? `המילה ארוכה מדי ללוח ${gridSize}×${gridSize}` : undefined}
                        className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                          tooLong
                            ? 'bg-red-100 text-red-500 line-through'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {w}
                      </span>
                    );
                  })}
                </div>
              )}
              {tooLongWords().length > 0 && (
                <p className="text-xs text-red-500 font-bold mt-1.5">
                  ⚠️ {tooLongWords().length === 1
                    ? `המילה "${tooLongWords()[0]}" ארוכה מדי ללוח ${gridSize}×${gridSize} ולא תופיע במשחק`
                    : `${tooLongWords().length} מילים ארוכות מדי ללוח ${gridSize}×${gridSize} ולא יופיעו במשחק`
                  }
                </p>
              )}
            </div>

            {/* Directions — 3×3 compass matrix */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-600 block mb-2">כיוונים מותרים</label>
              <div className="flex items-center justify-center gap-4">
                {/* 3×3 grid: each cell is a direction, center is the origin dot */}
                <div className="grid grid-cols-3 gap-1.5">
                  {COMPASS_CELLS.map(cell => {
                    if (cell === null) {
                      // Center cell — non-interactive origin
                      return (
                        <div
                          key="center"
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-100"
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                        </div>
                      );
                    }
                    const active = directions.includes(cell.key);
                    return (
                      <button
                        key={cell.key}
                        onClick={() => { playClick(); toggleDirection(cell.key); }}
                        onMouseEnter={playHover}
                        title={cell.label}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl text-xl border-2 transition-all active:scale-90 ${
                          active
                            ? 'border-orange-400 bg-orange-50 text-orange-500'
                            : 'border-gray-200 bg-white text-gray-300 hover:border-orange-200 hover:text-gray-400'
                        }`}
                      >
                        {cell.arrow}
                      </button>
                    );
                  })}
                </div>

                {/* Legend: how many directions are active */}
                <div className="text-sm text-gray-500 leading-relaxed">
                  <p className="font-bold text-gray-700">{directions.length} כיוונים</p>
                  <p className="text-xs">לחץ על החצים<br />להפעלה/כיבוי</p>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              onMouseEnter={playHover}
              disabled={!canSave}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-sm transition-all mb-8 ${
                saved
                  ? 'bg-green-500 text-white'
                  : canSave
                    ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saved ? 'נשמר ✓' : canSave ? `שמור (${Math.min(totalWords, 15)} מילים)` : 'הכנס שם ומילים כדי לשמור'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {pendingDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setPendingDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full mx-4 text-center"
            dir="rtl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3 text-red-400">
              <Trash size={32} />
            </div>
            <p className="text-gray-800 font-bold text-base mb-1">למחוק את התפזורת?</p>
            <p className="text-gray-500 text-sm mb-5">
              <span className="font-bold text-gray-700">{pendingDeleteName}</span> תימחק לצמיתות
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-xl transition"
              >
                כן, מחק
              </button>
              <button
                onClick={() => setPendingDeleteId(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-5 py-2 rounded-xl transition"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
