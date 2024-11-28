import React, { useEffect } from 'react';
import {
  X, FileText, User,
  Home, ShoppingBag,
  Info, MessageSquare,
  LogIn
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const SideNav = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const mainNavLinks = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: ShoppingBag, label: 'Store', to: '/store' },
    { icon: Info, label: 'About', to: '/about' },
    { icon: MessageSquare, label: 'Contact us', to: '/contact' },
  ];

  const authLinks = [
    { icon: User, label: 'Edit my account', to: '/profile' },
    { icon: FileText, label: 'My orders', to: '/orders' },
  ];

  const handleNavigation = (item) => {
    if (item.onClick) {
      item.onClick();
    } else {
      navigate(item.to);
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const shouldShowAuthLinks = location.pathname === '/orders';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-[98]
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidenav */}
      <div
        className={`
          fixed top-0 left-0 
          w-[65%] sm:w-[50%]
          h-screen 
          bg-white dark:bg-gray-900
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          z-[99] flex flex-col
          text-gray-700 dark:text-gray-200
          rounded-tr-lg rounded-br-lg
          overflow-hidden
          sidenav-container
        `}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 
            dark:text-gray-400 dark:hover:bg-background-secondary-dark transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col px-6 overflow-y-auto">
          {mainNavLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className="mb-4 flex items-center text-xl text-gray-700 
              dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}

          {shouldShowAuthLinks && isAuthenticated && (
            <>
              <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-4" />
              {authLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  className="mb-4 flex items-center text-xl text-gray-700 
                  dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              ))}
            </>
          )}

          {!isAuthenticated && !shouldShowAuthLinks && (
            <button
              onClick={() => {
                navigate('/signin');
                onClose();
              }}
              className="mb-4 flex items-center text-xl text-primary-100 hover:text-primary-hover"
            >
              <LogIn className="h-5 w-5 mr-3" />
              Sign In
            </button>
          )}
        </nav>
      </div>
    </>
  );
};

export default SideNav;