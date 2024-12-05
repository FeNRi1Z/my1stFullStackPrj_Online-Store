import { useState, useEffect } from "react";
import { X } from "lucide-react";

const OrderModal = ({ isOpen, onClose, children, title }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]
          transition-opacity duration-300 ease-in-out
          ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
        style={{ margin: 0 }}
      />

      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ margin: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div 
          className={`relative bg-white dark:bg-background-dark rounded-lg w-full 
            max-w-[90vw] lg:max-w-[900px] max-h-[90vh] flex flex-col
            transform transition-all duration-300 ease-out
            ${isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderModal;