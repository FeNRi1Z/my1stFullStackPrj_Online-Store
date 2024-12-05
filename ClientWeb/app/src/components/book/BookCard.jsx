import React, { useState } from 'react';
import BookDetailPopup from './BookDetailPopup';

const BookCard = ({ cover, title, author, book }) => {
  const [showPopup, setShowPopup] = useState(false);
  // console.log(book) //Debugging data from list api.

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div 
        className="flex-shrink-0 w-[150px] transition-transform duration-300 hover:scale-105 cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative w-[150px] h-[200px]">
          <img
            src={cover}
            alt={`Cover of ${title}`}
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md"
            loading="lazy"
          />
        </div>
        
        <div className="mt-2 px-1 space-y-1">
          <h3 className="text-text-dark dark:text-text-light font-medium text-sm 
                       overflow-hidden whitespace-nowrap text-ellipsis"
          >
            {title}
          </h3>
          <p className="text-secondary-50 dark:text-text-disabled text-xs 
                     overflow-hidden whitespace-nowrap text-ellipsis"
          >
            {author}
          </p>
        </div>
      </div>

      <BookDetailPopup
        book={{
          ...book,
          cover,
          title,
          author,
          categoriesName: book.categories || []
        }}
        isOpen={showPopup}
        onClose={handleClose}
      />
    </>
  );
};

export default BookCard;