import React, { useState } from 'react';
import NavBar from '../components/Navbar.jsx';
import SideOrderNav from './SideOrderNav';
import OrderCard from './OrderCard';
import { mockOrders } from '../assets/mockData';
import { useTheme } from '../components/ThemeProvider';

const OrderHistory = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar
          onMenuClick={() => setIsSideNavOpen(true)}
        />
      </div>

      <div className="flex pt-[60px]">
        {/* Side Navigation - Only visible on large screens */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <SideOrderNav />
        </div>

        {/* Main Content */}
        <div className="flex-grow min-h-screen overflow-y-auto p-4 lg:p-8 lg:ml-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-text-dark dark:text-text-light mb-6">
              Order history
            </h1>
            <p className="text-sm text-secondary-50 dark:text-text-disabled mb-6">
              {mockOrders.length} orders
            </p>

            {/* Order Cards */}
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;