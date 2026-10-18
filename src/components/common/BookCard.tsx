import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Book } from '../../types';
import { useStore } from '../../context/StoreContext';
import { BookCoverGraphic } from './BookCoverGraphic';

interface BookCardProps {
  book: Book;
  showCategory?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, showCategory = false }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(book.id);

  const handleCardClick = () => {
    navigateTo('book-details', book.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(book.id);
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleCardClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${book.title}, লেখক: ${book.author}, মূল্য: ৳${book.demoPrice}`}
      className="group relative flex flex-col bg-white rounded-xl border border-[#E5EAE6] hover:border-[#176B48]/40 p-3 sm:p-3.5 transition-all duration-200 hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#176B48]"
    >
      {/* Cover Image Container */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#F6F8F6] p-2 flex items-center justify-center">
        <div className="w-28 sm:w-32 md:w-36 transition-transform duration-300 group-hover:scale-102">
          <BookCoverGraphic
            title={book.title}
            author={book.author}
            publisher={book.publisher}
            theme={book.coverTheme}
            coverImage={book.coverImage}
            showRibbon={book.isBestseller}
          />
        </div>

        {/* Wishlist Quick Toggle Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-xs transition-transform active:scale-90 ${
            wishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/85 text-[#69736D] hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={wishlisted ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় যোগ করুন'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Discount Tag (if any) */}
        {book.discountPercent && book.discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-[#104D36] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs tracking-wider">
            {book.discountPercent}% ছাড়
          </div>
        )}
      </div>

      {/* Book Metadata & Title */}
      <div className="flex-1 flex flex-col pt-3">
        {/* Unboxed Metadata (Category · Publisher) */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#69736D] mb-1">
          {showCategory ? (
            <span className="truncate max-w-[100px]">{book.category}</span>
          ) : (
            <span className="truncate max-w-[120px]">{book.publisher}</span>
          )}
          <span aria-hidden="true" className="opacity-60">·</span>
          <span className="flex items-center text-amber-600 font-medium tabular-nums">
            <Star className="w-3 h-3 fill-amber-500 mr-0.5 inline" />
            {book.rating.toFixed(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-[#18211C] line-clamp-2 leading-snug group-hover:text-[#176B48] transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <p className="mt-1 text-xs text-[#69736D] truncate font-medium">
          {book.author}
        </p>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-[#E5EAE6]/60 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-bold text-[#176B48] tabular-nums">
              ৳{book.demoPrice}
            </span>
            {book.originalPrice && book.originalPrice > book.demoPrice && (
              <span className="text-xs text-[#69736D] line-through tabular-nums">
                ৳{book.originalPrice}
              </span>
            )}
          </div>

          {/* Quick Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F6F8F6] hover:bg-[#176B48] text-[#18211C] hover:text-white rounded-lg text-xs font-semibold border border-[#E5EAE6] hover:border-[#176B48] transition-all cursor-pointer active:scale-95 shrink-0"
            aria-label={`কার্টে যোগ করুন: ${book.title}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">যুক্ত করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
