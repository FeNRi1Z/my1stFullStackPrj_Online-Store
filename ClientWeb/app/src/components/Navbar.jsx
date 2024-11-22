import React, { useState } from 'react';
import { Menu, ShoppingBag, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useCart } from './CartProvider';
import SideNav from './SideNav';

const ThemeToggleButton = ({ children, onClick, showThemeToggle }) => (
  showThemeToggle && (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full transition-all duration-300 ease-in-out 
                 hover:bg-gray-200 dark:hover:bg-gray-700 
                 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {children}
    </button>
  )
);

const NavLink = ({ href, children }) => (
  <a 
    href={href}
    className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white
               transition-colors px-4 py-2"
  >
    {children}
  </a>
);

const NavBar = ({ onCartOpen, showThemeToggle = true   }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  return (
    <>
      <nav className="w-full bg-white dark:bg-background-dark shadow-sm transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4">
            {/* Left side - Menu button (mobile) and Navigation links (desktop) */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSideNavOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-background-secondary-dark 
                         transition-colors md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-text-dark dark:text-text-light" />
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4 ml-4">
                <NavLink href="/">Home</NavLink>
                <NavLink href="">About</NavLink>
                <NavLink href="">Services</NavLink>
                <NavLink href="">Contact</NavLink>
              </div>
            </div>

            {/* Right side - Icons group */}
            <div className="flex items-center gap-4">
              {/* Shopping Cart Button */}
              <button 
                onClick={onCartOpen}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-background-secondary-dark 
                         transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="h-6 w-6 text-text-dark dark:text-text-light hover:text-primary-100 dark:hover:text-primary-100" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center 
                                justify-center bg-primary-100 text-white rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Theme Toggle */}
              <ThemeToggleButton onClick={toggleTheme} showThemeToggle={showThemeToggle}>
                {theme === 'light' ? (
                  <Moon className="h-6 w-6 text-text-dark hover:text-primary-100" />
                ) : (
                  <Sun className="h-6 w-6 text-text-light hover:text-primary-100" />
                )}
              </ThemeToggleButton>

              {/* Avatar */}
              <div 
                onClick={() => navigate('/Profile')}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 cursor-pointer
                         hover:ring-2 hover:ring-primary-100 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile SideNav */}
      <div className="md:hidden">
        <SideNav 
          isOpen={isSideNavOpen} 
          onClose={() => setIsSideNavOpen(false)} 
        />
      </div>
    </>
  );
};

export default NavBar;