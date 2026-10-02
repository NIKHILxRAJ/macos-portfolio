// A blue macOS-style wave wallpaper, drawn in SVG (no image file).
export default function Wallpaper() {
  return (
    <svg className="wallpaper" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="wp-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b1fd6" />
          <stop offset="0.45" stopColor="#2337d8" />
          <stop offset="1" stopColor="#0b1b8c" />
        </linearGradient>
        <linearGradient id="wp-wave" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#5b7bff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#2f55f0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0f2fc4" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="wp-deep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1028b8" />
          <stop offset="1" stopColor="#06125e" />
        </linearGradient>
        <linearGradient id="wp-shine" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#dfe6ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="wp-glow" cx="0.18" cy="0.25" r="0.45">
          <stop offset="0" stopColor="#8a6bff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8a6bff" stopOpacity="0" />
        </radialGradient>
        <filter id="wp-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <rect width="1440" height="900" fill="url(#wp-base)" />
      <rect width="1440" height="900" fill="url(#wp-glow)" />
      <path d="M-40 900 C 260 640, 470 380, 760 250 C 1010 140, 1230 120, 1480 40 L1480 900 Z" fill="url(#wp-wave)" />
      <path d="M-40 900 C 330 720, 560 520, 860 430 C 1110 355, 1300 360, 1480 300 L1480 900 Z" fill="url(#wp-deep)" opacity="0.85" />
      <path d="M200 900 C 520 760, 780 690, 1040 700 C 1240 708, 1380 760, 1480 820 L1480 900 Z" fill="#1a3fe0" opacity="0.55" filter="url(#wp-blur)" />
      <path d="M-40 900 C 260 640, 470 380, 760 250 C 1010 140, 1230 120, 1480 40" fill="none" stroke="url(#wp-shine)" strokeWidth="3" />
      <path d="M-40 900 C 260 640, 470 380, 760 250 C 1010 140, 1230 120, 1480 40" fill="none" stroke="#c9d4ff" strokeOpacity="0.35" strokeWidth="14" filter="url(#wp-blur)" />
    </svg>
  );
}
