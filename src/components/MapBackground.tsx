export function MapBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid texture */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="0.3"
              opacity="0.06"
            />
          </pattern>
          <pattern id="map-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="hsl(var(--foreground))" opacity="0.08" />
          </pattern>
          <radialGradient id="map-vignette" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        <rect width="100%" height="100%" fill="url(#map-dots)" />
        <rect width="100%" height="100%" fill="url(#map-vignette)" />
      </svg>

      {/* Decorative compass rose */}
      <svg
        className="absolute right-4 top-8 h-16 w-16 text-foreground opacity-[0.04]"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path d="M24 2l3 10h-6l3-10zM24 46l3-10h-6l3 10zM2 24l10-3v6L2 24zM46 24l-10-3v6l10-3z" fill="currentColor" />
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </svg>

      {/* Faded guild seal watermark */}
      <svg
        className="absolute left-6 bottom-32 h-20 w-20 text-primary opacity-[0.03]"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2L4 7v9c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V7L16 2z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
