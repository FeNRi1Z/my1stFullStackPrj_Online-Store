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
    <div className="w-full max-w-3xl lg:max-w-xl xl:max-w-lg">
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
        </div>
      </form>
    </div>
  );
};

export default SearchBox;