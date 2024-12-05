import React, { useMemo } from 'react';
import { Table, Button, Tooltip } from 'antd';
import { Minus, Plus, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useCart } from './CartProvider';
import config from '../../config';

const CartTable = ({ items, searchQuery, windowWidth }) => {
  const { updateQuantity, removeItem } = useCart();

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'Book',
        dataIndex: 'name',
        align: 'left',
        width: windowWidth < 640 ? '50%' : '40%',
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
              <div className="w-12 h-16 sm:w-16 sm:h-24 flex-shrink-0">
                {record.img && record.img !== 'noIMGFile' ? (
                  <img
                    src={`${config.apiPath}/uploads/product_img/${record.img}`}
                    alt={text}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder-book.png';
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded 
                    flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">
                      No Image
                    </span>
                  </div>
                )}
              </div>
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
        width: windowWidth < 640 ? '25%' : '25%',
        sorter: (a, b) => a.quantity - b.quantity,
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {record.maxQuantity < 1 ? (
              <span className="text-red-500">Out of Stock</span>
            ) : (
              <>
                <Button
                  size="small"
                  icon={<Minus className="w-4 h-4" />}
                  onClick={() => updateQuantity(record.id, record.quantity - 1)}
                  disabled={record.quantity <= 1}
                  className="flex items-center justify-center"
                />
                <Tooltip title={`${record.quantity} of ${record.maxQuantity} available`}>
                  <span className="w-6 sm:w-8 text-center text-sm sm:text-base">
                    {record.quantity}
                  </span>
                </Tooltip>
                <Button
                  size="small"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => updateQuantity(record.id, record.quantity + 1)}
                  disabled={record.quantity >= record.maxQuantity}
                  className="flex items-center justify-center"
                />
              </>
            )}
          </div>
        ),
      }
    ];

    if (windowWidth < 640) {
      baseColumns.push({
        title: 'Total',
        dataIndex: 'total',
        align: 'right',
        width: '15%',
        sorter: (a, b) => (a.price * a.quantity) - (b.price * b.quantity),
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
          sorter: (a, b) => a.price - b.price,
          render: price => (
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
          sorter: (a, b) => (a.price * a.quantity) - (b.price * b.quantity),
          render: (_, record) => (
            <div className="text-center">
              ${(record.price * record.quantity).toFixed(2)}
            </div>
          ),
        }
      );
    }
    
    baseColumns.push({
      title: '',
      key: 'action',
      width: windowWidth < 640 ? '10%' : '8%',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<X className="w-4 h-4" />}
          onClick={() => removeItem(record.id)}
          className="flex items-center justify-center"
          aria-label={`Remove ${record.name} from cart`}
        />
      ),
    });
      
    return baseColumns;
  }, [windowWidth, updateQuantity, removeItem]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  return (
    <div className="p-2 sm:p-6">
      <Table
        columns={columns}
        dataSource={filteredItems}
        rowKey="id"
        pagination={false}
        scroll={{ x: true, y: 400 }}
        className="cart-table"
      />
    </div>
   
  );
};

CartTable.propTypes = {
  items: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  windowWidth: PropTypes.number.isRequired
};

export default CartTable;