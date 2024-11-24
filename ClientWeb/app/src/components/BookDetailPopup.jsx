import React, { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from './CartProvider';

const BookDetailPopup = ({ book, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleIncrement = () => {
    if (quantity < book.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      price: book.price,
      quantity: quantity,
      totalPrice: book.price * quantity,
      maxQuantity: book.quantity
    };

    addToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="relative bg-white dark:bg-background-secondary-dark rounded-lg w-full max-w-3xl 
                    shadow-xl border border-gray-200 dark:border-gray-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                   transition-colors duration-200"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Content Container */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left side - Book cover and basic info */}
            <div className="flex flex-col sm:flex-shrink-0 items-center sm:items-start">
              <div className="relative w-[180px] h-[250px] sm:w-[200px] sm:h-[280px] shadow-lg rounded-lg overflow-hidden">
                <img
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center sm:text-left space-y-1 w-full">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {book.author}
                </p>
              </div>
            </div>

            {/* Right side - Description and purchase options */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Description */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {book.desc}
                </p>
              </div>

              {/* Purchase section */}
              <div className="mt-6 pt-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={handleDecrement}
                        className={`p-1.5 rounded-md transition-colors duration-200 ${
                          quantity <= 1 
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-gray-900 dark:text-white font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        className={`p-1.5 rounded-md transition-colors duration-200 ${
                          quantity >= book.quantity 
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        disabled={quantity >= book.quantity}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${(book.price * quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Add to cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto px-6 py-2.5 bg-primary-100 text-white rounded-lg 
                             hover:bg-primary-hover active:bg-primary-active transition-colors duration-200
                             font-medium text-sm sm:text-base"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPopup;