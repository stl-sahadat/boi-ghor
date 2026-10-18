import React from 'react';
import { BookCheck, Compass, Headset, PackageCheck, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FeatureStrip: React.FC = () => {
  const { navigateTo, openSupportModal } = useStore();

  const features = [
    {
      icon: <BookCheck className="w-5 h-5 text-[#176B48]" />,
      title: 'সহজ বই ব্রাউজিং',
      desc: 'লেখক, বিষয় ও প্রকাশনী অনুযায়ী সহজে বই ফিল্টারিং ও অনুসন্ধান',
      action: () => navigateTo('catalog', undefined, 'all'),
      actionLabel: 'ক্যাটালগ ব্রাউজ করুন',
    },
    {
      icon: <PackageCheck className="w-5 h-5 text-[#176B48]" />,
      title: 'ক্যাশ অন ডেলিভারি ট্রায়াল',
      desc: 'পণ্য হাতে পেয়ে মূল্য পরিশোধের ডেমো অর্ডার প্রক্রিয়াকরণ',
      action: () => openSupportModal('সারাদেশে ক্যাশ অন ডেলিভারি'),
      actionLabel: 'ডেলিভারি নিয়ম দেখুন',
    },
    {
      icon: <Compass className="w-5 h-5 text-[#176B48]" />,
      title: 'পরিকল্পিত ক্যাটালগ',
      desc: 'বাংলা সাহিত্যের ক্লাসিক থেকে শুরু করে আধুনিক প্রকাশনা',
      action: () => navigateTo('catalog', undefined, 'all'),
      actionLabel: 'সকল বিষয় দেখুন',
    },
    {
      icon: <Headset className="w-5 h-5 text-[#176B48]" />,
      title: 'সহায়তা ডেস্ক',
      desc: 'বই নির্বাচন ও সাধারণ জিজ্ঞাসায় গ্রাহক সহায়তা প্ল্যাটফর্ম',
      action: () => openSupportModal('সাধারণ জিজ্ঞাসা (FAQ)'),
      actionLabel: 'জিজ্ঞাসা ও সাপোর্ট',
    },
  ];

  return (
    <section className="py-10 bg-[#F6F8F6] border-t border-[#E5EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-[#E5EAE6] hover:border-[#176B48]/50 hover:shadow-md transition-all duration-200 cursor-pointer text-left group"
            >
              <div className="p-2.5 rounded-lg bg-[#E8F3EE] group-hover:bg-[#176B48] text-[#176B48] group-hover:text-white transition-colors shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-[#18211C] group-hover:text-[#176B48] transition-colors">
                    {item.title}
                  </h4>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#176B48] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </div>
                <p className="text-xs text-[#69736D] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
