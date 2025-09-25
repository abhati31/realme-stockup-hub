import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import DistributorWelcome from "@/components/dashboard/DistributorWelcome";
import OrderCreationOptions from "@/components/orders/OrderCreationOptions";
import QuickEntry from "@/components/orders/QuickEntry";
import BrowseProducts from "@/components/orders/BrowseProducts";
import OrderReview from "@/components/orders/OrderReview";
import OrderConfirmation from "@/components/orders/OrderConfirmation";
import InventoryDashboard from "@/components/inventory/InventoryDashboard";
import ReceiveStock from "@/components/inventory/ReceiveStock";
import DispatchOrders from "@/components/inventory/DispatchOrders";
import TransferStock from "@/components/inventory/TransferStock";
import LowStockAlerts from "@/components/inventory/LowStockAlerts";
import InventoryDetails from "@/components/inventory/InventoryDetails";
import OnboardingDashboard from "@/components/onboarding/OnboardingDashboard";
import VendorRegistrationForm from "@/components/onboarding/VendorRegistrationForm";
import ApplicationReview from "@/components/onboarding/ApplicationReview";
import AdminOrderManagement from "@/components/orders/AdminOrderManagement";
import DistributorsList from "@/components/distributors/DistributorsList";
import SalesAnalytics from "@/components/analytics/SalesAnalytics";
import ComplianceDashboard from "@/components/compliance/ComplianceDashboard";
import AccessControl from "@/components/access/AccessControl";

type ViewType = 'dashboard' | 'orderOptions' | 'quickEntry' | 'browse' | 'review' | 'confirmation' | 
                'inventory' | 'receiveStock' | 'dispatchOrders' | 'transferStock' | 'lowStockAlerts' | 'inventoryDetails' |
                'onboarding' | 'vendorRegistration' | 'applicationReview' | 'analytics' | 'settings' | 
                'distributors' | 'compliance' | 'access' | 'orders';

type UserRole = 'distributor' | 'admin';

