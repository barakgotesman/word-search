export interface WordCategory {
  label: string;
  emoji: string;
  words: string[];
}

// All available words organized by category.
// Keep words 2–5 Hebrew letters for best fit on the default 10×10 grid.
export const WORD_CATEGORIES: WordCategory[] = [
  {
    label: 'חיות',
    emoji: '🐾',
    // Common animals a child aged 7+ would recognize
    words: ['כלב', 'חתול', 'ארנב', 'ציפור', 'סוס', 'פרה', 'אריה', 'פיל', 'גמל', 'קוף',
            'דג', 'כבש', 'עז', 'תרנגול', 'ברווז', 'נחש', 'צב', 'זאב', 'שועל', 'דוב'],
  },
  {
    label: 'משפחה',
    emoji: '👨‍👩‍👧',
    // Family member names used by Israeli children
    words: ['אמא', 'אבא', 'אח', 'אחות', 'סבא', 'סבתא', 'דוד', 'דודה', 'בן', 'בת'],
  },
  {
    label: 'טבע',
    emoji: '🌿',
    // Nature words — sky, weather, and landscape elements
    words: ['שמש', 'ירח', 'כוכב', 'ענן', 'גשם', 'פרח', 'עץ', 'ים', 'הר',
            'נהר', 'אבן', 'עלה', 'רוח', 'שלג', 'ברק', 'שדה', 'יער', 'חול'],
  },
  {
    label: 'חפצים',
    emoji: '🎒',
    // Everyday objects a child encounters at home or school
    words: ['בית', 'ספר', 'כדור', 'כיסא', 'תיק', 'עיפרון', 'שולחן', 'מיטה',
            'דלת', 'חלון', 'מחברת', 'מספריים', 'שעון', 'נעל', 'כובע', 'מטריה'],
  },
  {
    label: 'אוכל',
    emoji: '🍎',
    // Foods familiar to Israeli children
    words: ['תפוח', 'לחם', 'חלב', 'ביצה', 'דבש', 'עוגה', 'גלידה',
            'גזר', 'בננה', 'ענב', 'תות', 'אבטיח', 'פסטה', 'אורז', 'סלט'],
  },
  {
    label: 'צבעים',
    emoji: '🎨',
    // Basic colors — short words that fit easily in the grid
    words: ['אדום', 'כחול', 'ירוק', 'צהוב', 'לבן', 'שחור', 'כתום', 'סגול', 'ורוד', 'חום'],
  },
  {
    label: 'גוף',
    emoji: '🧍',
    // Body parts — simple vocabulary for young learners
    words: ['יד', 'רגל', 'ראש', 'עין', 'אוזן', 'אף', 'פה', 'שן', 'שיער', 'גב'],
  },
];

/**
 * Picks `count` random words spread across all categories.
 * Shuffles the full combined word pool so every game is different.
 *
 * @param count - How many words to return (default 10)
 * @returns Array of unique Hebrew words ready for puzzle generation
 */
export function getRandomAutoWords(count = 10): string[] {
  // Flatten all category words into one pool
  const pool = WORD_CATEGORIES.flatMap(cat => cat.words);

  // Fisher-Yates shuffle for true randomness
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}
