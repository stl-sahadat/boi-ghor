import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Star, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  Calendar,
  Share2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BookCoverGraphic } from '../common/BookCoverGraphic';
import { BookCard } from '../common/BookCard';
import { BookPageGallery } from './BookPageGallery';
import { SITE_CONFIG } from '../../data/siteConfig';

export const BookDetailsView: React.FC = () => {
  const { 
    selectedBook, 
    allBooks, 
    navigateTo, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    showToast,
    recentlyViewedBooks,
    clearRecentlyViewed,
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  if (!selectedBook) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <p className="text-base font-semibold text-[#18211C] mb-4">কোনো বই নির্বাচিত করা হয়নি</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-2.5 bg-[#176B48] text-white text-xs font-semibold rounded-xl hover:bg-[#104D36]"
        >
          ক্যাটালগে ফিরে যান
        </button>
      </div>
    );
  }

  const wishlisted = isInWishlist(selectedBook.id);

  // Related books from same category (excluding current book)
  const relatedBooks = allBooks
    .filter((b) => b.categorySlug === selectedBook.categorySlug && b.id !== selectedBook.id)
    .slice(0, 4);

  // Recently viewed books (excluding current book)
  const otherRecentlyViewed = recentlyViewedBooks
    .filter((b) => b.id !== selectedBook.id)
    .slice(0, 4);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > selectedBook.stock) return selectedBook.stock;
      return next;
    });
  };

  const handleAddToCart = () => {
    addToCart(selectedBook, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedBook, quantity);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedBook.title,
        text: `${selectedBook.title} - ${selectedBook.author} | বইঘর অনলাইন বুকস্টোর`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('বইয়ের লিঙ্কটি কপি করা হয়েছে');
    }
  };

  return (
    <div className="py-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back Button */}
        <div className="mb-6 flex items-center justify-between gap-4 pb-4 border-b border-[#E5EAE6]">
          <button
            onClick={() => navigateTo('catalog')}
            className="flex items-center gap-2 text-xs font-semibold text-[#69736D] hover:text-[#176B48] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>সকল বইয়ে ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-[#69736D] hover:bg-[#F6F8F6] hover:text-[#18211C] transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">শেয়ার</span>
            </button>
            <button
              onClick={() => toggleWishlist(selectedBook.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                wishlisted
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-[#E5EAE6] text-[#69736D] hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
              <span className="hidden sm:inline">{wishlisted ? 'পছন্দে আছে' : 'উইশলিস্ট'}</span>
            </button>
          </div>
        </div>

        {/* Main PDP Grid: Left Cover Showcase (5 cols), Right Details & Purchase Box (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Left Column: Book Cover Display */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm p-6 sm:p-8 bg-[#F6F8F6] rounded-2xl border border-[#E5EAE6] flex items-center justify-center relative shadow-xs">
              <div className="w-48 sm:w-56 md:w-64 transition-transform duration-300 hover:scale-102">
                <BookCoverGraphic
                  title={selectedBook.title}
                  author={selectedBook.author}
                  publisher={selectedBook.publisher}
                  theme={selectedBook.coverTheme}
                  coverImage={selectedBook.coverImage}
                  showRibbon={selectedBook.isBestseller}
                />
              </div>

              {selectedBook.discountPercent && selectedBook.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-[#104D36] text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                  {selectedBook.discountPercent}% ছাড় (ডেমো)
                </div>
              )}
            </div>

            {/* Quick trust reassurance box */}
            <div className="mt-4 w-full max-w-sm grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-[#F6F8F6] rounded-xl border border-[#E5EAE6] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#176B48] mx-auto mb-1" />
                <span className="font-semibold text-[#18211C] block">১০০% আসল বই</span>
                <span className="text-[11px] text-[#69736D]">মূল প্রকাশনীর কপি</span>
              </div>
              <div className="p-3 bg-[#F6F8F6] rounded-xl border border-[#E5EAE6] text-xs">
                <Truck className="w-4 h-4 text-[#176B48] mx-auto mb-1" />
                <span className="font-semibold text-[#18211C] block">সারাদেশে ডেলিভারি</span>
                <span className="text-[11px] text-[#69736D]">ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Metadata, Price & Buying Action */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category & Status */}
            <div className="flex items-center gap-2 text-xs text-[#69736D]">
              <span className="text-[#176B48] font-bold">{selectedBook.category}</span>
              <span>·</span>
              <span className="flex items-center text-amber-600 font-semibold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                {selectedBook.rating.toFixed(1)} ({selectedBook.ratingCount} টি ডেমো রেটিং)
              </span>
            </div>

            {/* Book Title & English Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#18211C] leading-snug">
                {selectedBook.title}
              </h1>
              {selectedBook.englishTitle && (
                <p className="text-sm text-[#69736D] font-medium mt-1">
                  {selectedBook.englishTitle}
                </p>
              )}
            </div>

            {/* Author & Publisher Details Box */}
            <div className="p-4 rounded-xl bg-[#F6F8F6] border border-[#E5EAE6] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#69736D] block">লেখক:</span>
                <strong className="text-[#18211C] text-sm font-semibold">{selectedBook.author}</strong>
              </div>
              <div>
                <span className="text-[#69736D] block">প্রকাশনী:</span>
                <strong className="text-[#18211C] text-sm font-semibold">{selectedBook.publisher}</strong>
              </div>
              {selectedBook.edition && (
                <div>
                  <span className="text-[#69736D] block">সংস্করণ:</span>
                  <span className="text-[#18211C] font-medium">{selectedBook.edition}</span>
                </div>
              )}
              {selectedBook.pages && (
                <div>
                  <span className="text-[#69736D] block">পৃষ্ঠা সংখ্যা:</span>
                  <span className="text-[#18211C] font-mono font-medium">{selectedBook.pages}</span>
                </div>
              )}
              {selectedBook.isbn && (
                <div className="sm:col-span-2">
                  <span className="text-[#69736D] block">আইএসবিএন:</span>
                  <span className="text-[#18211C] font-mono text-[11px]">{selectedBook.isbn}</span>
                </div>
              )}
            </div>

            {/* Price & Stock Display */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] space-y-4 shadow-xs">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#176B48] tabular-nums">
                  ৳{selectedBook.demoPrice}
                </span>
                {selectedBook.originalPrice && selectedBook.originalPrice > selectedBook.demoPrice && (
                  <span className="text-base text-[#69736D] line-through tabular-nums">
                    ৳{selectedBook.originalPrice}
                  </span>
                )}
                {selectedBook.discountPercent && (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    ৳{(selectedBook.originalPrice || 0) - selectedBook.demoPrice} সাশ্রয়
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 text-xs">
                {selectedBook.stock > 0 ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>স্টকে আছে ({selectedBook.stock} টি কপি উপলব্ধ)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>বর্তমানে স্টক শেষ</span>
                  </div>
                )}
              </div>

              {/* Quantity Stepper & Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#E5EAE6] rounded-xl overflow-hidden bg-[#F6F8F6] self-start sm:self-auto">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-11 flex items-center justify-center text-lg font-bold text-[#18211C] hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold tabular-nums text-[#18211C]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= selectedBook.stock}
                    className="w-10 h-11 flex items-center justify-center text-lg font-bold text-[#18211C] hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={selectedBook.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-white hover:bg-[#F6F8F6] text-[#176B48] font-bold text-xs sm:text-sm rounded-xl border border-[#176B48] shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ব্যাগে যোগ করুন</span>
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={selectedBook.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#176B48] hover:bg-[#104D36] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  <span>এখনই অর্ডার করুন</span>
                </button>
              </div>

              <p className="text-[11px] text-[#69736D] text-center sm:text-left">
                *এটি একটি ডেমো বুকস্টোর। "এখনই অর্ডার করুন" ক্লিক করলে ডেমো চেকআউটে নিয়ে যাবে।
              </p>
            </div>

            {/* Description Tab & Text */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-[#18211C] tracking-wide">
                বইয়ের বিবরণ
              </h3>
              <p className="text-xs sm:text-sm text-[#18211C]/80 leading-relaxed">
                {selectedBook.description}
              </p>
            </div>

            {/* Book Highlights / Features */}
            {selectedBook.features && selectedBook.features.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#18211C]">
                  মুদ্রণ ও বাঁধাই বৈশিষ্ট্য:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#69736D]">
                  {selectedBook.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#176B48]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* Interior Page Preview Images Gallery Section */}
        <BookPageGallery book={selectedBook} />

        {/* Related Books Section */}
        {relatedBooks.length > 0 && (
          <div className="pt-12 border-t border-[#E5EAE6]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#176B48]">একই বিষয়ের বই</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#18211C]">
                  সম্পর্কিত অন্যান্য বই
                </h3>
              </div>
              <button
                onClick={() => navigateTo('catalog', undefined, selectedBook.categorySlug)}
                className="text-xs font-semibold text-[#176B48] hover:underline"
              >
                এই বিষয়ের সব বই →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {relatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Books Section */}
        {otherRecentlyViewed.length > 0 && (
          <div className="pt-12 mt-12 border-t border-[#E5EAE6]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#176B48]">ব্রাউজিং হিস্টোরি</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#18211C]">
                  সম্প্রতি দেখা বইসমূহ
                </h3>
              </div>
              <button
                type="button"
                onClick={clearRecentlyViewed}
                className="text-xs font-semibold text-[#69736D] hover:text-rose-600 transition-colors cursor-pointer"
              >
                হিস্টোরি মুছুন
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {otherRecentlyViewed.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
