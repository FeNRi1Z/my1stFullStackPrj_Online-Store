import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Package} from 'lucide-react';
import ScrollableTable from './ScrollableTable';
import config from '../config';
import OrderModal from '../components/OrderModal'


const OrderCard = ({ order, onUploadSlip, onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  if (!order) {
    return null;
  }

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'shipped':
        return 'bg-purple-500';
      case 'paid':
        return 'bg-green-500'
      case 'in progress':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default: // "to be paid"
        return 'bg-yellow-500';
    }
  };

  const getStatusDisplay = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'shipped':
        return 'Shipped';
      case 'in progress':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      case 'paid':
        return 'Paid';
      default:
        return 'To be paid';
    }
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const generateTrackingNumber = () => {
    return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
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
      return format(new Date(dateString), 'dd/MM/yy');
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
  const trackingNumber = generateTrackingNumber()

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
            Order Date: {formatDate(order.createdAt)}
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
          {isShipped && trackingNumber && (
            <div className="mt-2">
              <a
                href={`https://track.thailandpost.com/?trackNumber=${trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-100 hover:bg-primary-hover px-3 py-1 rounded-md transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Package className="h-4 w-4 text-text-dark dark:text-text-light" />
                <span className="text-sm font-medium text-text-dark dark:text-text-light">
                  Parcel: {order.parcelCode} | Track Your Order {trackingNumber}
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {(order.status || '').toLowerCase() === 'to be paid' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUploadSlip(order.id);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Upload your slip
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel(order.id);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

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
    </>
  );
};

export default OrderCard;