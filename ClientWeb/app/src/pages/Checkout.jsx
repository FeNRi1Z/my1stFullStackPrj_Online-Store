import React, { useState } from 'react';
import {
    PenLine,
    ArrowRight,
    ArrowLeft,
    ChevronRight,
    CheckCircle
} from 'lucide-react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartProvider';
import { useTheme } from '../components/ThemeProvider';
import ScrollableTable from '../components/ScrollableTable';

const Checkout = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { cartItems } = useCart();

    {/* Mock user data */ }
    const [userData, setUserData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Book Street, Reading City, 10000',
        phone: '+1 234-567-8900'
    });

    {/* Handle address modal update */ }
    const handleAddressUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const address = formData.get('address');

        if (address) {
            setUserData(prev => ({
                ...prev,
                address
            }));
            setAddressModalVisible(false);
        }
    };

    {/* Handle phone modal update */ }
    const handlePhoneUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const phone = formData.get('phone');

        if (phone && /^[+]?[\d\s-]+$/.test(phone)) {
            setUserData(prev => ({
                ...prev,
                phone
            }));
            setPhoneModalVisible(false);
        }
    };

    message.config({
        top: 24,
        duration: 2,
        maxCount: 1,
    });

    const handleNextStep = () => {
        if (currentStep === 2 && !paymentMethod) {
            message.warning({
                content: 'Please select a payment method',
                className: `custom-message ${theme === 'dark' ? 'dark' : 'light'}`
            });
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-background-dark w-full max-w-md rounded-lg shadow-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4">
                            {title}
                        </h3>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    const renderItems = () => (
        <div className="relative rounded-lg overflow-hidden">
            {/* Fixed header */}
            <div className="bg-white dark:bg-background-secondary-dark">
                <table className="w-full">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="sticky top-0 py-4 px-6 text-left bg-white dark:bg-background-secondary-dark text-text-dark dark:text-text-light">Book</th>
                            <th className="sticky top-0 py-4 px-6 text-left bg-white dark:bg-background-secondary-dark text-text-dark dark:text-text-light w-24">Price</th>
                            <th className="sticky top-0 py-4 px-6 text-left bg-white dark:bg-background-secondary-dark text-text-dark dark:text-text-light w-24">Quantity</th>
                            <th className="sticky top-0 py-4 px-6 text-left bg-white dark:bg-background-secondary-dark text-text-dark dark:text-text-light w-24">Total</th>
                        </tr>
                    </thead>
                </table>
            </div>

            {/* Scrollable body */}
            <ScrollableTable>
                <table className="w-full">
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id} className="border-b dark:border-gray-700 bg-white dark:bg-background-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="py-4 px-6 min-w-[280px]">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            className="w-16 h-24 object-cover rounded shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="text-text-dark dark:text-text-light truncate">
                                                {item.title}
                                            </h3>
                                            <p className="text-secondary-50 dark:text-secondary-100 truncate">
                                                {item.author}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-text-dark dark:text-text-light w-24">
                                    ${item.price.toFixed(2)}
                                </td>
                                <td className="py-4 px-6 text-text-dark dark:text-text-light w-24">
                                    {item.quantity}
                                </td>
                                <td className="py-4 px-6 text-text-dark dark:text-text-light w-24">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollableTable>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4 w-full">
                        <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
                            Confirm Items
                        </h2>
                        <div className="bg-white dark:bg-background-secondary-dark rounded-lg shadow">
                            {renderItems()}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4 w-full">
                        <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
                            Payment Method
                        </h2>
                        <div className="flex flex-col space-y-6">
                            <div className="bg-white dark:bg-background-secondary-dark p-2 rounded-lg shadow">
                                <div className="space-y-4">
                                    <div className="relative p-4 rounded-lg bg-gray-50 dark:bg-background-dark">
                                        <div className="font-medium mb-2 text-text-dark dark:text-text-light">
                                            Address
                                        </div>
                                        <div className="text-secondary-50 dark:text-secondary-100">
                                            {userData.address}
                                        </div>
                                        <button
                                            onClick={() => setAddressModalVisible(true)}
                                            className="absolute top-2 right-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                        >
                                            <PenLine className="w-4 h-4 text-text-dark dark:text-text-light" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-background-secondary-dark p-2 rounded-lg shadow">
                                <div className="relative p-4 rounded-lg bg-gray-50 dark:bg-background-dark">
                                    <div className="font-medium mb-2 text-text-dark dark:text-text-light">
                                        Phone
                                    </div>
                                    <div className="text-secondary-50 dark:text-secondary-100">
                                        {userData.phone}
                                    </div>
                                    <button
                                        onClick={() => setPhoneModalVisible(true)}
                                        className="absolute top-2 right-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                    >
                                        <PenLine className="w-4 h-4 text-text-dark dark:text-text-light" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { value: 'cod', label: 'Cash on Delivery' },
                                    { value: 'qr', label: 'Bank Transfer' },
                                    // { value: 'credit', label: 'Credit Card' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        className={`p-4 rounded-lg cursor-pointer transition-all
                                                  ${paymentMethod === option.value
                                                ? 'border-2 border-primary-100'
                                                : 'border border-gray-200 dark:border-gray-700'}
                                                  bg-gray-50 dark:bg-background-dark
                                                  hover:border-primary-100`}
                                        onClick={() => setPaymentMethod(option.value)}
                                    >
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={option.value}
                                                checked={paymentMethod === option.value}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="form-radio text-primary-100"
                                            />
                                            <span className="text-text-dark dark:text-text-light">
                                                {option.label}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4 w-full">
                        <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
                            Complete Order
                        </h2>
                        <div className="flex flex-col items-center gap-6">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2 text-text-dark dark:text-text-light">
                                    Order Success
                                </h2>
                                <p className="text-text-dark dark:text-text-light">
                                    Order ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                                </p>
                                <p className="text-text-dark dark:text-text-light">
                                    Order Date: {new Date().toLocaleDateString()}
                                </p>
                            </div>
                            {paymentMethod === 'qr' && (
                                <p className="text-secondary-50 dark:text-secondary-100">
                                    Please upload payment slip at order history
                                </p>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    {/* Modal section */ }
    const addressModal = (
        <Modal
            isOpen={addressModalVisible}
            onClose={() => setAddressModalVisible(false)}
            title="Edit Address"
        >
            <form onSubmit={handleAddressUpdate}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                        Address
                    </label>
                    <textarea
                        name="address"
                        rows="4"
                        defaultValue={userData.address}
                        className="w-full px-3 py-2 border rounded-md 
                                 dark:bg-background-dark dark:border-gray-700
                                 text-text-dark dark:text-text-light
                                 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => setAddressModalVisible(false)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 
                                 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-100 text-white rounded-md
                                 hover:bg-primary-hover active:bg-primary-active"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );

    const phoneModal = (
        <Modal
            isOpen={phoneModalVisible}
            onClose={() => setPhoneModalVisible(false)}
            title="Edit Phone Number"
        >
            <form onSubmit={handlePhoneUpdate}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phone"
                        defaultValue={userData.phone}
                        pattern="^[+]?[\d\s-]+$"
                        className="w-full px-3 py-2 border rounded-md 
                                 dark:bg-background-dark dark:border-gray-700
                                 text-text-dark dark:text-text-light
                                 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => setPhoneModalVisible(false)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 
                                 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-100 text-white rounded-md
                                 hover:bg-primary-hover active:bg-primary-active"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 transition-colors duration-300">
            <div className="w-full max-w-4xl rounded-lg shadow-lg">
                <div className="px-8 pt-8 pb-6">
                    <h1 className="text-text-dark dark:text-text-light text-4xl font-bold text-center">
                        Checkout
                    </h1>

                    <div className="mt-6">
                        <div className="grid grid-cols-3 mb-2">
                            <span className={`text-sm text-left ${currentStep >= 1 ? 'text-primary-100' : 'text-text-disabled'
                                }`}>
                                Confirm Items
                            </span>
                            <span className={`text-sm text-center ${currentStep >= 2 ? 'text-primary-100' : 'text-text-disabled'
                                }`}>
                                Payment
                            </span>
                            <span className={`text-sm text-right ${currentStep >= 3 ? 'text-primary-100' : 'text-text-disabled'
                                }`}>
                                Complete
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                            <div
                                className="h-full bg-primary-100 rounded-full transition-all duration-300"
                                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-6">
                    <div className="min-h-[480px]">
                        {renderStep()}
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => currentStep === 1 ? navigate('/') : setCurrentStep(prev => prev - 1)}
                            className="flex items-center px-6 py-2 bg-white dark:bg-background-secondary-dark 
                             text-text-dark dark:text-text-light rounded-md 
                             border border-gray-200 dark:border-gray-700
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             focus:outline-none transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {currentStep === 1 ? 'Back to Home' : 'Previous'}
                        </button>

                        {currentStep < 3 && (
                            <button
                                onClick={handleNextStep}
                                className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
                                 hover:bg-primary-hover active:bg-primary-active
                                 focus:outline-none transition-colors"
                            >
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        )}
                        {currentStep === 3 && (
                            <button
                                onClick={() => navigate('/Orders')}
                                className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
                                 hover:bg-primary-hover active:bg-primary-active
                                 focus:outline-none transition-colors"
                            >
                                Order history
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        )}
                    </div>
                </div>

                {addressModal}
                {phoneModal}
            </div>
        </div>
    );
};

export default Checkout;