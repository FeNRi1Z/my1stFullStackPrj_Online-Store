import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../components/ThemeProvider';
import { ArrowRight } from 'lucide-react';
import NavBar from '../components/Navbar.jsx';
import SearchBox from '../components/SearchBox.jsx';
import TabPanel from '../components/TabPanel.jsx';
import SideNav from '../components/SideNav.jsx';
import CartModal from '../components/CartModal.jsx';

const Home = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const { theme } = useTheme();
  const username = "John";
  const storeRef = useRef(null);
  const landingRef = useRef(null);

  const handleGetStarted = () => {
    storeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMenuClick = () => {
    setIsSideNavOpen(true);
  };

  const handleSideNavClose = () => {
    setIsSideNavOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (storeRef.current) {
        const storeRect = storeRef.current.getBoundingClientRect();
        setShowNavbar(storeRect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Fixed Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <NavBar 
          onMenuClick={handleMenuClick} 
          onCartOpen={() => setIsCartOpen(true)}
        />
      </div>

      {/* Background Dim Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 pointer-events-none ${
          isSideNavOpen ? 'opacity-50' : 'opacity-0'
        }`}
        style={{ zIndex: 20 }}
      />

      {/* Main Content */}
      <div className="relative" onClick={() => isSideNavOpen && handleSideNavClose()}>
        {/* Landing Section */}
        <section 
          ref={landingRef}
          className="min-h-screen flex flex-col items-center justify-center px-4"
        >
          <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold 
                         text-text-dark dark:text-text-light 
                         text-center transition-colors duration-300">
              Welcome to Mod-ed!
            </h1>
            
            <p className="text-lg md:text-xl text-secondary-50 
                       dark:text-text-disabled text-center 
                       max-w-2xl transition-colors duration-300">
              Your gateway to endless stories. Discover, read, and explore 
              our vast collection of books across all genres.
            </p>

            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-primary-100 text-white 
                       text-lg font-semibold rounded-md
                       hover:bg-primary-hover active:bg-primary-active 
                       transform hover:scale-105 
                       transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 
                       focus:ring-primary-100 focus:ring-offset-2
                       flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 transform transition-transform 
                                  group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* Store Section */}
        <section 
          ref={storeRef}
          className="min-h-screen pt-16"
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
            <div className="mt-8">
              <p className="mb-2 text-sm text-text-dark dark:text-text-light transition-colors duration-200">
                Welcome back {username}!
              </p>
              <h1 className="mb-6 text-3xl font-bold text-text-dark dark:text-text-light transition-colors duration-200">
                What do you want to read today?
              </h1>
            </div>

            <SearchBox />

            <div className="mt-8">
              <TabPanel />
            </div>

            <div className="h-20" />
          </div>
        </section>
      </div>

     {/* SideNav */}
      <SideNav isOpen={isSideNavOpen} onClose={handleSideNavClose} />

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Home;