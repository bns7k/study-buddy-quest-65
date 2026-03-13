import { SVGProps } from "react";

export function GuildCrest(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Shield shape */}
      <path
        d="M16 2L4 7v9c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V7L16 2z"
        fill="currentColor"
        opacity={0.15}
      />
      <path
        d="M16 2L4 7v9c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V7L16 2z"
        stroke="currentColor"
        strokeWidth={1.5}
        fill="none"
        opacity={0.6}
      />
      {/* Inner diamond */}
      <path
        d="M16 8l5 6-5 6-5-6 5-6z"
        stroke="currentColor"
        strokeWidth={1}
        fill="currentColor"
        opacity={0.25}
      />
      {/* Top star */}
      <circle cx={16} cy={11} r={1.5} fill="currentColor" opacity={0.8} />
      {/* Quill lines */}
      <line x1={11} y1={18} x2={16} y2={22} stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1={21} y1={18} x2={16} y2={22} stroke="currentColor" strokeWidth={1} opacity={0.4} />
    </svg>
  );
}
