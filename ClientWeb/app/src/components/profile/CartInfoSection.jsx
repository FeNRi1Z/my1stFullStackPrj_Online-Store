export const CartInfoSection = ({ cartQty, cartTotal }) => (
    <div className="p-4 bg-gray-50 dark:bg-background-dark rounded-lg">
        <div className="space-y-2">
            <div>
                <p className="text-sm text-gray-500">Items in Cart</p>
                <p className="font-medium text-text-dark dark:text-text-light">{cartQty}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Cart Total</p>
                <p className="font-medium text-text-dark dark:text-text-light">
                    ${cartTotal?.toFixed(2) || "0.00"}
                </p>
            </div>
        </div>
    </div>
);
