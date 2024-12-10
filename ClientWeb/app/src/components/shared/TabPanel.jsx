import React, { useState, useRef, useEffect } from 'react';
import ScrollableFrame from './ScrollableFrame';
import booksData from '../../assets/books.json';

/**
 * TabPanel Component
 * A scrollable, touch-enabled tab interface for categorized book display
 * Currently unused but can be implement as category tab in future implementation
*/
const TabPanel = () => {
  const [activeTab, setActiveTab] = useState('');
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });
  const [categories, setCategories] = useState([]);
  const [categorizedBooks, setCategorizedBooks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const tabRefs = useRef({});
  const tabsContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  // const fetchBookCover = async (book) => {
  //   try {
  //     const response = await fetch(
  //       `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book.name)}+inauthor:${encodeURIComponent(book.author)}`
  //     );
  //     const data = await response.json();

  //     if (data.items && data.items[0]?.volumeInfo?.imageLinks?.thumbnail) {
  //       return {
  //         ...book,
  //         cover: data.items[0].volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')
  //       };
  //     }
  //     return {
  //       ...book,
  //       cover: book.img
  //     };
  //   } catch (error) {
  //     console.error('Error fetching book cover:', error);
  //     return {
  //       ...book,
  //       cover: book.img
  //     };
  //   }
  // };

  // Tab scrolling handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const distance = (x - startX) * 2;
    tabsContainerRef.current.scrollLeft = scrollLeft - distance;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - tabsContainerRef.current.offsetLeft;
    const distance = (x - startX) * 2;
    tabsContainerRef.current.scrollLeft = scrollLeft - distance;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const processBooks = async () => {
      try {
        setIsLoading(true);

        // Extract unique categories from all books
        const uniqueCategories = new Set();
        booksData.books.forEach(book => {
          book.categoriesName.forEach(category => {
            uniqueCategories.add(category);
          });
        });

        const categoryList = Array.from(uniqueCategories).sort();

        // Create categorized books object with Google Books API covers
        const booksByCategory = {};
        for (const category of categoryList) {
          const booksInCategory = booksData.books.filter(book =>
            book.categoriesName.includes(category)
          );

          // Fetch covers for all books in this category
          const processedBooks = await Promise.all(
            booksInCategory.map(async (book) => {
              const bookWithCover = await fetchBookCover(book);
              return {
                id: book.id,
                cover: bookWithCover.cover,
                title: book.name,
                author: book.author,
                price: book.price,
                quantity: book.quantity,
                desc: book.desc
              };
            })
          );

          booksByCategory[category] = processedBooks;
        }

        setCategories(categoryList);
        setCategorizedBooks(booksByCategory);
        if (categoryList.length > 0 && !activeTab) {
          setActiveTab(categoryList[0]);
        }
        setError(null);
      } catch (error) {
        console.error('Error processing books:', error);
        setError('Failed to load books. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    processBooks();
  }, []);

  // Update indicator position
  const updateIndicator = () => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      const container = tabsContainerRef.current;
      const tabLeft = currentTab.offsetLeft;

      setIndicatorStyle({
        left: `${tabLeft}px`,
        width: `${currentTab.offsetWidth}px`,
        opacity: 1,
        transition: isFirstRender.current ? 'opacity 0.3s' : 'all 0.3s'
      });
      isFirstRender.current = false;
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      requestAnimationFrame(() => {
        updateIndicator();
      });
    }
  }, [activeTab, categories]);

  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">No books found.</div>
      </div>
    );
  }

  const handleTabClick = (category) => {
    if (!isDragging) {
      setActiveTab(category);
    }
  };

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="dark:border-b border-secondary-50 border-text-disabled">
        <div
          ref={tabsContainerRef}
          className="relative flex overflow-x-auto scrollbar-hide select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {categories.map((category) => (
            <button
              key={category}
              ref={el => tabRefs.current[category] = el}
              onClick={() => handleTabClick(category)}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap
                         ${activeTab === category
                  ? 'text-primary-100'
                  : 'text-secondary-50 dark:text-text-disabled hover:text-primary-100 dark:hover:text-primary-100'
                }`}
            >
              {category}
            </button>
          ))}

          {/* Animated underline indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-primary-100 transition-all duration-300"
            style={indicatorStyle}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {categories.map((category) => (
          <div
            key={category}
            className={`transition-opacity duration-300 
                       ${activeTab === category ? 'block opacity-100' : 'hidden opacity-0'}`}
          >
            <ScrollableFrame books={categorizedBooks[category]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabPanel;