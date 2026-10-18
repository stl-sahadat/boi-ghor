import React from 'react';
import { History, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BookCard } from '../common/BookCard';

export const RecentlyViewedSection: React.FC = () => {
  const { recentlyViewedBooks, clearRecentlyViewed, navigateTo } = useStore();

  if (!recentlyViewedBooks || recentlyViewedBooks.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-white border-b border-[#E5EAE6]" aria-labelledby="recently-viewed-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#E5EAE6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#176B48] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 id="recently-viewed-heading" className="text-lg sm:text-xl font-bold text-[#18211C] tracking-tight">
                আপনার সম্প্রতি দেখা বই
              </h2>
              <p className="text-[11px] text-[#69736D]">
                যে বইগুলো আপনি সম্প্রতি ব্রাউজ বা পরিদর্শন করেছেন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={clearRecentlyViewed}
              className="text-xs text-[#69736D] hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
              title="সম্প্রতি দেখা বইয়ের তালিকা পরিষ্কার করুন"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>মুছুন</span>
            </button>
            <span className="text-[#E5EAE6]">|</span>
            <button
              type="button"
              onClick={() => navigateTo('catalog')}
              className="text-xs font-semibold text-[#176B48] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>সকল বই দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {recentlyViewedBooks.slice(0, 6).map((book) => (
            <BookCard key={book.id} book={book} showCategory={false} />
          ))}
        </div>

      </div>
    </section>
  );
};
