import React, { useState, useEffect } from 'react';
import { Table, Input, Button, ConfigProvider, theme as antdTheme, Tooltip } from 'antd';
import { SearchOutlined, AudioOutlined, MinusOutlined, PlusOutlined, CloseOutlined, ShoppingOutlined } from '@ant-design/icons';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useCart } from './CartProvider';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { cartItems, updateQuantity, removeItem, cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const primaryColor = '#EA9029';
  const primaryHover = '#D68324';

  const themeStyles = {
    background: theme === 'dark' ? '#2B2B2B' : '#F5F5F5',
    text: theme === 'dark' ? '#F5F5F5' : '#2D3142',
    cardBg: theme === 'dark' ? '#3D3D3D' : '#FFFFFF',
    tableBorder: theme === 'dark' ? '#4A4A4A' : '#E8E8E8',
    tableHeader: theme === 'dark' ? '#333333' : '#FAFAFA',
  };

  // Responsive columns
  const getColumns = (screenWidth) => {
    const baseColumns = [
      {
        title: 'Book',
        dataIndex: 'title',
        align: 'left',
        width: screenWidth < 640 ? '50%' : '40%',
        sorter: (a, b) => a.title.localeCompare(b.title),
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
              <img
                src={record.cover}
                alt={text}
                className="w-12 h-16 sm:w-16 sm:h-24 object-cover rounded"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm sm:text-base line-clamp-1 sm:line-clamp-2"
                  style={{ color: themeStyles.text }}>
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
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Button
              size="small"
              icon={<MinusOutlined />}
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
              icon={<PlusOutlined />}
              onClick={() => updateQuantity(record.id, record.quantity + 1)}
              disabled={record.quantity >= (record.maxQuantity || 99)}
              className="flex items-center justify-center hover:border-primary-100 focus:border-primary-100"
            />
          </div>
        ),
      },
    ];

    if (screenWidth < 640) {
      // Mobile view: Total price column
      baseColumns.push({
        title: 'Total',
        dataIndex: 'total',
        align: 'right',
        width: '15%',
        render: (_, record) => (
          <div className="text-right pr-2">
            <p className="text-sm font-medium" style={{ color: themeStyles.text }}>
              ${(record.price * record.quantity).toFixed(2)}
            </p>
          </div>
        ),
      });
    } else {
      // Desktop view: Price and Total columns
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

    // Remove button column for both mobile and desktop
    baseColumns.push({
      title: '',
      key: 'action',
      width: screenWidth < 640 ? '10%' : '8%',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<CloseOutlined />}
          onClick={() => removeItem(record.id)}
          className="flex items-center justify-center"
        />
      ),
    });

    return baseColumns;
  };

  // Window width hook
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const customToken = {
    colorPrimary: primaryColor,
    colorPrimaryHover: primaryHover,
    colorPrimaryActive: primaryHover,
    colorBgContainer: themeStyles.cardBg,
    colorText: themeStyles.text,
    colorBorder: themeStyles.tableBorder,
    colorBgElevated: themeStyles.cardBg,
    controlItemBgHover: theme === 'dark' ? '#4A4A4A' : '#F0F0F0',
    colorIcon: themeStyles.text,
    colorIconHover: primaryColor,
    colorPrimaryBorder: primaryColor,
    colorPrimaryBorderHover: primaryHover,
    colorBorderHover: primaryColor,
    colorPrimaryText: primaryColor,
    colorPrimaryTextHover: primaryHover,
    tableHeaderBg: themeStyles.tableHeader,
    controlOutlineWidth: 2,
    controlOutline: primaryColor + '20',
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: customToken,
        components: {
          Table: {
            headerBg: themeStyles.tableHeader,
            headerColor: themeStyles.text,
            headerSortHoverBg: theme === 'dark' ? '#404040' : '#f5f5f5',
            headerSortActiveBg: theme === 'dark' ? '#404040' : '#f5f5f5',
            rowHoverBg: theme === 'dark' ? '#404040' : '#f5f5f5',
            cellPaddingBlock: windowWidth < 640 ? 8 : 16,
            cellPaddingInline: windowWidth < 640 ? 8 : 16,
            tableLayout: 'fixed',
          },
          Button: {
            colorPrimaryHover: primaryHover,
            colorPrimaryActive: primaryHover,
            primaryColor: primaryColor,
          },
          Input: {
            activeBorderColor: primaryColor,
            hoverBorderColor: primaryColor,
            activeShadow: `0 0 0 2px ${primaryColor}20`,
          },
        },
      }}
    >
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
          <div
            className="relative w-full max-w-4xl rounded-lg shadow-xl"
            style={{
              maxHeight: '90vh',
              backgroundColor: themeStyles.cardBg,
            }}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b" style={{ borderColor: themeStyles.tableBorder }}>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={onClose}
                className="absolute right-2 sm:right-4 top-2 sm:top-4 hover:text-primary-100 focus:text-primary-100"
              />
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: themeStyles.text }}>
                My Cart ({cartCount} items)
              </h1>
            </div>

            {/* Search Bar */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b" style={{ borderColor: themeStyles.tableBorder }}>
              <Input
                placeholder="Search in cart..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<SearchOutlined className="site-form-item-icon" />}
                className="hover:border-primary-100 focus:border-primary-100"
              />
            </div>

            {/* Cart Content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 300px)' }}>
              {cartItems.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-4">
                  <ShoppingBag
                    className="mx-auto mb-4"
                    size={48}
                    strokeWidth={1.5}
                    style={{ color: primaryColor }}
                  />
                  <p className="text-lg sm:text-xl mb-4" style={{ color: themeStyles.text }}>
                    Your cart is empty
                  </p>
                  <Button
                    type="primary"
                    onClick={() => {
                      onClose();
                      navigate('/');
                    }}
                    style={{
                      backgroundColor: primaryColor,
                      height: '40px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                    }}
                    className="hover:bg-primary-hover text-white"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-2 sm:p-6">
                  <Table
                    columns={getColumns(windowWidth)}
                    dataSource={cartItems}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: true, y: 400 }}
                    className="cart-table"
                    onRow={(record) => ({
                      onClick: () => {
                        // Handle row click if needed
                      },
                    })}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 border-t" style={{
                borderColor: themeStyles.tableBorder,
                backgroundColor: themeStyles.cardBg
              }}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
                  <div className="text-base sm:text-lg font-medium" style={{ color: themeStyles.text }}>
                    Total: ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </div>
                  <Button
                    type="primary"
                    onClick={() => {
                      onClose();
                      navigate('/Checkout');
                    }}
                    className="w-full sm:w-auto !text-white hover:!text-white bg-[#EA9029] hover:bg-[#D68324] font-medium"
                    style={{
                      height: '40px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CartModal;