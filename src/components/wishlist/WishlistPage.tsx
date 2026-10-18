import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BookCoverGraphic } from '../common/BookCoverGraphic';

export const WishlistPage: React.FC = () => {
  const { 
    wishlistBooks, 
    toggleWishlist, 
    addToCart, 
    navigateTo 
  } = useStore();

  if (wishlistBooks.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-white min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-18 h-18 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18211C] mb-2">
            পছন্দের তালিকা খালি
          </h2>
          <p className="text-xs sm:text-sm text-[#69736D] mb-6 leading-relaxed">
            আপনি এখনও কোনো বই পছন্দের তালিকায় যুক্ত করেননি। পরবর্তীতে কেনার জন্য পছন্দের বইগুলো বুকমার্ক করে রাখতে পারেন।
          </p>
          <button
            onClick={() => navigateTo('catalog', undefined, 'all')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#176B48] hover:bg-[#104D36] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span>বইয়ের ক্যাটালগ দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#F6F8F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE6]">
          <div>
            <div className="text-xs text-[#69736D] mb-1">
              <span>হোম</span> <span className="mx-1">/</span> <span className="text-[#176B48] font-semibold">পছন্দের তালিকা</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#18211C] tracking-tight">
              আমার পছন্দের বই ({wishlistBooks.length} টি)
            </h1>
          </div>

          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#176B48] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>আরও বই খুঁজুন</span>
          </button>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {wishlistBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-[#E5EAE6] p-4 flex gap-4 items-center shadow-xs hover:border-[#176B48]/30 transition-all"
            >
              {/* Cover thumbnail */}
              <button
                type="button"
                onClick={() => navigateTo('book-details', book.id)}
                className="w-20 sm:w-24 shrink-0 cursor-pointer shadow-xs rounded hover:opacity-95 text-left focus:outline-none focus:ring-2 focus:ring-[#176B48]"
                aria-label={`বইয়ের বিস্তারিত দেখুন: ${book.title}`}
              >
                <BookCoverGraphic
                  title={book.title}
                  author={book.author}
                  publisher={book.publisher}
                  theme={book.coverTheme}
                  coverImage={book.coverImage}
                />
              </button>

              {/* Info & Actions */}
              <div className="flex-1 min-w-0 flex flex-col h-full justify-between py-1">
                <div>
                  <span className="text-[10px] text-[#69736D] block truncate">{book.category}</span>
                  <button
                    type="button"
                    onClick={() => navigateTo('book-details', book.id)}
                    className="text-left text-sm font-bold text-[#18211C] hover:text-[#176B48] line-clamp-2 transition-colors cursor-pointer mt-0.5 block max-w-full"
                  >
                    {book.title}
                  </button>
                  <p className="text-xs text-[#69736D] truncate mt-0.5">{book.author}</p>
                  
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-[#176B48] tabular-nums font-mono">
                      ৳{book.demoPrice}
                    </span>
                    {book.originalPrice && (
                      <span className="text-xs text-[#69736D] line-through tabular-nums font-mono">
                        ৳{book.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#E5EAE6]/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => addToCart(book, 1)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>কার্টে নিন</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(book.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="তালিকা থেকে সরান"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
