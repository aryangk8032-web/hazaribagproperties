import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { PropertiesView } from './components/views/PropertiesView';
import { PropertyDetailView } from './components/views/PropertyDetailView';
import { LocalityView } from './components/views/LocalityView';
import { GuidesView } from './components/views/GuidesView';
import { GuideDetailView } from './components/views/GuideDetailView';
import { CategorySEOView } from './components/views/CategorySEOView';
import { AddPropertyWizard } from './components/views/AddPropertyWizard';
import { SellerDashboard } from './components/views/SellerDashboard';
import { AdminDashboard } from './components/views/AdminDashboard';

import { VerificationModal } from './components/common/VerificationModal';
import { UnitConverterModal } from './components/common/UnitConverterModal';
import { SiteVisitModal } from './components/common/SiteVisitModal';
import { InquiryModal } from './components/common/InquiryModal';
import { AuthModal } from './components/common/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { currentPath } = useApp();

  // Route Dispatcher
  const renderCurrentRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomeView />;
    }

    // 2. Search / All Properties
    if (currentPath === '/properties') {
      return <PropertiesView />;
    }

    // 3. Property Details: /property/:slug
    if (currentPath.startsWith('/property/')) {
      const slug = currentPath.replace('/property/', '');
      return <PropertyDetailView slug={slug} />;
    }

    // 4. Locality: /locality/:slug
    if (currentPath.startsWith('/locality/')) {
      const slug = currentPath.replace('/locality/', '');
      return <LocalityView slug={slug} />;
    }

    // 5. Guides Detail: /property-guides/:slug
    if (currentPath.startsWith('/property-guides/')) {
      const slug = currentPath.replace('/property-guides/', '');
      return <GuideDetailView slug={slug} />;
    }

    // 6. Guides Index: /property-guides
    if (currentPath === '/property-guides') {
      return <GuidesView />;
    }

    // 7. Curated Category SEO Views
    if (currentPath === '/plots-for-sale-in-hazaribagh') {
      return <CategorySEOView categoryKey="plots" />;
    }
    if (currentPath === '/flats-for-sale-in-hazaribagh') {
      return <CategorySEOView categoryKey="flats" />;
    }
    if (currentPath === '/houses-for-sale-in-hazaribagh') {
      return <CategorySEOView categoryKey="houses" />;
    }
    if (currentPath === '/commercial-property-in-hazaribagh') {
      return <CategorySEOView categoryKey="commercial" />;
    }
    if (currentPath === '/property-for-rent-in-hazaribagh') {
      return <CategorySEOView categoryKey="rentals" />;
    }

    // 8. Add Property / List Property Wizard
    if (currentPath === '/list-property') {
      return <AddPropertyWizard />;
    }

    // 9. Seller Dashboard
    if (currentPath === '/dashboard') {
      return <SellerDashboard />;
    }

    // 10. Admin Verification Desk
    if (currentPath === '/admin') {
      return <AdminDashboard />;
    }

    // Fallback: Home
    return <HomeView />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Global Navbar */}
      <Header />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderCurrentRoute()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      <VerificationModal />
      <UnitConverterModal />
      <SiteVisitModal />
      <InquiryModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
