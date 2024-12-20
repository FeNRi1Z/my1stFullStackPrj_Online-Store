import React, { useState, useEffect, useRef , useCallback} from 'react';
import NavBar from '../components/layout/Navbar.jsx';
import SearchBox from '../components/search/SearchBox.jsx';
import BookCard from '../components/book/BookCard.jsx';
import SideNav from '../components/layout/SideNav.jsx';
import CartModal from '../components/cart/CartModal.jsx';
import config from '../config.js';

const Store = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const storeRef = useRef(null);

  const handleMenuClick = () => {
    setIsSideNavOpen(true);
  };

  const handleSideNavClose = () => {
    setIsSideNavOpen(false);
  };

  /* Function to handle search results */
  const handleSearch = useCallback((searchResults) => {
    if (Array.isArray(searchResults)) {
      setBooks(searchResults);
      setIsLoading(false);
    }
  }, []);

  /* Initial fetch of all books */
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
      {/* Nav bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
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
        {/* Store Section */}
        <section ref={storeRef} className="min-h-screen pt-16 pb-12">
          <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-[95%] 2xl:w-[95%]">
            <div className="mt-8 space-y-2">
              <p className="text-sm text-text-dark dark:text-text-light transition-colors duration-200">
                Find your next favorite book
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-dark dark:text-text-light transition-colors duration-200">
                What do you want to read today?
              </h1>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="flex justify-start">
                <SearchBox onSearch={handleSearch} />
              </div>
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

export default Store;