import React from 'react';
import { Spin } from 'antd';
/**
 * LoadingSpinner component
 * serve for showing spinner waiting for cart item to load / fetched.
 */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <Spin size="large" />
  </div>
);

export default LoadingSpinner;