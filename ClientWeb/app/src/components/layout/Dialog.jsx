import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Dialog = ({ isOpen, onClose, children }) => {
  // State to handle animation
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle closing animation
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 backdrop-blur-[4px] bg-black/30  overflow-y-auto transition-opacity duration-300
        ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      aria-labelledby="dialog-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300
          ${isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'}`}
        onClick={handleClose}
      />
      
      {/* Dialog position */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Dialog content */}
        <div 
          className={`relative rounded-lg shadow-xl w-full max-w-md p-6
            bg-white dark:bg-background-dark
            text-text-dark dark:text-text-light
            transition-all duration-300 transform
            ${isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 
              text-secondary-50 hover:text-text-dark
              dark:text-text-disabled dark:hover:text-text-light
              transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;