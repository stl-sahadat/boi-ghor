import { CategoryItem } from '../types';

export const SITE_CONFIG = {
  brandNameBangla: 'বইঘর',
  brandNameEnglish: 'BoiGhor',
  tagline: 'অনলাইন বইয়ের ঠিকানা — সহজে বই খুঁজুন, ঘরে বসেই সংগ্রহ করুন',
  announcement: 'স্বাগতম বইঘরে! নতুন বইয়ের সমাহার ও সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা (ডেমো সংস্করণ)',
  currencySymbol: '৳',
  
  // Delivery Fee Settings (BDT)
  deliveryFees: {
    insideDhaka: 60,
    outsideDhaka: 120,
    freeDeliveryThreshold: 1200, // Orders over 1200 BDT get free delivery in demo
  },

  // Contact Information Placeholders
  contact: {
    hotline: '+৮৮০১৭১০০০০০০০',
    email: 'support@boighor.example.com',
    address: '৪৪ বাংলাবাজার, ঢাকা-১১০০, বাংলাদেশ',
    hours: 'প্রতিদিন সকাল ৯টা - রাত ১০টা',
  },

  // Navigation Links
  navLinks: [
    { label: 'হোম', view: 'home' as const },
    { label: 'সব বই', view: 'catalog' as const, category: 'all' },
    { label: 'ক্যাটাগরি', view: 'catalog' as const, openCategory: true },
    { label: 'বেস্টসেলার', view: 'catalog' as const, filterType: 'bestseller' },
    { label: 'নতুন বই', view: 'catalog' as const, filterType: 'new' },
    { label: 'অফার', view: 'catalog' as const, filterType: 'discount' },
  ],

  // Special Collections
  specialCollections: [
    { id: 'new-readers', name: 'নতুন পাঠকের জন্য', count: '১২+ বই', desc: 'সহজ ও আকর্ষণীয় ভাষায় লেখা বাছাইকৃত বই' },
    { id: 'tech-ai', name: 'প্রযুক্তি ও AI শেখা', count: '৮+ বই', desc: 'আধুনিক প্রোগ্রামিং, ডাটা ও কৃত্রিম বুদ্ধিমত্তা' },
    { id: 'exam-prep', name: 'পরীক্ষার প্রস্তুতি', count: '১৫+ বই', desc: 'বিসিএস, ব্যাংক জব ও বিশ্ববিদ্যালয় ভর্তি গাইড' },
    { id: 'fiction-novel', name: 'গল্প ও উপন্যাস', count: '১৮+ বই', desc: 'কালজয়ী ক্লাসিক ও সাম্প্রতিক জনপ্রিয় ফিকশন' },
  ],

  // Disclaimer notice for prototype
  demoDisclaimer: 'দৃষ্টি আকর্ষণ: এটি একটি ফ্রন্টএন্ড ডেমো প্রোটোটাইপ। প্রদর্শিত বইয়ের তথ্য, মূল্য ও স্টক ডেমো উদ্দেশ্যে ব্যবহৃত হয়েছে। এতে কোন প্রকার আর্থিক লেনদেন বা বাস্তব অর্ডার সম্পন্ন হবে না। পরবর্তী ফেজে ব্যাকএন্ড ও পেমেন্ট গেটওয়ে যুক্ত হবে।',
};

export const POPULAR_CATEGORIES: CategoryItem[] = [
  {
    id: 'fiction-stories',
    name: 'উপন্যাস ও গল্প',
    englishName: 'Fiction & Novels',
    slug: 'fiction',
    iconName: 'BookOpen',
    description: 'হুমায়ূন আহমেদ, জাফর ইকবাল ও সমকালীন সাহিত্য',
    bookCount: 42,
  },
  {
    id: 'islamic-books',
    name: 'ইসলামি বই',
    englishName: 'Islamic Books',
    slug: 'islamic',
    iconName: 'Moon',
    description: 'কুরআন-হাদিসের বিশ্লেষণ, তাফসির ও জীবনমুখী ইসলাম',
    bookCount: 35,
  },
  {
    id: 'academic-books',
    name: 'একাডেমিক বই',
    englishName: 'Academic & Textbooks',
    slug: 'academic',
    iconName: 'GraduationCap',
    description: 'স্কুল, কলেজ ও বিশ্ববিদ্যালয় পাঠ্যবই',
    bookCount: 28,
  },
  {
    id: 'job-prep',
    name: 'চাকরি ও ভর্তি প্রস্তুতি',
    englishName: 'Job & Admission Prep',
    slug: 'job-prep',
    iconName: 'Briefcase',
    description: 'বিসিএস, ব্যাংক জব ও ভর্তি পরীক্ষার প্রস্তুতি সহায়িকা',
    bookCount: 24,
  },
  {
    id: 'self-dev',
    name: 'আত্মউন্নয়ন',
    englishName: 'Self Development',
    slug: 'self-development',
    iconName: 'Sparkles',
    description: 'মনোবল বৃদ্ধি, অভ্যাস গঠন ও ক্যারিয়ার গ্রোথ',
    bookCount: 31,
  },
  {
    id: 'science-tech',
    name: 'বিজ্ঞান ও প্রযুক্তি',
    englishName: 'Science & Tech',
    slug: 'science-tech',
    iconName: 'Cpu',
    description: 'কম্পিউটার বিজ্ঞান, প্রোগ্রামিং, গণিত ও পপুলার সায়েন্স',
    bookCount: 19,
  },
  {
    id: 'kids-teens',
    name: 'শিশু-কিশোর',
    englishName: 'Kids & Young Adult',
    slug: 'kids',
    iconName: 'Smile',
    description: 'রূপকথা, ছড়া, কমিকস ও রোমাঞ্চকর কিশোর সাহিত্য',
    bookCount: 26,
  },
  {
    id: 'language-learning',
    name: 'ভাষা শেখা',
    englishName: 'Language Learning',
    slug: 'language',
    iconName: 'Languages',
    description: 'ইংরেজি ব্যাকরণ, স্পোকেন ইংলিশ ও ভাষা দক্ষতা',
    bookCount: 16,
  },
];

export const DISTRICTS_LIST = [
  'ঢাকা',
  'চট্টগ্রাম',
  'রাজশাহী',
  'খুলনা',
  'সিলেট',
  'বরিশাল',
  'রংপুর',
  'ময়মনসিংহ',
  'কুমিল্লা',
  'গাজীপুর',
  'নারায়ণগঞ্জ',
  'বগুড়া',
  'যশোর',
  'কক্সবাজার',
  'দিনাজপুর',
  'ফরিদপুর'
];
