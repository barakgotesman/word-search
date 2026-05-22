import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function ArrowRight({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path stroke="currentColor" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function ArrowLeft({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path stroke="currentColor" d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function Home({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path stroke="currentColor" d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path stroke="currentColor" d="M9 21V12h6v9" />
    </svg>
  );
}

export function Settings({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
      <path
        stroke="currentColor"
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      />
    </svg>
  );
}

export function Play({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <polygon fill="currentColor" stroke="currentColor" points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

export function Puzzle({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        stroke="currentColor"
        fill="none"
        d="M12 2h4a1 1 0 0 1 1 1v2a2 2 0 0 0 4 0V3a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2a2 2 0 0 0 0 4h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a2 2 0 0 0 0-4H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a2 2 0 0 0 4 0V3a1 1 0 0 1 1-1z"
      />
    </svg>
  );
}

export function Lightning({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <polygon
        stroke="currentColor"
        fill="currentColor"
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      />
    </svg>
  );
}

export function Pencil({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path stroke="currentColor" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path stroke="currentColor" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export function Printer({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <polyline stroke="currentColor" points="6 9 6 2 18 2 18 9" />
      <path stroke="currentColor" d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect stroke="currentColor" x="6" y="14" width="12" height="8" />
    </svg>
  );
}

export function Trophy({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path stroke="currentColor" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path stroke="currentColor" d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path stroke="currentColor" d="M4 22h16" />
      <path stroke="currentColor" d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path stroke="currentColor" d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path stroke="currentColor" d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

export function Star({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <polygon
        stroke="currentColor"
        fill="currentColor"
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  );
}

export function Check({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <polyline stroke="currentColor" points="20 6 9 17 4 12" />
    </svg>
  );
}

export function Trash({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <polyline stroke="currentColor" points="3 6 5 6 21 6" />
      <path stroke="currentColor" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path stroke="currentColor" d="M10 11v6M14 11v6" />
      <path stroke="currentColor" d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function SpeakerOn({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <polygon stroke="currentColor" fill="currentColor" fillOpacity={0.15} points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path stroke="currentColor" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path stroke="currentColor" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export function SpeakerOff({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <polygon stroke="currentColor" fill="currentColor" fillOpacity={0.15} points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line stroke="currentColor" x1="23" y1="9" x2="17" y2="15" />
      <line stroke="currentColor" x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

export function GridIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <rect stroke="currentColor" x="3" y="3" width="7" height="7" />
      <rect stroke="currentColor" x="14" y="3" width="7" height="7" />
      <rect stroke="currentColor" x="14" y="14" width="7" height="7" />
      <rect stroke="currentColor" x="3" y="14" width="7" height="7" />
    </svg>
  );
}
