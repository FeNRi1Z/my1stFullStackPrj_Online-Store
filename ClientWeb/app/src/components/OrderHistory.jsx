import React, { useState, useEffect, useCallback } from 'react';
import OrderCard from './OrderCard';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { App } from 'antd';
import config from '../config';

const OrderHistory = ({ onOrderCountUpdate }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getAuthToken } = useAuth();
  const { message } = App.useApp();

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      const token = getAuthToken();
      if (!token) return;

      const cleanToken = token.replace('Bearer ', '');

      console.log('Fetching orders...'); 

      const response = await fetch(`${config.apiPath}/order/myOrderList`, {
        headers: {
          'Authorization': cleanToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        
        if (response.status === 401) {
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Orders received:', data);
      
      if (data && data.results && Array.isArray(data.results)) {
        setOrders(data.results);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      message.error(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [user, getAuthToken, message]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  useEffect(() => {
    onOrderCountUpdate(orders.length);
  }, [orders, onOrderCountUpdate]);

  const handleUploadSlip = async (orderId) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const cleanToken = token.replace('Bearer ', '');
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('img', file);

        const response = await fetch(`${config.apiPath}/order/uploadPaymentSlip`, {
          method: 'POST',
          headers: {
            'Authorization': cleanToken,
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload payment slip');
        }

        const data = await response.json();
        if (data.newName) {
          message.success('Payment slip uploaded successfully');
          await updateOrderPayment(orderId, data.newName);
        }
      };

      input.click();
    } catch (err) {
      console.error('Error handling upload:', err);
      message.error('Failed to upload payment slip');
    }
  };

  const updateOrderPayment = async (orderId, slipImage) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const cleanToken = token.replace('Bearer ', '');

      const response = await fetch(`${config.apiPath}/order/orderUpdate`, {
        method: 'PUT',
        headers: {
          'Authorization': cleanToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: orderId,
          status: 'Paid',
          paymentSlipIMG: slipImage,
          paymentDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      await fetchOrders();
      message.success('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order:', err);
      message.error('Failed to update order status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUploadSlip={handleUploadSlip}
            onCancel={() => {}}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 py-8">
          No orders found
        </div>
      )}
    </div>
  );
};

export default OrderHistory;