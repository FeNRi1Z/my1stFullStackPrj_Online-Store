import { Image } from "antd";
import ScrollableTable from "../shared/ScrollableTable";
import config from "../../config";

/**
 * CartSearch component
 * serve for making antd search work.
 */

export const OrderSummary = ({ cartItems, calculateTotal }) => {
  const validItems = cartItems.filter((item) => item.maxQuantity >= item.quantity);

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">Confirm Items</h2>
      <div className="bg-white dark:bg-background-secondary-dark rounded-lg shadow">
        <div className="relative rounded-lg overflow-hidden">
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
          <ScrollableTable>
            <table className="w-full">
              <tbody>
                {validItems.map((item) => (
                  <tr key={item.id} className="border-b dark:border-gray-700 bg-white dark:bg-background-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-6 min-w-[280px]">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-24">
                          <Image src={`${config.apiPath}/uploads/product_img/${item.img}`} alt={item.name} className="object-cover rounded shrink-0" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-text-dark dark:text-text-light truncate">{item.name}</h3>
                          <p className="text-secondary-50 dark:text-secondary-100 truncate">{item.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-dark dark:text-text-light w-24">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-text-dark dark:text-text-light w-24">{item.quantity}</td>
                    <td className="py-4 px-6 text-text-dark dark:text-text-light w-24">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableTable>
        </div>
      </div>
      <div className="flex justify-between items-center bg-white dark:bg-background-secondary-dark rounded-lg shadow p-4">
        <span className="text-text-dark dark:text-text-light font-semibold">Order Total:</span>
        <span className="text-text-dark dark:text-text-light text-xl font-bold">${calculateTotal().toFixed(2)}</span>
      </div>
    </div>
  );
};