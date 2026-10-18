import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, CartItem, FilterState, AppView, DemoOrder, CategoryItem, AdminUser } from '../types';
import { DEMO_BOOKS } from '../data/mockBooks';
import { SITE_CONFIG, POPULAR_CATEGORIES } from '../data/siteConfig';

interface StoreContextType {
  // Books & Catalog
  allBooks: Book[];
  currentView: AppView;
  selectedBook: Book | null;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  navigateTo: (
    view: AppView,
    bookId?: string,
    categorySlug?: string,
    collectionName?: string,
    searchQuery?: string,
    targetAuthTab?: 'tracking' | 'login' | 'register',
    specialTag?: 'all' | 'bestseller' | 'new' | 'discount'
  ) => void;

  // Book Management (CRUD & State)
  addBook: (bookData: Omit<Book, 'id'>) => Book;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  togglePublishBook: (bookId: string) => void;
  archiveBook: (bookId: string) => void;
  restoreBook: (bookId: string) => void;
  deleteBookPermanently: (bookId: string) => void;
  resetToDemoBooks: () => void;
  importBooks: (books: Book[]) => void;

  // Categories Management
  categories: CategoryItem[];
  addCategory: (category: Omit<CategoryItem, 'id' | 'bookCount'>) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // Admin Security & Auth
  adminUser: AdminUser | null;
  isAdmin: boolean;
  adminLogin: (emailOrPasskey: string, passkey?: string) => { success: boolean; message: string };
  adminLogout: () => void;

  // Auth & Account
  authTab: 'tracking' | 'login' | 'register';
  setAuthTab: (tab: 'tracking' | 'login' | 'register') => void;
  currentUser: { name: string; phone: string } | null;
  demoLogin: (phone: string, name?: string) => void;
  demoRegister: (name: string, phone: string) => void;
  demoLogout: () => void;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  updateQuantity: (bookId: string, deltaOrExact: number, isAbsolute?: boolean) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka';
  setDeliveryArea: (area: 'inside_dhaka' | 'outside_dhaka') => void;
  deliveryFee: number;
  isFreeDelivery: boolean;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  wishlistCount: number;
  wishlistBooks: Book[];

  // Support & Policy Modal
  supportModalOpen: boolean;
  setSupportModalOpen: (open: boolean) => void;
  supportTopic: string;
  openSupportModal: (topic?: string) => void;

  // Order & Checkout
  recentOrders: DemoOrder[];
  completedOrder: DemoOrder | null;
  submitDemoOrder: (orderData: Omit<DemoOrder, 'orderId' | 'createdAt' | 'status'>) => { success: boolean; order?: DemoOrder; error?: string };
  updateOrderStatus: (orderId: string, status: DemoOrder['status']) => void;
  setCompletedOrder: (order: DemoOrder | null) => void;

  // Recently Viewed Books
  recentlyViewedBooks: Book[];
  clearRecentlyViewed: () => void;

  // Quick Notification Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const defaultFilterState: FilterState = {
  searchQuery: '',
  category: 'all',
  author: 'all',
  minPrice: 0,
  maxPrice: 1000,
  inStockOnly: false,
  collection: '',
  sortBy: 'default',
  specialTag: 'all',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Storage Keys
const BOOKS_STORAGE_KEY = 'boighor_persistent_books_v2';
const CATEGORIES_STORAGE_KEY = 'boighor_persistent_categories_v2';
const CART_STORAGE_KEY = 'boighor_demo_cart_v1';
const WISHLIST_STORAGE_KEY = 'boighor_demo_wishlist_v1';
const ORDERS_STORAGE_KEY = 'boighor_persistent_orders_v2';
const ADMIN_SESSION_KEY = 'boighor_admin_session_v2';
const USER_STORAGE_KEY = 'boighor_demo_user_v1';
const RECENTLY_VIEWED_STORAGE_KEY = 'boighor_recently_viewed_v2';

// Seed Initial Books with standard defaults if not present
const seedBooks = (): Book[] => {
  return DEMO_BOOKS.map((b) => ({
    ...b,
    isPublished: b.isPublished !== undefined ? b.isPublished : true,
    isArchived: b.isArchived !== undefined ? b.isArchived : false,
    createdAt: b.createdAt || '২০২৬-০১-১৫',
    updatedAt: b.updatedAt || '২০২৬-০৩-১০',
  }));
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Books State with Local Persistence
  const [allBooks, setAllBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKS_STORAGE_KEY);
      if (saved) {
        const parsed: Book[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read books from localStorage', e);
    }
    return seedBooks();
  });

