import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import NavBar from '../components/Navbar.jsx';
import SideNav from '../components/SideNav.jsx';
import CartModal from '../components/CartModal.jsx';
import ScrollableFrame from '../components/ScrollableFrame.jsx';
import config from '../config.js';

const Home = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recentBooks, setRecentBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
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

  // Function to shuffle array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initial fetch of all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(config.apiPath + '/product/public/list');
        const data = await response.json();

        // Transform the data to match ScrollableFrame's expected format
        const transformedBooks = data.results.map(book => ({
          id: book.id,
          cover: config.apiPath + `/uploads/product_img/${book.img}`,
          title: book.name,
          author: book.author,
          desc: book.desc,
          price: book.price,
          quantity: book.quantity,
          categories: book.categoriesName
        }));

        // Get 10 most recent books
        const recent = transformedBooks.slice(0, 10);
        setRecentBooks(recent);

        // Get 10 random books
        const randomBooks = shuffleArray(transformedBooks).slice(0, 10);
        setRecommendedBooks(randomBooks);
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
      <div className="fixed top-0 left-0 right-0 z-40">
        <NavBar
          onMenuClick={handleMenuClick}
          onCartOpen={() => setIsCartOpen(true)}
        />
      </div>

      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 pointer-events-none ${isSideNavOpen ? 'opacity-50' : 'opacity-0'
          }`}
        style={{ zIndex: 20 }}
      />

      <div className="relative" onClick={() => isSideNavOpen && handleSideNavClose()}>
        <section
          ref={landingRef}
          className="min-h-screen flex flex-col items-center justify-center px-4"
        >
          <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-dark dark:text-text-light text-center transition-colors duration-300">
              Welcome to Mod-ed!
            </h1>

            <p className="text-lg md:text-xl text-secondary-50 dark:text-text-disabled text-center max-w-2xl transition-colors duration-300">
              Your gateway to endless stories. Discover, read, and explore
              our vast collection of books across all genres.
            </p>

            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-primary-100 text-white text-lg font-semibold rounded-md hover:bg-primary-hover active:bg-primary-active transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        <section ref={storeRef} className="min-h-screen pt-16 pb-6 sm:pt-4 scroll-mt-8">
          <div className="mx-auto w-full">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-pulse text-text-dark dark:text-text-light">
                  Loading your next adventure...
                </div>
              </div>
            ) : (
              <>
                {/* Recent Books Section */}
                <div className='mx-auto md:ml-16 sm:ml-4 ml:12'>
                  <ScrollableFrame
                    title="Newly Come"
                    books={recentBooks}
                  />

                  {/* Recommended Books Section */}
                  <ScrollableFrame
                    title="You may also want to read..."
                    books={recommendedBooks}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mx-auto mt-6 px-5 sm:px-4 md:px-16 lg:px-10 w-[95%] 2xl:w-[95%] flex justify-center">

            <a href="/store"
              className="group inline-flex items-center px-6 py-3 bg-primary-100 text-white text-base font-medium rounded-md hover:text-white hover:bg-primary-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
            >
              Find more at..
              <ArrowUpRight className="ml-2 w-5 h-5 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </section>
      </div>

      <SideNav isOpen={isSideNavOpen} onClose={handleSideNavClose} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Home;