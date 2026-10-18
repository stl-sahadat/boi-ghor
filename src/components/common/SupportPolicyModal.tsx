import React from 'react';
import { X, HelpCircle, Truck, RefreshCw, ShieldCheck, Phone, CheckCircle2, BookOpen } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SITE_CONFIG } from '../../data/siteConfig';

export const SupportPolicyModal: React.FC = () => {
  const { supportModalOpen, setSupportModalOpen, supportTopic, navigateTo } = useStore();

  if (!supportModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setSupportModalOpen(false)}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5EAE6] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#176B48] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18211C]">{supportTopic}</h3>
              <p className="text-[11px] text-[#69736D]">গ্রাহক সেবা ও নীতিমালার বিবরণ (ডেমো তথ্য)</p>
            </div>
          </div>
          <button
            onClick={() => setSupportModalOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Dynamic Body Content */}
        <div className="py-5 space-y-4 text-xs text-[#18211C]/85 leading-relaxed">
          {supportTopic === 'সহজ অর্ডার পদ্ধতি' && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#176B48]">বইঘরে কীভাবে বই অর্ডার করবেন?</p>
              <ol className="list-decimal list-inside space-y-2 text-[#18211C]/80">
                <li>ওয়েবসাইটে আপনার পছন্দের বই খুঁজুন এবং <strong>"ব্যাগে যোগ করুন"</strong> বাটনে ক্লিক করুন।</li>
                <li>শপিং কার্ট বা ব্যাগ আইকনে গিয়ে আপনার বইয়ের পরিমাণ যাচাই করুন।</li>
                <li><strong>"চেকআউট সম্পন্ন করুন"</strong> বাটনে চাপ দিন এবং আপনার নাম, সচল মোবাইল নম্বর ও পূর্ণ ঠিকানা প্রদান করুন।</li>
                <li>মূল্য পরিশোধ হিসেবে <strong>ক্যাশ অন ডেলিভারি (Cash on Delivery)</strong> নির্বাচন করুন।</li>
                <li>বই হাতে পেয়ে ডেলিভারিম্যানকে মূল্য পরিশোধ করুন।</li>
              </ol>
            </div>
          )}

          {supportTopic === 'সারাদেশে ক্যাশ অন ডেলিভারি' && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#176B48]">ক্যাশ অন ডেলিভারি সুবিধা</p>
              <p>আমরা ঢাকা সহ বাংলাদেশের ৬৪টি জেলাতেই ক্যাশ অন ডেলিভারি সুবিধা প্রদান করি।</p>
              <div className="p-3 bg-[#F6F8F6] rounded-xl border border-[#E5EAE6] space-y-1">
                <p><strong>ঢাকা সিটির ভেতরে:</strong> ডেলিভারি চার্জ মাত্র ৬০৳ (২-৩ কার্যদিবস)</p>
                <p><strong>ঢাকার বাইরে সারাদেশে:</strong> ডেলিভারি চার্জ ১২০৳ (৩-৫ কার্যদিবস)</p>
                <p className="text-emerald-800 font-semibold pt-1">১২০০৳ এর বেশি অর্ডারে ফ্রি ডেলিভারি প্রযোজ্য!</p>
              </div>
            </div>
          )}

          {supportTopic === 'রিটার্ন ও রিপ্লেসমেন্ট পলিসি' && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#176B48]">সহজ রিপ্লেসমেন্ট নিশ্চয়তা</p>
              <p>বইয়ে কোনো পৃষ্ঠা মিসিং, উল্টো বাঁধাই বা মুদ্রণজনিত কোনো ত্রুটি থাকলে ডেলিভারি গ্রহণের ৭ দিনের মধ্যে আমরা বিনামূল্যে নতুন কপি পৌঁছে দেওয়ার প্রতিশ্রুতি দিই।</p>
              <p>ত্রুটিযুক্ত বইয়ের ছবি তুলে আমাদের হটলাইন নম্বরে হোয়াটসঅ্যাপে যোগাযোগ করুন।</p>
            </div>
          )}

          {supportTopic === 'বইয়ের মান ও প্যাকেজিং' && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#176B48]">শতভাগ আসল বই ও সুরক্ষিত প্যাকেজিং</p>
              <p>বইঘরের প্রতিটি বই সরাসরি মূল প্রকাশনী ও অনুমোদিত পরিবেশকদের কাছ থেকে সংগৃহীত। পাইরেটেড বা ফটোকপি বইয়ের কোনো স্থান আমাদের কাছে নেই।</p>
              <p>বৃষ্টি ও পরিবহনের আঘাত থেকে বইকে নিরাপদে রাখতে প্রতিটি পার্সেল ওয়াটারপ্রুফ বাবল র‍্যাপ দিয়ে নিখুঁতভাবে মোড়কজাত করা হয়।</p>
            </div>
          )}

          {supportTopic === 'সচরাচর জিজ্ঞাসা (FAQ)' && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#176B48]">সচরাচর জিজ্ঞাসিত প্রশ্নাবলি</p>
              <div className="space-y-2">
                <div className="p-2.5 bg-[#F6F8F6] rounded-lg">
                  <p className="font-bold text-[#18211C]">প্রশ্ন: বইয়ের স্টক কীভাবে বুঝব?</p>
                  <p className="text-[#69736D] mt-0.5">উত্তর: প্রতিটি বইয়ের পাশে 'স্টকে আছে' বা কয়টি কপি অবশিষ্ট তা প্রদর্শিত হয়।</p>
                </div>
                <div className="p-2.5 bg-[#F6F8F6] rounded-lg">
                  <p className="font-bold text-[#18211C]">প্রশ্ন: অর্ডার ট্র্যাকিং কীভাবে করব?</p>
                  <p className="text-[#69736D] mt-0.5">উত্তর: 'অ্যাকাউন্ট' মেনুতে গিয়ে আপনার অর্ডার আইডি দিয়ে লাইভ অগ্রগতি দেখতে পারবেন।</p>
                </div>
              </div>
            </div>
          )}

          {/* Fallback default */}
          {!['সহজ অর্ডার পদ্ধতি', 'সারাদেশে ক্যাশ অন ডেলিভারি', 'রিটার্ন ও রিপ্লেসমেন্ট পলিসি', 'বইয়ের মান ও প্যাকেজিং', 'সচরাচর জিজ্ঞাসা (FAQ)'].includes(supportTopic) && (
            <div className="space-y-2">
              <p className="font-semibold text-[#18211C]">{supportTopic}</p>
              <p className="text-[#69736D]">
                বইঘর গ্রাহক সেবা প্ল্যাটফর্মে আপনাকে স্বাগতম। যেকোনো তথ্য বা বইয়ের সহায়তায় আমাদের হটলাইন নম্বরে যোগাযোগ করুন।
              </p>
            </div>
          )}

          {/* Direct helpline box */}
          <div className="p-3 bg-[#E8F3EE] rounded-xl border border-[#176B48]/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#104D36] block">সরাসরি কথা বলুন:</span>
              <strong className="text-sm text-[#176B48]">{SITE_CONFIG.contact.hotline}</strong>
            </div>
            <a
              href={`tel:${SITE_CONFIG.contact.hotline.replace(/[^\d+]/g, '')}`}
              className="px-3 py-1.5 bg-[#176B48] text-white rounded-lg font-bold text-xs hover:bg-[#104D36] transition-colors"
            >
              কল করুন
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#E5EAE6] flex justify-between items-center text-xs">
          <span className="text-[10px] text-[#69736D]">*ডেমো নীতিমালার অংশ</span>
          <button
            onClick={() => setSupportModalOpen(false)}
            className="px-4 py-2 bg-[#176B48] text-white rounded-xl font-bold hover:bg-[#104D36] transition-colors"
          >
            বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
};
