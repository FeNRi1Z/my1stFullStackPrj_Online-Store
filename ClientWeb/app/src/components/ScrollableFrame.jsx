import React, { useState, useRef, useEffect } from 'react';
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ScrollableFrame = ({ title, books }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const scrollContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const threshold = 10;
      setShowLeftArrow(scrollLeft > threshold);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - threshold);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const startControlsTimer = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    startControlsTimer();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShowControls(false);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setShowControls(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (isHovering) {
      startControlsTimer();
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      startControlsTimer();
    }
  };

  return (
    <div className="mt-12 relative">
      {title && (
        <h2 className="mb-4 px-4 text-2xl font-bold text-text-dark dark:text-text-light transition-colors duration-200">
          {title}
        </h2>
      )}

      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Arrow */}
        {showControls && showLeftArrow && !isDragging && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 flex items-center justify-center
                     bg-white dark:bg-background-secondary-dark
                     text-text-dark dark:text-text-light
                     rounded-full shadow-lg
                     transition-all duration-300
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     focus:outline-none"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow */}
        {showControls && showRightArrow && !isDragging && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 flex items-center justify-center
                     bg-white dark:bg-background-secondary-dark
                     text-text-dark dark:text-text-light
                     rounded-full shadow-lg
                     transition-all duration-300
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     focus:outline-none"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide select-none cursor-grab active:cursor-grabbing"
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex gap-6 px-4 py-2 min-h-full">
            {books.map((book) => (
              <BookCard
                key={book.id}
                cover={book.cover}
                title={book.title}
                author={book.author}
                book={book} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollableFrame;