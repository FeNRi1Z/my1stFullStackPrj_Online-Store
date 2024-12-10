import React from 'react';
import { Spin } from 'antd';
/**
 * LoadingSpinner Component
 * @param {Object} props
 * @param {string} props.size - Size of the spinner ('small' | 'default' | 'large')
 * @param {string} props.className - Additional CSS classes
 */

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <Spin size="large" />
  </div>
);

export default LoadingSpinner;