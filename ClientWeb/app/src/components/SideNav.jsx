import React, {useEffect} from 'react';
import { 
  X, FileText, User, Key, CreditCard, MapPin, LogOut,
  Home, ShoppingBag, Info, MessageSquare, LogIn 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const SideNav = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Main navigation links
  const mainNavLinks = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: ShoppingBag, label: 'Store', to: '/store' },
    { icon: Info, label: 'About', to: '/about' },
    { icon: MessageSquare, label: 'Contact us', to: '/contact' },
  ];

  // Authenticated user links
  const authLinks = [
    { icon: FileText, label: 'View orders', to: '/orders' },
    { icon: User, label: 'Profile', to: '/profile' },
    { icon: Key, label: 'Change password', to: '/change-password' },
    { icon: CreditCard, label: 'Payment methods', to: '/payment-methods' },
    { icon: MapPin, label: 'Manage addresses', to: '/addresses' },
    { icon: LogOut, label: 'Sign out', onClick: logout },
  ];

  const handleNavigation = (item) => {
    if (item.onClick) {
      item.onClick();
    } else {
      navigate(item.to);
    }
    onClose();
  };

  // Body scroll lock
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

  return (
    <>
    {isOpen && <div className={`z-55 w-full h-full fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out`} onClick={onClose} />}
    <div
      className={`
        fixed top-0 left-0 
        w-[65%] sm:w-[50%]
        h-screen 
        bg-white dark:bg-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        z-60 flex flex-col
        text-gray-700 dark:text-gray-200
        overflow-y-auto
      `}
      style={{ borderRadius: '10px 0 0 10px' }}
    >
      {/* Close button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-background-secondary-dark transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex flex-col px-6">
        {/* Main Navigation Links */}
        {mainNavLinks.map((item) => (
          <button 
            key={item.label}
            onClick={() => handleNavigation(item)}
            className="mb-4 flex items-center text-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </button>
        ))}

        {/* Separator */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-4" />

        {/* Auth Links */}
        {isAuthenticated ? (
          // Show authenticated user links
          authLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className="mb-4 flex items-center text-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </button>
          ))
        ) : (
          // Show sign in button for guest
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
    </>);
};

export default SideNav;