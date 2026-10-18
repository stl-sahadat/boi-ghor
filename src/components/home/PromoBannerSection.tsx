import React from 'react';
import { Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PromoBannerSection: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#104D36] via-[#176B48] to-[#14573B] text-white p-6 sm:p-8 md:p-10 shadow-lg">
          
          {/* Subtle geometric pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Banner Text (8 cols) */}
            <div className="md:col-span-8 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/15 backdrop-blur-xs text-xs font-semibold text-emerald-100">
                <Tag className="w-3.5 h-3.5" />
                <span>মৌসুমি বইমেলা বিশেষ প্রদর্শনী (ডেমো)</span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                পছন্দের বইয়ে আকর্ষণীয় ডেমো মূল্যছাড়
              </h3>

              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                সাহিত্য, ইতিহাস ও আত্মউন্নয়ন বিষয়ক নির্বাচিত বইসমূহে ১৫% থেকে ২৫% পর্যন্ত ছাড়ের ডেমো নমুনা। কার্টে যোগ করে সরাসরি কেনাকাটা উপভোগ করুন।
              </p>
            </div>

            {/* Banner CTA (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('catalog', undefined, undefined, undefined, undefined, undefined, 'discount')}
                className="w-full sm:w-auto px-6 py-3 bg-white text-[#104D36] hover:bg-emerald-50 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <span>অফারের বই দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-emerald-200/80 text-center md:text-right">
                *ডেমো প্রোটোটাইপ প্রদর্শনীর অংশ
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
