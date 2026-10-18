import React, { useState } from 'react';
import { BookCoverTheme } from '../../types';

interface BookCoverGraphicProps {
  title: string;
  author: string;
  publisher?: string;
  theme: BookCoverTheme;
  coverImage?: string;
  className?: string;
  showRibbon?: boolean;
}

export const BookCoverGraphic: React.FC<BookCoverGraphicProps> = ({
  title,
  author,
  publisher,
  theme,
  coverImage,
  className = '',
  showRibbon = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const hasValidCoverImage = Boolean(coverImage && !imgError);

  return (
    <div
      className={`relative select-none overflow-hidden rounded-r-md rounded-l-xs shadow-md transition-shadow duration-300 hover:shadow-xl ${className}`}
      style={{
        aspectRatio: '3/4',
        backgroundColor: theme.primary,
        backgroundImage: hasValidCoverImage
          ? undefined
          : `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
      }}
      aria-label={`বইয়ের প্রচ্ছদ: ${title} - ${author}`}
    >
      {/* Real Cover Image if provided */}
      {hasValidCoverImage ? (
        <img
          src={coverImage}
          alt={`বইয়ের প্রচ্ছদ: ${title}`}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="lazy"
        />
      ) : (
        <>
          {/* Subtle paper / cloth texture overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay z-1"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
            }}
          />

          {/* Decorative motif frame based on pattern */}
          <div className="absolute inset-2.5 sm:inset-3 border border-white/20 rounded pointer-events-none flex flex-col justify-between p-2.5 sm:p-3 z-2">
            {/* Top corner accents */}
            <div className="flex items-center justify-between text-[10px] tracking-wider text-white/70 uppercase">
              <span className="font-mono text-[9px] opacity-75">বইঘর</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
            </div>

            {/* Center decorative motif */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-2">
              <div className="mb-2 opacity-80" style={{ color: theme.accent }}>
                {theme.pattern === 'ornate' ? (
                  <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 4v16M4 12h16" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
                  </svg>
                ) : theme.pattern === 'geometric' ? (
                  <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12,2 22,12 12,22 2,12" />
                    <polygon points="12,6 18,12 12,18 6,12" strokeWidth="1" opacity="0.6" />
                  </svg>
                ) : theme.pattern === 'academic' ? (
                  <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10" />
                    <path d="M6 10h10" />
                  </svg>
                )}
              </div>

              {/* Book Title */}
              <h4 className="text-white font-bold leading-tight line-clamp-3 text-xs sm:text-sm md:text-base drop-shadow-sm px-1">
                {title}
              </h4>

              {/* Author Name */}
              <p className="mt-1.5 text-[11px] sm:text-xs text-white/90 font-medium line-clamp-1 drop-shadow-sm px-1">
                {author}
              </p>
            </div>

            {/* Bottom Publisher colophon */}
            <div className="pt-1 border-t border-white/15 flex items-center justify-between text-[9px] sm:text-[10px] text-white/75">
              <span className="truncate max-w-[80%]">{publisher || 'বইঘর'}</span>
              <span className="text-xs">✦</span>
            </div>
          </div>
        </>
      )}

      {/* Authentic book spine highlight & shadow gradient overlay */}
      <div 
        className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/15 to-transparent pointer-events-none z-10" 
      />
      <div 
        className="absolute inset-y-0 left-3 w-[1px] bg-black/20 pointer-events-none z-10" 
      />

      {/* Decorative Ribbon Bookmark (optional) */}
      {showRibbon && (
        <div 
          className="absolute top-0 right-3 w-3 h-8 shadow-md z-20"
          style={{ 
            backgroundColor: theme.accent,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' 
          }}
        />
      )}

      {/* Edge sheen */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-white/30 pointer-events-none z-10" />
    </div>
  );
};