interface OrderItem {
  sku: string;
  quantity: number;
  name: string;
  price: number;
}

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>('distributor');
  const [currentView, setCurrentView] = useState<ViewType>(userRole === 'admin' ? 'inventory' : 'dashboard');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderNumber, setOrderNumber] = useState('');

  // Handle role switching
  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    setCurrentView(newRole === 'admin' ? 'inventory' : 'dashboard');
    setOrderItems([]);
    setOrderNumber('');
  };

  const handleStartNewOrder = () => {
    setCurrentView('orderOptions');
  };

  const handleSelectOrderOption = (option: 'quick' | 'upload' | 'browse') => {
    if (option === 'quick') {
      setCurrentView('quickEntry');
    } else if (option === 'browse') {
      setCurrentView('browse');
    }
    // Upload option would be implemented later
  };

  const handleProceedToReview = (items: OrderItem[]) => {
    setOrderItems(items);
    setCurrentView('review');
  };

  const handleConfirmOrder = (orderData: { items: OrderItem[]; deliveryDate: string; paymentMethod: string }) => {
    // Generate order number
    const orderNum = `#ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setOrderNumber(orderNum);
    setCurrentView('confirmation');
  };

  const handleGoHome = () => {
    setCurrentView(userRole === 'admin' ? 'inventory' : 'dashboard');
    setOrderItems([]);
    setOrderNumber('');
  };

  // Inventory handlers
  const handleReceiveStock = () => setCurrentView('receiveStock');
  const handleDispatchOrders = () => setCurrentView('dispatchOrders');
  const handleTransferStock = () => setCurrentView('transferStock');
  const handleViewLowStock = () => setCurrentView('lowStockAlerts');

  const handleInventoryComplete = () => {
    setCurrentView('inventory');
  };
  const handleViewInventoryDetails = () => setCurrentView('inventoryDetails');

  // Onboarding handlers
  const handleViewApplication = (id: string) => setCurrentView('applicationReview');
  const handleCreateAccount = (id: string) => console.log('Creating account for', id);
  const handleOnboardingSubmit = (data: any) => {
    console.log('Application submitted:', data);
    setCurrentView('onboarding');
  };
  const handleStartNewApplication = () => setCurrentView('vendorRegistration');

  // View change handler
  const handleViewChange = (view: string) => {
    setCurrentView(view as ViewType);
  };

  const renderCurrentView = () => {
    // Distributor Views
    if (userRole === 'distributor') {
      switch (currentView) {
        case 'dashboard':
          return <DistributorWelcome onStartNewOrder={handleStartNewOrder} />;
        
        case 'orderOptions':
          return (
            <OrderCreationOptions
              onBack={() => setCurrentView('dashboard')}
              onSelectOption={handleSelectOrderOption}
            />
          );
        
        case 'quickEntry':
          return (
            <QuickEntry
              onBack={() => setCurrentView('orderOptions')}
              onProceed={handleProceedToReview}
            />
          );
        
        case 'browse':
          return (
            <BrowseProducts
              onBack={() => setCurrentView('orderOptions')}
              onProceed={handleProceedToReview}
            />
          );
        
        case 'review':
          return (
            <OrderReview
              items={orderItems}
              onBack={() => setCurrentView(orderItems.length > 0 ? 'quickEntry' : 'orderOptions')}
              onConfirm={handleConfirmOrder}
            />
          );
        
        case 'confirmation':
          return (
            <OrderConfirmation
              orderNumber={orderNumber}
              onGoHome={handleGoHome}
              onTrackOrder={() => {/* Track order functionality */}}
            />
          );
        
        default:
          return <DistributorWelcome onStartNewOrder={handleStartNewOrder} />;
      }
    }

    // Admin Views
    if (userRole === 'admin') {
      switch (currentView) {
        case 'inventory':
          return (
            <InventoryDashboard
              onReceiveStock={handleReceiveStock}
              onDispatchOrders={handleDispatchOrders}
              onTransferStock={handleTransferStock}
              onViewLowStock={handleViewLowStock}
              onViewInventoryDetails={handleViewInventoryDetails}
            />
          );
        case 'inventoryDetails':
          return (
            <InventoryDetails onBack={() => setCurrentView('inventory')} />
          );
        
        case 'receiveStock':
          return (
            <ReceiveStock
              onBack={() => setCurrentView('inventory')}
              onComplete={handleInventoryComplete}
            />
          );
        
        case 'dispatchOrders':
          return (
            <DispatchOrders
              onBack={() => setCurrentView('inventory')}
              onComplete={handleInventoryComplete}
            />
          );
        
        case 'transferStock':
          return (
            <TransferStock
              onBack={() => setCurrentView('inventory')}
              onComplete={handleInventoryComplete}
            />
          );
        
        case 'lowStockAlerts':
          return (
            <LowStockAlerts
              onBack={() => setCurrentView('inventory')}
              onReorder={handleInventoryComplete}
            />
          );
        
        case 'onboarding':
          return (
            <OnboardingDashboard
              onViewApplication={handleViewApplication}
              onCreateAccount={handleCreateAccount}
              onStartNewApplication={handleStartNewApplication}
            />
          );

        case 'distributors':
          return (
            <DistributorsList />
          );

        case 'orders':
          return (
            <AdminOrderManagement />
          );

        case 'analytics':
          return (
            <SalesAnalytics />
          );

        case 'compliance':
          return (
            <ComplianceDashboard />
          );
        case 'access':
          return (
            <AccessControl />
          );
        
        case 'vendorRegistration':
          return (
            <VendorRegistrationForm
              onBack={() => setCurrentView('onboarding')}
              onSubmit={handleOnboardingSubmit}
            />
          );
        
        case 'applicationReview':
          return (
            <ApplicationReview
              onBack={() => setCurrentView('onboarding')}
              onApprove={() => setCurrentView('onboarding')}
              onReject={() => setCurrentView('onboarding')}
              onRequestInfo={() => setCurrentView('onboarding')}
            />
          );
        
        default:
          return (
            <InventoryDashboard
              onReceiveStock={handleReceiveStock}
              onDispatchOrders={handleDispatchOrders}
              onTransferStock={handleTransferStock}
              onViewLowStock={handleViewLowStock}
            />
          );
      }
    }

    return <DistributorWelcome onStartNewOrder={handleStartNewOrder} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        userRole={userRole} 
        onRoleChange={handleRoleChange}
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {userRole === 'admin' ? (
          <div className="flex gap-6">
            <div className="hidden md:block shrink-0">
              <AdminSidebar currentView={currentView} onViewChange={handleViewChange} />
            </div>
            <main className="flex-1 py-8">
              {renderCurrentView()}
            </main>
          </div>
        ) : (
          <main className="py-8">
            {renderCurrentView()}
          </main>
        )}
      </div>
    </div>
  );
};

export default Index;