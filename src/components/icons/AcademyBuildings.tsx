import { SVGProps } from "react";

export function LectureHallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Roof / pediment */}
      <path d="M20 4L4 16h32L20 4z" fill="currentColor" opacity={0.2} />
      <path d="M20 4L4 16h32L20 4z" stroke="currentColor" strokeWidth={1.2} opacity={0.5} />
      {/* Columns */}
      <rect x={9} y={16} width={2.5} height={16} rx={1} fill="currentColor" opacity={0.3} />
      <rect x={18.75} y={16} width={2.5} height={16} rx={1} fill="currentColor" opacity={0.3} />
      <rect x={28.5} y={16} width={2.5} height={16} rx={1} fill="currentColor" opacity={0.3} />
      {/* Base */}
      <rect x={4} y={32} width={32} height={3} rx={1} fill="currentColor" opacity={0.25} />
      {/* Door */}
      <rect x={17} y={24} width={6} height={8} rx={1} fill="currentColor" opacity={0.15} />
    </svg>
  );
}

export function LibraryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Bookshelf frame */}
      <rect x={6} y={6} width={28} height={28} rx={2} stroke="currentColor" strokeWidth={1.2} opacity={0.4} />
      {/* Shelves */}
      <line x1={6} y1={16} x2={34} y2={16} stroke="currentColor" strokeWidth={1} opacity={0.3} />
      <line x1={6} y1={26} x2={34} y2={26} stroke="currentColor" strokeWidth={1} opacity={0.3} />
      {/* Books row 1 */}
      <rect x={9} y={8} width={3} height={7} rx={0.5} fill="currentColor" opacity={0.35} />
      <rect x={13} y={9} width={2.5} height={6} rx={0.5} fill="currentColor" opacity={0.25} />
      <rect x={17} y={8} width={3} height={7} rx={0.5} fill="currentColor" opacity={0.3} />
      <rect x={22} y={9} width={2} height={6} rx={0.5} fill="currentColor" opacity={0.2} />
      <rect x={26} y={8} width={3.5} height={7} rx={0.5} fill="currentColor" opacity={0.35} />
      {/* Books row 2 */}
      <rect x={9} y={18} width={2.5} height={7} rx={0.5} fill="currentColor" opacity={0.25} />
      <rect x={13} y={18} width={3} height={7} rx={0.5} fill="currentColor" opacity={0.3} />
      <rect x={18} y={19} width={2} height={6} rx={0.5} fill="currentColor" opacity={0.2} />
      <rect x={22} y={18} width={3} height={7} rx={0.5} fill="currentColor" opacity={0.35} />
      <rect x={27} y={18} width={2.5} height={7} rx={0.5} fill="currentColor" opacity={0.25} />
      {/* Scroll on bottom */}
      <ellipse cx={20} cy={30} rx={6} ry={2.5} stroke="currentColor" strokeWidth={1} opacity={0.3} />
    </svg>
  );
}

export function MarketYardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Awning */}
      <path d="M4 14h32l-3 8H7l-3-8z" fill="currentColor" opacity={0.2} />
      <path d="M4 14h32" stroke="currentColor" strokeWidth={1.2} opacity={0.5} />
      {/* Poles */}
      <line x1={8} y1={14} x2={8} y2={34} stroke="currentColor" strokeWidth={1.5} opacity={0.3} />
      <line x1={32} y1={14} x2={32} y2={34} stroke="currentColor" strokeWidth={1.5} opacity={0.3} />
      {/* Counter */}
      <rect x={7} y={26} width={26} height={3} rx={1} fill="currentColor" opacity={0.25} />
      {/* Goods */}
      <circle cx={15} cy={32} r={2} fill="currentColor" opacity={0.2} />
      <circle cx={25} cy={32} r={2} fill="currentColor" opacity={0.2} />
      {/* Sign */}
      <rect x={16} y={6} width={8} height={6} rx={1} stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1={20} y1={4} x2={20} y2={6} stroke="currentColor" strokeWidth={1} opacity={0.3} />
    </svg>
  );
}

export function ObservatoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Dome */}
      <path d="M10 20a10 10 0 0120 0" fill="currentColor" opacity={0.15} />
      <path d="M10 20a10 10 0 0120 0" stroke="currentColor" strokeWidth={1.2} opacity={0.5} />
      {/* Tower */}
      <rect x={12} y={20} width={16} height={14} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={12} y={20} width={16} height={14} rx={1} stroke="currentColor" strokeWidth={1} opacity={0.3} />
      {/* Telescope */}
      <line x1={20} y1={12} x2={30} y2={6} stroke="currentColor" strokeWidth={2} strokeLinecap="round" opacity={0.45} />
      <circle cx={31} cy={5} r={2} stroke="currentColor" strokeWidth={1} opacity={0.4} />
      {/* Window */}
      <circle cx={20} cy={27} r={3} stroke="currentColor" strokeWidth={1} opacity={0.3} />
      {/* Stars */}
      <circle cx={8} cy={8} r={0.8} fill="currentColor" opacity={0.4} />
      <circle cx={34} cy={12} r={0.6} fill="currentColor" opacity={0.3} />
      <circle cx={6} cy={16} r={0.5} fill="currentColor" opacity={0.25} />
    </svg>
  );
}
