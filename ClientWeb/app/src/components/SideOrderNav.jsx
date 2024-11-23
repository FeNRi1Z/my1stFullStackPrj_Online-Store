import React from 'react';
import { FileText, User, Key, CreditCard, MapPin, LogOut } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

const SideOrderNav = () => {
  const { theme } = useTheme();
  const navItems = [
    { icon: FileText, text: 'View orders', count: 3, href: '#' },
    { icon: User, text: 'Personal details', href: '#' },
    { icon: Key, text: 'Change password', href: '#' },
    { icon: CreditCard, text: 'Payment methods', href: '#' },
    { icon: MapPin, text: 'Manage addresses', href: '#' },
    { icon: LogOut, text: 'Log out', href: '#' },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white dark:bg-background-dark border-r border-gray-200 dark:border-background-secondary-dark overflow-y-auto pt-[60px]">
      <div className="p-4 space-y-1">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-background-secondary-dark text-text-dark dark:text-text-light group transition-colors duration-200"
          >
            <item.icon className="w-5 h-5 mr-3 text-secondary-50 dark:text-text-disabled group-hover:text-text-dark dark:group-hover:text-text-light" />
            <span className="flex-grow">{item.text}</span>
            {item.count && (
              <span className="bg-primary-100 text-white dark:text-text-light px-2 py-0.5 rounded-full text-sm">
                {item.count}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SideOrderNav;