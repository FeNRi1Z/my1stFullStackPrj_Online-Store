import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import SignIn from './pages/backoffice/SignIn';
import Home from './pages/backoffice/Home';
import Order from './pages/backoffice/Order';
import Product from './pages/backoffice/Product';
import User from './pages/backoffice/User';

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/order',
    element: <Order />
  },
  {
    path: '/product',
    element: <Product />
  },
  {
    path: '/user',
    element: <User />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);