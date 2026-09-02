import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'horizontal';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'auto',
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const gradientIdPrefix = React.useId().replace(/:/g, '');
  const gradientIds = {
    primary: `${gradientIdPrefix}-hzGoldPrimary`,
    highlight: `${gradientIdPrefix}-hzGoldHighlight`,
    shadow: `${gradientIdPrefix}-hzGoldShadow`,
    ring: `${gradientIdPrefix}-hzGoldRing`,
  };

  // Size mapping for the icon mark
  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 52,
    xl: 68,
  };

  const currentIconSize = iconSizes[size];

  // Vector SVG of the Hazaribag Properties architectural emblem
  const renderLogoMark = (customSize?: number) => {
    const s = customSize || currentIconSize;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
        aria-label="Hazaribag Properties Logo Mark"
      >
        <defs>
          {/* Rich metallic gold gradient - Primary */}
          <linearGradient id={gradientIds.primary} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECC468" />
            <stop offset="25%" stopColor="#DF9F28" />
            <stop offset="50%" stopColor="#FFEA9F" />
            <stop offset="75%" stopColor="#CA8B1A" />
            <stop offset="100%" stopColor="#96610E" />
          </linearGradient>

          {/* Bright gold shine for highlights */}
          <linearGradient id={gradientIds.highlight} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#E5A62D" />
            <stop offset="100%" stopColor="#8C5708" />
          </linearGradient>

          {/* Deep gold shadow for 3D tower bevel facets */}
          <linearGradient id={gradientIds.shadow} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4881E" />
            <stop offset="100%" stopColor="#693F05" />
          </linearGradient>

          {/* Gold metallic ring gradient */}
          <linearGradient id={gradientIds.ring} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2A62C" />
            <stop offset="40%" stopColor="#FFF3B8" />
            <stop offset="70%" stopColor="#C3851B" />
            <stop offset="100%" stopColor="#7E4D06" />
          </linearGradient>
        </defs>

        {/* Outer Circular Orbital Rings */}
        <path
          d="M 45,95 A 62,62 0 1,1 155,95"
          stroke={`url(#${gradientIds.ring})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M 38,102 A 70,70 0 1,1 162,102"
          stroke={`url(#${gradientIds.ring})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />

        {/* --- 4 ASCENDING 3D METALLIC SKYSCRAPER TOWERS --- */}

        {/* Tower 1 (Far Left - Small) */}
        <polygon
          points="62,130 62,75 73,68 73,130"
          fill={`url(#${gradientIds.shadow})`}
        />
        <polygon
          points="68,130 68,71 73,68 73,130"
          fill={`url(#${gradientIds.highlight})`}
          opacity="0.85"
        />

        {/* Tower 2 (Middle Left - Medium-Tall) */}
        <polygon
          points="76,130 76,42 88,34 88,130"
          fill={`url(#${gradientIds.primary})`}
        />
        <polygon
          points="82,130 82,38 88,34 88,130"
          fill={`url(#${gradientIds.highlight})`}
          opacity="0.9"
        />

        {/* Tower 3 (Middle Right - Tallest Central Spire) */}
        <polygon
          points="91,130 91,12 103,20 103,130"
          fill={`url(#${gradientIds.primary})`}
        />
        <polygon
          points="97,130 97,16 103,20 103,130"
          fill={`url(#${gradientIds.shadow})`}
          opacity="0.8"
        />
        {/* Tower 3 Apex Bevel Accent */}
        <polygon
          points="91,12 103,20 97,25 91,12"
          fill="#FFE899"
          opacity="0.95"
        />

        {/* Tower 4 (Far Right - Medium-Low) */}
        <polygon
          points="106,130 106,62 117,68 117,130"
          fill={`url(#${gradientIds.primary})`}
        />
        <polygon
          points="112,130 112,65 117,68 117,130"
          fill={`url(#${gradientIds.shadow})`}
          opacity="0.9"
        />

        {/* --- SWEEPING BLACK ARCHITECTURAL ROOF GABLE --- */}
        <path
          d="M 22,142 C 60,138 85,116 100,102 C 115,116 140,138 178,142 C 142,132 115,110 100,96 C 85,110 58,132 22,142 Z"
          fill={theme === 'dark' ? '#FFFFFF' : '#1E293B'}
        />

        {/* --- 4-PANE GOLD WINDOW GRID --- */}
        <rect x="94" y="112" width="5" height="5" rx="0.5" fill={`url(#${gradientIds.primary})`} />
        <rect x="101" y="112" width="5" height="5" rx="0.5" fill={`url(#${gradientIds.highlight})`} />
        <rect x="94" y="119" width="5" height="5" rx="0.5" fill={`url(#${gradientIds.shadow})`} />
        <rect x="101" y="119" width="5" height="5" rx="0.5" fill={`url(#${gradientIds.primary})`} />
      </svg>
    );
  };

  // 1. ICON ONLY VARIANT
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderLogoMark()}
      </div>
    );
  }

  // 2. COMPACT / STACKED BADGE VARIANT (e.g. for splash, modals, or centered branding)
  if (variant === 'compact' || variant === 'full') {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        {renderLogoMark(variant === 'full' ? 88 : 56)}
        
        {/* Main Title */}
        <span
          className={`font-serif font-extrabold tracking-wider leading-none mt-2 ${
            variant === 'full' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
          } ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
          style={{ letterSpacing: '0.08em' }}
        >
          HAZARIBAG
        </span>

        {/* Gold PROPERTIES with lines */}
        <div className="flex items-center justify-center gap-2 w-full mt-1">
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#CA8B1A] to-[#CA8B1A]" />
          <span
            className="font-serif font-bold text-xs sm:text-sm tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#DF9F28] via-[#F4C542] to-[#B0740E]"
          >
            PROPERTIES
          </span>
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#CA8B1A] via-[#CA8B1A] to-transparent" />
        </div>

        {/* Tagline */}
        {showTagline && (
          <span
            className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] mt-1.5 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            TRUSTED SPACES. LASTING VALUE.
          </span>
        )}
      </div>
    );
  }

  // 3. HORIZONTAL HEADER / NAVBAR VARIANT (Default)
  return (
    <div className={`inline-flex items-center gap-1.5 sm:gap-3 ${className}`}>
      {renderLogoMark()}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-serif font-bold text-xs sm:text-lg tracking-wider leading-none ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
            style={{ letterSpacing: '0.06em' }}
          >
            HAZARIBAG
          </span>
          <span className="hidden sm:inline font-serif font-bold text-sm tracking-widest text-blue-600 leading-none">
            PROPERTIES
          </span>
        </div>

        {showTagline && (
          <span
            className={`hidden sm:inline text-[9px] uppercase font-bold tracking-[0.16em] mt-0.5 leading-tight ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Trusted Spaces. Lasting Value.
          </span>
        )}
      </div>
    </div>
  );
};
