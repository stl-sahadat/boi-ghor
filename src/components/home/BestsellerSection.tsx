import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BookCard } from '../common/BookCard';

export const BestsellerSection: React.FC = () => {
  const { allBooks, navigateTo } = useStore();

  // Filter bestselling books (active and published only)
  const bestsellers = allBooks
    .filter((book) => book.isBestseller && !book.isArchived && book.isPublished !== false)
    .slice(0, 5);

  return (
    <section className="py-12 bg-[#F6F8F6] border-y border-[#E5EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#176B48] mb-1">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>জনপ্রিয় বইসমূহ</span>
              <span className="opacity-40">·</span>
              <span className="text-[11px] text-[#69736D]">ডেমো তালিকা</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#18211C] tracking-tight">
              বেস্টসেলার বই
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('catalog', undefined, undefined, undefined, undefined, undefined, 'bestseller')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#176B48] hover:text-[#104D36] transition-colors cursor-pointer group"
          >
            <span>সকল বেস্টসেলার বই</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {bestsellers.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

      </div>
    </section>
  );
};
