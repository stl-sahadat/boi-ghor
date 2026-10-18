import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SITE_CONFIG, POPULAR_CATEGORIES } from '../../data/siteConfig';

export const Header: React.FC = () => {
  const { 
    currentView, 
    navigateTo, 
    cartCount, 
    wishlistCount, 
    allBooks,
    filterState,
    setFilterState,
    currentUser,
    demoLogout,
    openAuthModal,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filterState.searchQuery || '');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const POPULAR_SEARCH_SUGGESTIONS = [
    'হুমায়ূন আহমেদ',
    'মুহম্মদ জাফর ইকবাল',
    'সায়েন্স ফিকশন',
    'অনুবাদ সাহিত্য',
    'রবীন্দ্রনাথ ঠাকুর',
    'ইতিহাস ও মুক্তিযুদ্ধ',
    'গণিত ও বিজ্ঞান',
    'উপন্যাস',
  ];

  // Sync internal search input if filterState changed externally
  useEffect(() => {
    setSearchInput(filterState.searchQuery || '');
  }, [filterState.searchQuery]);

  // Click outside listener for search, categories & account dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(e.target as Node)) {
        setMobileSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter books matching search query for live dropdown preview
  const liveSearchResults = searchInput.trim()
    ? allBooks.filter((book) => {
        if (book.isArchived || book.isPublished === false) return false;
        const query = searchInput.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          (book.englishTitle && book.englishTitle.toLowerCase().includes(query)) ||
          book.author.toLowerCase().includes(query) ||
          book.publisher.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query)
        );
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchFocused(false);
    setMobileSearchFocused(false);
    navigateTo('catalog', undefined, undefined, undefined, searchInput.trim());
  };

  const handleApplySuggestion = (text: string) => {
    setSearchInput(text);
    setSearchFocused(false);
    setMobileSearchFocused(false);
    navigateTo('catalog', undefined, undefined, undefined, text);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
    navigateTo('catalog', undefined, categorySlug);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5EAE6] transition-all">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-18">
          
          {/* Left Zone: Brand Logo & Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 -ml-2 rounded-lg text-[#18211C] hover:bg-[#F6F8F6] focus:outline-none focus:ring-2 focus:ring-[#176B48]"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#176B48] flex items-center justify-center text-white shadow-sm group-hover:bg-[#104D36] transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-[#176B48] leading-none">
                  {SITE_CONFIG.brandNameBangla}
                </span>
                <span className="text-[10px] text-[#69736D] tracking-wider uppercase font-medium mt-0.5">
                  {SITE_CONFIG.brandNameEnglish}
                </span>
              </div>
            </button>
          </div>

          {/* Middle Zone: Desktop Live Search Input */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="বইয়ের নাম, লেখক, প্রকাশক বা ক্যাটাগরি খুঁজুন..."
                className="w-full pl-10 pr-16 py-2.5 bg-[#F6F8F6] hover:bg-[#EFF3F0] focus:bg-white text-sm text-[#18211C] rounded-xl border border-[#E5EAE6] focus:border-[#176B48] focus:ring-2 focus:ring-[#176B48]/15 outline-none transition-all placeholder:text-[#69736D]"
              />
              <Search className="w-4 h-4 text-[#69736D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md"
                  aria-label="অনুসন্ধান মুছুন"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#176B48] hover:bg-[#104D36] text-white rounded-lg transition-colors cursor-pointer"
                aria-label="অনুসন্ধান করুন"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Live Autocomplete / Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#E5EAE6] py-2 z-50 overflow-hidden animate-fade-in">
                {searchInput.trim() === '' ? (
                  /* Suggestions when search input is empty */
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#69736D] uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#176B48]" />
                      <span>জনপ্রিয় অনুসন্ধান পরামর্শ</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {POPULAR_SEARCH_SUGGESTIONS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleApplySuggestion(term)}
                          className="px-2.5 py-1 text-xs bg-[#F6F8F6] hover:bg-[#E8F3EE] hover:text-[#176B48] rounded-lg border border-[#E5EAE6] transition-colors cursor-pointer text-[#18211C] flex items-center gap-1"
                        >
                          <TrendingUp className="w-3 h-3 text-[#176B48]" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-[#E5EAE6]/60 flex items-center justify-between text-[11px]">
                      <span className="text-[#69736D]">জনপ্রিয় বিভাগ:</span>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_CATEGORIES.slice(0, 3).map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategorySelect(cat.slug)}
                            className="text-[#176B48] hover:underline font-medium"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : liveSearchResults.length > 0 ? (
                  /* Matched Results Found */
                  <>
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-[#69736D] border-b border-[#E5EAE6] flex justify-between items-center bg-[#F6F8F6]">
                      <span>অনুসন্ধান ফলাফল</span>
                      <span className="text-[#176B48] font-bold">{liveSearchResults.length} টি বই পাওয়া গেছে</span>
                    </div>
                    <div className="divide-y divide-[#E5EAE6]/50 max-h-72 overflow-y-auto">
                      {liveSearchResults.map((book) => (
                        <button
                          key={book.id}
                          onClick={() => {
                            setSearchFocused(false);
                            navigateTo('book-details', book.id);
                          }}
                          className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#F6F8F6] text-left transition-colors cursor-pointer group"
                        >
                          <div 
                            className="w-9 h-12 rounded shrink-0 shadow-xs flex items-center justify-center text-white text-[9px] font-bold p-1 text-center group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: book.coverTheme.primary }}
                          >
                            <span className="line-clamp-2">{book.title}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#18211C] group-hover:text-[#176B48] truncate transition-colors">{book.title}</p>
                            <p className="text-xs text-[#69736D] truncate">{book.author} · {book.publisher}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-[#176B48] tabular-nums font-mono">৳{book.demoPrice}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-[#E5EAE6] bg-[#F6F8F6]">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full py-1.5 text-center text-xs font-semibold text-[#176B48] hover:text-[#104D36] cursor-pointer"
                      >
                        সব ফলাফল দেখুন ({liveSearchResults.length}) →
                      </button>
                    </div>
                  </>
                ) : (
                  /* Helpful Empty Results Dropdown State */
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-[#18211C] mb-1">
                      "{searchInput}" এর সাথে কোনো বই মেলেনি
                    </p>
                    <p className="text-[11px] text-[#69736D] mb-3">
                      বানান ঠিক আছে কিনা দেখুন বা নিচের জনপ্রিয় বিষয়গুলো অনুসন্ধান করুন:
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                      {POPULAR_SEARCH_SUGGESTIONS.slice(0, 4).map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleApplySuggestion(term)}
                          className="px-2 py-0.5 text-[11px] bg-[#F6F8F6] hover:bg-[#E8F3EE] hover:text-[#176B48] rounded border border-[#E5EAE6] text-[#18211C]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchFocused(false);
                        navigateTo('catalog', undefined, 'all');
                      }}
                      className="text-xs font-semibold text-[#176B48] hover:underline"
                    >
                      ক্যাটালগের সকল বই দেখুন →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Zone: Wishlist, Account, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={() => navigateTo('wishlist')}
              className={`relative p-2.5 rounded-xl border border-transparent hover:border-[#E5EAE6] hover:bg-[#F6F8F6] text-[#18211C] transition-all cursor-pointer ${
                currentView === 'wishlist' ? 'bg-[#F6F8F6] border-[#E5EAE6] text-[#176B48]' : ''
              }`}
              title="পছন্দের তালিকা"
              aria-label="পছন্দের তালিকা"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-600 fill-rose-50' : 'text-[#69736D]'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account & Sign In / Sign Up Trigger */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
                  currentView === 'account' || accountMenuOpen
                    ? 'bg-[#E8F3EE] border-[#176B48] text-[#176B48]'
                    : 'border-[#E5EAE6] hover:border-[#176B48]/40 hover:bg-[#F6F8F6] text-[#18211C]'
                }`}
                title={currentUser ? `অ্যাকাউন্ট: ${currentUser.name}` : 'লগইন বা সাইন আপ করুন'}
                aria-label="অ্যাকাউন্ট ও সাইন ইন"
              >
                <div className="relative">
                  <User className="w-4 h-4 text-[#176B48]" />
                  {currentUser && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                  )}
                </div>
                <span className="hidden sm:inline-block max-w-[90px] truncate">
                  {currentUser ? currentUser.name : 'সাইন ইন'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#69736D] transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Account Flyout Menu */}
              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E5EAE6] py-2 z-50 animate-fade-in">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#E5EAE6] bg-[#F6F8F6]">
                        <p className="text-xs font-bold text-[#18211C] truncate">{currentUser.name}</p>
                        <p className="text-[11px] font-mono text-[#69736D]">{currentUser.phone}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E8F3EE] text-[#104D36]">
                          সক্রিয় ডেমো সেশন
                        </span>
                      </div>
                      <div className="py-1 text-xs">
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigateTo('account', undefined, undefined, undefined, undefined, 'tracking');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-[#F6F8F6] text-[#18211C] hover:text-[#176B48] flex items-center justify-between cursor-pointer"
                        >
                          <span>আমার অর্ডারসমূহ</span>
                          <span className="text-[10px] text-[#69736D] font-mono">ট্র্যাকিং</span>
                        </button>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigateTo('wishlist');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-[#F6F8F6] text-[#18211C] hover:text-[#176B48] flex items-center justify-between cursor-pointer"
                        >
                          <span>পছন্দের তালিকা</span>
                          <span className="text-[10px] text-rose-600 font-bold">{wishlistCount}</span>
                        </button>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigateTo('admin');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-emerald-50 text-[#176B48] font-semibold flex items-center justify-between cursor-pointer border-t border-[#E5EAE6]/50"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#176B48]" />
                            <span>অ্যাডমিন প্যানেল</span>
                          </span>
                          <span className="text-[9px] bg-emerald-100 text-[#104D36] px-1.5 py-0.5 rounded font-bold">প্রবেশ</span>
                        </button>
                        <div className="border-t border-[#E5EAE6] my-1" />
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            demoLogout();
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-rose-50 text-rose-600 font-medium cursor-pointer"
                        >
                          লগআউট করুন
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-[#E5EAE6] text-xs">
                        <p className="font-bold text-[#18211C]">পাঠক অ্যাকাউন্ট</p>
                        <p className="text-[10px] text-[#69736D]">অর্ডার ট্র্যাক করতে বা বই সেভ করতে</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            openAuthModal('login');
                          }}
                          className="w-full py-2 px-3 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
                        >
                          সাইন ইন / লগইন করুন
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            openAuthModal('register');
                          }}
                          className="w-full py-1.5 px-3 bg-[#F6F8F6] hover:bg-[#E5EAE6] text-[#18211C] text-xs font-semibold rounded-lg text-center transition-colors cursor-pointer"
                        >
                          নতুন অ্যাকাউন্ট নিবন্ধন
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigateTo('account', undefined, undefined, undefined, undefined, 'tracking');
                          }}
                          className="w-full py-1 px-3 text-[#69736D] hover:text-[#176B48] text-[11px] text-center transition-colors cursor-pointer pt-1"
                        >
                          অর্ডার ট্র্যাকিং দেখুন →
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigateTo('admin');
                          }}
                          className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#176B48] text-[11px] font-bold rounded-lg text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-1 border border-emerald-200"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>অ্যাডমিন প্যানেল (লগইন)</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => navigateTo('cart')}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#176B48] hover:bg-[#104D36] text-white shadow-sm transition-all cursor-pointer active:scale-95"
              aria-label="শপিং ব্যাগ"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-[#104D36] text-[11px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white tabular-nums">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold tracking-wide">
                ব্যাগ
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (visible on small screens) */}
        <div className="pb-3 md:hidden relative" ref={mobileSearchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setMobileSearchFocused(true)}
              placeholder="বই, লেখক বা বিষয় খুঁজুন..."
              className="w-full pl-9 pr-16 py-2 bg-[#F6F8F6] text-sm text-[#18211C] rounded-lg border border-[#E5EAE6] focus:border-[#176B48] outline-none placeholder:text-[#69736D]"
            />
            <Search className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md"
                aria-label="মুছুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-[#176B48]"
              aria-label="অনুসন্ধান"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Live Suggestions Dropdown */}
          {mobileSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#E5EAE6] py-2 z-50 overflow-hidden animate-fade-in max-h-80 overflow-y-auto">
              {searchInput.trim() === '' ? (
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#69736D] uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#176B48]" />
                    <span>জনপ্রিয় অনুসন্ধান</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCH_SUGGESTIONS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleApplySuggestion(term)}
                        className="px-2 py-1 text-xs bg-[#F6F8F6] hover:bg-[#E8F3EE] hover:text-[#176B48] rounded-lg border border-[#E5EAE6] transition-colors cursor-pointer text-[#18211C]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : liveSearchResults.length > 0 ? (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-[#69736D] border-b border-[#E5EAE6] bg-[#F6F8F6] flex justify-between">
                    <span>ফলাফল ({liveSearchResults.length})</span>
                  </div>
                  <div className="divide-y divide-[#E5EAE6]/50">
                    {liveSearchResults.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => {
                          setMobileSearchFocused(false);
                          navigateTo('book-details', book.id);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[#F6F8F6] text-left"
                      >
                        <div 
                          className="w-8 h-10 rounded shrink-0 shadow-xs flex items-center justify-center text-white text-[8px] font-bold p-1 text-center"
                          style={{ backgroundColor: book.coverTheme.primary }}
                        >
                          <span className="line-clamp-2">{book.title}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#18211C] truncate">{book.title}</p>
                          <p className="text-[10px] text-[#69736D] truncate">{book.author}</p>
                        </div>
                        <span className="text-xs font-bold text-[#176B48] tabular-nums font-mono">৳{book.demoPrice}</span>
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-[#E5EAE6] bg-[#F6F8F6]">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full py-1 text-center text-xs font-semibold text-[#176B48]"
                    >
                      সব ফলাফল দেখুন →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 text-center">
                  <p className="text-xs font-bold text-[#18211C] mb-1">কোনো বই মেলেনি</p>
                  <p className="text-[10px] text-[#69736D] mb-2">বানান পরীক্ষা করুন বা ক্যাটাগরি ব্রাউজ করুন।</p>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileSearchFocused(false);
                      navigateTo('catalog', undefined, 'all');
                    }}
                    className="text-xs font-semibold text-[#176B48] underline"
                  >
                    ক্যাটালগে সকল বই দেখুন
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sub-Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-[#E5EAE6]/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
          {/* Categories Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-[#18211C] hover:text-[#176B48] py-1.5 px-3 rounded-lg hover:bg-[#F6F8F6] transition-colors cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5 text-[#176B48]" />
              <span>সকল ক্যাটাগরি</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#69736D] transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Categories Flyout Menu */}
            {categoriesDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-[#E5EAE6] py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#69736D] border-b border-[#E5EAE6]">
                  জনপ্রিয় বিভাগসমূহ
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {POPULAR_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className="w-full px-3.5 py-2 text-left flex items-center justify-between text-xs text-[#18211C] hover:bg-[#F6F8F6] hover:text-[#176B48] transition-colors cursor-pointer"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#69736D] tabular-nums">({cat.bookCount})</span>
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-[#E5EAE6] bg-[#F6F8F6]">
                  <button
                    onClick={() => {
                      setCategoriesDropdownOpen(false);
                      navigateTo('catalog', undefined, 'all');
                    }}
                    className="w-full text-center text-xs font-medium text-[#176B48] hover:underline"
                  >
                    সব বই দেখুন →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Nav Links */}
          <div className="flex items-center gap-6 text-xs font-medium text-[#18211C]">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#176B48] transition-colors py-1 cursor-pointer ${
                currentView === 'home' ? 'text-[#176B48] font-bold border-b-2 border-[#176B48]' : ''
              }`}
            >
              হোম
            </button>
            <button
              onClick={() => navigateTo('catalog', undefined, 'all')}
              className={`hover:text-[#176B48] transition-colors py-1 cursor-pointer ${
                currentView === 'catalog' && filterState.category === 'all' && !filterState.collection
                  ? 'text-[#176B48] font-bold border-b-2 border-[#176B48]'
                  : ''
              }`}
            >
              সব বই
            </button>
            <button
              type="button"
              onClick={() => navigateTo('catalog', undefined, 'fiction')}
              className="hover:text-[#176B48] transition-colors py-1 cursor-pointer"
            >
              উপন্যাস
            </button>
            <button
              type="button"
              onClick={() => navigateTo('catalog', undefined, 'islamic')}
              className="hover:text-[#176B48] transition-colors py-1 cursor-pointer"
            >
              ইসলামি বই
            </button>
            <button
              type="button"
              onClick={() => navigateTo('catalog', undefined, 'academic')}
              className="hover:text-[#176B48] transition-colors py-1 cursor-pointer"
            >
              একাডেমিক
            </button>
            <button
              type="button"
              onClick={() => navigateTo('catalog', undefined, 'science-tech')}
              className="hover:text-[#176B48] transition-colors py-1 cursor-pointer"
            >
              বিজ্ঞান ও প্রযুক্তি
            </button>
            <button
              type="button"
              onClick={() => navigateTo('catalog', undefined, 'job-prep')}
              className="hover:text-[#176B48] transition-colors py-1 cursor-pointer"
            >
              চাকরি প্রস্তুতি
            </button>
            <button
              type="button"
              onClick={() => navigateTo('catalog', undefined, undefined, undefined, undefined, undefined, 'bestseller')}
              className="hover:text-[#176B48] transition-colors py-1 text-[#176B48] font-semibold cursor-pointer"
            >
              অফার ও বেস্টসেলার
            </button>
          </div>

          {/* Quick Help Link */}
          <a
            href={`tel:${SITE_CONFIG.contact.hotline.replace(/[^\d+]/g, '')}`}
            className="text-xs text-[#69736D] hover:text-[#176B48] flex items-center gap-1.5 transition-colors cursor-pointer group"
            title="অর্ডার সহায়তায় কল করুন"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
            <span>অর্ডার সহায়তা: <strong className="text-[#18211C] group-hover:underline font-mono">{SITE_CONFIG.contact.hotline}</strong></span>
          </a>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#E5EAE6] flex items-center justify-between bg-[#F6F8F6]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#176B48] flex items-center justify-center text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-[#176B48]">{SITE_CONFIG.brandNameBangla}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#69736D] hover:bg-white"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Auth Card */}
            <div className="p-3 bg-[#E8F3EE]/60 border-b border-[#E5EAE6]">
              {currentUser ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#18211C] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#69736D] font-mono">{currentUser.phone}</p>
                  </div>
                  <button
                    onClick={() => {
                      demoLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1 text-xs bg-white text-rose-600 rounded-lg border border-rose-200 font-semibold"
                  >
                    লগআউট
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="py-2.5 px-2 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
                  >
                    সাইন ইন / লগইন
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('register');
                    }}
                    className="py-2.5 px-2 bg-white hover:bg-gray-100 border border-[#E5EAE6] text-[#18211C] text-xs font-semibold rounded-lg text-center transition-colors cursor-pointer"
                  >
                    নতুন অ্যাকাউন্ট
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Links */}
            <div className="p-4 flex-1 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-[#69736D] uppercase tracking-wider mb-2">
                  প্রধান মেনু
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('home');
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-[#18211C] hover:bg-[#F6F8F6] cursor-pointer"
                  >
                    হোম
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('catalog', undefined, 'all');
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-[#18211C] hover:bg-[#F6F8F6] cursor-pointer"
                  >
                    সব বই ব্রাউজ করুন
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('wishlist');
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-[#18211C] hover:bg-[#F6F8F6] flex justify-between cursor-pointer"
                  >
                    <span>পছন্দের তালিকা</span>
                    <span className="text-xs text-[#176B48] font-bold">{wishlistCount}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('cart');
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-[#18211C] hover:bg-[#F6F8F6] flex justify-between cursor-pointer"
                  >
                    <span>শপিং ব্যাগ</span>
                    <span className="text-xs text-[#176B48] font-bold">{cartCount}</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('account', undefined, undefined, undefined, undefined, 'tracking');
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-[#18211C] hover:bg-[#F6F8F6] cursor-pointer"
                  >
                    অর্ডার ট্র্যাকিং
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigateTo('admin');
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-bold rounded-lg text-[#176B48] bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between cursor-pointer border border-emerald-200 mt-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>অ্যাডমিন প্যানেল</span>
                    </span>
                    <span className="text-[10px] bg-[#176B48] text-white px-2 py-0.5 rounded">লগইন</span>
                  </button>
                </div>
              </div>

              {/* Drawer Categories */}
              <div>
                <p className="text-[11px] font-bold text-[#69736D] uppercase tracking-wider mb-2">
                  বইয়ের ক্যাটাগরি
                </p>
                <div className="space-y-1">
                  {POPULAR_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className="w-full text-left px-3 py-2 text-xs text-[#18211C] hover:bg-[#F6F8F6] rounded-lg flex items-center justify-between cursor-pointer"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#69736D]">({cat.bookCount})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer with interactive tel link */}
            <div className="p-4 border-t border-[#E5EAE6] bg-[#F6F8F6] text-xs text-[#69736D]">
              <p className="font-semibold text-[#18211C] mb-1">সহায়তা প্রয়োজন?</p>
              <a
                href={`tel:${SITE_CONFIG.contact.hotline.replace(/[^\d+]/g, '')}`}
                className="text-[#176B48] hover:underline font-bold font-mono block"
              >
                হটলাইন: {SITE_CONFIG.contact.hotline}
              </a>
              <p className="mt-2 text-[10px]">বইঘর © ২০২৬ — ডেমো সংস্করণ</p>
            </div>
          </div>
          
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
