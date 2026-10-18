import React from 'react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { navigateTo, openAuthModal, currentUser } = useStore();

  return (
    <div className="bg-[#104D36] text-white/95 text-xs py-2 px-4 border-b border-[#176B48]/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Interactive Announcement Banner */}
        <button
          type="button"
          onClick={() => navigateTo('catalog', undefined, undefined, 'নতুন পাঠকের জন্য')}
          className="flex items-center gap-2 truncate text-left hover:text-white transition-colors cursor-pointer group focus-visible:outline-2 focus-visible:outline-white rounded"
          title="বিশেষ অফার দেখতে ক্লিক করুন"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0 group-hover:scale-125 transition-transform" />
          <p className="truncate sm:text-left font-medium text-emerald-100 group-hover:text-white">
            {SITE_CONFIG.announcement}
          </p>
        </button>
        
        {/* Right: Quick Interactive Controls */}
        <div className="hidden md:flex items-center gap-3.5 text-[11px] text-emerald-100 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('account', undefined, undefined, undefined, undefined, 'tracking')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            অর্ডার ট্র্যাকিং
          </button>
          
          <span className="opacity-30">|</span>

          {currentUser ? (
            <button
              type="button"
              onClick={() => navigateTo('account')}
              className="text-emerald-200 hover:text-white font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>স্বাগতম, <strong className="text-white">{currentUser.name}</strong></span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="hover:text-white transition-colors cursor-pointer font-medium"
              >
                সাইন ইন
              </button>
              <span className="opacity-30">/</span>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="hover:text-white transition-colors cursor-pointer font-medium"
              >
                নিবন্ধন
              </button>
            </div>
          )}

          <span className="opacity-30">|</span>

          <a
            href={`tel:${SITE_CONFIG.contact.hotline.replace(/[^\d+]/g, '')}`}
            className="hover:text-white hover:underline transition-colors flex items-center gap-1"
            title="হটলাইনে সরাসরি কল করুন"
          >
            <span>হটলাইন:</span>
            <span className="font-semibold text-white font-mono">{SITE_CONFIG.contact.hotline}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
