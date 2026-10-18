import React, { useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  X, 
  BookOpen, 
  ChevronDown 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BookCard } from '../common/BookCard';
import { POPULAR_CATEGORIES } from '../../data/siteConfig';

export const CatalogPage: React.FC = () => {
  const { allBooks, filterState, setFilterState, resetFilters, categories } = useStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const activeCategories = useMemo(() => {
    return (categories && categories.length > 0) ? categories : POPULAR_CATEGORIES;
  }, [categories]);

  // Extract unique authors from dataset
  const uniqueAuthors = useMemo(() => {
    const authors = Array.from(new Set(allBooks.map((b) => b.author)));
    return authors.sort();
  }, [allBooks]);

  // Compute filtered & sorted books
  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      // Exclude archived or draft/unpublished books from public catalog
      if (book.isArchived || book.isPublished === false) {
        return false;
      }

      // 1. Search Query
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase().trim();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesEnglishTitle = book.englishTitle ? book.englishTitle.toLowerCase().includes(query) : false;
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesPublisher = book.publisher.toLowerCase().includes(query);
        const matchesCategory = book.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesEnglishTitle && !matchesAuthor && !matchesPublisher && !matchesCategory) {
          return false;
        }
      }

      // 2. Category
      if (filterState.category !== 'all') {
        if (book.categorySlug !== filterState.category) {
          return false;
        }
      }

      // 3. Collection
      if (filterState.collection) {
        if (!book.specialCollections || !book.specialCollections.includes(filterState.collection)) {
          return false;
        }
      }

      // 4. Author
      if (filterState.author !== 'all') {
        if (book.author !== filterState.author) {
          return false;
        }
      }

      // 5. Price Range
      if (book.demoPrice < filterState.minPrice || book.demoPrice > filterState.maxPrice) {
        return false;
      }

      // 6. Availability / In Stock
      if (filterState.inStockOnly && book.stock <= 0) {
        return false;
      }

      // 7. Special Tag (Bestseller / New Arrival / Discount)
      if (filterState.specialTag && filterState.specialTag !== 'all') {
        if (filterState.specialTag === 'bestseller' && !book.isBestseller) {
          return false;
        }
        if (filterState.specialTag === 'new' && !book.isNewArrival) {
          return false;
        }
        if (filterState.specialTag === 'discount' && (!book.discountPercent || book.discountPercent <= 0)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') {
        return a.demoPrice - b.demoPrice;
      }
      if (filterState.sortBy === 'price-desc') {
        return b.demoPrice - a.demoPrice;
      }
      if (filterState.sortBy === 'title') {
        return a.title.localeCompare(b.title, 'bn');
      }
      if (filterState.sortBy === 'newest') {
        return (b.publicationYear || 0) - (a.publicationYear || 0);
      }
      return 0; // default
    });
  }, [allBooks, filterState]);

  const activeFilterCount = [
    filterState.searchQuery ? 1 : 0,
    filterState.category !== 'all' ? 1 : 0,
    filterState.collection ? 1 : 0,
    filterState.author !== 'all' ? 1 : 0,
    filterState.minPrice > 0 || filterState.maxPrice < 1000 ? 1 : 0,
    filterState.inStockOnly ? 1 : 0,
    filterState.specialTag && filterState.specialTag !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="py-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb Header */}
        <div className="mb-6 pb-4 border-b border-[#E5EAE6] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#69736D] mb-1">
              <span>হোম</span> <span className="mx-1">/</span> <span className="text-[#176B48] font-semibold">বইয়ের ক্যাটালগ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#18211C] tracking-tight">
              {filterState.specialTag === 'bestseller'
                ? 'বেস্টসেলার বইসমূহ'
                : filterState.specialTag === 'new'
                ? 'নতুন প্রকাশিত বই'
                : filterState.specialTag === 'discount'
                ? 'বিশেষ ছাড়ের বইসমূহ'
                : filterState.collection
                ? filterState.collection
                : filterState.category !== 'all'
                ? POPULAR_CATEGORIES.find((c) => c.slug === filterState.category)?.name || 'বই ক্যাটালগ'
                : 'সকল বইসমূহ'}
            </h1>
            <p className="text-xs text-[#69736D] mt-1">
              মোট <strong className="text-[#18211C] tabular-nums font-semibold">{filteredBooks.length}</strong> টি বই প্রদর্শিত হচ্ছে
            </p>
          </div>

          {/* Sort & Mobile Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F6F8F6] border border-[#E5EAE6] text-xs font-semibold text-[#18211C] hover:bg-[#EFF3F0] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#176B48]" />
              <span>ফিল্টার</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#176B48] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#69736D] hidden sm:inline">সাজান:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-2 bg-[#F6F8F6] border border-[#E5EAE6] rounded-xl text-xs font-medium text-[#18211C] focus:border-[#176B48] outline-none cursor-pointer"
              >
                <option value="default">প্রাসঙ্গিকতা (ডিফল্ট)</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
                <option value="newest">নতুন সংযোজন</option>
                <option value="title">শিরোনাম অনুযায়ী (অ-ঔ)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar (Desktop) + Right Book Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar (1 col) */}
          <aside className="hidden lg:block space-y-6 bg-[#F6F8F6] p-5 rounded-2xl border border-[#E5EAE6] h-fit sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#18211C]">
                <Filter className="w-4 h-4 text-[#176B48]" />
                <span>ফিল্টার অপশন</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#176B48] hover:text-[#104D36] flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>রিসেট</span>
                </button>
              )}
            </div>

            {/* Search within catalog */}
            <div>
              <label className="block text-xs font-bold text-[#18211C] mb-2">
                অনুসন্ধান
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filterState.searchQuery}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="বই, লেখক, প্রকাশনী..."
                  className="w-full pl-8 pr-3 py-2 bg-white text-xs rounded-lg border border-[#E5EAE6] focus:border-[#176B48] outline-none placeholder:text-[#69736D]"
                />
                <Search className="w-3.5 h-3.5 text-[#69736D] absolute left-2.5 top-1/2 -translate-y-1/2" />
                {filterState.searchQuery && (
                  <button
                    onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Special Highlights Filter */}
            <div>
              <label className="block text-xs font-bold text-[#18211C] mb-2">
                সংগ্রহ ও ফিচার
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFilterState((p) => ({ ...p, specialTag: 'all' }))}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                    !filterState.specialTag || filterState.specialTag === 'all'
                      ? 'bg-[#176B48] text-white border-[#176B48]'
                      : 'bg-white text-[#18211C] border-[#E5EAE6] hover:bg-gray-50'
                  }`}
                >
                  সকল বই
                </button>
                <button
                  type="button"
                  onClick={() => setFilterState((p) => ({ ...p, specialTag: 'bestseller' }))}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                    filterState.specialTag === 'bestseller'
                      ? 'bg-[#176B48] text-white border-[#176B48]'
                      : 'bg-white text-[#18211C] border-[#E5EAE6] hover:bg-gray-50'
                  }`}
                >
                  বেস্টসেলার
                </button>
                <button
                  type="button"
                  onClick={() => setFilterState((p) => ({ ...p, specialTag: 'new' }))}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                    filterState.specialTag === 'new'
                      ? 'bg-[#176B48] text-white border-[#176B48]'
                      : 'bg-white text-[#18211C] border-[#E5EAE6] hover:bg-gray-50'
                  }`}
                >
                  নতুন বই
                </button>
                <button
                  type="button"
                  onClick={() => setFilterState((p) => ({ ...p, specialTag: 'discount' }))}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                    filterState.specialTag === 'discount'
                      ? 'bg-[#176B48] text-white border-[#176B48]'
                      : 'bg-white text-[#18211C] border-[#E5EAE6] hover:bg-gray-50'
                  }`}
                >
                  মূল্যছাড়
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-[#18211C] mb-2">
                ক্যাটাগরি
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setFilterState((prev) => ({ ...prev, category: 'all', collection: '' }))}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    filterState.category === 'all' && !filterState.collection
                      ? 'bg-[#176B48] text-white'
                      : 'text-[#18211C] hover:bg-white'
                  }`}
                >
                  <span>সকল বিষয়</span>
                  <span className="text-[10px] opacity-80 font-mono">({allBooks.length})</span>
                </button>
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterState((prev) => ({ ...prev, category: cat.slug, collection: '' }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      filterState.category === cat.slug
                        ? 'bg-[#176B48] text-white'
                        : 'text-[#18211C] hover:bg-white'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] opacity-80 font-mono">
                      ({allBooks.filter((b) => b.categorySlug === cat.slug).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-xs font-bold text-[#18211C] mb-2">
                লেখক
              </label>
              <select
                value={filterState.author}
                onChange={(e) => setFilterState((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full px-2.5 py-2 bg-white text-xs rounded-lg border border-[#E5EAE6] focus:border-[#176B48] outline-none text-[#18211C] cursor-pointer"
              >
                <option value="all">সকল লেখক</option>
                {uniqueAuthors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter (Range Slider / Maximum) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#18211C]">
                  সর্বোচ্চ মূল্য
                </label>
                <span className="text-xs font-bold text-[#176B48] tabular-nums font-mono">
                  ৳{filterState.maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="20"
                value={filterState.maxPrice}
                onChange={(e) => setFilterState((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-[#176B48] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#69736D] mt-1 font-mono">
                <span>৳১০০</span>
                <span>৳১০০০</span>
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-2 border-t border-[#E5EAE6]">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterState.inStockOnly}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                  className="rounded text-[#176B48] focus:ring-[#176B48] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-medium text-[#18211C]">শুধু স্টকে থাকা বই</span>
              </label>
            </div>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-white hover:bg-gray-100 text-[#18211C] text-xs font-semibold rounded-lg border border-[#E5EAE6] transition-colors cursor-pointer"
              >
                সব ফিল্টার মুছুন ({activeFilterCount})
              </button>
            )}
          </aside>

          {/* Right Area: Books Grid (3 cols) */}
          <main className="lg:col-span-3">
            {/* Active filter badges strip */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#69736D]">সক্রিয় ফিল্টার:</span>
                {filterState.specialTag && filterState.specialTag !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-[#176B48] font-semibold">
                    {filterState.specialTag === 'bestseller' ? 'বেস্টসেলার' : filterState.specialTag === 'new' ? 'নতুন প্রকাশিত' : 'মূল্যছাড়'}
                    <button 
                      type="button" 
                      onClick={() => setFilterState((p) => ({ ...p, specialTag: 'all' }))} 
                      className="text-[#176B48] hover:text-[#104D36] ml-1 cursor-pointer"
                      aria-label="ফিল্টার মুছুন"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F6F8F6] border border-[#E5EAE6] rounded-md text-xs text-[#18211C]">
                    অনুসন্ধান: "{filterState.searchQuery}"
                    <button onClick={() => setFilterState((p) => ({ ...p, searchQuery: '' }))} className="text-[#69736D] hover:text-[#18211C]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.category !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F6F8F6] border border-[#E5EAE6] rounded-md text-xs text-[#18211C]">
                    বিষয়: {activeCategories.find((c) => c.slug === filterState.category)?.name}
                    <button onClick={() => setFilterState((p) => ({ ...p, category: 'all' }))} className="text-[#69736D] hover:text-[#18211C]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.collection && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F6F8F6] border border-[#E5EAE6] rounded-md text-xs text-[#18211C]">
                    কালেকশন: {filterState.collection}
                    <button onClick={() => setFilterState((p) => ({ ...p, collection: '' }))} className="text-[#69736D] hover:text-[#18211C]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.author !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F6F8F6] border border-[#E5EAE6] rounded-md text-xs text-[#18211C]">
                    লেখক: {filterState.author}
                    <button onClick={() => setFilterState((p) => ({ ...p, author: 'all' }))} className="text-[#69736D] hover:text-[#18211C]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.maxPrice < 1000 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F6F8F6] border border-[#E5EAE6] rounded-md text-xs text-[#18211C]">
                    সর্বোচ্চ: ৳{filterState.maxPrice}
                    <button onClick={() => setFilterState((p) => ({ ...p, maxPrice: 1000 }))} className="text-[#69736D] hover:text-[#18211C]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F6F8F6] border border-[#E5EAE6] rounded-md text-xs text-[#18211C]">
                    শুধু ইন-স্টক
                    <button onClick={() => setFilterState((p) => ({ ...p, inStockOnly: false }))} className="text-[#69736D] hover:text-[#18211C]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Books Grid or Empty State */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} showCategory={true} />
                ))}
              </div>
            ) : (
              /* Helpful Empty Results State */
              <div className="text-center py-16 px-4 bg-[#F6F8F6] rounded-2xl border border-[#E5EAE6]">
                <div className="w-16 h-16 rounded-2xl bg-white text-[#69736D] flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#18211C] mb-1">
                  কোনো বই খুঁজে পাওয়া যায়নি
                </h3>
                <p className="text-xs sm:text-sm text-[#69736D] max-w-md mx-auto mb-6">
                  আপনার অনুসন্ধান বা নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো বই বর্তমানে এই ডেমো ক্যাটালগে নেই। অনুগ্রহ করে ভিন্ন শব্দ দিয়ে অনুসন্ধান করুন।
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>সব ফিল্টার রিসেট করুন</span>
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-5/6 max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE6] mb-4">
              <div className="flex items-center gap-2 font-bold text-[#18211C]">
                <Filter className="w-4 h-4 text-[#176B48]" />
                <span>ফিল্টার সেটিংস</span>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories & Tags */}
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-[#18211C] mb-2">সংগ্রহ ও ফিচার</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFilterState((p) => ({ ...p, specialTag: 'all' }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                      !filterState.specialTag || filterState.specialTag === 'all'
                        ? 'bg-[#176B48] text-white border-[#176B48]'
                        : 'bg-[#F6F8F6] text-[#18211C] border-[#E5EAE6]'
                    }`}
                  >
                    সকল বই
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterState((p) => ({ ...p, specialTag: 'bestseller' }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                      filterState.specialTag === 'bestseller'
                        ? 'bg-[#176B48] text-white border-[#176B48]'
                        : 'bg-[#F6F8F6] text-[#18211C] border-[#E5EAE6]'
                    }`}
                  >
                    বেস্টসেলার
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterState((p) => ({ ...p, specialTag: 'new' }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                      filterState.specialTag === 'new'
                        ? 'bg-[#176B48] text-white border-[#176B48]'
                        : 'bg-[#F6F8F6] text-[#18211C] border-[#E5EAE6]'
                    }`}
                  >
                    নতুন বই
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterState((p) => ({ ...p, specialTag: 'discount' }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer border ${
                      filterState.specialTag === 'discount'
                        ? 'bg-[#176B48] text-white border-[#176B48]'
                        : 'bg-[#F6F8F6] text-[#18211C] border-[#E5EAE6]'
                    }`}
                  >
                    মূল্যছাড়
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211C] mb-2">বিষয়</label>
                <select
                  value={filterState.category}
                  onChange={(e) => setFilterState((p) => ({ ...p, category: e.target.value, collection: '' }))}
                  className="w-full p-2 text-xs border border-[#E5EAE6] rounded-lg"
                >
                  <option value="all">সকল ক্যাটাগরি</option>
                  {activeCategories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211C] mb-2">লেখক</label>
                <select
                  value={filterState.author}
                  onChange={(e) => setFilterState((p) => ({ ...p, author: e.target.value }))}
                  className="w-full p-2 text-xs border border-[#E5EAE6] rounded-lg"
                >
                  <option value="all">সকল লেখক</option>
                  {uniqueAuthors.map((author) => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>সর্বোচ্চ মূল্য</span>
                  <span className="text-[#176B48]">৳{filterState.maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="20"
                  value={filterState.maxPrice}
                  onChange={(e) => setFilterState((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
                  className="w-full accent-[#176B48]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterState.inStockOnly}
                    onChange={(e) => setFilterState((p) => ({ ...p, inStockOnly: e.target.checked }))}
                    className="rounded text-[#176B48]"
                  />
                  <span>শুধু স্টকে থাকা বই</span>
                </label>
              </div>
            </div>

            {/* Mobile Filter Footer */}
            <div className="pt-4 border-t border-[#E5EAE6] flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#18211C] text-xs font-semibold rounded-xl"
              >
                রিসেট
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-semibold rounded-xl"
              >
                প্রয়োগ করুন ({filteredBooks.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
