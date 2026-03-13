export function MapBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {/* Parchment base with warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(35,30%,92%)] via-[hsl(38,25%,88%)] to-[hsl(32,20%,85%)] dark:from-[hsl(220,20%,12%)] dark:via-[hsl(225,18%,10%)] dark:to-[hsl(220,22%,8%)]" />
      
      {/* Subtle warm glow from path area */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(38,60%,70%,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,hsl(38,60%,50%,0.06)_0%,transparent_70%)]" />

      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Parchment texture pattern */}
          <filter id="parchment-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
          </filter>
          
          {/* Subtle grid */}
          <pattern id="map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="0.2"
              opacity="0.05"
            />
          </pattern>

          {/* Aged dots */}
          <pattern id="parchment-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.4" fill="hsl(30, 40%, 50%)" opacity="0.06" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        <rect width="100%" height="100%" fill="url(#parchment-dots)" />
      </svg>

      {/* Corner ornaments */}
      <svg className="absolute top-2 left-2 h-12 w-12 text-accent opacity-[0.12]" viewBox="0 0 40 40" fill="none">
        <path d="M2 2v12c0 6 4 10 10 10h12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M2 2l6 6" stroke="currentColor" strokeWidth="1" />
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      </svg>
      <svg className="absolute top-2 right-2 h-12 w-12 text-accent opacity-[0.12] scale-x-[-1]" viewBox="0 0 40 40" fill="none">
        <path d="M2 2v12c0 6 4 10 10 10h12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M2 2l6 6" stroke="currentColor" strokeWidth="1" />
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      </svg>

      {/* Compass rose */}
      <svg className="absolute right-6 top-16 h-14 w-14 text-accent opacity-[0.06]" viewBox="0 0 48 48" fill="none">
        <path d="M24 2l2 8h-4l2-8zM24 46l2-8h-4l2 8zM2 24l8-2v4L2 24zM46 24l-8-2v4l8-2z" fill="currentColor" />
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="24" cy="24" r="1.5" fill="currentColor" />
        <text x="24" y="8" textAnchor="middle" fill="currentColor" fontSize="4" fontWeight="bold">N</text>
      </svg>

      {/* Edge vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />
    </div>
  );
}
