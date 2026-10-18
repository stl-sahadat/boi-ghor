import React, { useState } from 'react';
import { 
  User, 
  Package, 
  LogIn, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  ShieldAlert,
  Search,
  BookOpen,
  LogOut,
  Heart,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AccountPage: React.FC = () => {
  const { 
    recentOrders, 
    navigateTo, 
    showToast,
    authTab,
    setAuthTab,
    currentUser,
    demoLogin,
    demoRegister,
    demoLogout,
    wishlistCount,
    cartCount
  } = useStore();

  const [searchOrderId, setSearchOrderId] = useState('');

  // Sign in state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState({ name: '', phone: '' });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = loginPhone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone) {
      setLoginError('মোবাইল নম্বরটি আবশ্যক');
      return;
    }
    if (cleanPhone.length < 11) {
      setLoginError('১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      return;
    }
    setLoginError('');
    demoLogin(cleanPhone, 'মো. পাঠক');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = { name: '', phone: '' };
    if (!regName.trim()) {
      errs.name = 'আপনার পূর্ণ নাম লিখুন';
    }
    const cleanPhone = regPhone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errs.phone = 'মোবাইল নম্বরটি আবশ্যক';
    } else if (cleanPhone.length < 11) {
      errs.phone = '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন';
    }
    setRegError(errs);
    if (!errs.name && !errs.phone) {
      demoRegister(regName, cleanPhone);
    }
  };

  const filteredOrders = searchOrderId.trim()
    ? recentOrders.filter((o) => o.orderId.toLowerCase().includes(searchOrderId.toLowerCase().trim()))
    : recentOrders;

  return (
    <div className="py-8 bg-[#F6F8F6] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-[#E5EAE6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#69736D] mb-1">
              <span>হোম</span> <span className="mx-1">/</span> <span className="text-[#176B48] font-semibold">গ্রাহক অ্যাকাউন্ট</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#18211C] tracking-tight">
              অ্যাকাউন্ট ও অর্ডার ট্র্যাকিং
            </h1>
            <p className="text-xs text-[#69736D] mt-1">
              অর্ডারের সার্বিক অগ্রগতি পর্যবেক্ষণ ও ডেমো প্রোফাইল ইন্টারফেস
            </p>
          </div>

          {currentUser && (
            <button
              onClick={demoLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          )}
        </div>

        {/* Prototype Clarification Banner */}
        <div className="mb-6 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>ফ্রন্টএন্ড প্রোটোটাইপ বিজ্ঞপ্তি:</strong> প্রকৃত ইউজার অথেনটিকেশন, ডাটাবেস ও লাইভ কুরিয়ার এপিআই ইন্টিগ্রেশন পরবর্তী ফেজে যুক্ত হবে। এখানে প্রদত্ত লগইন, রেজিস্ট্রেশন ও স্ট্যাটাস ট্র্যাকিং ডেমো প্রদর্শনীর অংশ হিসেবে ব্রাউজারে সক্রিয় রয়েছে।
          </div>
        </div>

        {/* User Profile Card (if logged in) */}
        {currentUser && (
          <div className="mb-6 p-5 bg-white rounded-2xl border border-[#E5EAE6] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] text-[#176B48] flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#18211C]">{currentUser.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    লগইনকৃত (ডেমো)
                  </span>
                </div>
                <p className="text-xs text-[#69736D] font-mono mt-0.5">মোবাইল: {currentUser.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E5EAE6]">
              <button
                onClick={() => setAuthTab('tracking')}
                className="px-3 py-1.5 rounded-lg bg-[#F6F8F6] hover:bg-gray-100 text-[#18211C] font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-[#176B48]" />
                <span>অর্ডার ({recentOrders.length})</span>
              </button>
              <button
                onClick={() => navigateTo('wishlist')}
                className="px-3 py-1.5 rounded-lg bg-[#F6F8F6] hover:bg-gray-100 text-[#18211C] font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>পছন্দ ({wishlistCount})</span>
              </button>
              <button
                onClick={() => navigateTo('cart')}
                className="px-3 py-1.5 rounded-lg bg-[#F6F8F6] hover:bg-gray-100 text-[#18211C] font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#176B48]" />
                <span>ব্যাগ ({cartCount})</span>
              </button>
            </div>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex border-b border-[#E5EAE6] bg-white rounded-t-2xl px-4 pt-3 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setAuthTab('tracking')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
              authTab === 'tracking'
                ? 'border-[#176B48] text-[#176B48]'
                : 'border-transparent text-[#69736D] hover:text-[#18211C]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>অর্ডার ট্র্যাকিং ({recentOrders.length})</span>
          </button>

          <button
            onClick={() => setAuthTab('login')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
              authTab === 'login'
                ? 'border-[#176B48] text-[#176B48]'
                : 'border-transparent text-[#69736D] hover:text-[#18211C]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>লগইন (Sign In)</span>
          </button>

          <button
            onClick={() => setAuthTab('register')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
              authTab === 'register'
                ? 'border-[#176B48] text-[#176B48]'
                : 'border-transparent text-[#69736D] hover:text-[#18211C]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন অ্যাকাউন্ট (Sign Up)</span>
          </button>
        </div>

        {/* Tab 1: Order Tracking View */}
        {authTab === 'tracking' && (
          <div className="bg-white rounded-b-2xl border-x border-b border-[#E5EAE6] p-5 sm:p-6 shadow-xs space-y-6">
            
            {/* Search Box */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="w-full sm:max-w-md relative">
                <input
                  type="text"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  placeholder="অর্ডার আইডি দিয়ে খুঁজুন (যেমন: BG-2026)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8F6] border border-[#E5EAE6] rounded-xl outline-none focus:border-[#176B48]"
                />
                <Search className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <span className="text-xs text-[#69736D]">
                ডেমো অর্ডারের সংখ্যা: <strong className="text-[#18211C] font-mono">{filteredOrders.length}</strong>
              </span>
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 rounded-2xl bg-[#F6F8F6] border border-[#E5EAE6] space-y-4"
                  >
                    {/* Order header row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5EAE6]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-mono text-[#18211C]">{order.orderId}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#176B48]">
                            {order.status === 'pending'
                              ? 'অর্ডার প্রক্রিয়াধীন'
                              : order.status === 'processing'
                              ? 'প্যাকেজিং সম্পন্ন'
                              : order.status === 'shipped'
                              ? 'ডেলিভারির পথে'
                              : 'ডেলিভারি সম্পন্ন'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#69736D] mt-0.5">{order.createdAt}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-[#69736D] block">মোট প্রদেয়:</span>
                        <span className="text-base font-bold text-[#176B48] tabular-nums font-mono">
                          ৳{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Visual 4-Step Tracking Timeline */}
                    <div className="py-2">
                      <p className="text-xs font-bold text-[#18211C] mb-3">ডেলিভারি অগ্রগতি টাইমলাইন (নমুনা):</p>
                      <div className="grid grid-cols-4 gap-2 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-[#E5EAE6] -z-0" />

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className="w-7 h-7 rounded-full bg-[#176B48] text-white flex items-center justify-center text-xs font-bold mb-1 shadow-xs">
                            ✓
                          </div>
                          <span className="text-[11px] font-semibold text-[#18211C]">অর্ডার গৃহীত</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-xs ${
                            order.status !== 'pending' ? 'bg-[#176B48] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {order.status !== 'pending' ? '✓' : '২'}
                          </div>
                          <span className="text-[11px] font-semibold text-[#18211C]">প্যাকেজিং</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-xs ${
                            order.status === 'shipped' || order.status === 'delivered' ? 'bg-[#176B48] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {order.status === 'shipped' || order.status === 'delivered' ? '✓' : '৩'}
                          </div>
                          <span className="text-[11px] font-semibold text-[#18211C]">কুরিয়ারে হস্তান্তর</span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-xs ${
                            order.status === 'delivered' ? 'bg-[#176B48] text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {order.status === 'delivered' ? '✓' : '৪'}
                          </div>
                          <span className="text-[11px] font-semibold text-[#18211C]">ডেলিভারি সম্পন্ন</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#E5EAE6] text-xs">
                      <div>
                        <span className="text-[#69736D] block mb-1">ডেলিভারি তথ্য:</span>
                        <p className="font-semibold text-[#18211C]">{order.customer.fullName}</p>
                        <p className="text-[#69736D]">{order.customer.phone}</p>
                        <p className="text-[#69736D]">{order.customer.address}, {order.customer.district}</p>
                      </div>

                      <div>
                        <span className="text-[#69736D] block mb-1">বইসমূহ ({order.items.length}):</span>
                        <ul className="space-y-1">
                          {order.items.map((i) => (
                            <li key={i.book.id} className="flex justify-between">
                              <span className="truncate max-w-[70%] font-medium text-[#18211C]">
                                {i.book.title} (x{i.quantity})
                              </span>
                              <span className="font-mono tabular-nums text-[#176B48]">
                                ৳{i.book.demoPrice * i.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#69736D]">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-semibold">কোনো অর্ডার পাওয়া যায়নি</p>
                <p className="text-xs mt-1">প্রদত্ত আইডির সাথে মিল পাওয়া যায়নি।</p>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Login UI Preview */}
        {authTab === 'login' && (
          <div className="bg-white rounded-b-2xl border-x border-b border-[#E5EAE6] p-6 sm:p-8 shadow-xs max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] text-[#176B48] flex items-center justify-center mx-auto mb-2">
                <LogIn className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#18211C]">বইঘর অ্যাকাউন্টে সাইন ইন</h2>
              <div className="mt-1 inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-[#176B48] text-[11px] font-semibold border border-emerald-200">
                ফ্রন্টএন্ড প্রোটোটাইপ মোড
              </div>
              <p className="text-xs text-[#69736D] mt-2 leading-relaxed">
                আপনার ১১ ডিজিটের মোবাইল নম্বর প্রদান করে সরাসরি ডেমো সেশন শুরু করতে পারেন।
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18211C] mb-1.5">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => {
                    setLoginPhone(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="যেমন: ০১৭১১২২৩৩৪৪"
                  className={`w-full px-3 py-2.5 bg-[#F6F8F6] border rounded-xl outline-none transition-colors font-mono ${
                    loginError ? 'border-rose-400' : 'border-[#E5EAE6] focus:border-[#176B48]'
                  }`}
                />
                {loginError && <p className="text-[11px] text-rose-500 mt-1">{loginError}</p>}
              </div>

              <div>
                <label className="block font-bold text-[#18211C] mb-1.5">
                  ওটিপি / পাসওয়ার্ড (ঐচ্ছিক ডেমো ফিল্ড)
                </label>
                <input
                  type="password"
                  disabled
                  placeholder="•••••••• (ব্যাকএন্ড ফেজ ২-এ সক্রিয় হবে)"
                  className="w-full px-3 py-2.5 bg-gray-100 border border-[#E5EAE6] rounded-xl outline-none text-gray-400 cursor-not-allowed"
                />
                <p className="text-[10px] text-[#69736D] mt-1">ডেমো টেস্টের জন্য পাসওয়ার্ডের প্রয়োজন নেই</p>
              </div>

              {/* Quick Demo Login Preset Buttons */}
              <div>
                <span className="text-[10px] text-[#69736D] block mb-1.5 font-medium">এক-ক্লিকে টেস্ট ডেমো লগইন:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => demoLogin('০১৭০০-১২৩৪৫৬', 'আব্দুল্লাহ আল মারুফ')}
                    className="p-2 rounded-xl border border-[#E5EAE6] bg-[#F6F8F6] hover:bg-[#E8F3EE] hover:border-[#176B48] text-left transition-colors cursor-pointer"
                  >
                    <p className="font-semibold text-[#18211C] truncate text-[11px]">মারুফ (অর্ডারসহ)</p>
                    <p className="text-[10px] text-[#69736D] font-mono">০১৭০০-১২৩৪৫৬</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => demoLogin('০১৮০০-৬৭৮৯০১', 'তানভীর আহমেদ')}
                    className="p-2 rounded-xl border border-[#E5EAE6] bg-[#F6F8F6] hover:bg-[#E8F3EE] hover:border-[#176B48] text-left transition-colors cursor-pointer"
                  >
                    <p className="font-semibold text-[#18211C] truncate text-[11px]">তানভীর আহমেদ</p>
                    <p className="text-[10px] text-[#69736D] font-mono">০১৮০০-৬৭৮৯০১</p>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#176B48] hover:bg-[#104D36] text-white font-bold rounded-xl transition-all cursor-pointer text-xs shadow-md active:scale-98"
              >
                সাইন ইন করুন (ডেমো)
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className="text-xs text-[#176B48] hover:underline cursor-pointer font-semibold"
                >
                  নতুন পাঠক? এখানে নতুন অ্যাকাউন্ট খুলুন →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Register UI Preview */}
        {authTab === 'register' && (
          <div className="bg-white rounded-b-2xl border-x border-b border-[#E5EAE6] p-6 sm:p-8 shadow-xs max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] text-[#176B48] flex items-center justify-center mx-auto mb-2">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#18211C]">নতুন অ্যাকাউন্ট নিবন্ধন</h2>
              <div className="mt-1 inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-[#176B48] text-[11px] font-semibold border border-emerald-200">
                ফ্রন্টএন্ড প্রোটোটাইপ মোড
              </div>
              <p className="text-xs text-[#69736D] mt-2 leading-relaxed">
                আপনার নাম ও মোবাইল নম্বর দিয়ে বিনামূল্যে ডেমো অ্যাকাউন্ট তৈরি করে দেখুন।
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18211C] mb-1.5">
                  আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (regError.name) setRegError({ ...regError, name: '' });
                  }}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className={`w-full px-3 py-2.5 bg-[#F6F8F6] border rounded-xl outline-none transition-colors ${
                    regError.name ? 'border-rose-400' : 'border-[#E5EAE6] focus:border-[#176B48]'
                  }`}
                />
                {regError.name && <p className="text-[11px] text-rose-500 mt-1">{regError.name}</p>}
              </div>

              <div>
                <label className="block font-bold text-[#18211C] mb-1.5">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => {
                    setRegPhone(e.target.value);
                    if (regError.phone) setRegError({ ...regError, phone: '' });
                  }}
                  placeholder="০১৭১xxxxxxx"
                  className={`w-full px-3 py-2.5 bg-[#F6F8F6] border rounded-xl outline-none transition-colors font-mono ${
                    regError.phone ? 'border-rose-400' : 'border-[#E5EAE6] focus:border-[#176B48]'
                  }`}
                />
                {regError.phone && <p className="text-[11px] text-rose-500 mt-1">{regError.phone}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#176B48] hover:bg-[#104D36] text-white font-bold rounded-xl transition-all cursor-pointer text-xs shadow-md active:scale-98"
              >
                অ্যাকাউন্ট তৈরি করুন (ডেমো)
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className="text-xs text-[#176B48] hover:underline cursor-pointer font-semibold"
                >
                  ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন →
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
