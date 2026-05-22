import { getCellsBetween, coordsEqual, getFoundCellsMap } from '../../utils/gameHelpers';
import type { CellCoord, PlacedWord } from '../../types/game';

interface Props {
  grid: string[][];
  gridSize: number;
  placedWords: PlacedWord[];
  selectionStart: CellCoord | null;
  selectionEnd: CellCoord | null;
  onCellClick: (cell: CellCoord) => void;
  onCellHover: (cell: CellCoord) => void;
}

export default function PuzzleGrid({
  grid,
  gridSize,
  placedWords,
  selectionStart,
  selectionEnd,
  onCellClick,
  onCellHover,
}: Props) {
  const foundMap = getFoundCellsMap(placedWords);

  const previewPath =
    selectionStart && selectionEnd
      ? getCellsBetween(selectionStart, selectionEnd) ?? []
      : selectionStart
        ? [selectionStart]
        : [];

  const previewSet = new Set(previewPath.map(c => `${c.row},${c.col}`));

  const fontSize = gridSize <= 10 ? 'text-base sm:text-lg' : 'text-xs sm:text-base';
  const cellSize = gridSize <= 8
    ? 'w-9 h-9 sm:w-10 sm:h-10'
    : gridSize <= 10
      ? 'w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10'
      : 'w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9';

  return (
    <div
      className="inline-grid gap-1"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {grid.map((row, ri) =>
        row.map((letter, ci) => {
          const key = `${ri},${ci}`;
          const foundColor = foundMap.get(key);
          const isInPreview = previewSet.has(key);
          const isStart = selectionStart && coordsEqual(selectionStart, { row: ri, col: ci });

          let bgStyle: React.CSSProperties = {};
          let extraClass = 'bg-white hover:bg-blue-50 border border-gray-200';

          if (foundColor) {
            bgStyle = { backgroundColor: foundColor };
            extraClass = 'border-transparent';
          } else if (isStart) {
            extraClass = 'bg-orange-400 border-orange-500 scale-110';
          } else if (isInPreview) {
            extraClass = 'bg-yellow-300 border-yellow-400';
          }

          return (
            <button
              key={key}
              onClick={() => onCellClick({ row: ri, col: ci })}
              onMouseEnter={() => onCellHover({ row: ri, col: ci })}
              style={bgStyle}
              className={`
                ${cellSize} ${fontSize} ${extraClass}
                flex items-center justify-center
                rounded-lg font-bold
                transition-all duration-100
                active:scale-95 select-none cursor-pointer
                shadow-sm
              `}
            >
              {letter}
            </button>
          );
        }),
      )}
    </div>
  );
}
