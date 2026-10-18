import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Phone, 
  MapPin, 
  User, 
  AlertCircle,
  Package,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DISTRICTS_LIST, SITE_CONFIG } from '../../data/siteConfig';
import { CheckoutFormState } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryArea,
    setDeliveryArea,
    deliveryFee,
    cartTotal,
    navigateTo,
    submitDemoOrder,
    completedOrder,
    setCompletedOrder,
    currentUser,
    openAuthModal,
  } = useStore();

  const [form, setForm] = useState<CheckoutFormState>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    district: 'ঢাকা',
    address: '',
    notes: '',
    deliveryArea: deliveryArea,
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If order was just submitted, show clear demo confirmation view
  if (completedOrder) {
    return (
      <div className="py-12 bg-[#F6F8F6] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-[#E5EAE6] p-6 sm:p-8 shadow-sm text-center">
            
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#176B48] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-block px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-semibold mb-3">
              দৃষ্টি আকর্ষণ: এটি একটি ফ্রন্টএন্ড ডেমো অর্ডার
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#18211C] mb-2">
              অর্ডার সফলভাবে গ্রহণ করা হয়েছে (ডেমো)!
            </h1>

            <p className="text-xs sm:text-sm text-[#69736D] leading-relaxed max-w-lg mx-auto mb-6">
              ধন্যবাদ! আপনার ডেমো অর্ডারটি আমাদের টেস্ট সিস্টেমে লিপিবদ্ধ হয়েছে। যেহেতু এটি একটি ফ্রন্টএন্ড প্রোটোটাইপ, তাই বাস্তবে কোনো চার্জ বা পার্সেল প্রেরণ করা হবে না।
            </p>

            {/* Order Details Card */}
            <div className="bg-[#F6F8F6] rounded-xl p-5 border border-[#E5EAE6] text-left space-y-3 mb-6 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-[#E5EAE6]">
                <span className="text-[#69736D]">ডেমো অর্ডার নম্বর:</span>
                <strong className="font-mono text-[#176B48] font-bold">{completedOrder.orderId}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EAE6]">
                <span className="text-[#69736D]">গ্রাহকের নাম:</span>
                <span className="font-semibold text-[#18211C]">{completedOrder.customer.fullName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EAE6]">
                <span className="text-[#69736D]">মোবাইল নম্বর:</span>
                <span className="font-mono text-[#18211C]">{completedOrder.customer.phone}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EAE6]">
                <span className="text-[#69736D]">ডেলিভারি ঠিকানা:</span>
                <span className="text-right text-[#18211C] max-w-[60%]">
                  {completedOrder.customer.address}, {completedOrder.customer.district}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5EAE6]">
                <span className="text-[#69736D]">পেমেন্ট পদ্ধতি:</span>
                <span className="text-[#18211C] font-medium">{completedOrder.customer.paymentMethod}</span>
              </div>

              {/* Items summary */}
              <div className="pt-2">
                <span className="text-[#69736D] block mb-1">অর্ডারকৃত বইসমূহ ({completedOrder.items.length}):</span>
                <ul className="space-y-1">
                  {completedOrder.items.map((item) => (
                    <li key={item.book.id} className="flex justify-between text-xs">
                      <span className="truncate max-w-[70%]">
                        {item.book.title} (x{item.quantity})
                      </span>
                      <span className="font-mono tabular-nums text-[#176B48]">
                        ৳{item.book.demoPrice * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-[#E5EAE6] flex justify-between text-base font-bold text-[#18211C]">
                <span>পরিশোধযোগ্য মোট:</span>
                <span className="text-[#176B48] tabular-nums">৳{completedOrder.total}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  navigateTo('account');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#176B48] hover:bg-[#104D36] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                অর্ডার ট্র্যাকিং দেখুন
              </button>
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  navigateTo('catalog');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-[#18211C] text-xs sm:text-sm font-semibold rounded-xl border border-[#E5EAE6] transition-colors cursor-pointer"
              >
                আরও বই ব্রাউজ করুন
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Redirect if cart empty
  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <p className="text-sm text-[#69736D] mb-4">আপনার কার্টে কোনো বই নেই।</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-2.5 bg-[#176B48] text-white text-xs font-semibold rounded-xl"
        >
          বইয়ের ক্যাটালগ দেখুন
        </button>
      </div>
    );
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) {
      errs.fullName = 'আপনার পূর্ণ নাম লিখুন';
    }
    if (!form.phone.trim()) {
      errs.phone = 'সচল মোবাইল নম্বর লিখুন';
    } else if (!/^(\+?8801|01)[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'সঠিক বাংলাদেশি ১১ ডিজিটের নম্বর দিন (যেমন: 017xxxxxxxx)';
    }
    if (!form.address.trim()) {
      errs.address = 'পূর্ণ ডেলিভারি ঠিকানা লিখুন (রোড, বাড়ি নং ইত্যাদি)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitDemoOrder({
        items: cart,
        subtotal: cartSubtotal,
        deliveryFee: deliveryFee,
        total: cartTotal,
        customer: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          district: form.district,
          address: form.address.trim(),
          deliveryArea: form.deliveryArea,
          paymentMethod: 'ক্যাশ অন ডেলিভারি (Cash on Delivery)',
        },
      });

      setIsSubmitting(false);
      if (!res.success && res.error) {
        setErrors((prev) => ({ ...prev, form: res.error || 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে' }));
      }
    }, 600);
  };

  return (
    <div className="py-8 bg-[#F6F8F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#69736D] mb-1">
              <span>শপিং ব্যাগ</span> <span className="mx-1">/</span> <span className="text-[#176B48] font-semibold">চেকআউট</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#18211C] tracking-tight">
              অর্ডার কনফার্মেশন ও চেকআউট
            </h1>
          </div>

          <button
            onClick={() => navigateTo('cart')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#176B48] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ব্যাগে ফিরে যান</span>
          </button>
        </div>

        {/* Prototype Header Notice */}
        <div className="mb-6 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#176B48] shrink-0" />
          <span>
            <strong>ফ্রন্টএন্ড প্রোটোটাইপ মোড:</strong> এই ফর্মে দেওয়া তথ্য কোনো বহিরাগত সার্ভারে সংরক্ষণ করা হবে না। সরাসরি টেস্ট অর্ডার সম্পূর্ণ করতে নিচের ফর্মটি পূরণ করুন।
          </span>
        </div>

        {/* Checkout Split Grid: Left Form (7 cols), Right Order Summary (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer & Delivery Details Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5EAE6] p-6 shadow-xs">
            <h2 className="text-base font-bold text-[#18211C] pb-3 border-b border-[#E5EAE6] mb-5">
              ১. ডেলিভারির তথ্য
            </h2>

            {/* Account Status / Guest Checkout Option */}
            <div className="mb-5 p-4 rounded-xl border transition-colors bg-[#F6F8F6] border-[#E5EAE6]">
              {currentUser ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E8F3EE] text-[#176B48] flex items-center justify-center font-bold shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#18211C]">লগইনকৃত অ্যাকাউন্ট: {currentUser.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-[#176B48]">সক্রিয় গ্রাহক</span>
                      </div>
                      <p className="text-[11px] text-[#69736D]">মোবাইল: {currentUser.phone} · এই অর্ডারটি আপনার অ্যাকাউন্ট ড্যাশবোর্ডে সংরক্ষিত হবে।</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, fullName: '', phone: '' }));
                    }}
                    className="text-xs font-semibold text-[#176B48] hover:underline self-start sm:self-auto cursor-pointer"
                  >
                    ভিন্ন গ্রাহকের তথ্য ব্যবহার করুন
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#18211C]">গেস্ট চেকআউট (Guest Checkout সক্রিয়)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">অ্যাকাউন্ট আবশ্যক নয়</span>
                      </div>
                      <p className="text-[11px] text-[#69736D]">
                        কোনো পাসওয়ার্ড ছাড়াই শুধু নাম, মোবাইল ও ঠিকানা প্রদান করে সরাসরি ডেমো অর্ডার সম্পন্ন করতে পারেন।
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#176B48] border border-[#176B48]/30 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    অ্যাকাউন্টে সাইন ইন করুন
                  </button>
                </div>
              )}
            </div>

            {errors.form && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#18211C] mb-1.5">
                  আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="যেমন: মো. কামরুল হাসান"
                    className={`w-full pl-9 pr-3 py-2.5 text-xs bg-[#F6F8F6] border rounded-xl outline-none transition-colors ${
                      errors.fullName ? 'border-rose-400 focus:border-rose-600' : 'border-[#E5EAE6] focus:border-[#176B48]'
                    }`}
                  />
                  <User className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#18211C] mb-1.5">
                  সচল মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="০১৭১১-XXXXXX"
                    className={`w-full pl-9 pr-3 py-2.5 text-xs bg-[#F6F8F6] border rounded-xl outline-none transition-colors font-mono ${
                      errors.phone ? 'border-rose-400 focus:border-rose-600' : 'border-[#E5EAE6] focus:border-[#176B48]'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                <p className="text-[10px] text-[#69736D] mt-1">ডেলিভারিম্যান এই নম্বরে যোগাযোগ করবেন</p>
              </div>

              {/* Delivery Area & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18211C] mb-1.5">
                    ডেলিভারি অঞ্চল
                  </label>
                  <select
                    value={form.deliveryArea}
                    onChange={(e) => {
                      const area = e.target.value as 'inside_dhaka' | 'outside_dhaka';
                      setForm({ ...form, deliveryArea: area });
                      setDeliveryArea(area);
                    }}
                    className="w-full px-3 py-2.5 text-xs bg-[#F6F8F6] border border-[#E5EAE6] rounded-xl outline-none focus:border-[#176B48]"
                  >
                    <option value="inside_dhaka">ঢাকা সিটির ভেতরে (৳৬০)</option>
                    <option value="outside_dhaka">ঢাকার বাইরে সমগ্র বাংলাদেশ (৳১২০)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18211C] mb-1.5">
                    জেলা
                  </label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs bg-[#F6F8F6] border border-[#E5EAE6] rounded-xl outline-none focus:border-[#176B48]"
                  >
                    {DISTRICTS_LIST.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="block text-xs font-bold text-[#18211C] mb-1.5">
                  পূর্ণ ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="বাড়ি নং, রোড নং, এলাকার নাম বা পরিচিত ল্যান্ডমার্ক..."
                    className={`w-full p-3 text-xs bg-[#F6F8F6] border rounded-xl outline-none transition-colors ${
                      errors.address ? 'border-rose-400 focus:border-rose-600' : 'border-[#E5EAE6] focus:border-[#176B48]'
                    }`}
                  />
                </div>
                {errors.address && <p className="text-[11px] text-rose-500 mt-0.5">{errors.address}</p>}
              </div>

              {/* Order Notes (optional) */}
              <div>
                <label className="block text-xs font-semibold text-[#69736D] mb-1">
                  অতিরিক্ত নির্দেশনা (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                  className="w-full px-3 py-2 text-xs bg-[#F6F8F6] border border-[#E5EAE6] rounded-xl outline-none focus:border-[#176B48]"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-[#E5EAE6]">
                <h3 className="text-xs font-bold text-[#18211C] mb-3">
                  ২. মূল্য পরিশোধের পদ্ধতি নির্বাচন
                </h3>

                <div className="space-y-2.5">
                  {/* Option 1: Cash on Delivery (ACTIVE DEMO OPTION) */}
                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#176B48] bg-[#E8F3EE]/60 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setForm({ ...form, paymentMethod: 'cod' })}
                      className="mt-0.5 text-[#176B48] focus:ring-[#176B48]"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#18211C] font-bold">ক্যাশ অন ডেলিভারি (Cash on Delivery)</strong>
                        <span className="text-[10px] bg-[#176B48] text-white px-2 py-0.5 rounded font-semibold">সক্রিয় ডেমো</span>
                      </div>
                      <p className="text-[#69736D] mt-0.5">
                        বই হাতে পেয়ে ডেলিভারিম্যানকে মূল্য পরিশোধ করার সুবিধা।
                      </p>
                    </div>
                  </label>

                  {/* Option 2: bKash (Disabled placeholder) */}
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-[#E5EAE6] bg-[#F6F8F6] opacity-60">
                    <input type="radio" disabled className="mt-0.5" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#18211C]">বিকাশ / নগদ (bKash / Nagad)</span>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded">পরবর্তী ফেজে</span>
                      </div>
                      <p className="text-[#69736D] text-[11px] mt-0.5">
                        অনলাইন পেমেন্ট গেটওয়ে পরবর্তী ব্যাকএন্ড সংস্করণে যুক্ত করা হবে।
                      </p>
                    </div>
                  </div>

                  {/* Option 3: Card / Net Banking (Disabled placeholder) */}
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-[#E5EAE6] bg-[#F6F8F6] opacity-60">
                    <input type="radio" disabled className="mt-0.5" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#18211C]">ডেবিট / ক্রেডিট কার্ড</span>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded">পরবর্তী ফেজে</span>
                      </div>
                      <p className="text-[#69736D] text-[11px] mt-0.5">
                        ভিসা, মাস্টারকার্ড ও স্থানীয় ব্যাংক কার্ড সমর্থন।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Order Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#176B48] hover:bg-[#104D36] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <Package className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার নিশ্চিত করুন (মোট ৳${cartTotal})`}
                  </span>
                </button>
                <p className="text-[10px] text-center text-[#69736D] mt-2">
                  *চেকআউট বাটনে চাপলে একটি টেস্ট ডেমো রসিদ তৈরি হবে।
                </p>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5EAE6] p-5 shadow-xs">
              <h2 className="text-sm font-bold text-[#18211C] pb-3 border-b border-[#E5EAE6] flex justify-between items-center">
                <span>আপনার ব্যাগের বইসমূহ</span>
                <span className="text-xs text-[#69736D] tabular-nums font-mono">({cart.length} টি)</span>
              </h2>

              {/* Items List */}
              <div className="divide-y divide-[#E5EAE6]/60 max-h-80 overflow-y-auto py-2">
                {cart.map((item) => (
                  <div key={item.book.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#18211C] truncate">{item.book.title}</p>
                      <p className="text-[#69736D] text-[11px] truncate">
                        {item.book.author} · পরিমাণ: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#18211C] tabular-nums font-mono">
                        ৳{item.book.demoPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#E5EAE6] text-xs">
                <div className="flex justify-between text-[#69736D]">
                  <span>আইটেম উপমোট:</span>
                  <span className="font-semibold text-[#18211C] tabular-nums font-mono">৳{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-[#69736D]">
                  <span>ডেলিভারি চার্জ ({form.deliveryArea === 'inside_dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'}):</span>
                  <span className="font-semibold text-[#18211C] tabular-nums font-mono">
                    {deliveryFee === 0 ? <span className="text-emerald-700">ফ্রি</span> : `৳${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#18211C] pt-2 border-t border-[#E5EAE6]">
                  <span>সর্বমোট প্রাক্কলন:</span>
                  <span className="text-[#176B48] text-lg tabular-nums font-mono">৳{cartTotal}</span>
                </div>
              </div>
            </div>

            {/* Reassurance strip */}
            <div className="bg-[#E8F3EE] rounded-xl p-4 border border-[#176B48]/20 space-y-2 text-xs text-[#104D36]">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#176B48]" />
                <span>নিরাপদ ও নির্ভরযোগ্য কেনাকাটা</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                ডেলিভারি গ্রহণের সময় প্যাকেট যাচাই করে মূল্য পরিশোধ করতে পারবেন। কোনো সমস্যা হলে আমাদের হটলাইনে যোগাযোগ করুন।
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
