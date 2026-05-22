# Word Search Game (תפזורת)

## Overview
A Hebrew word search puzzle game for children aged 7+.
The game is cheerful, simple, and fun — no timers, no pressure.
Built as a client-side React app with no backend.

## Tech Stack
- **React 18** — UI library
- **TypeScript** — type safety
- **Vite** — build tool & dev server
- **Tailwind CSS v3** — utility-first styling
- **React Router v6** — client-side routing

## Dev Commands
```bash
npm install        # install dependencies
npm run dev        # start dev server → http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build
```

## Routes
| Path          | Screen           |
|---------------|------------------|
| `/`           | MainMenu         |
| `/my-puzzles` | MyPuzzlesScreen  |
| `/game`       | GameBoard        |
| `/victory`    | VictoryScreen    |
| `/settings`   | SettingsScreen   |

## Project Structure
```
src/
├── types/
│   └── game.ts                  # All TypeScript interfaces & types
├── data/
│   └── wordBank.ts              # Hebrew word bank, ~100 words, 7 categories
├── utils/
│   ├── puzzleGenerator.ts       # Grid generation algorithm
│   ├── gameHelpers.ts           # Selection validation, path helpers
│   ├── sounds.ts                # Web Audio API sound effects
│   └── music.ts                 # Background music singleton (HTMLAudioElement)
├── context/                     # useGame() hook lives here too — no separate hooks/ dir
│   └── GameContext.tsx          # React Context — shared state across routes
└── components/
    ├── screens/
    │   ├── MainMenu.tsx          # Landing screen with diagonal ticker background
    │   ├── MyPuzzlesScreen.tsx   # Preset selection grid
    │   ├── GameBoard.tsx         # Active puzzle — desktop + mobile layouts
    │   ├── VictoryScreen.tsx     # Win screen
    │   └── SettingsScreen.tsx    # Preset manager (sidebar + editor panel)
    └── ui/
        ├── PuzzleGrid.tsx        # Letter grid with selection highlighting
        ├── WordList.tsx          # Word list with hint/reveal popup
        ├── MusicButton.tsx       # Global floating speaker toggle (bottom-left)
        └── icons.tsx             # SVG icon components
public/
├── favicon.svg
└── assets/
    ├── menu-illustration.png    # Hero image shown beside the main menu
    └── background-music.mp3     # Looping background music (Puzzle Picnic)
```

## Named Preset System

### Data Shape
```ts
// Stored as JSON array in localStorage under key 'wordSearch_presets'
interface PuzzlePreset {
  id: string;                   // Date.now().toString()
  name: string;                 // user-given name e.g. "חיות"
  emoji: string;                // auto-picked from first selected category, fallback ✏️
  gridSize: number;             // 8 | 10 | 12
  selectedCategories: string[]; // category labels e.g. ["חיות", "אוכל"]
  customWords: string;          // raw textarea value, parsed at game-start time
  directions: DirectionKey[];   // allowed placement directions
}
```

### Flow
1. **Settings** (`/settings`) — sidebar lists all presets; editor panel creates/edits them
2. **My Puzzles** (`/my-puzzles`) — card grid; tap a card → `startGameFromPreset(preset)` → `/game`
3. **Quick game** (`/`) → `startGame()` → random words, no preset name
4. `currentPreset` stored in GameContext so VictoryScreen can replay the same preset (new grid, same words)

## Game Logic

### Puzzle Generation
1. Create an empty N×N grid
2. Shuffle the word list (Fisher-Yates), then attempt to place each word
3. For each word: try random directions and positions; skip if can't fit
4. Fill empty cells with random Hebrew letters

### Word Selection (UI)
- **Tap/click cell A** → highlighted as selection start (orange)
- **Hover** → preview path from A to cursor highlighted (yellow)
- **Tap/click cell B** → validate path, check against placed words
- Tapping the same cell twice → cancels selection
- **Clicking a word in the list** → confirmation popup → `revealWord()` hint

### Directions (8 total)
| Key          | (dr, dc)  | Label    |
|--------------|-----------|----------|
| `right`      | (0, +1)   | ימינה    |
| `left`       | (0, -1)   | שמאלה    |
| `down`       | (+1, 0)   | למטה     |
| `up`         | (-1, 0)   | למעלה    |
| `down-right` | (+1, +1)  | אלכסון ↘ |
| `down-left`  | (+1, -1)  | אלכסון ↙ |
| `up-right`   | (-1, +1)  | אלכסון ↗ |
| `up-left`    | (-1, -1)  | אלכסון ↖ |

