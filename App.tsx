
import React, { useState, useEffect, useCallback } from 'react';
import Login from './screens/Login';
import Layout from './components/Layout';
import AdminDashboard from './screens/AdminDashboard';
import AdminProducts from './screens/AdminProducts';
import AdminOrders from './screens/AdminOrders';
import AdminCustomers from './screens/AdminCustomers';
import AdminStoreProfile from './screens/AdminStoreProfile';
import AdminCategories from './screens/AdminCategories';
import CustomerStorefront from './screens/CustomerStorefront';
import CustomerCart from './screens/CustomerCart';
import CustomerOrderHistory from './screens/CustomerOrderHistory';
import ProductDetails from './screens/ProductDetails';
import CustomerProfile from './screens/CustomerProfile';
import Toast, { ToastType } from './components/Toast';
import { UserRole } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | 'GUEST'>('GUEST');
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    const savedRole = localStorage.getItem('afriauto_role');
    if (savedRole) {
      setUserRole(savedRole as UserRole);
      setIsAuthenticated(true);
      setActiveTab(savedRole === UserRole.ADMIN ? 'dashboard' : 'home');
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    localStorage.setItem('afriauto_role', role);
    setUserRole(role);
    setIsAuthenticated(true);
    setShowLogin(false);
    setActiveTab(role === UserRole.ADMIN ? 'dashboard' : 'home');
    showToast(`Identity confirmed as ${role.toLowerCase()}`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('afriauto_role');
    setIsAuthenticated(false);
    setUserRole('GUEST');
    setActiveTab('home');
    setSelectedProductId(null);
    showToast('Session terminated successfully', 'info');
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setActiveTab('product-details');
  };

  if (showLogin) {
    return <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />;
  }

  return (
    <>
      <Layout 
        role={userRole} 
        onLogout={handleLogout} 
        onLoginRequest={() => setShowLogin(true)}
        activeTab={activeTab === 'product-details' ? 'catalog' : activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedProductId(null);
        }}
      >
        {userRole === UserRole.ADMIN ? (
          <>
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'store-profile' && <AdminStoreProfile />}
            {activeTab === 'categories' && <AdminCategories />}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'featured-products' && <AdminProducts />}
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'customers' && <AdminCustomers />}
            {activeTab === 'reports' && <AdminDashboard />}
            {activeTab === 'notifications' && <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">WhatsApp Log Stream Enabled</div>}
          </>
        ) : (
          <>
            {activeTab === 'home' && (
              <CustomerStorefront 
                onAddToCart={(name) => {
                  if (!isAuthenticated) {
                    setShowLogin(true);
                  } else {
                    showToast(`${name} added to your basket`, 'success');
                  }
                }} 
                onViewProduct={navigateToProduct}
              />
            )}
            {activeTab === 'catalog' && (
              <CustomerStorefront 
                onAddToCart={(name) => {
                  if (!isAuthenticated) {
                    setShowLogin(true);
                  } else {
                    showToast(`${name} added to your basket`, 'success');
                  }
                }} 
                onViewProduct={navigateToProduct}
              />
            )}
            {activeTab === 'featured' && (
              <CustomerStorefront 
                onAddToCart={(name) => {
                  if (!isAuthenticated) {
                    setShowLogin(true);
                  } else {
                    showToast(`${name} added to your basket`, 'success');
                  }
                }} 
                onViewProduct={navigateToProduct}
              />
            )}
            {activeTab === 'product-details' && selectedProductId && (
              <ProductDetails 
                productId={selectedProductId} 
                onBack={() => setActiveTab('catalog')} 
                onAddToCart={(name) => {
                  if (!isAuthenticated) {
                    setShowLogin(true);
                  } else {
                    showToast(`${name} added to your basket`, 'success');
                  }
                }}
                onViewProduct={navigateToProduct}
              />
            )}
            {activeTab === 'cart' && (
              <CustomerCart 
                onCheckoutRequest={() => isAuthenticated ? null : setShowLogin(true)} 
                showToast={showToast}
              />
            )}
            {activeTab === 'my-orders' && (isAuthenticated ? <CustomerOrderHistory /> : <div className="text-center py-20"><p className="text-slate-500 font-bold mb-4">Login to view order history</p><button onClick={() => setShowLogin(true)} className="bg-blue-600 text-white px-8 py-3 rounded-[24px] font-black h-16 flex items-center justify-center mx-auto w-48 shadow-xl shadow-blue-500/20">Sign In</button></div>)}
            {activeTab === 'my-profile' && (
              isAuthenticated ? (
                <CustomerProfile onLogout={handleLogout} showToast={showToast} />
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-500 font-bold mb-4">Login to view profile</p>
                  <button onClick={() => setShowLogin(true)} className="bg-blue-600 text-white px-8 py-3 rounded-[24px] font-black h-16 flex items-center justify-center mx-auto w-48 shadow-xl shadow-blue-500/20">Sign In</button>
                </div>
              )
            )}
          </>
        )}
      </Layout>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
};

export default App;
