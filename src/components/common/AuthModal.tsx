import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Phone, User, ShieldAlert, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DISTRICTS_LIST, SITE_CONFIG } from '../../data/siteConfig';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    demoLogin,
    demoRegister,
    currentUser,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState('ঢাকা');
  const [regErrors, setRegErrors] = useState<{ name?: string; phone?: string }>({});

  // Sync mode if changed externally
  useEffect(() => {
    if (authModalOpen) {
      setActiveTab(authModalMode);
      setLoginError('');
      setRegErrors({});
    }
  }, [authModalOpen, authModalMode]);

  // Handle ESC key to close
  useEffect(() => {
    if (!authModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

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
    closeAuthModal();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string } = {};
    if (!regName.trim()) {
      errors.name = 'আপনার পূর্ণ নাম লিখুন';
    }
    const cleanPhone = regPhone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errors.phone = 'মোবাইল নম্বরটি আবশ্যক';
    } else if (cleanPhone.length < 11) {
      errors.phone = '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন';
    }
    setRegErrors(errors);

    if (!errors.name && !errors.phone) {
      demoRegister(regName, cleanPhone);
      closeAuthModal();
    }
  };

  const handleQuickDemoUser = (name: string, phone: string) => {
    demoLogin(phone, name);
    closeAuthModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5EAE6] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#176B48] flex items-center justify-center font-bold">
              {activeTab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base font-bold text-[#18211C]">
                {activeTab === 'login' ? 'বইঘর অ্যাকাউন্টে সাইন ইন' : 'নতুন পাঠক নিবন্ধন'}
              </h2>
              <p className="text-[11px] text-[#69736D]">
                {activeTab === 'login' ? 'অর্ডার ট্র্যাকিং ও পছন্দের তালিকা সংরক্ষণ' : 'বিনামূল্যে নতুন অ্যাকাউন্ট খুলুন'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Clarification Banner */}
        <div className="my-3.5 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>ফ্রন্টএন্ড প্রোটোটাইপ মোড:</strong> প্রকৃত ব্যাকএন্ড ডাটাবেস ও লাইভ এসএমএস ওটিপি পরবর্তী ফেজে সংযুক্ত হবে। কোনো পাসওয়ার্ড ছাড়াই সরাসরি ডেমো সেশন শুরু করতে পারেন।
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#F6F8F6] p-1 border border-[#E5EAE6] mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#176B48] shadow-xs'
                : 'text-[#69736D] hover:text-[#18211C]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>সাইন ইন (লগইন)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-[#176B48] shadow-xs'
                : 'text-[#69736D] hover:text-[#18211C]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>নতুন অ্যাকাউন্ট (নিবন্ধন)</span>
          </button>
        </div>

        {/* Form 1: Sign In */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-[#18211C] mb-1">
                মোবাইল নম্বর <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => {
                    setLoginPhone(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="যেমন: ০১৭১১২২৩৩৪৪"
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#F6F8F6] border rounded-xl outline-none font-mono text-xs transition-colors ${
                    loginError ? 'border-rose-400 focus:border-rose-600' : 'border-[#E5EAE6] focus:border-[#176B48]'
                  }`}
                />
                <Phone className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {loginError && <p className="text-[11px] text-rose-500 mt-1">{loginError}</p>}
            </div>

            <div>
              <label className="block font-bold text-[#18211C] mb-1">
                পাসওয়ার্ড / ওটিপি (ঐচ্ছিক ডেমো ফিল্ড)
              </label>
              <input
                type="password"
                disabled
                placeholder="•••••••• (ব্যাকএন্ড ফেজ ২-এ সক্রিয় হবে)"
                className="w-full px-3 py-2 bg-gray-100 border border-[#E5EAE6] rounded-xl outline-none text-gray-400 text-xs cursor-not-allowed"
              />
              <p className="text-[10px] text-[#69736D] mt-1">টেস্টের জন্য পাসওয়ার্ড আবশ্যক নয়</p>
            </div>

            {/* Quick Demo Login Preset Buttons */}
            <div className="pt-1">
              <span className="text-[10px] text-[#69736D] block mb-1.5 font-medium">এক-ক্লিকে ডেমো লগইন:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoUser('আব্দুল্লাহ আল মারুফ', '০১৭০০-১২৩৪৫৬')}
                  className="px-2 py-1.5 rounded-lg border border-[#E5EAE6] bg-[#F6F8F6] hover:bg-[#E8F3EE] hover:border-[#176B48] text-[11px] text-left transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-[#18211C] truncate">মারুফ (অর্ডারসহ)</p>
                  <p className="text-[10px] text-[#69736D] font-mono">০১৭০০-১২৩৪৫৬</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoUser('ফারহানা রহমান', '০১৮০০-৬৭৮৯০১')}
                  className="px-2 py-1.5 rounded-lg border border-[#E5EAE6] bg-[#F6F8F6] hover:bg-[#E8F3EE] hover:border-[#176B48] text-[11px] text-left transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-[#18211C] truncate">ফারহানা (সাধারণ)</p>
                  <p className="text-[10px] text-[#69736D] font-mono">০১৮০০-৬৭৮৯০১</p>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#176B48] hover:bg-[#104D36] text-white font-bold rounded-xl transition-all cursor-pointer text-xs shadow-md active:scale-98"
            >
              সাইন ইন সম্পন্ন করুন (ডেমো)
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs text-[#176B48] hover:underline cursor-pointer font-semibold"
              >
                নতুন পাঠক? নতুন অ্যাকাউন্ট নিবন্ধন করুন →
              </button>
            </div>
          </form>
        )}

        {/* Form 2: Register (Sign Up) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-[#18211C] mb-1">
                আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (regErrors.name) setRegErrors({ ...regErrors, name: '' });
                  }}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#F6F8F6] border rounded-xl outline-none text-xs transition-colors ${
                    regErrors.name ? 'border-rose-400 focus:border-rose-600' : 'border-[#E5EAE6] focus:border-[#176B48]'
                  }`}
                />
                <User className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {regErrors.name && <p className="text-[11px] text-rose-500 mt-1">{regErrors.name}</p>}
            </div>

            <div>
              <label className="block font-bold text-[#18211C] mb-1">
                মোবাইল নম্বর <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => {
                    setRegPhone(e.target.value);
                    if (regErrors.phone) setRegErrors({ ...regErrors, phone: '' });
                  }}
                  placeholder="যেমন: ০১৭XXXXXXXX"
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#F6F8F6] border rounded-xl outline-none font-mono text-xs transition-colors ${
                    regErrors.phone ? 'border-rose-400 focus:border-rose-600' : 'border-[#E5EAE6] focus:border-[#176B48]'
                  }`}
                />
                <Phone className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {regErrors.phone && <p className="text-[11px] text-rose-500 mt-1">{regErrors.phone}</p>}
            </div>

            <div>
              <label className="block font-bold text-[#18211C] mb-1">
                জেলা (ঐচ্ছিক)
              </label>
              <div className="relative">
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F6F8F6] border border-[#E5EAE6] rounded-xl outline-none text-xs focus:border-[#176B48] cursor-pointer"
                >
                  {DISTRICTS_LIST.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-[#69736D] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#176B48] hover:bg-[#104D36] text-white font-bold rounded-xl transition-all cursor-pointer text-xs shadow-md active:scale-98"
            >
              নিবন্ধন সম্পূর্ণ করুন (ডেমো)
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-[#176B48] hover:underline cursor-pointer font-semibold"
              >
                ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
