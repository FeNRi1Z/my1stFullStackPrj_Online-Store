import React from 'react';
import { Button, Tooltip } from 'antd';
import { Minus, Plus, X } from 'lucide-react';
import config from '../../../config';

export const tableColumns = ({ screenWidth, updateQuantity, removeItem }) => {
  const getColumns = (screenWidth) => {
    const baseColumns = [
      {
        title: 'Book',
        dataIndex: 'name',
        align: 'left',
        width: screenWidth < 640 ? '50%' : '40%',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record) => (
          <Tooltip
            title={
              <div>
                <div className="font-medium">{text}</div>
                <div className="text-sm">{record.author}</div>
              </div>
            }
            placement="rightTop"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              {record.img && record.img !== 'noIMGFile' ? (
                <img
                  src={config.apiPath + `/uploads/product_img/${record.img}`}
                  alt={text}
                  className="w-12 h-16 sm:w-16 sm:h-24 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder-book.png';
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="w-12 h-16 sm:w-16 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500">
                    No Image
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm sm:text-base line-clamp-1 sm:line-clamp-2">
                  {text}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {record.author}
                </p>
              </div>
            </div>
          </Tooltip>
        ),
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        align: 'center',
        width: screenWidth < 640 ? '25%' : '25%',
        sorter: (a, b) => a.quantity - b.quantity,
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Button
              size="small"
              icon={<Minus className="w-4 h-4" />}
              onClick={() => updateQuantity(record.id, record.quantity - 1)}
              disabled={record.quantity <= 1}
              className="flex items-center justify-center hover:border-primary-100 focus:border-primary-100"
            />
            <Tooltip title={`${record.quantity} of ${record.maxQuantity || 99} available`}>
              <span className="w-6 sm:w-8 text-center text-sm sm:text-base">
                {record.quantity}
              </span>
            </Tooltip>
            <Button
              size="small"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => updateQuantity(record.id, record.quantity + 1)}
              disabled={record.quantity >= (record.maxQuantity || 99)}
              className="flex items-center justify-center hover:border-primary-100 focus:border-primary-100"
            />
          </div>
        ),
      }
    ];

    if (screenWidth < 640) {
      baseColumns.push({
        title: 'Total',
        dataIndex: 'total',
        align: 'right',
        width: '15%',
        render: (_, record) => (
          <div className="text-right pr-2">
            <p className="text-sm font-medium">
              ${(record.price * record.quantity).toFixed(2)}
            </p>
          </div>
        ),
      });
    } else {
      baseColumns.push(
        {
          title: 'Price',
          dataIndex: 'price',
          align: 'center',
          width: '15%',
          render: (price) => (
            <div className="text-center">
              ${price.toFixed(2)}
            </div>
          ),
        },
        {
          title: 'Total',
          dataIndex: 'total',
          align: 'center',
          width: '15%',
          render: (_, record) => (
            <div className="text-center">
              ${(record.price * record.quantity).toFixed(2)}
            </div>
          ),
        }
      );
    }

    baseColumns.push({
      title: "",
      key: "action",
      width: screenWidth < 640 ? "10%" : "8%",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<X className="w-4 h-4" />}
          onClick={() => removeItem(record.id)}
          className="flex items-center justify-center"
        />
      ),
    });

    return baseColumns;
  };

  return getColumns(screenWidth);
};