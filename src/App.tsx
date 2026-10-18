import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { SupportPolicyModal } from './components/common/SupportPolicyModal';
import { AuthModal } from './components/common/AuthModal';

// Home Sections
import { HeroSection } from './components/home/HeroSection';
import { CategorySection } from './components/home/CategorySection';
import { BestsellerSection } from './components/home/BestsellerSection';
import { NewArrivalSection } from './components/home/NewArrivalSection';
import { SpecialCollectionsSection } from './components/home/SpecialCollectionsSection';
import { PromoBannerSection } from './components/home/PromoBannerSection';
import { FeatureStrip } from './components/home/FeatureStrip';
import { RecentlyViewedSection } from './components/home/RecentlyViewedSection';

// Dedicated Views
import { CatalogPage } from './components/catalog/CatalogPage';
import { BookDetailsView } from './components/details/BookDetailsView';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { AccountPage } from './components/account/AccountPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentView } = useStore();

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#F6F8F6]">
        <AdminDashboard />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#18211C]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Header & Search */}
      <Header />

      {/* 3. Main Dynamic Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* C. Hero Section */}
            <HeroSection />

            {/* D. Popular Categories */}
            <CategorySection />

            {/* E. Bestselling Books */}
            <BestsellerSection />

            {/* F. New Arrivals */}
            <NewArrivalSection />

            {/* G. Special Collections */}
            <SpecialCollectionsSection />

            {/* H. Promotional Banner */}
            <PromoBannerSection />

            {/* I. Recently Viewed Books (if any) */}
            <RecentlyViewedSection />

            {/* J. Reader-friendly Information Strip */}
            <FeatureStrip />
          </>
        )}

        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'book-details' && <BookDetailsView />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'account' && <AccountPage />}
      </main>

      {/* J. Footer */}
      <Footer />

      {/* Mobile Bottom Navigation for Thumb Reachability */}
      <MobileBottomNav />

      {/* Instant Notification Toast */}
      <Toast />

      {/* Support & Policy Modal */}
      <SupportPolicyModal />

      {/* Quick Sign In / Sign Up Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
