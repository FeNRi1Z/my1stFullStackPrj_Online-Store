import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from './AuthProvider';

const MenuItem = ({ icon: Icon, label, onClick, hasChevron = true }) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 flex items-center justify-between
                 hover:bg-gray-100 dark:hover:bg-gray-700
                 text-gray-700 dark:text-gray-200
                 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasChevron && <ChevronRight className="w-4 h-4" />}
    </button>
  );
};

const ProfileDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
        />
        <MenuItem 
          icon={Package} 
          label="My orders" 
          onClick={() => {
            navigate('/orders');
            onClose();
          }}
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