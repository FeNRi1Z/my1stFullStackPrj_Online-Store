import React from 'react';
import { X } from 'lucide-react';

const SideNav = ({ isOpen, onClose }) => {
  return (
    <div
      className={`
        fixed top-0 left-0 
        w-[65%] sm:w-[50%]
        h-screen 
        bg-white dark:bg-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        z-40 flex flex-col
        text-gray-700 dark:text-gray-200
      `}
      style={{
        borderRadius: '10px 0 0 10px',
      }}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-background-secondary-dark transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="flex flex-col items-center mt-8">
        <a 
          href="#" 
          onClick={onClose}
          className="mb-4 text-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
        >
          Home
        </a>
        <a 
          href="#" 
          onClick={onClose}
          className="mb-4 text-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
        >
          About
        </a>
        <a 
          href="#" 
          onClick={onClose}
          className="mb-4 text-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
        >
          Services
        </a>
        <a 
          href="#" 
          onClick={onClose}
          className="mb-4 text-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
        >
          Contact
        </a>
      </nav>
    </div>
  );
};

export default SideNav;