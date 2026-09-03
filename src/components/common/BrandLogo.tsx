import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'horizontal';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

const iconSizes = { sm: 34, md: 42, lg: 56, xl: 72 };

const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <span
    className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm"
    style={{ width: size, height: size }}
  >
    <img
      src="/hazaribagh-properties-logo.png"
      alt="Hazaribagh Properties"
      width={size}
      height={size}
      className="pointer-events-none h-full w-full max-w-none scale-[1.45] select-none object-cover"
    />
  </span>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'auto',
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const markSize = iconSizes[size];
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const taglineColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-500';

  if (variant === 'icon') return <LogoMark size={markSize} />;

  if (variant === 'compact' || variant === 'full') {
    const compactMarkSize = variant === 'full' ? 96 : 60;
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        <LogoMark size={compactMarkSize} />
        <span className={`mt-2 font-serif font-extrabold leading-none tracking-[0.08em] ${variant === 'full' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'} ${textColor}`}>
          HAZARIBAG
        </span>
        <span className="mt-1 font-serif text-xs font-bold tracking-[0.25em] text-blue-600">PROPERTIES</span>
        {showTagline && <span className={`mt-1.5 text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px] ${taglineColor}`}>Trusted Spaces. Lasting Value.</span>}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}>
      <LogoMark size={markSize} />
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1">
          <span className={`font-serif text-xs font-bold leading-none tracking-[0.06em] sm:text-lg ${textColor}`}>HAZARIBAG</span>
          <span className="hidden font-serif text-sm font-bold leading-none tracking-widest text-blue-600 sm:inline">PROPERTIES</span>
        </div>
        {showTagline && <span className={`hidden mt-0.5 text-[9px] font-bold uppercase leading-tight tracking-[0.16em] sm:inline ${taglineColor}`}>Trusted Spaces. Lasting Value.</span>}
      </div>
    </div>
  );
};
