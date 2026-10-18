import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Image as ImageIcon, 
  Upload, 
  AlertCircle,
  Eye,
  RotateCcw
} from 'lucide-react';
import { Book, PreviewPageItem } from '../../types';

interface BookPageGalleryProps {
  book: Book;
  onAddLocalPreview?: (newItem: PreviewPageItem) => void;
}

export const BookPageGallery: React.FC<BookPageGalleryProps> = ({ book }) => {
  // Local temporary preview pages for testing uploads in frontend phase
  const [localCustomPages, setLocalCustomPages] = useState<PreviewPageItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine standard book preview images with any temporary uploaded local pages
  const combinedPages: PreviewPageItem[] = React.useMemo(() => {
    const list: PreviewPageItem[] = [];
    if (book.previewImages && book.previewImages.length > 0) {
      book.previewImages.forEach((url, idx) => {
        const label = book.previewLabels && book.previewLabels[idx]
          ? book.previewLabels[idx]
          : idx === 0 ? 'সূচিপত্র' : `নমুনা পৃষ্ঠা ${idx}`;
        list.push({
          id: `${book.id}-preview-${idx}`,
          url,
          label,
          isCustomUpload: false,
        });
      });
    }

    // Add local uploaded pages for this specific book
    localCustomPages.forEach((item) => {
      list.push(item);
    });

    return list;
  }, [book.previewImages, book.previewLabels, book.id, localCustomPages]);

  // Reset page index and custom uploads if book changes
  useEffect(() => {
    setActivePageIndex(0);
    setLightboxOpen(false);
    setIsZoomed(false);
    setLocalCustomPages([]);
    setImageErrors({});
  }, [book.id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActivePageIndex((prev) => (prev < combinedPages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActivePageIndex((prev) => (prev > 0 ? prev - 1 : combinedPages.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, combinedPages.length]);

  const handleOpenLightbox = (index: number) => {
    setActivePageIndex(index);
    setIsZoomed(false);
    setLightboxOpen(true);
  };

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    setActivePageIndex((prev) => (prev > 0 ? prev - 1 : combinedPages.length - 1));
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    setActivePageIndex((prev) => (prev < combinedPages.length - 1 ? prev + 1 : 0));
  };

  // Local file upload handler for testing scans/images in frontend
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const resultUrl = loadEvent.target?.result as string;
        if (resultUrl) {
          const newLabel = `লোকাল স্ক্যান ${localCustomPages.length + idx + 1} (অস্থায়ী)`;
          setLocalCustomPages((prev) => [
            ...prev,
            {
              id: `custom-${Date.now()}-${idx}`,
              url: resultUrl,
              label: newLabel,
              isCustomUpload: true,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activePage = combinedPages[activePageIndex];

  return (
    <section className="mt-12 pt-10 border-t border-[#E5EAE6]" aria-labelledby="interior-preview-heading">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#176B48] mb-1">
            <BookOpen className="w-4 h-4 text-[#176B48]" />
            <span>বইয়ের নমুনা অংশ</span>
            {combinedPages.length > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#E8F3EE] text-[#104D36] font-bold tabular-nums">
                {combinedPages.length} টি পৃষ্ঠা
              </span>
            )}
          </div>
          <h2 id="interior-preview-heading" className="text-xl sm:text-2xl font-bold text-[#18211C] tracking-tight">
            বইয়ের ভেতরের কিছু পৃষ্ঠা
          </h2>
          <p className="text-xs text-[#69736D] mt-0.5">
            বইটি সংগ্রহের পূর্বে সূচিপত্র ও নির্বাচিত পাতার পাঠযোগ্য নমুনা দেখে নিন
          </p>
        </div>

        {/* Temporary Local Scan Uploader for Testing Frontend Scans */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLocalFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6F8F6] hover:bg-white text-xs font-semibold text-[#18211C] border border-[#E5EAE6] hover:border-[#176B48] rounded-xl transition-all cursor-pointer shadow-2xs"
            title="কম্পিউটার বা মোবাইল থেকে নমুনা পাতার ছবি যোগ করুন"
          >
            <Upload className="w-3.5 h-3.5 text-[#176B48]" />
            <span>নমুনা পাতা টেস্ট করুন</span>
          </button>

          {localCustomPages.length > 0 && (
            <button
              type="button"
              onClick={() => setLocalCustomPages([])}
              className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="লোকাল প্রিভিউ ছবি মুছুন"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Temporary Upload Disclaimer if user added local files */}
      {localCustomPages.length > 0 && (
        <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>অস্থায়ী ব্রাউজার প্রিভিউ:</strong> আপনার আপলোড করা নমুনা ছবি শুধুমাত্র এই ব্রাউজার সেশনে দেখার জন্য। পেজ রিফ্রেশ করলে এটি স্বয়ংক্রিয়ভাবে মুছে যাবে।
          </span>
        </div>
      )}

      {/* Thumbnails Grid or Empty State */}
      {combinedPages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {combinedPages.map((page, idx) => {
            const isFailed = imageErrors[page.id];

            return (
              <button
                type="button"
                key={page.id}
                onClick={() => handleOpenLightbox(idx)}
                className="group text-left relative flex flex-col bg-white rounded-xl border border-[#E5EAE6] hover:border-[#176B48] p-2.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#176B48]"
                aria-label={`${book.title} - ${page.label} বড় করে দেখুন`}
              >
                {/* Thumbnail Preview Area with Book Aspect Ratio */}
                <div 
                  className="relative w-full overflow-hidden rounded-lg bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center p-2"
                  style={{ aspectRatio: '3/4' }}
                >
                  {isFailed ? (
                    <div className="flex flex-col items-center justify-center text-center p-4 text-[#69736D]">
                      <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-xs font-semibold text-[#18211C]">{page.label}</span>
                      <span className="text-[10px] text-gray-500 mt-1">ছবি লোড হতে ব্যর্থ</span>
                    </div>
                  ) : (
                    <img
                      src={page.url}
                      alt={`${book.title} - ${page.label}`}
                      onError={() => setImageErrors((prev) => ({ ...prev, [page.id]: true }))}
                      className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-300 group-hover:scale-102"
                      loading="lazy"
                    />
                  )}

                  {/* Hover Overlay with Eye Icon */}
                  <div className="absolute inset-0 bg-[#104D36]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs rounded-lg">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#104D36] text-xs font-bold rounded-lg shadow-md">
                      <Eye className="w-3.5 h-3.5" />
                      <span>বড় করে দেখুন</span>
                    </div>
                  </div>

                  {/* Indicator if this is a temporary upload */}
                  {page.isCustomUpload && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      লোকাল
                    </span>
                  )}
                </div>

                {/* Page Label & Index */}
                <div className="pt-2.5 px-1 flex items-center justify-between text-xs w-full">
                  <span className="font-semibold text-[#18211C] group-hover:text-[#176B48] truncate transition-colors">
                    {page.label}
                  </span>
                  <span className="text-[11px] text-[#69736D] tabular-nums font-mono shrink-0 ml-1">
                    #{idx + 1}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Empty state when book has no interior images */
        <div className="p-8 rounded-2xl bg-[#F6F8F6] border border-[#E5EAE6] text-center">
          <div className="w-12 h-12 rounded-xl bg-white text-[#69736D] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#18211C] mb-1">
            কোনো নমুনা পৃষ্ঠা যুক্ত করা হয়নি
          </h3>
          <p className="text-xs text-[#69736D] max-w-md mx-auto mb-4 leading-relaxed">
            এই বইটির ভেতরের পাতার নমুনা স্ক্যান এখনও প্রস্তুত করা হয়নি। আপনি চাইলে আপনার ডিভাইস থেকে কোনো স্ক্যান ছবি যুক্ত করে প্রিভিউ টেস্ট করতে পারেন।
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-xs font-semibold text-[#176B48] border border-[#176B48] rounded-xl transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>নমুনা পাতা টেস্ট করুন</span>
          </button>
        </div>
      )}

      {/* Lightbox Modal Reader */}
      {lightboxOpen && activePage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Lightbox Top Control Bar */}
          <div 
            className="flex items-center justify-between gap-4 text-white pb-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 truncate">
              <span className="text-sm font-bold text-emerald-400 truncate">
                {book.title}
              </span>
              <span className="text-white/40">/</span>
              <span className="text-xs text-white/90 font-medium truncate">
                {activePage.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/15 text-white/90 font-mono tabular-nums">
                {activePageIndex + 1} / {combinedPages.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Toggle */}
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                title={isZoomed ? 'স্বাভাবিক মাপ' : 'জুম করুন'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                <span className="hidden sm:inline">{isZoomed ? 'জুম আউট' : 'জুম ইন'}</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                title="বন্ধ করুন (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Middle Content Area (Maximized text legibility) */}
          <div 
            className="flex-1 relative flex items-center justify-center my-3 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            {combinedPages.length > 1 && (
              <button
                type="button"
                onClick={handlePrevPage}
                className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer backdrop-blur-xs border border-white/20 shadow-xl"
                aria-label="পূর্ববর্তী পৃষ্ঠা"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Displayed Page Image with Crisp Contrast */}
            <div 
              className={`max-w-4xl max-h-[75vh] transition-transform duration-200 rounded-lg shadow-2xl bg-white p-2 sm:p-4 overflow-auto ${
                isZoomed ? 'scale-130 sm:scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={activePage.url}
                alt={`${book.title} - ${activePage.label}`}
                className="max-h-[68vh] w-auto mx-auto object-contain select-none"
              />
            </div>

            {/* Next Button */}
            {combinedPages.length > 1 && (
              <button
                type="button"
                onClick={handleNextPage}
                className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer backdrop-blur-xs border border-white/20 shadow-xl"
                aria-label="পরবর্তী পৃষ্ঠা"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Strip: Thumbnails Preview for Fast Jumping */}
          <div 
            className="flex items-center justify-center gap-2 pt-2 overflow-x-auto max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {combinedPages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => {
                  setActivePageIndex(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-12 h-16 rounded border-2 overflow-hidden transition-all shrink-0 cursor-pointer ${
                  activePageIndex === idx
                    ? 'border-emerald-400 scale-105 shadow-md'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
                title={page.label}
              >
                <img
                  src={page.url}
                  alt={page.label}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
