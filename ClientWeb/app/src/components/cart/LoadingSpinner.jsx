import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <Spin size="large" />
  </div>
);

export default LoadingSpinner;