import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { CartProvider } from './components/CartProvider';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/SignIn',
    element: <SignIn />
  },
  {
    path: '/Register',
    element: <Register />
  },
  {
    path: '/Store',
    element: <Store />
  },
  {
    path: '/Profile',
    element: <Profile />
  },
  {
    path: '/Orders',
    element: <Orders />
  },
  {
    path: '/Checkout',
    element: <Checkout />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);