import React from 'react';
import { 
  BookOpen, 
  Moon, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  Cpu, 
  Smile, 
  Languages, 
  ArrowRight 
} from 'lucide-react';
import { POPULAR_CATEGORIES } from '../../data/siteConfig';
import { useStore } from '../../context/StoreContext';

// Icon map for dynamic lucide icons
const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Languages: <Languages className="w-5 h-5" />,
};

export const CategorySection: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section id="popular-categories" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#176B48] tracking-wider mb-1">
              বিষয়ভিত্তিক বই
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#18211C] tracking-tight">
              জনপ্রিয় ক্যাটাগরি
            </h2>
          </div>

          <button
            onClick={() => navigateTo('catalog', undefined, 'all')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#176B48] hover:text-[#104D36] transition-colors cursor-pointer group"
          >
            <span>সকল ক্যাটাগরি দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid (2 cols mobile, 4 cols tablet/desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {POPULAR_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => navigateTo('catalog', undefined, category.slug)}
              className="flex flex-col text-left p-4 sm:p-5 rounded-xl bg-[#F6F8F6] hover:bg-white border border-[#E5EAE6] hover:border-[#176B48]/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-white group-hover:bg-[#176B48] text-[#176B48] group-hover:text-white flex items-center justify-center shadow-xs transition-colors">
                  {iconMap[category.iconName] || <BookOpen className="w-5 h-5" />}
                </div>
                <span className="text-[11px] text-[#69736D] tabular-nums font-mono">
                  {category.bookCount}+ বই
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#18211C] group-hover:text-[#176B48] transition-colors leading-snug">
                {category.name}
              </h3>
              
              <p className="mt-1 text-xs text-[#69736D] line-clamp-1">
                {category.description}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