### Word Match
A selection from cell A to cell B is valid if:
- The path is a straight line (horizontal / vertical / 45° diagonal)
- The letters along the path match a placed word **forward or backward**

## Word Bank (`src/data/wordBank.ts`)
~100 words across 7 categories, each with a Hebrew label + emoji.

| Category | Hebrew  |
|----------|---------|
| Animals  | חיות    |
| Family   | משפחה   |
| Nature   | טבע     |
| Objects  | חפצים   |
| Food     | אוכל    |
| Colors   | צבעים   |
| Body     | גוף     |

**Quick game** — `getRandomAutoWords(10)` Fisher-Yates shuffles the full pool; different words every game.
**Preset game** — merges custom words + selected category words, shuffles, caps at 15.

To add words: append to the relevant array in `wordBank.ts`.
Keep words **2–5 Hebrew letters** for best fit on the default 10×10 grid.

## Grid Sizes
| Size  | Label  | Recommended for     |
|-------|--------|---------------------|
| 8×8   | קטנה   | Short sessions      |
| 10×10 | רגילה  | Default / auto mode |
| 12×12 | גדולה  | Experienced players |

## Sound & Music

### Sound Effects (`src/utils/sounds.ts`)
Synthesized with Web Audio API — no external files needed.
- `playHover()` — 880 Hz, 0.06s, soft tone on button hover
- `playClick()` — 520 Hz, 0.1s, click feedback
- `playWordFound()` — two-note 660 Hz → 880 Hz, celebratory chime

### Background Music (`src/utils/music.ts`)
- Singleton `HTMLAudioElement` loops `/assets/background-music.mp3` at 35% volume
- Starts on first user interaction (browser autoplay policy)
- Mute state persisted in `localStorage` under key `wordSearch_musicMuted`
- `MusicButton` component — fixed bottom-left, visible on all screens, shows SpeakerOn/SpeakerOff SVG

## Responsive Layout

### GameBoard
- **Desktop (≥ lg):** grid + word list side by side
- **Mobile (< lg):** grid centered (scrollable if oversized), horizontal word chip strip at bottom
- Cell sizes scale down on mobile: `w-6/w-7` for 12×12, `w-7` for 10×10, `w-9` for 8×8

### SettingsScreen
- **Desktop:** fixed sidebar (w-56) + editor panel
- **Mobile:** hamburger button in top bar opens a slide-in drawer for the preset list; editor takes full width

## Print Feature
- Click the 🖨️ button during a game
- The browser's native print dialog opens
- `@media print` CSS: hides all UI, shows only `.print-area`
- Grid stacks above word list, both centered, A4 portrait optimized

## Main Menu
- **Left column:** title + 3 buttons (משחק מהיר, התפזורת שלי, הגדרות)
- **Right column (desktop only):** hero illustration (`/assets/menu-illustration.png`)
- **Background:** diagonal scrolling ticker strips of Hebrew words at -20° rotation, 7 rows, alternating scroll directions, opacity 0.13–0.21
- Primary button pulses with `ctaPulse` CSS animation (scale 1→1.04)

## Hebrew / RTL Notes
- All UI text containers use `dir="rtl"`
- The grid itself is direction-neutral (single letters in cells)
- Font: **Heebo** loaded from Google Fonts (clean Hebrew, readable for kids)
- Final-form Hebrew letters (ך ם ן ף ץ) are **not** used as filler letters
  to avoid confusing young readers
- In RTL flex: icon placed **last** in JSX appears on the **left** side visually

## Coding Style
- **Always add meaningful comments** — every `const`, variable, function, and parameter should have a comment explaining its purpose and role
- Comments should explain *what* and *why*, not just restate the name
- Function parameters should be commented inline or via a short JSDoc-style block
- Examples:
  ```ts
  // Number of columns/rows in the square puzzle grid
  const gridSize = 10;

  /**
   * Marks a word as found without user interaction (hint/reveal feature).
   * @param word - The Hebrew word string to reveal on the grid
   */
  function revealWord(word: string) { ... }
  ```

## Key Design Decisions
- **No timer** — relaxed, pressure-free
- **React Router v6** — each screen is a real route; browser back button works
- **React Context** — game state shared between screens without prop drilling; includes `currentPreset` for replay
- **Color-coded found words** — each found word gets a unique highlight color
- **Mobile-first** — responsive layouts for all screens, hamburger drawer on settings
- **No external state library** — Context covers all needs
- **No external audio files for SFX** — Web Audio API synthesis only
- **Victory replay** — "שחק שוב" replays the same mode: preset games re-run `startGameFromPreset` (new grid), quick games re-run `startGame`
