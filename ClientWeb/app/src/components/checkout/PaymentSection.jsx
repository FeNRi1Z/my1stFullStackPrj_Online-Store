import { PenLine } from "lucide-react";

/**
 * PaymentSection component
 * serve for showing payment option in multistep form.
 */


export const PaymentSection = ({ 
  userData, 
  paymentMethod, 
  setPaymentMethod, 
  onEditAddress, 
  onEditPhone 
}) => {
  return (
    <div className="space-y-4 w-full">
      <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">Contact Information</h2>
      <div className="flex flex-col space-y-6">
        <div className="bg-white dark:bg-background-secondary-dark p-2 rounded-lg shadow">
          <div className="relative p-4 rounded-lg bg-gray-50 dark:bg-background-dark">
            <div className="font-medium mb-2 text-text-dark dark:text-text-light">Address</div>
            <div className="text-secondary-50 dark:text-secondary-100">{userData.address}</div>
            <button onClick={onEditAddress} className="absolute top-2 right-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
              <PenLine className="w-4 h-4 text-text-dark dark:text-text-light" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-background-secondary-dark p-2 rounded-lg shadow">
          <div className="relative p-4 rounded-lg bg-gray-50 dark:bg-background-dark">
            <div className="font-medium mb-2 text-text-dark dark:text-text-light">Phone</div>
            <div className="text-secondary-50 dark:text-secondary-100">{userData.phone}</div>
            <button onClick={onEditPhone} className="absolute top-2 right-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
              <PenLine className="w-4 h-4 text-text-dark dark:text-text-light" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">Payment Method</h2>

          <div
            className={`p-4 rounded-lg cursor-pointer transition-all
              ${paymentMethod === "qr" ? "border-2 border-primary-100" : "border border-gray-200 dark:border-gray-700"}
              bg-gray-50 dark:bg-background-dark
              hover:border-primary-100`}
            onClick={() => setPaymentMethod("qr")}>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="qr"
                checked={paymentMethod === "qr"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-primary-100"
              />
              <span className="text-text-dark dark:text-text-light">Bank Transfer</span>
            </label>
          </div>

          <div
            className={`p-4 rounded-lg cursor-not-allowed transition-all
              border border-gray-200 dark:border-gray-700
              bg-gray-50/50 dark:bg-background-dark/50`}>
            <label className="flex items-center space-x-3 cursor-not-allowed">
              <input type="radio" name="paymentMethod" value="cod" disabled checked={false} className="form-radio text-gray-300 dark:text-gray-600" />
              <div className="flex items-center gap-2">
                <span className="text-gray-400 dark:text-gray-500">Cash on Delivery</span>
                <span className="text-xs py-0.5 px-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">Coming Soon</span>
              </div>
            </label>
          </div>

          {paymentMethod === "qr" && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">After order confirmation, please upload your payment slip in the order history section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};