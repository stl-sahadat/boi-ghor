import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigateTo, cartCount, wishlistCount } = useStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EAE6] px-2 py-1.5 flex items-center justify-around h-15 shadow-lg">
      {/* Home */}
      <button
        type="button"
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'home' ? 'text-[#176B48] font-bold' : 'text-[#69736D]'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>হোম</span>
      </button>

      {/* Catalog */}
      <button
        type="button"
        onClick={() => navigateTo('catalog', undefined, 'all')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'catalog' ? 'text-[#176B48] font-bold' : 'text-[#69736D]'
        }`}
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span>ক্যাটালগ</span>
      </button>

      {/* Wishlist */}
      <button
        type="button"
        onClick={() => navigateTo('wishlist')}
        className={`relative flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'wishlist' ? 'text-[#176B48] font-bold' : 'text-[#69736D]'
        }`}
      >
        <Heart className="w-5 h-5 mb-0.5" />
        <span>পছন্দ</span>
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-3 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
            {wishlistCount}
          </span>
        )}
      </button>

      {/* Cart */}
      <button
        type="button"
        onClick={() => navigateTo('cart')}
        className={`relative flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'cart' || currentView === 'checkout' ? 'text-[#176B48] font-bold' : 'text-[#69736D]'
        }`}
      >
        <ShoppingBag className="w-5 h-5 mb-0.5" />
        <span>ব্যাগ</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-3 bg-[#176B48] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
            {cartCount}
          </span>
        )}
      </button>

      {/* Account */}
      <button
        type="button"
        onClick={() => navigateTo('account')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'account' ? 'text-[#176B48] font-bold' : 'text-[#69736D]'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>অ্যাকাউন্ট</span>
      </button>
    </nav>
  );
};
