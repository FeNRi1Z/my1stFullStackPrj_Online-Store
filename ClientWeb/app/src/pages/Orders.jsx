import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/Navbar';
import SideOrderNav from '../components/order/SideOrderNav';
import OrderHistory from '../components/order/OrderHistory';
import ProfileContent from '../components/profile/ProfileContent';
import CartModal from '../components/cart/CartModal';
import { useAuth } from '../components/auth/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from 'antd';

const Orders = () => {
  const { getAuthToken, logout } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const location = useLocation();
  const [activeView, setActiveView] = useState(
    location.state?.initialView || 'orders'
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleOrderCountUpdate = (count) => {
    setTotalOrderCount(count);
  };


  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      message.error('Please sign in to view orders');
      logout();
      navigate('/signin', { replace: true });
    }
  }, [getAuthToken, logout, navigate, message]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar
          onCartOpen={() => setIsCartOpen(true)}
          onViewChange={handleViewChange}
        />
      </div>

      <div className="flex pt-[60px]">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <SideOrderNav
            totalOrderCount={totalOrderCount}
            activeView={activeView}
            onNavigate={handleViewChange}
          />
        </div>

        <div className="flex-grow min-h-screen overflow-y-auto p-4 lg:p-8 lg:ml-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-text-dark dark:text-text-light mb-6">
              {activeView === 'orders' ? 'Order History' : 'Profile Information'}
            </h1>
            {activeView === 'orders' ? (
              <OrderHistory
                onOrderCountUpdate={handleOrderCountUpdate}
                getAuthToken={getAuthToken}
              />
            ) : (
              <ProfileContent onBack={() => setActiveView('orders')} />
            )}
          </div>
        </div>
      </div>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Orders;