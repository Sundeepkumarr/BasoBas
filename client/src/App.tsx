import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/stores/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AIChatbot from '@/components/AIChatbot';

// Pages
import LandingPage from '@/features/landing/LandingPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/features/auth/AuthPages';
import PropertyListingPage from '@/features/properties/PropertyListingPage';
import PropertyDetailsPage from '@/features/properties/PropertyDetailsPage';
import ChatPage from '@/features/chat/ChatPage';
import FinancePage from '@/features/finance/FinancePage';
import { OwnerDashboard, BuyerDashboard, AdminDashboard } from '@/features/dashboard/DashboardPages';
import AddPropertyPage from '@/features/dashboard/AddPropertyPage';
import EditPropertyPage from '@/features/dashboard/EditPropertyPage';
import { AboutPage, ServicesPage, ContactPage, FAQPage, BlogPage, WishlistPage, ProfilePage, SettingsPage, PricingPage, PrivacyPage, TermsPage, NotificationsPage } from '@/features/pages/StaticPages';

// Layout Wrapper
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
    <AIChatbot />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', borderRadius: '12px' } }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route path="/properties" element={<MainLayout><PropertyListingPage /></MainLayout>} />
          <Route path="/properties/:id" element={<MainLayout><PropertyDetailsPage /></MainLayout>} />
          <Route path="/finance" element={<MainLayout><FinancePage /></MainLayout>} />
          <Route path="/chat" element={<MainLayout><ChatPage /></MainLayout>} />

          {/* Static Pages */}
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/services" element={<MainLayout><ServicesPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/faq" element={<MainLayout><FAQPage /></MainLayout>} />
          <Route path="/blog" element={<MainLayout><BlogPage /></MainLayout>} />
          <Route path="/pricing" element={<MainLayout><PricingPage /></MainLayout>} />
          <Route path="/privacy" element={<MainLayout><PrivacyPage /></MainLayout>} />
          <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />

          {/* User Routes (Protected in real app) */}
          <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
          <Route path="/notifications" element={<MainLayout><NotificationsPage /></MainLayout>} />
          
          <Route path="/dashboard/buyer" element={<MainLayout><BuyerDashboard /></MainLayout>} />
          <Route path="/dashboard/owner" element={<MainLayout><OwnerDashboard /></MainLayout>} />
          <Route path="/dashboard/owner/add-property" element={<MainLayout><AddPropertyPage /></MainLayout>} />
          <Route path="/dashboard/owner/edit-property/:id" element={<MainLayout><EditPropertyPage /></MainLayout>} />
          <Route path="/dashboard/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
