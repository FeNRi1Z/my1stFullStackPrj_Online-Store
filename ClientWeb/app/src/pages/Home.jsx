import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import NavBar from '../components/Navbar.jsx';
import BookCard from '../components/BookCard.jsx';
import SideNav from '../components/SideNav.jsx';
import CartModal from '../components/CartModal.jsx';
import config from '../config.js';

const Home = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
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

  // Initial fetch of all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(config.apiPath + '/product/public/list');
        const data = await response.json();
        setBooks(data.results);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <NavBar
          onMenuClick={handleMenuClick}
          onCartOpen={() => setIsCartOpen(true)}
        />
      </div>

      {/* Background Dim Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 pointer-events-none ${isSideNavOpen ? 'opacity-50' : 'opacity-0'
          }`}
        style={{ zIndex: 20 }}
      />

      {/* Main Content */}
      <div className="relative" onClick={() => isSideNavOpen && handleSideNavClose()}>
        {/* Home Section */}
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
        <section ref={storeRef} className="min-h-screen pt-16 pb-12">
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-[95%] 2xl:w-[95%]">
            <div className="mt-8 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-dark dark:text-text-light transition-colors duration-200">
                Newly Come
              </h1>
            </div>

            <div className="mt-6 sm:mt-8">
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
                  <div className="animate-pulse text-text-dark dark:text-text-light">
                    Loading your next adventure...
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 
                gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                  {books.map((book) => (
                    <div key={book.id} className="flex justify-center">
                      <BookCard
                        cover={config.apiPath + `/uploads/product_img/${book.img}`}
                        title={book.name}
                        author={book.author}
                        book={{
                          id: book.id,
                          desc: book.desc,
                          price: book.price,
                          quantity: book.quantity,
                          categories: book.categoriesName
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Empty state */}
            {!isLoading && books.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center">
                <p className="text-lg text-text-dark dark:text-text-light mb-4">
                  No books found
                </p>
                <p className="text-sm text-secondary-50 dark:text-text-disabled">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
          <div className='mx-auto mr-6 mt-6 px-4 sm:px-6 md:px-8 lg:px-12 w-[95%] 2xl:w-[95%]'><a
            href="/store"
            className="group inline-flex items-center px-6 py-3 
                            bg-primary-100 text-white text-base font-medium 
                            rounded-md hover:text-white hover:bg-primary-hover 
                            transition-colors duration-200
                            focus:outline-none focus:ring-2   
                            focus:ring-primary-100 focus:ring-offset-2"
          >
            Go to store now
            <ArrowUpRight className="ml-2 w-5 h-5 transform transition-transform 
                                      group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a></div>
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