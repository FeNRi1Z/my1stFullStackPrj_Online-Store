import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Package } from 'lucide-react';
import ScrollableTable from '../shared/ScrollableTable';
import config from '../../config';
import OrderModal from '../order/OrderModal';
import Dialog from '../layout/Dialog';
import axios from 'axios';

const OrderCard = ({ order, onUploadSlip, onCancel, onStatusChange, getAuthToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    orderId: null
  });

  if (!order) {
    return null;
  }


  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const cleanToken = token.replace('Bearer ', '');

      await axios.put(`${config.apiPath}/order/clientOrderUpdate`,
        {
          id: orderId,
          status: newStatus
        },
        {
          headers: {
            'Authorization': cleanToken,
            'Content-Type': 'application/json'
          }
        }
      );

      // Call onStatusChange if provided
      if (onStatusChange) {
        onStatusChange(orderId, newStatus);
      }

      // Call onCancel to refresh the order list
      if (onCancel) {
        await onCancel();
      }

      return true; // Return true on success

    } catch (error) {
      console.error('Error updating order status:', error);
      return false; // Return false on error
    }
  };

  const handleDialogClose = () => {
    setConfirmDialog({ isOpen: false, type: null, orderId: null });
    setShowSuccess(false);
    setCountdown(null);
    setIsModalOpen(false);
  };

  const handleConfirmAction = async () => {
    const { type, orderId } = confirmDialog;

    try {
      setIsLoading(true);
      let success = false;

      if (type === 'cancel') {
        success = await handleStatusUpdate(orderId, 'Cancelled');
      } else if (type === 'complete') {
        success = await handleStatusUpdate(orderId, 'Completed');
      }

      if (success) {
        setShowSuccess(true);
        setIsLoading(false);

        let timeLeft = 5;
        setCountdown(timeLeft);

        const countInterval = setInterval(() => {
          timeLeft -= 1;
          if (timeLeft <= 0) {
            clearInterval(countInterval);
            handleDialogClose();
          } else {
            setCountdown(timeLeft);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error in handleConfirmAction:', error);
      setIsLoading(false);
    }
  };



  const handleCancel = (e, orderId) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      type: 'cancel',
      orderId
    });
  };

  const handleComplete = (e, orderId) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      type: 'complete',
      orderId
    });
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "problem":
        return "bg-orange-500";
      case "shipped":
        return "bg-purple-500";
      case "paid":
        return "bg-lime-500";
      case "in progress":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default: // "to be paid"
        return "bg-yellow-500";
    }
  };

  const getStatusDisplay = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "Completed";
      case "problem":
        return "Problem";
      case "shipped":
        return "Shipped";
      case "in progress":
        return "In Progress";
      case "cancelled":
        return "Cancelled";
      case "paid":
        return "Paid";
      default:
        return "To be paid";
    }
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const getImageUrl = (item) => {
    if (imageErrors[item.productId]) {
      return '/placeholder-image.jpg';
    }
    if (item.img && item.img !== 'noIMGFile') {
      return `${config.apiPath}/uploads/product_img/${item.img}`;
    }
    return '/placeholder-image.jpg';
  };

  const orderItems = order.orderItems || [];
  const uniqueItemCount = orderItems.length;

  const handleCardClick = (e) => {
    if (e.target.tagName.toLowerCase() === 'button' ||
      e.target.closest('button')) {
      return;
    }
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    try {
      return dayjs(dateString).format("YYYY/MM/DD HH:mm:ss");
    } catch {
      return 'N/A';
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ?
      price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") :
      '0.00';
  };

  const isShipped = (order.status || '').toLowerCase() === 'shipped';

  return (
    <>
      <div
        className="bg-white dark:bg-background-secondary-dark rounded-lg p-4 mb-4 relative cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 ${getStatusColor(order.status)} text-white px-4 py-1 rounded-full text-sm font-medium`}>
          {getStatusDisplay(order.status)}
        </div>

        {/* Order Info */}
        <div className="mb-4 pr-32">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-light">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Order Date: {formatDate(order.orderDate)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Items: {uniqueItemCount} <br />
            Total: ${formatPrice(order.orderTotal)}
          </p>
          {order.address && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Shipping Address: {order.address}
            </p>
          )}
          {/* Parcel Code with Tracking number */}
          {isShipped && (
            <div className="mt-2">
              <a
                href={`https://track.thailandpost.com/?trackNumber=${order.parcelCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-100 hover:bg-primary-hover px-3 py-1 rounded-md transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Package className="h-4 w-4 text-text-dark dark:text-text-light" />
                <span className="text-sm font-medium text-text-dark dark:text-text-light">
                  Track your order: {order.parcelCode}
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {(order.status || '').toLowerCase() === 'to be paid' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadSlip(order.id);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
                disabled={isLoading}
              >
                Upload your slip
              </button>
              <button
                onClick={(e) => handleCancel(e, order.id)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
            </>
          )}
          {isShipped && (
            <button
              onClick={(e) => handleComplete(e, order.id)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
              disabled={isLoading}
            >
              Confirm Order
            </button>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Order Details #${order.id}`}
      >
        <ScrollableTable maxHeight="calc(90vh - 250px)">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-background-secondary-dark sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white w-1/2 lg:w-3/5">Product</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">Quantity</th>
                <th className="hidden sm:table-cell px-4 py-3 text-right font-medium text-gray-900 dark:text-white">Price</th>
                <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orderItems.map((item) => (
                <tr
                  key={item.productId}
                  className="hover:bg-gray-50 dark:hover:bg-background-secondary-dark"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 lg:w-24 lg:h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                        <img
                          src={getImageUrl(item)}
                          alt={item.name || 'Product'}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(item.productId)}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white line-clamp-2">
                          {item.name || 'Unnamed Product'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {item.author}
                        </p>
                        {item.categoriesName && item.categoriesName.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {item.categoriesName.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm sm:text-base">
                    {item.quantity}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-right text-sm sm:text-base">
                    ${item.productPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm sm:text-base">
                    ${item.totalPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-background-secondary-dark font-medium">
                <td colSpan="2" className="sm:hidden"></td>
                <td colSpan="3" className="hidden sm:table-cell"></td>
                <td className="px-4 py-3 text-right text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Total Amount: ${order.orderTotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollableTable>
      </OrderModal>
      <Dialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDialogClose} // Always allow closing
      >
        <div className="space-y-4">
          {!showSuccess ? (
            <>
              <h3 className="text-lg font-semibold">
                {confirmDialog.type === 'cancel'
                  ? 'Cancel Order'
                  : 'Complete Order'}
              </h3>
              <p>
                {confirmDialog.type === 'cancel'
                  ? 'Are you sure you want to cancel this order?'
                  : 'Are you sure you want to mark this order as completed?'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleDialogClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                  disabled={isLoading}
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 text-white rounded-md text-sm font-medium ${confirmDialog.type === 'cancel'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Yes, Confirm'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Success!
              </h3>
              <p className="text-gray-600">
                {confirmDialog.type === 'cancel'
                  ? 'Order has been cancelled'
                  : 'Order has been completed'}
              </p>
              {countdown && (
                <p className="text-gray-500 mt-2">
                  Closing in {countdown} seconds...
                </p>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default OrderCard;