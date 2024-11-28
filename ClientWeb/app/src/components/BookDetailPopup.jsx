import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCart } from './CartProvider';

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
      <div
        className={`fixed inset-0 backdrop-blur-[4px] bg-black/50 
                   ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 300ms ease-in-out' }}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`relative bg-white dark:bg-background-secondary-dark rounded-lg p-6 max-w-3xl w-full mx-4 
                  shadow-xl border border-gray-200 dark:border-gray-800
                  transform transition-all duration-300 ease-out
                  ${isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
                   dark:text-gray-400 dark:hover:text-gray-200
                   transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-6">
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
              {/* Update category rendering to use categories array directly */}
              <div className="flex flex-wrap gap-2 mt-2">
                {book.categories?.map((category, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 
                             text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Overview
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {book.desc}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {isOutOfStock ? (
                    <span className="text-lg font-semibold text-text-dark dark:text-text-light">Price per unit:</span>
                  ) : (
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

                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${(book.price * quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`px-6 py-2 rounded-lg transition-colors duration-200
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
  );
};

export default BookDetailPopup;