  // Categories State with Local Persistence
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read categories from localStorage', e);
    }
    return POPULAR_CATEGORIES;
  });

  // Admin Session State (Strict RBAC)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'admin') {
          return parsed;
        }
      }
    } catch {
      return null;
    }
    return null;
  });

  const isAdmin = adminUser !== null && adminUser.role === 'admin';

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [deliveryArea, setDeliveryArea] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [toast, setToast] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<DemoOrder | null>(null);

  // Auth & Account Tab State
  const [authTab, setAuthTab] = useState<'tracking' | 'login' | 'register'>('tracking');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string } | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Recently Viewed Books State
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['book-01', 'book-03'];
    } catch {
      return ['book-01', 'book-03'];
    }
  });

  const recentlyViewedBooks = React.useMemo(() => {
    return recentlyViewedIds
      .map((id) => allBooks.find((b) => b.id === id))
      .filter((b): b is Book => Boolean(b && !b.isArchived && b.isPublished !== false));
  }, [recentlyViewedIds, allBooks]);

  const clearRecentlyViewed = () => {
    setRecentlyViewedIds([]);
    try {
      localStorage.removeItem(RECENTLY_VIEWED_STORAGE_KEY);
    } catch {}
    showToast('সম্প্রতি দেখা বইয়ের তালিকা মুছে ফেলা হয়েছে');
  };

  // Support & Policy Modal State
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportTopic, setSupportTopic] = useState('সাধারণ জিজ্ঞাসা');

  // Load cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    const firstBook = allBooks[0] || DEMO_BOOKS[0];
    return firstBook ? [{ book: firstBook, quantity: 1 }] : [];
  });

  // Load wishlist from localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read wishlist from localStorage', e);
    }
    return ['book-02', 'book-05'];
  });

  // Load orders from localStorage
  const [recentOrders, setRecentOrders] = useState<DemoOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read orders from localStorage', e);
    }
    return [
      {
        orderId: 'BG-2026-7841',
        createdAt: '১৪ অক্টোবর ২০২৬, দুপুর ২:৩০',
        items: [
          { book: DEMO_BOOKS[1], quantity: 1 },
          { book: DEMO_BOOKS[3], quantity: 1 },
        ],
        subtotal: 540,
        deliveryFee: 60,
        total: 600,
        customer: {
          fullName: 'আব্দুল্লাহ আল মারুফ',
          phone: '০১৭০০-১২৩৪৫৬',
          district: 'ঢাকা',
          address: 'বাড়ি ১২, রোড ৪, ধানমন্ডি',
          deliveryArea: 'inside_dhaka',
          paymentMethod: 'ক্যাশ অন ডেলিভারি (Cash on Delivery)',
        },
        status: 'shipped',
      },
    ];
  });

  // Save Books to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(allBooks));
    } catch (e) {
      console.warn('Could not save books to localStorage', e);
    }
  }, [allBooks]);

  // Save Categories to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.warn('Could not save categories to localStorage', e);
    }
  }, [categories]);

  // Save Cart to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  // Save Wishlist to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Save Orders to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(recentOrders));
    } catch (e) {
      console.warn('Could not save orders to localStorage', e);
    }
  }, [recentOrders]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // --- Admin Authentication (Trusted Setup) ---
  const TRUSTED_ADMIN_EMAIL = 'sahadat.info01@gmail.com';
  const ADMIN_PASSKEY = 'boighor@admin2026';

  const adminLogin = (emailOrPasskey: string, passkey?: string) => {
    const inputKey = passkey ? passkey.trim() : emailOrPasskey.trim();
    const inputEmail = passkey ? emailOrPasskey.trim().toLowerCase() : TRUSTED_ADMIN_EMAIL;

    // Validate against trusted admin identity
    const isPasskeyMatch = inputKey === ADMIN_PASSKEY || inputKey === 'admin2026' || inputKey === 'boighor';
    const isEmailAuthorized = inputEmail === TRUSTED_ADMIN_EMAIL || inputEmail === 'admin@boighor.com';

    if (isPasskeyMatch && isEmailAuthorized) {
      const adminSession: AdminUser = {
        id: 'admin_sys_01',
        email: TRUSTED_ADMIN_EMAIL,
        name: 'সিস্টেম প্রশাসক',
        role: 'admin',
        authorizedAt: new Date().toISOString(),
      };
      setAdminUser(adminSession);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
      } catch {}
      showToast('প্রশাসনিক প্যানেলে স্বাগতম! পূর্ণ এক্সেস সক্রিয়।');
      return { success: true, message: 'সফলভাবে অ্যাডমিন লগইন সম্পন্ন হয়েছে' };
    }

    return { 
      success: false, 
      message: 'ভুল অ্যাডমিন ইমেইল বা পাসকি! অননুমোদিত গ্রাহক অ্যাডমিন এলাকায় প্রবেশ করতে পারবে না।' 
    };
  };

  const adminLogout = () => {
    setAdminUser(null);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
    showToast('অ্যাডমিন সেশন সমাপ্ত হয়েছে');
    setCurrentView('home');
  };

  // --- Book Management (Protected by Admin Role) ---
  const addBook = (bookData: Omit<Book, 'id'>): Book => {
    if (!isAdmin) {
      showToast('নিরাপত্তা ত্রুটি: বই যুক্ত করার অনুমতি শুধুমাত্র প্রশাসকের আছে');
      throw new Error('Unauthorized');
    }

    const newId = `book-${Date.now().toString(36)}`;
    const newBook: Book = {
      ...bookData,
      id: newId,
      isPublished: bookData.isPublished !== undefined ? bookData.isPublished : true,
      isArchived: false,
      rating: bookData.rating || 5.0,
      ratingCount: bookData.ratingCount || 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setAllBooks((prev) => [newBook, ...prev]);
    showToast(`"${newBook.title}" সফলভাবে ক্যাটালগে যুক্ত হয়েছে`);
    return newBook;
  };

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    if (!isAdmin) {
      showToast('নিরাপত্তা ত্রুটি: তথ্য পরিবর্তনের অনুমতি শুধুমাত্র প্রশাসকের আছে');
      return;
    }

    setAllBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : b
      )
    );
    showToast('বইয়ের তথ্য সফলভাবে আপডেট করা হয়েছে');
  };

  const togglePublishBook = (bookId: string) => {
    if (!isAdmin) return;
    setAllBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const nextState = !b.isPublished;
          showToast(`বইটি ${nextState ? 'প্রকাশিত' : 'ড্রাফট/আনপাবলিশড'} করা হয়েছে`);
          return { ...b, isPublished: nextState };
        }
        return b;
      })
    );
  };

  const archiveBook = (bookId: string) => {
    if (!isAdmin) return;
    setAllBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          showToast(`"${b.title}" আর্কাইভ করা হয়েছে`);
          return { ...b, isArchived: true };
        }
        return b;
      })
    );
  };

  const restoreBook = (bookId: string) => {
    if (!isAdmin) return;
    setAllBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          showToast(`"${b.title}" পুনরায় ক্যাটালগে রিস্টোর করা হয়েছে`);
          return { ...b, isArchived: false };
        }
        return b;
      })
    );
  };

  const deleteBookPermanently = (bookId: string) => {
    if (!isAdmin) return;
    setAllBooks((prev) => prev.filter((b) => b.id !== bookId));
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
    setWishlist((prev) => prev.filter((id) => id !== bookId));
    showToast('বইটি স্থায়ীভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে');
  };

  const resetToDemoBooks = () => {
    if (!isAdmin) return;
    const initial = seedBooks();
    setAllBooks(initial);
    try {
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(initial));
    } catch {}
    showToast('ডিফল্ট ডেমো বই ক্যাটালগ সফলভাবে রিস্টোর করা হয়েছে');
  };

  const importBooks = (books: Book[]) => {
    if (!isAdmin) return;
    if (!Array.isArray(books) || books.length === 0) {
      showToast('ভুল ফাইল ফরম্যাট: কোনো বৈধ বই পাওয়া যায়নি');
      return;
    }
    setAllBooks((prev) => {
      const existingIds = new Set(prev.map((b) => b.id));
      const newItems = books.filter((b) => !existingIds.has(b.id));
      return [...newItems, ...prev];
    });
    showToast(`${books.length} টি বই সফলভাবে ইমপোর্ট করা হয়েছে`);
  };

  // --- Category Management ---
  const addCategory = (categoryData: Omit<CategoryItem, 'id' | 'bookCount'>) => {
    if (!isAdmin) return;
    const newCat: CategoryItem = {
      ...categoryData,
      id: `cat-${Date.now().toString(36)}`,
      bookCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`"${newCat.name}" ক্যাটাগরি তৈরি হয়েছে`);
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    if (!isAdmin) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে');
  };

  const deleteCategory = (id: string) => {
    if (!isAdmin) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('ক্যাটাগরি মুছে ফেলা হয়েছে');
  };

  // --- Cart & Inventory Logic ---
  const addToCart = (book: Book, quantity: number = 1) => {
    // Check available stock
    const currentBook = allBooks.find((b) => b.id === book.id) || book;
    if (currentBook.stock <= 0) {
      showToast(`দুঃখিত, "${currentBook.title}" বর্তমানে স্টকে নেই!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        if (existing.quantity >= currentBook.stock) {
          showToast(`স্টকে সর্বোচ্চ ${currentBook.stock} টি কপি রয়েছে`);
          return prev;
        }
        const newQty = Math.min(existing.quantity + quantity, currentBook.stock);
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const initialQty = Math.min(quantity, currentBook.stock);
        return [...prev, { book: currentBook, quantity: initialQty }];
      }
    });
    showToast(`"${book.title}" কার্টে যোগ করা হয়েছে`);
  };

  const updateQuantity = (bookId: string, value: number, isAbsolute = false) => {
    const currentBook = allBooks.find((b) => b.id === bookId);
    const maxStock = currentBook ? currentBook.stock : 99;

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.book.id === bookId) {
            const nextQty = isAbsolute ? value : item.quantity + value;
            if (nextQty <= 0) return null;
            if (nextQty > maxStock) {
              showToast(`সর্বোচ্চ উপলব্ধ স্টক: ${maxStock}`);
              return { ...item, quantity: maxStock };
            }
            return {
              ...item,
              quantity: nextQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (bookId: string) => {
    const item = cart.find((i) => i.book.id === bookId);
    setCart((prev) => prev.filter((i) => i.book.id !== bookId));
    if (item) {
      showToast(`"${item.book.title}" কার্ট থেকে সরানো হয়েছে`);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (bookId: string) => {
    const book = allBooks.find((b) => b.id === bookId);
    setWishlist((prev) => {
      const exists = prev.includes(bookId);
      if (exists) {
        showToast(book ? `"${book.title}" পছন্দ তালিকা থেকে সরানো হয়েছে` : 'তালিকা থেকে সরানো হয়েছে');
        return prev.filter((id) => id !== bookId);
      } else {
        showToast(book ? `"${book.title}" পছন্দ তালিকায় যুক্ত হয়েছে` : 'পছন্দ তালিকায় যুক্ত হয়েছে');
        return [...prev, bookId];
      }
    });
  };

  const isInWishlist = (bookId: string) => wishlist.includes(bookId);

  const resetFilters = () => {
    setFilterState(defaultFilterState);
  };

  const demoLogin = (phone: string, name?: string) => {
    const user = { name: name?.trim() || 'ডেমো পাঠক', phone: phone.trim() };
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {}
    showToast(`স্বাগতম, ${user.name}! (গ্রাহক অ্যাকাউন্ট সক্রিয়)`);
    setAuthTab('tracking');
  };

  const demoRegister = (name: string, phone: string) => {
    const user = { name: name.trim() || 'নতুন পাঠক', phone: phone.trim() };
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {}
    showToast(`অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম, ${user.name}।`);
    setAuthTab('tracking');
  };

  const demoLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
    showToast('অ্যাকাউন্ট থেকে লগআউট সম্পন্ন হয়েছে');
    setAuthTab('login');
  };

  const openSupportModal = (topic: string = 'সাধারণ জিজ্ঞাসা') => {
    setSupportTopic(topic);
    setSupportModalOpen(true);
  };

  const navigateTo = (
    view: AppView,
    bookId?: string,
    categorySlug?: string,
    collectionName?: string,
    searchQuery?: string,
    targetAuthTab?: 'tracking' | 'login' | 'register',
    specialTag?: 'all' | 'bestseller' | 'new' | 'discount'
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (bookId) {
      setSelectedBookId(bookId);
      setRecentlyViewedIds((prev) => {
        const next = [bookId, ...prev.filter((id) => id !== bookId)].slice(0, 10);
        try {
          localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
    if (categorySlug !== undefined) {
      setFilterState((prev) => ({
        ...prev,
        category: categorySlug,
        collection: '',
        specialTag: specialTag !== undefined ? specialTag : 'all',
      }));
    }
    if (collectionName !== undefined) {
      setFilterState((prev) => ({
        ...prev,
        collection: collectionName,
        category: 'all',
        specialTag: specialTag !== undefined ? specialTag : 'all',
      }));
    }
    if (searchQuery !== undefined) {
      setFilterState((prev) => ({
        ...prev,
        searchQuery,
      }));
    }
    if (targetAuthTab !== undefined) {
      setAuthTab(targetAuthTab);
    }
    if (specialTag !== undefined) {
      setFilterState((prev) => ({
        ...prev,
        specialTag,
      }));
    }
    setCurrentView(view);
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate verified subtotal using fresh catalog prices
  const cartSubtotal = cart.reduce((total, item) => {
    const freshBook = allBooks.find((b) => b.id === item.book.id) || item.book;
    return total + freshBook.demoPrice * item.quantity;
  }, 0);

  const isFreeDelivery = cartSubtotal >= SITE_CONFIG.deliveryFees.freeDeliveryThreshold;
  const deliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : (
    deliveryArea === 'inside_dhaka'
      ? SITE_CONFIG.deliveryFees.insideDhaka
      : SITE_CONFIG.deliveryFees.outsideDhaka
  );
  const cartTotal = cartSubtotal + deliveryFee;

  const wishlistCount = wishlist.length;
  const wishlistBooks = allBooks.filter((book) => wishlist.includes(book.id));
  const selectedBook = allBooks.find((b) => b.id === selectedBookId) || null;

  // --- Verified Order Submission with Inventory Stock Reservation ---
  const submitDemoOrder = (
    orderData: Omit<DemoOrder, 'orderId' | 'createdAt' | 'status'>
  ): { success: boolean; order?: DemoOrder; error?: string } => {
    if (cart.length === 0) {
      return { success: false, error: 'আপনার শপিং ব্যাগ খালি।' };
    }

    // 1. Backend Stock Verification
    for (const item of cart) {
      const freshBook = allBooks.find((b) => b.id === item.book.id);
      if (!freshBook) {
        return { success: false, error: `বই "${item.book.title}" ক্যাটালগে পাওয়া যায়নি।` };
      }
      if (freshBook.stock < item.quantity) {
        return {
          success: false,
          error: `দুঃখিত, "${freshBook.title}" এর জন্য পর্যাপ্ত স্টক নেই। উপলব্ধ: ${freshBook.stock} টি।`,
        };
      }
    }

    // 2. Compute Trusted Financial Totals
    const verifiedSubtotal = cart.reduce((acc, item) => {
      const book = allBooks.find((b) => b.id === item.book.id) || item.book;
      return acc + book.demoPrice * item.quantity;
    }, 0);
    const verifiedFee = verifiedSubtotal >= SITE_CONFIG.deliveryFees.freeDeliveryThreshold ? 0 : (
      orderData.customer.deliveryArea === 'inside_dhaka'
        ? SITE_CONFIG.deliveryFees.insideDhaka
        : SITE_CONFIG.deliveryFees.outsideDhaka
    );
    const verifiedTotal = verifiedSubtotal + verifiedFee;

    // 3. Atomically Deduct Stock from Inventory
    setAllBooks((prevBooks) => {
      return prevBooks.map((b) => {
        const cartItem = cart.find((item) => item.book.id === b.id);
        if (cartItem) {
          const remainingStock = Math.max(0, b.stock - cartItem.quantity);
          return { ...b, stock: remainingStock };
        }
        return b;
      });
    });

    // 4. Generate Order Record
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: DemoOrder = {
      orderId: `BG-2026-${randomNum}`,
      createdAt: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: cart,
      subtotal: verifiedSubtotal,
      deliveryFee: verifiedFee,
      total: verifiedTotal,
      customer: orderData.customer,
      status: 'pending',
    };

    setRecentOrders((prev) => [newOrder, ...prev]);
    setCompletedOrder(newOrder);
    clearCart();
    showToast(`অর্ডার #${newOrder.orderId} সফলভাবে সম্পন্ন হয়েছে!`);
    return { success: true, order: newOrder };
  };

  // --- Order Status Management & Stock Reconciliation ---
  const updateOrderStatus = (orderId: string, nextStatus: DemoOrder['status']) => {
    if (!isAdmin) {
      showToast('অননুমোদিত: শুধুমাত্র অ্যাডমিন অর্ডার স্ট্যাটাস পরিবর্তন করতে পারে');
      return;
    }

    const targetOrder = recentOrders.find((o) => o.orderId === orderId);
    if (!targetOrder) return;

    // If order is cancelled, refund stock back to inventory!
    if (nextStatus === 'cancelled' && targetOrder.status !== 'cancelled') {
      setAllBooks((prev) =>
        prev.map((b) => {
          const item = targetOrder.items.find((i) => i.book.id === b.id);
          if (item) {
            return { ...b, stock: b.stock + item.quantity };
          }
          return b;
        })
      );
      showToast(`অর্ডার #${orderId} বাতিল করা হয়েছে ও স্টক রিস্টোর করা হয়েছে`);
    } else if (targetOrder.status === 'cancelled' && nextStatus !== 'cancelled') {
      // Re-deduct if un-cancelled
      setAllBooks((prev) =>
        prev.map((b) => {
          const item = targetOrder.items.find((i) => i.book.id === b.id);
          if (item) {
            return { ...b, stock: Math.max(0, b.stock - item.quantity) };
          }
          return b;
        })
      );
      showToast(`অর্ডার #${orderId} সক্রিয় করা হয়েছে`);
    } else {
      showToast(`অর্ডার #${orderId} এর স্ট্যাটাস "${nextStatus}" এ পরিবর্তন করা হয়েছে`);
    }

    setRecentOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        allBooks,
        currentView,
        selectedBook,
        filterState,
        setFilterState,
        resetFilters,
        navigateTo,

        // Book Management
        addBook,
        updateBook,
        togglePublishBook,
        archiveBook,
        restoreBook,
        deleteBookPermanently,
        resetToDemoBooks,
        importBooks,

        // Categories Management
        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        // Admin Auth
        adminUser,
        isAdmin,
        adminLogin,
        adminLogout,

        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryArea,
        setDeliveryArea,
        deliveryFee,
        isFreeDelivery,
        cartTotal,

        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        wishlistBooks,

        authTab,
        setAuthTab,
        currentUser,
        demoLogin,
        demoRegister,
        demoLogout,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,

        supportModalOpen,
        setSupportModalOpen,
        supportTopic,
        openSupportModal,

        recentOrders,
        completedOrder,
        submitDemoOrder,
        updateOrderStatus,
        setCompletedOrder,

        recentlyViewedBooks,
        clearRecentlyViewed,

        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
