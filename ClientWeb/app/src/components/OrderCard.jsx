import React from 'react';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'dispatched':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-background-secondary-dark rounded-lg p-4 mb-4">
      <div className="flex items-center text-sm text-secondary-50 dark:text-text-disabled mb-3">
        <span className="flex items-center">
          <span className={`w-2 h-2 ${getStatusColor(order.status)} rounded-full mr-2`}></span>
          {order.status}
        </span>
        {order.deliveryDate && (
          <span className="ml-2">
            on {order.deliveryDate}
          </span>
        )}
      </div>

      {order.items.map((item) => (
        <div key={item.id} className="flex items-center py-2 border-b last:border-b-0 border-gray-100 dark:border-background-dark">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="ml-4 flex-grow">
            <h4 className="text-sm font-medium text-text-dark dark:text-text-light">
              {item.name}
            </h4>
            {item.deliveryTime && (
              <p className="text-sm text-secondary-50 dark:text-text-disabled">
                {item.deliveryTime} ({item.timeWindow})
              </p>
            )}
          </div>
        </div>
      ))}

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="px-4 py-2 text-primary-100 hover:bg-gray-50 dark:hover:bg-background-dark rounded-md transition-colors">
          View order details
        </button>
        <button className="px-4 py-2 text-primary-100 hover:bg-gray-50 dark:hover:bg-background-dark rounded-md transition-colors">
          Get invoice
        </button>
        <button className="px-4 py-2 text-primary-100 hover:bg-gray-50 dark:hover:bg-background-dark rounded-md transition-colors">
          Edit order
        </button>
      </div>
    </div>
  );
};

export default OrderCard;