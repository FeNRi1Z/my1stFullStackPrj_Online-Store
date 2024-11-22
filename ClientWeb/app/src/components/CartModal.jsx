import React, { useState, useEffect } from 'react';
import { Table, Input, Button, ConfigProvider, theme as antdTheme } from 'antd';
import { SearchOutlined, AudioOutlined, MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
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

  // hardcode custom css antd
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

  const columns = [
    {
      title: 'Book',
      dataIndex: 'title',
      align: 'left',
      width: '40%',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div className="flex items-center gap-4">
          <img src={record.cover} alt={text} className="w-16 h-24 object-cover rounded" />
          <div className="min-w-0">
            <h3 className="font-medium truncate" style={{ color: themeStyles.text }}>{text}</h3>
            <p className="text-gray-600 dark:text-gray-400 truncate">{record.author}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'center',
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <div className="text-center">
          ${price.toFixed(2)}
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      align: 'center',
      width: '25%',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            icon={<MinusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity - 1)}
            disabled={record.quantity <= 1}
            className="flex items-center justify-center hover:border-primary-100 focus:border-primary-100"
          />
          <span className="w-8 text-center">{record.quantity}</span>
          <Button
            icon={<PlusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity + 1)}
            disabled={record.quantity >= (record.maxQuantity || 99)}
            className="flex items-center justify-center hover:border-primary-100 focus:border-primary-100"
          />
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
    },
    {
      title: '',
      key: 'action',
      width: '8%',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center">
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={() => removeItem(record.id)}
            className="flex items-center justify-center"
          />
        </div>
      ),
    },
  ];


  if (!isOpen) return null;

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
            cellPaddingBlock: 16,
            cellPaddingInline: 16,
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

        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className="relative w-full max-w-4xl rounded-lg shadow-xl"
            style={{
              maxHeight: '90vh',
              backgroundColor: themeStyles.cardBg,
            }}
          >
            <div className="p-6 border-b" style={{ borderColor: themeStyles.tableBorder }}>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={onClose}
                className="absolute right-4 top-4 hover:text-primary-100 focus:text-primary-100"
              />
              <h1 className="text-2xl font-bold" style={{ color: themeStyles.text }}>
                My Cart ({cartCount} items)
              </h1>
            </div>

            <div className="px-6 py-4 border-b" style={{ borderColor: themeStyles.tableBorder }}>
              <Input
                placeholder="Search in cart..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<SearchOutlined className="site-form-item-icon" />}
                suffix={<AudioOutlined />}
                className="hover:border-primary-100 focus:border-primary-100"
              />
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 300px)' }}>
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl mb-4" style={{ color: themeStyles.text }}>
                    Your cart is empty
                  </p>
                  <Button
                    type="primary"
                    onClick={() => {
                      onClose();
                      navigate('/');
                    }}
                    style={{ backgroundColor: primaryColor }}
                    className="hover:bg-primary-hover"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-6">
                  <Table
                    columns={columns}
                    dataSource={cartItems}
                    rowKey="id"
                    pagination={false}
                    scroll={{ y: 400 }}
                  />
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t" style={{
                borderColor: themeStyles.tableBorder,
                backgroundColor: themeStyles.cardBg
              }}>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium" style={{ color: themeStyles.text }}>
                    Total: ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </div>
                  <Button
                    type="primary"
                    onClick={() => {
                      onClose();
                      navigate('/Checkout');
                    }}
                    className="!text-white hover:!text-white bg-[#EA9029] hover:bg-[#D68324] font-medium"
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