import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { CartProvider } from './components/cart/CartProvider';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import About from './pages/About';

// Root layout component that provides context
const RootLayout = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'signin',
        element: <SignIn />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'store',
        element: <Store />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        )
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);