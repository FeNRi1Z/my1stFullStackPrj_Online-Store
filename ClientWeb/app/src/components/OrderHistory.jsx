import React, { useState, useEffect } from 'react';
import NavBar from '../components/Navbar.jsx';
import SideOrderNav from './SideOrderNav';
import OrderCard from './OrderCard';
import { useTheme } from '../components/ThemeProvider';
import { Loader2 } from 'lucide-react';
import { message } from 'antd';
import config from "../../config";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(config.apiPath + '/order/orderList', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.results);
    } catch (error) {
      message.error('Failed to load order history');
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
              </div>
            ) : (
              <>
                <p className="text-sm text-secondary-50 dark:text-text-disabled mb-6">
                  {orders.length} orders
                </p>

                {/* Order Cards */}
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center text-text-disabled dark:text-text-disabled py-8">
                    No orders found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;