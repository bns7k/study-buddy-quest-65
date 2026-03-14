import { SVGProps } from "react";

export function GuildCrest(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="16" cy="16" r="13" fill="currentColor" opacity={0.12} />
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.6" opacity={0.7} />
      <path d="M16 6.5L22.8 10.4V18.2L16 22.1L9.2 18.2V10.4L16 6.5Z" stroke="currentColor" strokeWidth="1.2" opacity={0.5} />

      {/* Capital Guild monogram */}
      <path
        d="M13.9 20.8C11.7 20.8 10 19.1 10 16.9C10 14.7 11.7 13 13.9 13C15 13 15.9 13.4 16.6 14.1"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M17 13H20.7C21.9 13 22.9 14 22.9 15.2V16.9C22.9 19.1 21.1 20.8 18.9 20.8H17V17.2H20"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="8.8" r="1.2" fill="currentColor" opacity={0.9} />
    </svg>
  );
}
