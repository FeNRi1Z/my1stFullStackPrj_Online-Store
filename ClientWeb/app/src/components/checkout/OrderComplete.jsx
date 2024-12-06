import { CheckCircle, Store, ArrowRight } from "lucide-react";

/**
 * OrderComplete component show order status success page 
 * if order create request was success
 */

export const OrderComplete = ({ orderData, paymentMethod, onToStore, onToOrders }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[480px] w-full">
            <div className="flex flex-col items-center gap-6 mb-8">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2 text-text-dark dark:text-text-light">
                        Order Success
                    </h2>
                    <p className="text-text-dark dark:text-text-light">
                        Order ID: {orderData?.id}
                    </p>
                    <p className="text-text-dark dark:text-text-light">
                        Order Date: {new Date().toLocaleString()}
                    </p>
                </div>
                {paymentMethod === "qr" && (
                    <div className="text-center">
                        <p className="text-secondary-50 dark:text-secondary-100">
                            Account number: 123-456-7890
                        </p>
                        <p className="text-secondary-50 dark:text-secondary-100">
                            Please upload payment slip to your order
                        </p>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onToStore}
                    className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
            hover:bg-primary-hover active:bg-primary-active
            focus:outline-none transition-colors"
                >
                    Continue Shopping
                    <Store className="w-4 h-4 ml-2" />
                </button>
                <button
                    onClick={onToOrders}
                    className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
            hover:bg-primary-hover active:bg-primary-active
            focus:outline-none transition-colors"
                >
                    Go to My Orders
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        </div>
    );
};