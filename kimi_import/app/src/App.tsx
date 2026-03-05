import { useStore } from '@/store';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { CreatorLayout } from '@/layouts/CreatorLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { AutomationPage } from '@/pages/AutomationPage';
import { WhatsAppPage } from '@/pages/WhatsAppPage';
import { SocialMediaPage } from '@/pages/SocialMediaPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import { CreatorDashboard } from '@/pages/creator/CreatorDashboard';
import { ScriptGenerator } from '@/pages/creator/ScriptGenerator';
import { VideoGenerator } from '@/pages/creator/VideoGenerator';
import { VoiceGenerator } from '@/pages/creator/VoiceGenerator';
import { CreatorScheduler } from '@/pages/creator/CreatorScheduler';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminSubscriptions } from '@/pages/admin/AdminSubscriptions';
import { AdminPayments } from '@/pages/admin/AdminPayments';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  const { isAuthenticated, user, currentPage } = useStore();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  const role = user?.role || 'vendor';

  // Vendor Routes
  if (role === 'vendor') {
    const renderVendorPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <DashboardPage />;
        case 'products':
          return <ProductsPage />;
        case 'orders':
          return <OrdersPage />;
        case 'automation':
          return <AutomationPage />;
        case 'whatsapp':
          return <WhatsAppPage />;
        case 'social-media':
          return <SocialMediaPage />;
        case 'analytics':
          return <AnalyticsPage />;
        case 'settings':
          return <SettingsPage />;
        case 'subscription':
          return <SubscriptionPage />;
        default:
          return <DashboardPage />;
      }
    };

    return (
      <DashboardLayout>
        {renderVendorPage()}
        <Toaster position="top-right" richColors />
      </DashboardLayout>
    );
  }

  // Creator Routes
  if (role === 'creator') {
    const renderCreatorPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <CreatorDashboard />;
        case 'scripts':
          return <ScriptGenerator />;
        case 'videos':
          return <VideoGenerator />;
        case 'voices':
          return <VoiceGenerator />;
        case 'scheduler':
          return <CreatorScheduler />;
        case 'social-media':
          return <SocialMediaPage />;
        case 'analytics':
          return <AnalyticsPage />;
        case 'settings':
          return <SettingsPage />;
        case 'subscription':
          return <SubscriptionPage />;
        default:
          return <CreatorDashboard />;
      }
    };

    return (
      <CreatorLayout>
        {renderCreatorPage()}
        <Toaster position="top-right" richColors />
      </CreatorLayout>
    );
  }

  // Admin Routes
  if (role === 'admin') {
    const renderAdminPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'users':
        case 'vendors':
        case 'creators':
          return <AdminUsers />;
        case 'subscriptions':
          return <AdminSubscriptions />;
        case 'payments':
          return <AdminPayments />;
        case 'orders':
          return <OrdersPage />;
        case 'analytics':
          return <AnalyticsPage />;
        case 'settings':
          return <SettingsPage />;
        default:
          return <AdminDashboard />;
      }
    };

    return (
      <AdminLayout>
        {renderAdminPage()}
        <Toaster position="top-right" richColors />
      </AdminLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardPage />
      <Toaster position="top-right" richColors />
    </DashboardLayout>
  );
}

export default App;
