import React, { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../cart/CartProvider';

const BookDetailPopup = ({ book, onClose, isOpen }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const { addToCart } = useCart();
  const isOutOfStock = book.quantity < 1;

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

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

  const handleQuantityChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      if (newValue < 1) {
        setQuantity(1);
      } else if (newValue > book.quantity) {
        setQuantity(book.quantity);
      } else {
        setQuantity(newValue);
      }
    }
  };

  const handleQuantityBlur = () => {
    setIsEditing(false);
    if (isNaN(quantity) || quantity < 1) {
      setQuantity(1);
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
    handleClose();
  };

  if (!isOpen && !isAnimating) return null;

   return (
    <div
      className={`fixed inset-0 z-[98] flex items-center justify-center
                ${isAnimating ? '' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 backdrop-blur-[4px] bg-black/50 
                   ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 300ms ease-in-out' }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full h-full sm:h-auto flex items-center justify-center p-4">
        <div
          className={`relative bg-white dark:bg-background-secondary-dark rounded-lg 
                     w-full max-w-3xl max-h-[90vh] overflow-y-auto
                     shadow-xl border border-gray-200 dark:border-gray-800
                     transform transition-all duration-300 ease-out
                     ${isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header with Close Button */}
          <div className="sticky top-0 left-0 right-0 flex justify-end p-4 bg-white dark:bg-background-secondary-dark z-10">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 
                       dark:text-gray-400 dark:hover:text-gray-200
                       transition-colors duration-200"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content Container with Padding */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left column - Image and basic info */}
              <div className="flex-shrink-0 md:w-[200px]">
                <div className="w-full md:w-[200px] h-[280px] relative">
                  <img
                    src={book.cover}
                    alt={`Cover of ${book.title}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white break-words">
                    {book.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 break-words">
                    {book.author}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {book.categories?.map((category, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 
                                 text-gray-700 dark:text-gray-300 rounded-full
                                 break-words max-w-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - Overview and actions */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Overview
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                    {book.desc}
                  </p>
                </div>

                {/* Price and Add to Cart section */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      {!isOutOfStock && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleDecrement}
                            className={`p-1 rounded-full ${quantity <= 1
                              ? 'text-gray-600 cursor-not-allowed'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-100'
                              }`}
                            disabled={quantity <= 1}
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          {isEditing ? (
                            <input
                              type="number"
                              value={quantity}
                              onChange={handleQuantityChange}
                              onBlur={handleQuantityBlur}
                              className="w-16 text-center border rounded-md dark:bg-gray-800 dark:text-white"
                              min="1"
                              max={book.quantity}
                              autoFocus
                            />
                          ) : (
                            <span 
                              className="w-8 text-center text-gray-900 dark:text-white cursor-pointer"
                              onDoubleClick={() => setIsEditing(true)}
                            >
                              {quantity}
                            </span>
                          )}
                          <button
                            onClick={handleIncrement}
                            className={`p-1 rounded-full ${quantity >= book.quantity
                              ? 'text-gray-600 cursor-not-allowed'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-100'
                              }`}
                            disabled={quantity >= book.quantity}
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      <span className="text-lg font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {isOutOfStock ? 'Price per unit: ' : ''} ${(book.price * quantity).toFixed(2)} 
                      </span>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`px-6 py-2 rounded-lg transition-colors duration-200 w-full sm:w-auto
                                ${isOutOfStock 
                                  ? 'bg-gray-400 cursor-not-allowed text-white'
                                  : 'bg-primary-100 text-white hover:bg-primary-hover active:bg-primary-active'
                                }`}
                    >
                      {isOutOfStock ? 'Out of Stock' : 'Add to cart'}
                    </button>
                  </div>
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