import React from 'react';
import { BookOpen, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { SITE_CONFIG, POPULAR_CATEGORIES } from '../../data/siteConfig';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { navigateTo, openSupportModal, openAuthModal } = useStore();

  return (
    <footer className="bg-[#104D36] text-white/90 border-t border-[#176B48]/40 pt-12 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand & Mission (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#176B48] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white block">
                  {SITE_CONFIG.brandNameBangla}
                </span>
                <span className="text-[10px] text-emerald-200 tracking-wider uppercase font-medium">
                  {SITE_CONFIG.brandNameEnglish} Online Bookstore
                </span>
              </div>
            </button>

            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-sm">
              বাংলাদেশের পাঠকদের জন্য বই কেনার সহজ ও নির্ভরযোগ্য মাধ্যম। পছন্দের বই খুঁজে নেওয়া, সহজে কার্ট ব্যবস্থাপনা ও দ্রুত অর্ডার করার আধুনিক অনলাইন অভিজ্ঞতা।
            </p>

            {/* Interactive Contact Links */}
            <div className="space-y-2 pt-2 text-xs text-emerald-100/90">
              <a
                href={`tel:${SITE_CONFIG.contact.hotline.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2 hover:text-white hover:underline transition-colors cursor-pointer w-fit"
                title="সরাসরি ফোনে কল করুন"
              >
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>হটলাইন: <strong className="text-white font-mono">{SITE_CONFIG.contact.hotline}</strong></span>
              </a>

              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="flex items-center gap-2 hover:text-white hover:underline transition-colors cursor-pointer w-fit"
                title="ইমেইল পাঠান"
              >
                <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>ইমেইল: <span className="text-white">{SITE_CONFIG.contact.email}</span></span>
              </a>

              <a
                href="https://maps.google.com/?q=Barura+Comilla+Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white hover:underline transition-colors cursor-pointer w-fit"
                title="গুগল ম্যাপে লোকেশন দেখুন"
              >
                <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>ঠিকানা: <span className="text-white">{SITE_CONFIG.contact.address}</span></span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] text-emerald-200/90 block mb-2 font-medium">সামাজিক যোগাযোগ মাধ্যম:</span>
              <div className="flex items-center gap-2 text-xs">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors cursor-pointer font-medium"
                >
                  Facebook
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors cursor-pointer font-medium"
                >
                  YouTube
                </a>
                <a
                  href="https://wa.me/8801710000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors cursor-pointer font-medium"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              দ্রুত লিঙ্ক
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  হোম পেজ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', undefined, 'all')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  সব বইয়ের ক্যাটালগ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  পছন্দের তালিকা
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('cart')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  শপিং কার্ট
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  সাইন ইন / লগইন
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  নতুন অ্যাকাউন্ট নিবন্ধন
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('account', undefined, undefined, undefined, undefined, 'tracking')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  অর্ডার ট্র্যাকিং
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('admin')}
                  className="text-emerald-300 hover:text-white hover:underline transition-colors cursor-pointer text-left flex items-center gap-1 font-semibold"
                >
                  <span>প্রশাসনিক প্যানেল (অ্যাডমিন)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Book Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              জনপ্রিয় বিষয়
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              {POPULAR_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo('catalog', undefined, cat.slug)}
                    className="hover:text-white hover:underline transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support & Policies (ALL INTERACTIVE BUTTONS) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              গ্রাহক সেবা ও পলিসি
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={() => openSupportModal('সহজ অর্ডার পদ্ধতি')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>সহজ অর্ডার পদ্ধতি</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupportModal('সারাদেশে ক্যাশ অন ডেলিভারি')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>সারাদেশে ক্যাশ অন ডেলিভারি</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupportModal('রিটার্ন ও রিপ্লেসমেন্ট পলিসি')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>রিটার্ন ও রিপ্লেসমেন্ট পলিসি</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupportModal('বইয়ের মান ও প্যাকেজিং')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>বইয়ের মান ও প্যাকেজিং</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSupportModal('সচরাচর জিজ্ঞাসা (FAQ)')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>সচরাচর জিজ্ঞাসা (FAQ)</span>
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-emerald-200 block mb-1">সম্ভাব্য পেমেন্ট মাধ্যম:</span>
              <div className="flex items-center gap-2 text-[10px] text-emerald-100/70 font-mono">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">COD</span>
                <span>bKash</span>
                <span>Nagad</span>
                <span>Visa/Master</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype & Copyright Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70">
          <p className="text-center md:text-left leading-relaxed max-w-3xl">
            {SITE_CONFIG.demoDisclaimer}
          </p>
          <p className="shrink-0 text-center font-mono text-[11px]">
            © ২০২৬ {SITE_CONFIG.brandNameBangla} ({SITE_CONFIG.brandNameEnglish}). সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
};
