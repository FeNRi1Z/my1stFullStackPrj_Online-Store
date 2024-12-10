import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Package, LogOut } from 'lucide-react';
import { MenuItem } from './MenuItem';
import { useAuth } from '../auth/AuthProvider';

/**
 * ProfileDropdown Component - Displays user profile actions in a dropdown menu
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls dropdown visibility
 * @param {Function} props.onClose - Callback to close the dropdown
 * @param {Function} props.onViewChange - Callback to change view in orders page
 */

const ProfileDropdown = ({ isOpen, onClose, onViewChange }) => {
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOrdersPage = location.pathname === '/orders';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleProfileClick = () => {
    if (isOrdersPage) {
      onViewChange?.('profile');
    } else {
      navigate('/orders', { state: { initialView: 'profile' } });
    }
    onClose();
  };

  const handleOrdersClick = () => {
    if (isOrdersPage) {
      onViewChange?.('orders');
    } else {
      navigate('/orders', { state: { initialView: 'orders' } });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-64 rounded-lg shadow-lg
                 bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700
                 overflow-hidden z-50"
    >
      {/* Profile Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="font-medium text-gray-800 dark:text-gray-200">
          {user?.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {user?.email}
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <MenuItem 
          icon={User} 
          label="Edit my account" 
          onClick={handleProfileClick}
        />
        <MenuItem 
          icon={Package} 
          label="My orders" 
          onClick={handleOrdersClick}
        />
        <MenuItem 
          icon={LogOut} 
          label="Sign out" 
          onClick={() => {
            logout();
            onClose();
          }}
          hasChevron={false}
        />
      </div>
    </div>
  );
};

export default ProfileDropdown;