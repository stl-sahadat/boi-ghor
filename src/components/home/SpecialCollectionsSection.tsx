import React from 'react';
import { Layers, ArrowRight, Bookmark } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { useStore } from '../../context/StoreContext';

export const SpecialCollectionsSection: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section className="py-12 bg-[#F6F8F6] border-t border-[#E5EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#176B48] mb-1">
              <Layers className="w-4 h-4 text-[#176B48]" />
              <span>বাছাইকৃত সংগ্রহ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#18211C] tracking-tight">
              বিশেষ কালেকশন
            </h2>
          </div>

          <p className="text-xs text-[#69736D] max-w-xs">
            আপনার আগ্রহ ও প্রয়োজন অনুযায়ী বাছাইকৃত বইয়ের গুচ্ছ তালিকা
          </p>
        </div>

        {/* Collections Grid (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SITE_CONFIG.specialCollections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => navigateTo('catalog', undefined, undefined, collection.name)}
              className="flex flex-col text-left p-5 bg-white rounded-xl border border-[#E5EAE6] hover:border-[#176B48] hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#176B48] flex items-center justify-center group-hover:bg-[#176B48] group-hover:text-white transition-colors">
                  <Bookmark className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-medium text-[#69736D]">
                  {collection.count}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#18211C] group-hover:text-[#176B48] transition-colors">
                {collection.name}
              </h3>

              <p className="mt-1 text-xs text-[#69736D] leading-relaxed mb-4 flex-1">
                {collection.desc}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#176B48] group-hover:translate-x-1 transition-transform">
                <span>কালেকশন দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
