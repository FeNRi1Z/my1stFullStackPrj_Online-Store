import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full mx-4 relative 
                    shadow-xl border border-gray-200 dark:border-gray-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
                   dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Book cover and basic info */}
          <div className="flex-shrink-0">
            <div className="w-[200px] h-[280px] relative">
              <img
                src={book.cover}
                alt={`Cover of ${book.title}`}
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="mt-4 space-y-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {book.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {book.author}
              </p>
            </div>
          </div>

          {/* Right side - Description and purchase options */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Overview
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {book.desc}
              </p>
            </div>

            {/* Purchase controls */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDecrement}
                      className={`p-1 rounded-full ${
                        quantity <= 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-8 text-center text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className={`p-1 rounded-full ${
                        quantity >= book.quantity 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      disabled={quantity >= book.quantity}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Price */}
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${(book.price * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-primary-100 text-white rounded-lg hover:bg-primary-hover active:bg-primary-active
                           transition-colors duration-200"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPopup;