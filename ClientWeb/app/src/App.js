import React from 'react';
import NavBar from './components/PageLayout';
import { useTheme } from './components/ThemeProvider';

const App = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl font-bold text-text-dark dark:text-text-light">
            Welcome to Your App
          </h1>
          
          <p className="text-secondary-50 dark:text-text-disabled text-center max-w-2xl">
            This is your new React application with a responsive navigation bar, 
            side navigation, and dark mode support. Start editing to build your app!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="p-6 bg-white dark:bg-background-secondary-dark rounded-lg shadow-md 
                          hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-text-dark dark:text-text-light mb-2">
                  Feature {item}
                </h2>
                <p className="text-secondary-50 dark:text-text-disabled">
                  This is a sample feature card. Replace this with your actual content
                  and functionality.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;