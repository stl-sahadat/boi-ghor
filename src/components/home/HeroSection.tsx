import React from 'react';
import { Search, Compass, BookMarked, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BookCoverGraphic } from '../common/BookCoverGraphic';
import { DEMO_BOOKS } from '../../data/mockBooks';

export const HeroSection: React.FC = () => {
  const { navigateTo } = useStore();

  // Curated showcase books for the hero stack
  const featuredBooks = [
    DEMO_BOOKS[0], // একাত্তরের দিনগুলি
    DEMO_BOOKS[2], // দেয়াল
    DEMO_BOOKS[1], // প্যারাডক্সিক্যাল সাজিদ
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F6F8F6] via-white to-white py-8 sm:py-12 md:py-16 border-b border-[#E5EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Action Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Unboxed Micro Header */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B48]">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>বাংলাদেশের নির্ভরযোগ্য অনলাইন বুকস্টোর</span>
              <span className="opacity-40">·</span>
              <span className="text-[#69736D]">সহজ কেনাকাটা</span>
            </div>

            {/* Headline with balanced wrapping */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#18211C] leading-[1.18] tracking-tight max-w-2xl mx-auto lg:mx-0">
              প্রিয় লেখকের বই পৌঁছে যাবে <span className="text-[#176B48]">আপনার দোরগোড়ায়</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-[#69736D] leading-relaxed max-w-xl mx-auto lg:mx-0">
              কালজয়ী সাহিত্য, ইসলামি গ্রন্থ, একাডেমিক ও চাকরি প্রস্তুতি—আপনার পছন্দের যে কোনো বই সহজে খুঁজে নিন এবং ক্যাশ অন ডেলিভারিতে অর্ডার করুন।
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={() => navigateTo('catalog', undefined, 'all')}
                className="flex items-center gap-2 px-6 py-3 bg-[#176B48] hover:bg-[#104D36] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>বই খুঁজুন</span>
              </button>

              <button
                onClick={() => {
                  const catEl = document.getElementById('popular-categories');
                  if (catEl) {
                    catEl.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigateTo('catalog', undefined, 'all');
                  }
                }}
                className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-[#F6F8F6] text-[#18211C] text-sm font-semibold rounded-xl border border-[#E5EAE6] hover:border-[#176B48]/40 transition-all cursor-pointer shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#176B48]" />
                <span>ক্যাটাগরি দেখুন</span>
              </button>
            </div>

            {/* Trust features inline row */}
            <div className="pt-4 border-t border-[#E5EAE6]/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#69736D]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#18211C] text-sm">১০০০+</span>
                <span>তালিকাভুক্ত বই</span>
              </div>
              <span className="opacity-40">/</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#18211C] text-sm">৬৪ জেলায়</span>
                <span>হোম ডেলিভারি সুবিধা</span>
              </div>
              <span className="opacity-40">/</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#18211C] text-sm">১০০%</span>
                <span>আসল বই নিশ্চয়তা</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Book Composition Showcase (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md p-6 bg-gradient-to-tr from-[#E8F3EE] to-white rounded-2xl border border-[#E5EAE6] shadow-sm">
              
              {/* Stacked Book Composition */}
              <div className="relative flex items-center justify-center h-64 sm:h-72">
                {/* Book 1 (Left tilted) */}
                <button 
                  type="button"
                  onClick={() => navigateTo('book-details', featuredBooks[0].id)}
                  className="absolute left-4 sm:left-6 w-32 sm:w-36 -rotate-6 transform hover:rotate-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg rounded-r text-left focus:outline-none focus:ring-2 focus:ring-[#176B48]"
                  aria-label={`বইয়ের বিবরণ দেখুন: ${featuredBooks[0].title}`}
                >
                  <BookCoverGraphic
                    title={featuredBooks[0].title}
                    author={featuredBooks[0].author}
                    publisher={featuredBooks[0].publisher}
                    theme={featuredBooks[0].coverTheme}
                    coverImage={featuredBooks[0].coverImage}
                  />
                </button>

                {/* Book 2 (Right tilted) */}
                <button 
                  type="button"
                  onClick={() => navigateTo('book-details', featuredBooks[1].id)}
                  className="absolute right-4 sm:right-6 w-32 sm:w-36 rotate-6 transform hover:rotate-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg rounded-r text-left focus:outline-none focus:ring-2 focus:ring-[#176B48]"
                  aria-label={`বইয়ের বিবরণ দেখুন: ${featuredBooks[1].title}`}
                >
                  <BookCoverGraphic
                    title={featuredBooks[1].title}
                    author={featuredBooks[1].author}
                    publisher={featuredBooks[1].publisher}
                    theme={featuredBooks[1].coverTheme}
                    coverImage={featuredBooks[1].coverImage}
                  />
                </button>

                {/* Book 3 (Center foreground) */}
                <button 
                  type="button"
                  onClick={() => navigateTo('book-details', featuredBooks[2].id)}
                  className="relative z-20 w-34 sm:w-40 transform hover:scale-105 transition-transform duration-300 cursor-pointer shadow-2xl rounded-r text-left focus:outline-none focus:ring-2 focus:ring-[#176B48]"
                  aria-label={`বইয়ের বিবরণ দেখুন: ${featuredBooks[2].title}`}
                >
                  <BookCoverGraphic
                    title={featuredBooks[2].title}
                    author={featuredBooks[2].author}
                    publisher={featuredBooks[2].publisher}
                    theme={featuredBooks[2].coverTheme}
                    coverImage={featuredBooks[2].coverImage}
                    showRibbon={true}
                  />
                </button>
              </div>

              {/* Bottom quick label */}
              <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs text-[#69736D]">
                <span className="flex items-center gap-1.5 font-medium text-[#18211C]">
                  <BookMarked className="w-3.5 h-3.5 text-[#176B48]" />
                  সপ্তাহের নির্বাচিত বই
                </span>
                <button
                  onClick={() => navigateTo('catalog', undefined, 'all')}
                  className="text-[#176B48] font-semibold hover:underline"
                >
                  সব দেখুন →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
