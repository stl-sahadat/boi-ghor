export interface BookCoverTheme {
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
  pattern: 'classic' | 'modern' | 'minimal' | 'ornate' | 'geometric' | 'academic';
}

export interface Book {
  id: string;
  title: string;
  englishTitle?: string;
  author: string;
  translator?: string;
  publisher: string;
  category: string;
  categorySlug: string;
  demoPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  stock: number;
  rating: number;
  ratingCount: number;
  pages?: number;
  edition?: string;
  isbn?: string;
  coverTheme: BookCoverTheme;
  coverImage?: string;
  previewImages?: string[];
  previewLabels?: string[];
  description: string;
  features?: string[];
  isBestseller?: boolean;
  isNewArrival?: boolean;
  specialCollections?: string[];
  publicationYear?: number;
  isPublished?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PreviewPageItem {
  id: string;
  url: string;
  label: string;
  isCustomUpload?: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  englishName: string;
  slug: string;
  iconName: string;
  description: string;
  bookCount: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  author: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  collection: string;
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'newest' | 'title';
  specialTag?: 'all' | 'bestseller' | 'new' | 'discount';
}

export interface CheckoutFormState {
  fullName: string;
  phone: string;
  district: string;
  address: string;
  notes: string;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka';
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
}

export interface DemoOrder {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: {
    fullName: string;
    phone: string;
    district: string;
    address: string;
    deliveryArea: 'inside_dhaka' | 'outside_dhaka';
    paymentMethod: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  authorizedAt: string;
}

export type AppView = 
  | 'home' 
  | 'catalog' 
  | 'book-details' 
  | 'cart' 
  | 'checkout' 
  | 'wishlist' 
  | 'account'
  | 'admin';
