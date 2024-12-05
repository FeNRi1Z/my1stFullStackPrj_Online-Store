import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Dialog = ({ isOpen, onClose, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="relative">
      {/* Backdrop */}
      <div 
        className="fixed top-0 left-0 w-full h-full bg-black/50 transition-opacity duration-300"
        style={{
          opacity: isAnimating ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 99999
        }}
        onClick={onClose}
      />
      
      {/* Dialog container */}
      <div 
        className="fixed top-0 left-0 w-full h-full overflow-y-auto"
        style={{ zIndex: 100000 }}
      >
        <div className="flex items-center justify-center min-h-full p-4">
          <div 
            className={`relative w-full max-w-md rounded-lg bg-white dark:bg-background-dark p-6 shadow-xl
              transform transition-all duration-300
              ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;