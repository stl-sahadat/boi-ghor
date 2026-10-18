import React, { useState, useMemo, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  BookOpen, 
  ShoppingBag, 
  Tags, 
  Database, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Archive, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  AlertTriangle, 
  Upload, 
  Download, 
  ExternalLink, 
  LogOut, 
  DollarSign, 
  Package, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Sparkles,
  Phone,
  MapPin,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Book, CategoryItem, DemoOrder, BookCoverTheme } from '../../types';
import { createSampleTableOfContents, createSampleTextPage } from '../../data/bookInteriorPages';

export const AdminDashboard: React.FC = () => {
  const {
    allBooks,
    addBook,
    updateBook,
    togglePublishBook,
    archiveBook,
    restoreBook,
    deleteBookPermanently,
    resetToDemoBooks,
    importBooks,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    adminUser,
    isAdmin,
    adminLogin,
    adminLogout,
    navigateTo,
    recentOrders,
    updateOrderStatus,
    showToast,
  } = useStore();

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('sahadat.info01@gmail.com');
  const [passkey, setPasskey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'categories' | 'orders' | 'database'>('overview');

  // Books Filter & Search State
  const [bookSearch, setBookSearch] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('all');
  const [bookStatusFilter, setBookStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived' | 'low_stock'>('all');

  // Book Modal (Add / Edit)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Book Form State
  const initialBookForm: Omit<Book, 'id'> = {
    title: '',
    englishTitle: '',
    author: '',
    publisher: 'বইঘর প্রকাশনী',
    category: 'উপন্যাস ও গল্প',
    categorySlug: 'fiction',
    demoPrice: 350,
    originalPrice: 400,
    discountPercent: 12,
    stock: 20,
    rating: 5.0,
    ratingCount: 1,
    pages: 200,
    edition: '১ম সংস্করণ, ২০২৬',
    isbn: '978-984-900-001-1',
    description: '',
    coverTheme: {
      primary: '#176B48',
      secondary: '#104D36',
      accent: '#E6B800',
      textColor: '#FFFFFF',
      pattern: 'classic',
    },
    coverImage: '',
    previewLabels: ['সূচিপত্র', 'নমুনা পৃষ্ঠা ১'],
    previewImages: [],
    isPublished: true,
    isArchived: false,
    isBestseller: false,
    isNewArrival: true,
  };

  const [bookForm, setBookForm] = useState<Omit<Book, 'id'>>(initialBookForm);
  const [newPreviewLabel, setNewPreviewLabel] = useState('');
  const [newPreviewUrl, setNewPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Orders Filter & State
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | DemoOrder['status']>('all');
  const [revealedCustomerOrders, setRevealedCustomerOrders] = useState<Record<string, boolean>>({});

  // Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEnglishName, setNewCatEnglishName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Confirmation Modals
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Handle Admin Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const result = adminLogin(loginEmail, passkey);
    if (!result.success) {
      setAuthError(result.message);
    }
  };

  // If Not Authenticated, Show Protected Admin Login Portal
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F8F6] py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5EAE6] p-8 shadow-sm">
          <div className="w-14 h-14 bg-[#E8F3EE] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#176B48]">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-[#18211C]">বইঘর অ্যাডমিন এক্সেস পোর্টাল</h1>
            <p className="text-xs text-[#69736D] mt-1">
              প্রশাসনিক নিয়ন্ত্রণ প্যানেল (Protected Admin Gateway)
            </p>
          </div>

          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>নিরাপত্তা নীতি:</strong> সাধারণ গ্রাহক একাউন্ট দিয়ে অ্যাডমিন প্যানেলে প্রবেশাধিকার নেই। কেবল অনুমোদিত প্রশাসক পরিচয় যাচাই সাপেক্ষে লগইন করা যাবে।
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#18211C] mb-1">
                প্রশাসক ইমেইল (Authorized Admin Email)
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE6] text-xs focus:outline-none focus:border-[#176B48] bg-[#F6F8F6]"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18211C] mb-1">
                অ্যাডমিন পাসকি (Admin Passkey)
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                required
                placeholder="ডিফল্ট: boighor@admin2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE6] text-xs focus:outline-none focus:border-[#176B48]"
              />
              <p className="text-[10px] text-[#69736D] mt-1">
                *টেস্ট পাসকি: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">boighor@admin2026</code>
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>প্রশাসনিক প্যানেলে প্রবেশ করুন</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="w-full py-2.5 text-center text-xs font-semibold text-[#69736D] hover:text-[#18211C] cursor-pointer"
            >
              বুকস্টোর হোমপেজে ফিরে যান
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Metrics Calculation ---
  const totalBooksCount = allBooks.length;
  const publishedBooksCount = allBooks.filter((b) => b.isPublished && !b.isArchived).length;
  const draftBooksCount = allBooks.filter((b) => !b.isPublished && !b.isArchived).length;
  const archivedBooksCount = allBooks.filter((b) => b.isArchived).length;
  const lowStockBooks = allBooks.filter((b) => b.stock <= 5 && !b.isArchived);
  const totalOrdersCount = recentOrders.length;
  const pendingOrdersCount = recentOrders.filter((o) => o.status === 'pending').length;
  const totalRevenue = recentOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Filtered Books
  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      // Search
      const q = bookSearch.trim().toLowerCase();
      const matchSearch = !q || (
        book.title.toLowerCase().includes(q) ||
        (book.englishTitle && book.englishTitle.toLowerCase().includes(q)) ||
        book.author.toLowerCase().includes(q) ||
        book.publisher.toLowerCase().includes(q)
      );

      // Category
      const matchCat = bookCategoryFilter === 'all' || book.categorySlug === bookCategoryFilter;

      // Status
      let matchStatus = true;
      if (bookStatusFilter === 'published') matchStatus = Boolean(book.isPublished && !book.isArchived);
      if (bookStatusFilter === 'draft') matchStatus = Boolean(!book.isPublished && !book.isArchived);
      if (bookStatusFilter === 'archived') matchStatus = Boolean(book.isArchived);
      if (bookStatusFilter === 'low_stock') matchStatus = Boolean(book.stock <= 5 && !book.isArchived);

      return matchSearch && matchCat && matchStatus;
    });
  }, [allBooks, bookSearch, bookCategoryFilter, bookStatusFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return recentOrders;
    return recentOrders.filter((o) => o.status === orderStatusFilter);
  }, [recentOrders, orderStatusFilter]);

  // Open Book Modal (New or Edit)
  const handleOpenAddBook = () => {
    setEditingBookId(null);
    setBookForm({
      ...initialBookForm,
      previewImages: [
        createSampleTableOfContents('নতুন বই', 'লেখক নাম', [
          { title: 'সূচিপত্র ভূমিকা', page: '৭' },
          { title: 'অধ্যায় ১: সূচনা পর্ব', page: '১৫' },
        ]),
        createSampleTextPage('নতুন বই · লেখক নাম', 'অধ্যায় ১', '১৫', [
          'বইটির প্রথম অধ্যায়ের নমুনা পৃষ্ঠা প্রদর্শনের জন্য প্রস্তুত করা হয়েছে।'
        ])
      ]
    });
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book: Book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title,
      englishTitle: book.englishTitle || '',
      author: book.author,
      publisher: book.publisher,
      category: book.category,
      categorySlug: book.categorySlug,
      demoPrice: book.demoPrice,
      originalPrice: book.originalPrice || Math.round(book.demoPrice * 1.2),
      discountPercent: book.discountPercent || 0,
      stock: book.stock,
      rating: book.rating,
      ratingCount: book.ratingCount,
      pages: book.pages || 200,
      edition: book.edition || '১ম সংস্করণ',
      isbn: book.isbn || '',
      description: book.description,
      coverTheme: book.coverTheme,
      coverImage: book.coverImage || '',
      previewLabels: book.previewLabels || ['সূচিপত্র', 'নমুনা পৃষ্ঠা ১'],
      previewImages: book.previewImages || [],
      isPublished: book.isPublished !== undefined ? book.isPublished : true,
      isArchived: Boolean(book.isArchived),
      isBestseller: Boolean(book.isBestseller),
      isNewArrival: Boolean(book.isNewArrival),
    });
    setIsBookModalOpen(true);
  };

  // Save Book Handler
  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      showToast('বইয়ের শিরোনাম ও লেখকের নাম বাধ্যতামূলক');
      return;
    }

    if (editingBookId) {
      updateBook(editingBookId, bookForm);
    } else {
      addBook(bookForm);
    }
    setIsBookModalOpen(false);
  };

  // Upload or Add Preview Image
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP) গ্রহণযোগ্য');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('ফাইলের আকার সর্বোচ্চ ২ মেগাবাইট হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const label = newPreviewLabel.trim() || `পৃষ্ঠা ${((bookForm.previewImages?.length || 0) + 1)}`;
      setBookForm((prev) => ({
        ...prev,
        previewImages: [...(prev.previewImages || []), result],
        previewLabels: [...(prev.previewLabels || []), label],
      }));
      setNewPreviewLabel('');
      showToast('পৃষ্ঠার ছবি সফলভাবে সংযুক্ত করা হয়েছে');
    };
    reader.readAsDataURL(file);
  };

  const handleAddPreviewUrl = () => {
    if (!newPreviewUrl.trim()) return;
    const label = newPreviewLabel.trim() || `পৃষ্ঠা ${((bookForm.previewImages?.length || 0) + 1)}`;
    setBookForm((prev) => ({
      ...prev,
      previewImages: [...(prev.previewImages || []), newPreviewUrl.trim()],
      previewLabels: [...(prev.previewLabels || []), label],
    }));
    setNewPreviewUrl('');
    setNewPreviewLabel('');
    showToast('পৃষ্ঠার লিংক সংযুক্ত করা হয়েছে');
  };

  const handleRemovePreview = (index: number) => {
    setBookForm((prev) => ({
      ...prev,
      previewImages: (prev.previewImages || []).filter((_, i) => i !== index),
      previewLabels: (prev.previewLabels || []).filter((_, i) => i !== index),
    }));
  };

  const handleMovePreview = (index: number, direction: 'up' | 'down') => {
    const images = [...(bookForm.previewImages || [])];
    const labels = [...(bookForm.previewLabels || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    const tempImg = images[index];
    images[index] = images[targetIndex];
    images[targetIndex] = tempImg;

    const tempLbl = labels[index];
    labels[index] = labels[targetIndex];
    labels[targetIndex] = tempLbl;

    setBookForm((prev) => ({
      ...prev,
      previewImages: images,
      previewLabels: labels,
    }));
  };

  // Toggle Customer PII reveal for fulfillment
  const toggleCustomerReveal = (orderId: string) => {
    setRevealedCustomerOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-[#18211C] pb-16">
      
      {/* Top Admin Navigation Bar */}
      <header className="bg-white border-b border-[#E5EAE6] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#176B48] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ব
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#18211C]">বইঘর অ্যাডমিন প্যানেল</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3EE] text-[#176B48] border border-[#176B48]/20">
                  সুপার অ্যাডমিন
                </span>
              </div>
              <p className="text-[11px] text-[#69736D] truncate max-w-xs sm:max-w-md">
                অ্যাকাউন্ট: {adminUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateTo('home')}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#176B48] bg-[#E8F3EE] hover:bg-[#d8eadd] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>স্টোর ভিউ দেখুন</span>
            </button>

            <button
              onClick={adminLogout}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 border-t border-[#E5EAE6]/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'ওভারভিউ', icon: Layers },
            { id: 'books', label: `বই তালিকা (${allBooks.length})`, icon: BookOpen },
            { id: 'categories', label: `ক্যাটাগরি (${categories.length})`, icon: Tags },
            { id: 'orders', label: `অর্ডারসমূহ (${recentOrders.length})`, icon: ShoppingBag },
            { id: 'database', label: 'ডাটা ও ব্যাকআপ', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#176B48] text-[#176B48]'
                    : 'border-transparent text-[#69736D] hover:text-[#18211C]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* System Notice regarding Storage & Firebase Status */}
        <div className="mb-6 bg-white rounded-2xl border border-[#E5EAE6] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#176B48] flex items-center justify-center shrink-0 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#18211C]">
                সিস্টেম স্টোরেজ ইঞ্জিন: সিকিউর লোকাল পারসিস্টেন্স (Persistent Local Storage)
              </p>
              <p className="text-[#69736D] text-[11px] mt-0.5">
                Firebase ক্লাউড সেটআপ ব্যবহারকারী কর্তৃক প্রত্যাখ্যান করা হয়েছিল। তাই অ্যাপটি নিরাপদ ব্রাউজার-লেভেল পারসিস্টেন্ট ইঞ্জিনে চলছে। সমস্ত পরিবর্তন তাৎক্ষণিকভাবে সংরক্ষিত হচ্ছে।
              </p>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-[#176B48] font-bold border border-emerald-200 shrink-0">
            ডাটাবেজ সক্রিয়
          </span>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#69736D] mb-2">
                  <span className="text-xs font-medium">মোট বিক্রয় (Revenue)</span>
                  <DollarSign className="w-4 h-4 text-[#176B48]" />
                </div>
                <div className="text-2xl font-bold text-[#18211C] font-mono">
                  ৳{totalRevenue.toLocaleString('bn-BD')}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  সফল ও প্রসেসিং অর্ডার বাবদ
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#69736D] mb-2">
                  <span className="text-xs font-medium">অর্ডার সংখ্যা</span>
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-[#18211C] font-mono">
                  {totalOrdersCount}
                </div>
                <div className="text-[11px] text-amber-600 font-semibold mt-1">
                  অপেক্ষমাণ: {pendingOrdersCount} টি
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#69736D] mb-2">
                  <span className="text-xs font-medium">সক্রিয় ক্যাটালগ বই</span>
                  <BookOpen className="w-4 h-4 text-[#176B48]" />
                </div>
                <div className="text-2xl font-bold text-[#18211C] font-mono">
                  {publishedBooksCount} <span className="text-xs font-normal text-[#69736D]">/ {totalBooksCount}</span>
                </div>
                <div className="text-[11px] text-[#69736D] mt-1">
                  ড্রাফট: {draftBooksCount} · আর্কাইভ: {archivedBooksCount}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#69736D] mb-2">
                  <span className="text-xs font-medium">কম স্টক সতর্কতা</span>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-bold text-rose-600 font-mono">
                  {lowStockBooks.length}
                </div>
                <div className="text-[11px] text-rose-600 font-medium mt-1">
                  স্টক ৫ বা তার কম
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Recent Orders */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAE6]">
                  <div>
                    <h2 className="text-sm font-bold text-[#18211C]">সাম্প্রতিক গ্রাহক অর্ডারসমূহ</h2>
                    <p className="text-[11px] text-[#69736D]">ফুলফিলমেন্ট ও স্ট্যাটাস ট্র্যাকিং</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#176B48] hover:underline cursor-pointer"
                  >
                    সমস্ত অর্ডার দেখুন ({recentOrders.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.orderId}
                      className="p-3 rounded-xl border border-[#E5EAE6] hover:border-[#176B48]/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-[#18211C]">#{order.orderId}</span>
                          <span className="text-[10px] text-[#69736D]">{order.createdAt}</span>
                        </div>
                        <p className="text-[#18211C] font-medium mt-0.5">
                          {order.customer.fullName} · {order.items.length} টি বই (৳{order.total})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value as any)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[#E5EAE6] bg-[#F6F8F6] focus:outline-none focus:border-[#176B48]"
                        >
                          <option value="pending">অপেক্ষমাণ (Pending)</option>
                          <option value="processing">প্রসেসিং (Processing)</option>
                          <option value="shipped">ডেলিভারিতে (Shipped)</option>
                          <option value="delivered">ডেলিভার্ড (Delivered)</option>
                          <option value="cancelled">বাতিল (Cancelled)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Low Stock Alerts */}
              <div className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAE6]">
                  <div>
                    <h2 className="text-sm font-bold text-rose-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>লো স্টক অ্যালার্ট</span>
                    </h2>
                    <p className="text-[11px] text-[#69736D]">দ্রুত রি-স্টক প্রয়োজন</p>
                  </div>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {lowStockBooks.length} টি
                  </span>
                </div>

                {lowStockBooks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#69736D]">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    সব বই পর্যাপ্ত স্টকে রয়েছে।
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {lowStockBooks.map((b) => (
                      <div
                        key={b.id}
                        className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-[#18211C] truncate">{b.title}</p>
                          <p className="text-[10px] text-[#69736D] truncate">{b.author}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-rose-700 font-bold font-mono px-2 py-0.5 bg-white rounded border border-rose-200">
                            {b.stock} টি
                          </span>
                          <button
                            onClick={() => updateBook(b.id, { stock: b.stock + 10 })}
                            className="p-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-[10px] font-bold cursor-pointer"
                            title="+১০ যোগ করুন"
                          >
                            +১০
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: BOOKS MANAGEMENT */}
        {activeTab === 'books' && (
          <div className="space-y-4">
            
            {/* Action Bar */}
            <div className="bg-white rounded-2xl border border-[#E5EAE6] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
              
              {/* Search & Category Filter */}
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    placeholder="বইয়ের নাম, লেখক বা প্রকাশক দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5EAE6] text-xs focus:outline-none focus:border-[#176B48]"
                  />
                </div>

                <select
                  value={bookCategoryFilter}
                  onChange={(e) => setBookCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#E5EAE6] text-xs focus:outline-none focus:border-[#176B48] bg-white"
                >
                  <option value="all">সব ক্যাটাগরি</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={bookStatusFilter}
                  onChange={(e) => setBookStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-[#E5EAE6] text-xs focus:outline-none focus:border-[#176B48] bg-white font-medium"
                >
                  <option value="all">সব স্ট্যাটাস ({allBooks.length})</option>
                  <option value="published">প্রকাশিত ({publishedBooksCount})</option>
                  <option value="draft">ড্রাফট ({draftBooksCount})</option>
                  <option value="archived">আর্কাইভ ({archivedBooksCount})</option>
                  <option value="low_stock">লো স্টক ({lowStockBooks.length})</option>
                </select>
              </div>

              {/* Add Book Button */}
              <button
                onClick={handleOpenAddBook}
                className="px-4 py-2 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন বই যুক্ত করুন</span>
              </button>

            </div>

            {/* Books Table */}
            <div className="bg-white rounded-2xl border border-[#E5EAE6] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F6F8F6] border-b border-[#E5EAE6] text-[#69736D] font-bold">
                      <th className="py-3 px-4">বই ও লেখক</th>
                      <th className="py-3 px-3">ক্যাটাগরি</th>
                      <th className="py-3 px-3">মূল্য (বিক্রয় / আসল)</th>
                      <th className="py-3 px-3">বর্তমান স্টক</th>
                      <th className="py-3 px-3">প্রিভিউ পৃষ্ঠা</th>
                      <th className="py-3 px-3">অবস্থা</th>
                      <th className="py-3 px-4 text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAE6]">
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#69736D]">
                          কোনো বই পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-[#F6F8F6]/50 transition-colors">
                          
                          {/* Title & Cover Swatch */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-12 rounded shadow-xs shrink-0 flex items-center justify-center text-[10px] text-white font-bold text-center p-1 overflow-hidden"
                                style={{
                                  backgroundColor: book.coverTheme.primary,
                                  backgroundImage: book.coverImage ? `url(${book.coverImage})` : undefined,
                                  backgroundSize: 'cover',
                                }}
                              >
                                {!book.coverImage && book.title.slice(0, 2)}
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <p className="font-bold text-[#18211C] truncate">{book.title}</p>
                                <p className="text-[11px] text-[#69736D] truncate">{book.author} · {book.publisher}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-[#F6F8F6] text-[#18211C] border border-[#E5EAE6] text-[11px]">
                              {book.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-3 font-mono">
                            <div className="font-bold text-[#176B48]">৳{book.demoPrice}</div>
                            {book.originalPrice && book.originalPrice > book.demoPrice && (
                              <div className="text-[10px] text-[#69736D] line-through">৳{book.originalPrice}</div>
                            )}
                          </td>

                          {/* Stock Controls */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateBook(book.id, { stock: Math.max(0, book.stock - 1) })}
                                className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-[#18211C] flex items-center justify-center font-bold text-xs cursor-pointer"
                              >
                                -
                              </button>
                              <span className={`font-mono font-bold px-1.5 min-w-8 text-center ${
                                book.stock <= 5 ? 'text-rose-600' : 'text-[#18211C]'
                              }`}>
                                {book.stock}
                              </span>
                              <button
                                onClick={() => updateBook(book.id, { stock: book.stock + 1 })}
                                className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-[#18211C] flex items-center justify-center font-bold text-xs cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Preview Pages Count */}
                          <td className="py-3 px-3">
                            <span className="text-[11px] text-[#69736D]">
                              {book.previewImages?.length || 0} টি ছবি
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-3">
                            {book.isArchived ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                আর্কাইভ
                              </span>
                            ) : book.isPublished ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                প্রকাশিত
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200">
                                ড্রাফট
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              
                              {/* Publish / Unpublish Toggle */}
                              <button
                                onClick={() => togglePublishBook(book.id)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  book.isPublished
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                                title={book.isPublished ? 'আনপাবলিশ করুন' : 'পাবলিশ করুন'}
                              >
                                {book.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>

                              {/* Archive / Restore */}
                              <button
                                onClick={() => (book.isArchived ? restoreBook(book.id) : archiveBook(book.id))}
                                className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                title={book.isArchived ? 'ক্যাটালগে রিস্টোর করুন' : 'আর্কাইভ করুন'}
                              >
                                {book.isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                              </button>

                              {/* Edit Book */}
                              <button
                                onClick={() => handleOpenEditBook(book)}
                                className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                                title="সম্পাদনা করুন"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Permanently */}
                              <button
                                onClick={() => setDeleteConfirmId(book.id)}
                                className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                title="স্থায়ীভাবে মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            
            <div className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#18211C]">ক্যাটাগরি তালিকা ও বইয়ের পরিসংখ্যান</h2>
                <p className="text-xs text-[#69736D]">ক্যাটালগ ব্রাউজিং ও শ্রেণিবিন্যাস নিয়ন্ত্রণ</p>
              </div>
              <button
                onClick={() => setIsCatModalOpen(true)}
                className="px-4 py-2 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ক্যাটাগরি তৈরি করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const bookCount = allBooks.filter((b) => b.categorySlug === cat.slug && !b.isArchived).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-[#18211C]">{cat.name}</span>
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#E8F3EE] text-[#176B48]">
                          {bookCount} টি বই
                        </span>
                      </div>
                      <p className="text-xs text-[#69736D] mb-1">{cat.englishName} ({cat.slug})</p>
                      <p className="text-[11px] text-[#69736D]/90 line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-center justify-between">
                      <button
                        onClick={() => navigateTo('catalog', undefined, cat.slug)}
                        className="text-xs font-semibold text-[#176B48] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>ক্যাটালগ দেখুন</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        মুছুন
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 4: ORDERS & CUSTOMER FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Orders Filter Bar */}
            <div className="bg-white rounded-2xl border border-[#E5EAE6] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h2 className="text-sm font-bold text-[#18211C]">গ্রাহক অর্ডার ও ফুলফিলমেন্ট</h2>
                <p className="text-xs text-[#69736D]">
                  নিরাপত্তা নীতি: ডেলিভারি ফুলফিলমেন্টের প্রয়োজন ব্যতীত গ্রাহকের ব্যক্তিগত তথ্য (PII) গোপন রাখা হয়।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-[#E5EAE6] text-xs focus:outline-none focus:border-[#176B48] bg-white font-semibold"
                >
                  <option value="all">সব অর্ডার ({recentOrders.length})</option>
                  <option value="pending">অপেক্ষমাণ (Pending)</option>
                  <option value="processing">প্রসেসিং (Processing)</option>
                  <option value="shipped">ডেলিভারিতে (Shipped)</option>
                  <option value="delivered">ডেলিভার্ড (Delivered)</option>
                  <option value="cancelled">বাতিলকৃত (Cancelled)</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E5EAE6] p-12 text-center text-xs text-[#69736D]">
                  কোনো অর্ডার পাওয়া যায়নি।
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isRevealed = Boolean(revealedCustomerOrders[order.orderId]);
                  
                  return (
                    <div
                      key={order.orderId}
                      className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5EAE6]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-[#18211C]">
                            #{order.orderId}
                          </span>
                          <span className="text-xs text-[#69736D]">
                            তারিখ: {order.createdAt}
                          </span>
                        </div>

                        {/* Status Control */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#69736D]">স্ট্যাটাস:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value as any)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl border focus:outline-none ${
                              order.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : order.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : order.status === 'shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="pending">অপেক্ষমাণ (Pending)</option>
                            <option value="processing">প্রসেসিং (Processing)</option>
                            <option value="shipped">ডেলিভারির জন্য প্রেরিত (Shipped)</option>
                            <option value="delivered">সফলভাবে ডেলিভার্ড (Delivered)</option>
                            <option value="cancelled">অর্ডার বাতিল (Cancelled - রিফান্ড স্টক)</option>
                          </select>
                        </div>
                      </div>

                      {/* Items & Customer Info Split Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        
                        {/* Purchased Books */}
                        <div className="p-3.5 rounded-xl bg-[#F6F8F6] space-y-2">
                          <p className="font-bold text-[#18211C] flex items-center justify-between pb-1 border-b border-[#E5EAE6]">
                            <span>অর্ডারকৃত বইসমূহ ({order.items.length} টি)</span>
                            <span className="font-mono text-[#176B48]">মোট: ৳{order.total}</span>
                          </p>
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span className="truncate pr-2">{item.book.title} (x{item.quantity})</span>
                                <span className="font-mono text-[#69736D] shrink-0">৳{item.book.demoPrice * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-[#E5EAE6] text-[10px] text-[#69736D] flex justify-between">
                            <span>ডেলিভারি চার্জ: ৳{order.deliveryFee}</span>
                            <span>পেমেন্ট: {order.customer.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Customer Privacy Isolated Details */}
                        <div className="p-3.5 rounded-xl border border-[#E5EAE6] space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-[#E5EAE6]">
                            <span className="font-bold text-[#18211C]">ডেলিভারি প্রাপকের তথ্য</span>
                            <button
                              onClick={() => toggleCustomerReveal(order.orderId)}
                              className="text-[11px] font-bold text-[#176B48] hover:underline cursor-pointer flex items-center gap-1"
                            >
                              {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              <span>{isRevealed ? 'তথ্য হাইড করুন' : 'তথ্য প্রকাশ করুন (Fulfillment)'}</span>
                            </button>
                          </div>

                          <div className="space-y-1 text-[11px]">
                            <p className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-[#69736D]" />
                              <span className="font-medium">{order.customer.fullName}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#69736D]" />
                              <span className="font-mono">
                                {isRevealed ? order.customer.phone : `${order.customer.phone.slice(0, 4)}****${order.customer.phone.slice(-3)}`}
                              </span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#69736D] shrink-0 mt-0.5" />
                              <span>
                                {isRevealed 
                                  ? `${order.customer.address}, ${order.customer.district}`
                                  : `****** ${order.customer.district}`}
                              </span>
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TAB 5: DATABASE & SEED */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-[#E5EAE6] p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#18211C] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#176B48]" />
                <span>ডাটাবেজ ও ক্লাউড স্টোরেজ স্ট্যাটাস</span>
              </h2>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <p className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#176B48]" />
                  <span>লোকাল পারসিস্টেন্স মোড সক্রিয় (Persistent Local Engine)</span>
                </p>
                <p>
                  বর্তমানে ব্যবহারকারী কর্তৃক Firebase অনুমোদন প্রত্যাখ্যান করায় সাইটটি নিরাপদ ব্রাউজার স্টোরেজ দিয়ে পরিচালিত হচ্ছে।
                  বইয়ের তথ্য, নতুন সংযোজন, স্টক পরিবর্তন, ক্যাটাগরি এবং গ্রাহকের সমস্ত অর্ডার রিস্টোরযোগ্যভাবে সংরক্ষিত থাকে।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Reset / Reseed Demo Catalog */}
                <div className="p-4 rounded-xl border border-[#E5EAE6] space-y-3">
                  <h3 className="text-xs font-bold text-[#18211C]">ডিফল্ট ডেমো ক্যাটালগ রিস্টোর (Safe Seed)</h3>
                  <p className="text-[11px] text-[#69736D]">
                    মূল ১২টি নির্বাচিত বই ও সূচিপত্র/নমুনা পৃষ্ঠার প্রিভিউ পুনরুদ্ধার করতে এই বাটন চাপুন। এটি বর্তমান অর্ডার হিস্ট্রি ডিলিট করবে না।
                  </p>
                  <button
                    onClick={resetToDemoBooks}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ডেমো ক্যাটালগ রিস্টোর করুন</span>
                  </button>
                </div>

                {/* Export / Backup JSON */}
                <div className="p-4 rounded-xl border border-[#E5EAE6] space-y-3">
                  <h3 className="text-xs font-bold text-[#18211C]">JSON ফরম্যাটে ক্যাটালগ ব্যাকআপ ও এক্সপোর্ট</h3>
                  <p className="text-[11px] text-[#69736D]">
                    ক্যাটালগের সমস্ত বই এবং তাদের প্রিভিউ তথ্যের ব্যাকআপ ডাউনলোড করতে পারেন।
                  </p>
                  <button
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allBooks, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `boighor_catalog_backup_${new Date().toISOString().split('T')[0]}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      showToast('ক্যাটালগ ব্যাকআপ ডাউনলোড সম্পন্ন হয়েছে');
                    }}
                    className="px-3.5 py-2 bg-[#176B48] hover:bg-[#104D36] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>ক্যাটালগ ব্যাকআপ ডাউনলোড (JSON)</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* --- ADD / EDIT BOOK MODAL --- */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E5EAE6] my-8 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E5EAE6] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#18211C]">
                  {editingBookId ? 'বইয়ের তথ্য সম্পাদনা' : 'ক্যাটালগে নতুন বই যোগ করুন'}
                </h3>
                <p className="text-xs text-[#69736D]">
                  শিরোনাম, মূল্য, স্টক ও সূচিপত্র/নমুনা পৃষ্ঠা নিয়ন্ত্রণ
                </p>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-2 text-[#69736D] hover:text-[#18211C] hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSaveBook} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              
              {/* Row 1: Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#18211C] mb-1">বইয়ের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48]"
                    placeholder="যেমন: একাত্তরের দিনগুলি"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18211C] mb-1">ইংরেজি নাম (Optional)</label>
                  <input
                    type="text"
                    value={bookForm.englishTitle}
                    onChange={(e) => setBookForm({ ...bookForm, englishTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48]"
                    placeholder="Ekattorer Dinguli"
                  />
                </div>
              </div>

              {/* Row 2: Author & Publisher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#18211C] mb-1">লেখক / লেখিকা *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48]"
                    placeholder="যেমন: জাহানারা ইমাম"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18211C] mb-1">প্রকাশনী *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.publisher}
                    onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48]"
                    placeholder="যেমন: সময় প্রকাশন"
                  />
                </div>
              </div>

              {/* Row 3: Category, Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#18211C] mb-1">ক্যাটাগরি</label>
                  <select
                    value={bookForm.categorySlug}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.slug === e.target.value);
                      setBookForm({
                        ...bookForm,
                        categorySlug: e.target.value,
                        category: selected ? selected.name : 'উপন্যাস ও গল্প',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#18211C] mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={bookForm.demoPrice}
                    onChange={(e) => setBookForm({ ...bookForm, demoPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#18211C] mb-1">স্টক সংখ্যা (কপি) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={bookForm.stock}
                    onChange={(e) => setBookForm({ ...bookForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48] font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block font-bold text-[#18211C] mb-1">বইয়ের বিবরণ / পরিচিতি</label>
                <textarea
                  rows={3}
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48]"
                  placeholder="বইটির বিষয়বস্তু ও সংক্ষিপ্ত সারসংক্ষেপ লিখুন..."
                />
              </div>

              {/* Row 5: Cover Theme Preset */}
              <div className="p-4 rounded-2xl bg-[#F6F8F6] border border-[#E5EAE6] space-y-3">
                <label className="block font-bold text-[#18211C]">বইয়ের প্রচ্ছদ থিম বা কভার লিংক</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'এমারেল্ড গ্রিন', primary: '#176B48', secondary: '#104D36' },
                    { label: 'রয়্যাল নেভি', primary: '#1E3A8A', secondary: '#172554' },
                    { label: 'রুবী মেরুন', primary: '#881337', secondary: '#4C0519' },
                    { label: 'অ্যাম্বার গোল্ড', primary: '#78350F', secondary: '#451A03' },
                    { label: 'চারকোল গ্রে', primary: '#27272A', secondary: '#18181B' },
                  ].map((theme, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBookForm({
                        ...bookForm,
                        coverTheme: { ...bookForm.coverTheme, primary: theme.primary, secondary: theme.secondary },
                      })}
                      className="px-3 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
                      style={{
                        borderColor: bookForm.coverTheme.primary === theme.primary ? '#176B48' : '#E5EAE6',
                        backgroundColor: bookForm.coverTheme.primary === theme.primary ? '#E8F3EE' : 'white',
                      }}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                      <span>{theme.label}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="url"
                    value={bookForm.coverImage || ''}
                    onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                    placeholder="অথবা কভার ছবির সরাসরি URL লিংক দিন (ঐচ্ছিক)"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48] bg-white text-xs"
                  />
                </div>
              </div>

              {/* Row 6: Interior Preview Pages Manager */}
              <div className="p-4 rounded-2xl bg-[#F6F8F6] border border-[#E5EAE6] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#18211C]">বইয়ের ভেতরের প্রিভিউ পৃষ্ঠা (Interior Pages)</h4>
                    <p className="text-[11px] text-[#69736D]">
                      সূচিপত্র ও গুরুত্বপূর্ণ পৃষ্ঠার ছবি যুক্ত, পরিবর্তন বা রি-অর্ডার করুন
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#176B48] font-bold font-mono text-[11px]">
                    {bookForm.previewImages?.length || 0} টি পৃষ্ঠা
                  </span>
                </div>

                {/* Previews List */}
                <div className="space-y-2">
                  {(bookForm.previewImages || []).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-xl border border-[#E5EAE6] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                          {idx + 1}
                        </span>
                        <img
                          src={imgUrl}
                          alt="preview"
                          className="w-10 h-14 object-cover rounded border border-gray-200 shrink-0 bg-gray-50"
                        />
                        <div className="min-w-0">
                          <input
                            type="text"
                            value={bookForm.previewLabels?.[idx] || ''}
                            onChange={(e) => {
                              const labels = [...(bookForm.previewLabels || [])];
                              labels[idx] = e.target.value;
                              setBookForm({ ...bookForm, previewLabels: labels });
                            }}
                            placeholder="লেবেল (যেমন: সূচিপত্র)"
                            className="px-2 py-1 border border-[#E5EAE6] rounded text-[11px] font-medium w-36 sm:w-48"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMovePreview(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                          title="উপরে নিন"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMovePreview(idx, 'down')}
                          disabled={idx === (bookForm.previewImages?.length || 0) - 1}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
                          title="নিচে নিন"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePreview(idx)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="সরিয়ে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Page Controls */}
                <div className="pt-2 border-t border-[#E5EAE6] space-y-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={newPreviewLabel}
                      onChange={(e) => setNewPreviewLabel(e.target.value)}
                      placeholder="পৃষ্ঠার নাম (যেমন: সূচিপত্র / অধ্যায় ১)"
                      className="px-3 py-1.5 rounded-lg border border-[#E5EAE6] bg-white text-xs sm:w-48"
                    />

                    <input
                      type="url"
                      value={newPreviewUrl}
                      onChange={(e) => setNewPreviewUrl(e.target.value)}
                      placeholder="ইমেজ URL লিংক..."
                      className="px-3 py-1.5 rounded-lg border border-[#E5EAE6] bg-white text-xs flex-1"
                    />

                    <button
                      type="button"
                      onClick={handleAddPreviewUrl}
                      disabled={!newPreviewUrl.trim()}
                      className="px-3 py-1.5 bg-[#176B48] text-white rounded-lg text-xs font-semibold hover:bg-[#104D36] disabled:opacity-40 cursor-pointer"
                    >
                      লিংক যুক্ত করুন
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-[#E5EAE6] hover:bg-gray-50 text-xs font-semibold rounded-lg text-[#18211C] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#176B48]" />
                      <span>কম্পিউটার/মোবাইল থেকে আপলোড করুন (Max 2MB)</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookForm.isPublished}
                    onChange={(e) => setBookForm({ ...bookForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#176B48] rounded accent-[#176B48]"
                  />
                  <span className="font-semibold text-[#18211C]">ওয়েবসাইটে প্রকাশ করুন (Published)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookForm.isBestseller}
                    onChange={(e) => setBookForm({ ...bookForm, isBestseller: e.target.checked })}
                    className="w-4 h-4 text-[#176B48] rounded accent-[#176B48]"
                  />
                  <span className="font-semibold text-[#18211C]">বেস্টসেলার ব্যাজ দিন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookForm.isNewArrival}
                    onChange={(e) => setBookForm({ ...bookForm, isNewArrival: e.target.checked })}
                    className="w-4 h-4 text-[#176B48] rounded accent-[#176B48]"
                  />
                  <span className="font-semibold text-[#18211C]">নতুন বই ব্যাজ দিন</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#E5EAE6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#69736D] hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingBookId ? 'পরিবর্তন সংরক্ষণ করুন' : 'বইটি যুক্ত করুন'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- ADD CATEGORY MODAL --- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5EAE6]">
            <h3 className="text-base font-bold text-[#18211C] mb-4">নতুন ক্যাটাগরি তৈরি করুন</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#18211C] mb-1">ক্যাটাগরি নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="যেমন: বিজ্ঞান কল্পকাহিনী"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18211C] mb-1">ইংরেজি নাম *</label>
                <input
                  type="text"
                  value={newCatEnglishName}
                  onChange={(e) => setNewCatEnglishName(e.target.value)}
                  placeholder="Sci-Fi & Thriller"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18211C] mb-1">স্লাগ (Slug) *</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="sci-fi"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18211C] mb-1">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="পাঠকদের জন্য ক্যাটাগরি পরিচিতি..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EAE6] focus:outline-none focus:border-[#176B48]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#69736D] hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newCatName.trim() || !newCatSlug.trim()) {
                      showToast('ক্যাটাগরি নাম ও স্লাগ আবশ্যক');
                      return;
                    }
                    addCategory({
                      name: newCatName.trim(),
                      englishName: newCatEnglishName.trim() || newCatName.trim(),
                      slug: newCatSlug.trim().toLowerCase().replace(/\s+/g, '-'),
                      iconName: 'BookOpen',
                      description: newCatDesc.trim(),
                    });
                    setIsCatModalOpen(false);
                    setNewCatName('');
                    setNewCatEnglishName('');
                    setNewCatSlug('');
                    setNewCatDesc('');
                  }}
                  className="px-5 py-2 bg-[#176B48] hover:bg-[#104D36] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  ক্যাটাগরি তৈরি করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E5EAE6] text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#18211C] mb-1">স্থায়ীভাবে মুছে ফেলতে চান?</h3>
            <p className="text-xs text-[#69736D] mb-5">
              এই বইটি ক্যাটালগ ও ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে। আপনি চাইলে মুছে ফেলার বদলে &#39;আর্কাইভ&#39; বা &#39;আনপাবলিশ&#39; করতে পারেন।
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#69736D] hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  deleteBookPermanently(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
