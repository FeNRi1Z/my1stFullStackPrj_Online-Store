import React, { useState } from 'react';
import { Search, Mic, Loader2 } from 'lucide-react';

const SearchBox = ({ onSearch, onShowAll }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle voice input
  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    try {
      setIsListening(true);
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  };

  // Handle search submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setIsLoading(true);
      await onSearch(searchTerm);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center w-full">
      <div className="relative flex-1">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 
                      text-secondary-50 dark:text-text-disabled">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full h-14 pl-12 pr-12
                   bg-white dark:bg-background-secondary-dark
                   text-text-dark dark:text-text-light
                   placeholder-secondary-50 dark:placeholder-text-disabled
                   rounded-md
                   focus:outline-none focus:ring-2 focus:ring-primary-100
                   transition-all duration-300
                   disabled:opacity-50"
          disabled={isLoading || isListening}
        />

        {/* Mic Button */}
        {/* <button
          type="button"
          onClick={handleVoiceInput}
          disabled={isLoading}
          className={`absolute right-3 top-1/2 -translate-y-1/2 
                    ${isListening 
                      ? 'text-primary-100 animate-pulse' 
                      : 'text-secondary-50 dark:text-text-disabled hover:text-primary-100 dark:hover:text-primary-100'
                    }
                    transition-colors duration-200
                    disabled:opacity-50`}
        >
          <Mic className="w-5 h-5" />
        </button> */}
      </div>

      {/* Show All Button */}
      {/* <button
        type="button"
        onClick={onShowAll}
        disabled={isLoading}
        className="h-14 px-6
                 bg-primary-100 hover:bg-primary-hover active:bg-primary-active
                 text-white font-medium
                 rounded-md
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Show All
      </button> */}
    </form>
  );
};

export default SearchBox;