import React from 'react';
import { FileText, User, Key } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

const SideOrderNav = ({ totalOrderCount, activeView, onNavigate }) => {
  const { theme } = useTheme();
  const navItems = [
    { 
      icon: User, 
      text: 'Edit profile', 
      view: 'profile',
      onClick: () => onNavigate('profile')
    },
    { 
      icon: FileText, 
      text: 'View orders', 
      count: totalOrderCount > 0 ? totalOrderCount : null,
      view: 'orders',
      onClick: () => onNavigate('orders')
    },
    // { 
    //   icon: Key, 
    //   text: 'Change password', 
    //   view: 'password',
    //   onClick: () => onNavigate('password')
    // },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white dark:bg-background-dark border-r border-gray-200 dark:border-background-secondary-dark overflow-y-auto pt-[60px]">
      <div className="p-4 space-y-1">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full flex items-center p-3 rounded-lg 
              ${activeView === item.view 
                ? 'bg-gray-100 dark:bg-background-secondary-dark' 
                : 'hover:bg-gray-100 dark:hover:bg-background-secondary-dark'
              } 
              text-text-dark dark:text-text-light group transition-colors duration-200`}
          >
            <item.icon className={`w-5 h-5 mr-3 
              ${activeView === item.view
                ? 'text-text-dark dark:text-text-light'
                : 'text-secondary-50 dark:text-text-disabled group-hover:text-text-dark dark:group-hover:text-text-light'
              }`} 
            />
            <span className="flex-grow">{item.text}</span>
            {item.count && (
              <span className="bg-primary-100 text-white dark:text-text-light px-2 py-0.5 rounded-full text-sm">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideOrderNav;