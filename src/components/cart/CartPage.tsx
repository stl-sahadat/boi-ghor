import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  Tag, 
  ShieldAlert, 
  Sparkles,
  Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BookCoverGraphic } from '../common/BookCoverGraphic';
import { SITE_CONFIG } from '../../data/siteConfig';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryArea,
    setDeliveryArea,
    deliveryFee,
    isFreeDelivery,
    cartTotal,
    navigateTo,
    showToast,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'BOIGHOR10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setCouponDiscount(discount);
      setCouponApplied(true);
      showToast('১০% ডেমো কুপন কোড প্রয়োগ করা হয়েছে!');
    } else {
      showToast('অকার্যকর কুপন কোড। ডেমো কোড "BOIGHOR10" ব্যবহার করুন');
    }
  };

  const finalTotal = Math.max(0, cartTotal - couponDiscount);

  if (cart.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-white min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-18 h-18 rounded-2xl bg-[#F6F8F6] text-[#69736D] flex items-center justify-center mx-auto mb-4 border border-[#E5EAE6]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18211C] mb-2">
            আপনার শপিং ব্যাগ খালি
          </h2>
          <p className="text-xs sm:text-sm text-[#69736D] mb-6 leading-relaxed">
            আপনার ব্যাগে বর্তমানে কোনো বই যুক্ত করা হয়নি। পছন্দের বই খুঁজে নিতে আমাদের ক্যাটালগ ঘুরে দেখুন।
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
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#69736D] mb-1">
              <span>হোম</span> <span className="mx-1">/</span> <span className="text-[#176B48] font-semibold">শপিং ব্যাগ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#18211C] tracking-tight">
              শপিং কার্ট ({cart.length} টি বই)
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('catalog')}
              className="text-xs font-semibold text-[#176B48] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>আরও বই যোগ করুন</span>
            </button>
            <span className="text-[#E5EAE6]">|</span>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>কার্ট খালি করুন</span>
            </button>
          </div>
        </div>

        {/* Layout Grid: Left Items List (8 cols), Right Order Summary (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Delivery Bar */}
            <div className="p-4 bg-white rounded-xl border border-[#E5EAE6] flex items-center gap-3">
              <div className="p-2 bg-[#E8F3EE] rounded-lg text-[#176B48]">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                {isFreeDelivery ? (
                  <p className="font-semibold text-emerald-800">
                    অভিনন্দন! আপনার অর্ডারে ফ্রি ডেলিভারি প্রযোজ্য হয়েছে।
                  </p>
                ) : (
                  <p className="text-[#69736D]">
                    আর মাত্র <strong className="text-[#18211C] tabular-nums">৳{SITE_CONFIG.deliveryFees.freeDeliveryThreshold - cartSubtotal}</strong> এর বই কিনলেই পাচ্ছেন ফ্রি ডেলিভারি!
                  </p>
                )}
                {/* Progress bar */}
                <div className="mt-1.5 w-full bg-[#E5EAE6] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#176B48] h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (cartSubtotal / SITE_CONFIG.deliveryFees.freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Item Cards */}
            <div className="bg-white rounded-2xl border border-[#E5EAE6] divide-y divide-[#E5EAE6]/80 overflow-hidden shadow-xs">
              {cart.map((item) => (
                <div key={item.book.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Book Info & Cover */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button 
                      type="button"
                      onClick={() => navigateTo('book-details', item.book.id)}
                      className="w-16 sm:w-20 shrink-0 cursor-pointer shadow-xs rounded hover:opacity-90 transition-opacity text-left focus:outline-none focus:ring-2 focus:ring-[#176B48]"
                      aria-label={`বইয়ের বিস্তারিত দেখুন: ${item.book.title}`}
                    >
                      <BookCoverGraphic
                        title={item.book.title}
                        author={item.book.author}
                        publisher={item.book.publisher}
                        theme={item.book.coverTheme}
                        coverImage={item.book.coverImage}
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-[#69736D] block truncate">
                        {item.book.category} · {item.book.publisher}
                      </span>
                      <button 
                        type="button"
                        onClick={() => navigateTo('book-details', item.book.id)}
                        className="text-left font-bold text-sm sm:text-base text-[#18211C] hover:text-[#176B48] truncate transition-colors cursor-pointer block max-w-full"
                      >
                        {item.book.title}
                      </button>
                      <p className="text-xs text-[#69736D] truncate mt-0.5">
                        {item.book.author}
                      </p>
                      
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-[#176B48] tabular-nums">
                          ৳{item.book.demoPrice}
                        </span>
                        {item.book.originalPrice && item.book.originalPrice > item.book.demoPrice && (
                          <span className="text-xs text-[#69736D] line-through tabular-nums">
                            ৳{item.book.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EAE6]/50">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E5EAE6] rounded-lg overflow-hidden bg-[#F6F8F6]">
                      <button
                        onClick={() => updateQuantity(item.book.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#18211C] hover:bg-gray-200 cursor-pointer"
                        aria-label="পরিমাণ কমান"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-bold tabular-nums text-[#18211C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.book.id, 1)}
                        disabled={item.quantity >= item.book.stock}
                        className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#18211C] hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                        aria-label="পরিমাণ বাড়ান"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-[10px] text-[#69736D] block">উপমোট:</span>
                      <span className="text-sm sm:text-base font-bold text-[#18211C] tabular-nums">
                        ৳{item.book.demoPrice * item.quantity}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.book.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="আইটেমটি সরান"
                      aria-label="আইটেমটি সরান"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Demo Notice Banner */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                এটি একটি ডেমো শপিং কার্ট। আপনি কার্টে থাকা আইটেমগুলোর পরিমাণ পরিবর্তন করতে পারেন। কোনো বাস্তব ব্যাংক কার্ড বা মোবাইল ফিনান্সিয়াল চার্জ করা হবে না।
              </p>
            </div>

          </div>

          {/* Right Column: Order Summary & Checkout Box (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#18211C] pb-3 border-b border-[#E5EAE6]">
                অর্ডার সারাংশ
              </h2>

              {/* Delivery Area Selection */}
              <div>
                <label className="block text-xs font-bold text-[#18211C] mb-2">
                  ডেলিভারি এলাকা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryArea('inside_dhaka')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                      deliveryArea === 'inside_dhaka'
                        ? 'border-[#176B48] bg-[#E8F3EE] text-[#176B48] font-bold'
                        : 'border-[#E5EAE6] text-[#69736D] hover:bg-[#F6F8F6]'
                    }`}
                  >
                    ঢাকা সিটির ভেতরে (৳৬০)
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside_dhaka')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                      deliveryArea === 'outside_dhaka'
                        ? 'border-[#176B48] bg-[#E8F3EE] text-[#176B48] font-bold'
                        : 'border-[#E5EAE6] text-[#69736D] hover:bg-[#F6F8F6]'
                    }`}
                  >
                    ঢাকার বাইরে (৳১২০)
                  </button>
                </div>
              </div>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <label className="block text-xs font-semibold text-[#69736D] mb-1.5">
                  কুপন বা ডিসকাউন্ট কোড (ডেমো কোড: BOIGHOR10):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="BOIGHOR10"
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 text-xs bg-[#F6F8F6] border border-[#E5EAE6] rounded-lg outline-none focus:border-[#176B48] uppercase"
                  />
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-3 py-2 bg-[#176B48] text-white text-xs font-semibold rounded-lg hover:bg-[#104D36] disabled:opacity-50 cursor-pointer"
                  >
                    {couponApplied ? 'প্রযুক্ত' : 'প্রয়োগ'}
                  </button>
                </div>
              </form>

              {/* Subtotals Calculation Table */}
              <div className="space-y-2 pt-3 border-t border-[#E5EAE6] text-xs">
                <div className="flex justify-between text-[#69736D]">
                  <span>আইটেম উপমোট:</span>
                  <span className="font-semibold text-[#18211C] tabular-nums">৳{cartSubtotal}</span>
                </div>

                <div className="flex justify-between text-[#69736D]">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-semibold text-[#18211C] tabular-nums">
                    {deliveryFee === 0 ? <span className="text-emerald-700">ফ্রি</span> : `৳${deliveryFee}`}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>কুপন ছাড় (১০%):</span>
                    <span className="font-semibold tabular-nums">-৳{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-[#18211C] pt-2 border-t border-[#E5EAE6]">
                  <span>সর্বমোট প্রাক্কলন:</span>
                  <span className="text-[#176B48] text-lg tabular-nums">৳{finalTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-3.5 bg-[#176B48] hover:bg-[#104D36] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <span>চেকআউট সম্পন্ন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-[#69736D] text-center">
                ক্যাশ অন ডেলিভারি এবং সহজ চেকআউট সুবিধা
              </p>
            </div>

            {/* Back button */}
            <button
              onClick={() => navigateTo('catalog')}
              className="w-full py-2.5 bg-white hover:bg-gray-50 text-xs font-semibold text-[#18211C] rounded-xl border border-[#E5EAE6] transition-colors"
            >
              ← বই ব্রাউজ করা চালিয়ে যান
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
