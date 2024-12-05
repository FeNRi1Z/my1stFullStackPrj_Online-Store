import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import { useCart } from "../components/cart/CartProvider";
import ScrollableTable from "../components/shared/ScrollableTable";
import { PenLine, ArrowRight, ArrowLeft, CheckCircle, Loader2, X, Minus, Plus } from "lucide-react";
import { App, Image } from "antd";
import config from "../config";
import NavBar from "../components/layout/Navbar";
import CartModal from "../components/cart/CartModal";
import SideNav from "../components/layout/SideNav";

const Checkout = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [addressModalVisible, setAddressModalVisible] = useState(false);
	const [phoneModalVisible, setPhoneModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [orderData, setOrderData] = useState(null);
	const [isCompleted, setIsCompleted] = useState(false);

	// New state for navbar-related functionality
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const navigate = useNavigate();
	const { user } = useAuth();
	const { cartItems, clearCart } = useCart();
	const { message } = App.useApp();

	const [userData, setUserData] = useState({
		address: "",
		phone: "",
	});

	useEffect(() => {
		if (user) {
			setUserData({
				address: user.address || "",
				phone: user.phone || "",
			});
		}
	}, [user]);

	const handleNextStep = async () => {
		if (currentStep === 2) {
			if (!paymentMethod) {
				message.warning("Please select a payment method");
				return;
			}

			if (!userData.address?.trim()) {
				message.warning("Please provide a delivery address");
				return;
			}

			const phoneRegex = /^0\d{9}$/;
			if (!phoneRegex.test(userData.phone)) {
				message.warning("Please provide a valid 10-digit phone number starting with 0");
				return;
			}

			const validItems = cartItems.filter(item => item.maxQuantity >= item.quantity);

			if (validItems.length === 0) {
				message.warning("All items in the cart are out of stock");
				return;
			}

			setIsLoading(true);
			try {
				const dataBody = {
					address: userData.address,
					phone: userData.phone,
					paymentMethod: paymentMethod,
					orderItems: validItems.map((item) => ({
						productId: parseInt(item.id),
						quantity: parseInt(item.quantity),
					})),
				};

				const response = await fetch(`${config.apiPath}/order/orderCreate`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': localStorage.getItem('token'),
					},
					body: JSON.stringify(dataBody),
				});

				const data = await response.json();

				if (response.ok) {
					await clearCart();
					setOrderData(data.newOrder);
					setIsCompleted(true);
					setCurrentStep(3);
					message.success("Order created successfully!");
				} else {
					throw new Error(data.error || "Failed to create order");
				}
			} catch (error) {
				console.error("Order creation error:", error);
				message.error(error.message || "Failed to create order");
			} finally {
				setIsLoading(false);
			}
		} else {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleMenuClick = () => {
		setIsSideNavOpen(true);
	};

	const handleSideNavClose = () => {
		setIsSideNavOpen(false);
	};


	const handleToMyOrder = () => {
		navigate('/orders');
	};

	const handleBack = () => {
		if (currentStep === 1) {
			const previousURL = localStorage.getItem('previousURL') || '/';
			navigate(previousURL);
		} else {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const calculateTotal = () => {
		const validItems = cartItems.filter(item => item.maxQuantity >= item.quantity);
		return validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
	};
	const Modal = ({ isOpen, onClose, title, children }) => {
		if (!isOpen) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
				<div className="bg-white dark:bg-background-dark w-full max-w-md rounded-lg shadow-lg">
					<div className="p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
						{children}
					</div>
				</div>
			</div>
		);
	};

	const renderItems = () => {
		const validItems = cartItems.filter(item => item.maxQuantity >= item.quantity);

		return (
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
												<Image
													src={`${config.apiPath}/uploads/product_img/${item.img}`}
													alt={item.name}
													className="object-cover rounded shrink-0"
												/>
											</div>
											<div className="min-w-0">
												<h3 className="text-text-dark dark:text-text-light truncate">{item.name}</h3>
												<p className="text-secondary-50 dark:text-secondary-100 truncate">{item.author}</p>
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
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<>
						<div className="space-y-4 w-full">
							<h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
								Confirm Items
							</h2>
							<div className="bg-white dark:bg-background-secondary-dark rounded-lg shadow">
								{renderItems()}
							</div>
						</div>
						<div className="space-y-3 w-full mt-4">
							<div className="flex justify-between items-center bg-white dark:bg-background-secondary-dark rounded-lg shadow p-4">
								<span className="text-text-dark dark:text-text-light font-semibold">
									Order Total:
								</span>
								<span className="text-text-dark dark:text-text-light text-xl font-bold">
									${calculateTotal().toFixed(2)}
								</span>
							</div>
						</div>
					</>
				);

			case 2:
				return (
					<div className="space-y-4 w-full">
						<h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
							Contact Information
						</h2>
						<div className="flex flex-col space-y-6">
							<div className="bg-white dark:bg-background-secondary-dark p-2 rounded-lg shadow">
								<div className="space-y-4">
									<div className="relative p-4 rounded-lg bg-gray-50 dark:bg-background-dark">
										<div className="font-medium mb-2 text-text-dark dark:text-text-light">Address</div>
										<div className="text-secondary-50 dark:text-secondary-100">{userData.address}</div>
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
									<div className="font-medium mb-2 text-text-dark dark:text-text-light">Phone</div>
									<div className="text-secondary-50 dark:text-secondary-100">{userData.phone}</div>
									<button
										onClick={() => setPhoneModalVisible(true)}
										className="absolute top-2 right-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
									>
										<PenLine className="w-4 h-4 text-text-dark dark:text-text-light" />
									</button>
								</div>
							</div>

							<div className="space-y-4">
								<h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-4">
									Payment Method
								</h2>

								<div
									className={`p-4 rounded-lg cursor-pointer transition-all
                    ${paymentMethod === "qr" ? "border-2 border-primary-100" : "border border-gray-200 dark:border-gray-700"}
                    bg-gray-50 dark:bg-background-dark
                    hover:border-primary-100`}
									onClick={() => setPaymentMethod("qr")}
								>
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
                    bg-gray-50/50 dark:bg-background-dark/50`}
								>
									<label className="flex items-center space-x-3 cursor-not-allowed">
										<input
											type="radio"
											name="paymentMethod"
											value="cod"
											disabled
											checked={false}
											className="form-radio text-gray-300 dark:text-gray-600"
										/>
										<div className="flex items-center gap-2">
											<span className="text-gray-400 dark:text-gray-500">Cash on Delivery</span>
											<span className="text-xs py-0.5 px-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
												Coming Soon
											</span>
										</div>
									</label>
								</div>

								{paymentMethod === "qr" && (
									<div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
										<p className="text-sm text-blue-700 dark:text-blue-300">
											After order confirmation, please upload your payment slip in the order history section.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-4 w-full">
						<h2 className="text-text-dark dark:text-text-light text-xl font-semibold mb-24">
							Order Complete
						</h2>
						<div className="flex flex-col items-center gap-6">
							<CheckCircle className="w-16 h-16 text-green-500" />
							<div className="text-center">
								<h2 className="text-2xl font-bold mb-2 text-text-dark dark:text-text-light">
									Order Success
								</h2>
								<p className="text-text-dark dark:text-text-light">Order ID: {orderData?.id}</p>
								<p className="text-text-dark dark:text-text-light">
									Order Date: {new Date().toLocaleString()}
								</p>
							</div>
							{paymentMethod === "qr" && (
								<p className="text-secondary-50 dark:text-secondary-100">
									Please upload payment slip to your order
								</p>
							)}
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	const handleAddressChange = () => {
		const address = document.getElementById("addressModal").value;
		setUserData({ ...userData, address });
		setAddressModalVisible(false);
	};

	const handlePhoneChange = () => {
		const phone = document.getElementById("phoneModal").value;
		setUserData({ ...userData, phone });
		setPhoneModalVisible(false);
	};

	const addressModal = (
		<Modal isOpen={addressModalVisible} title="Edit Address">
			<div className="mb-4">
				<div className="flex justify-between">
					<label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
						Address
					</label>
					<button
						type="button"
						onClick={() => setUserData({ ...userData, address: user.address })}
						className="text-gray-600 dark:text-gray-300 hover:text-primary-100 dark:hover:text-primary-100 underline text-sm mb-2"
					>
						Reset
					</button>
				</div>
				<textarea
					id="addressModal"
					name="address"
					rows="4"
					defaultValue={userData.address}
					placeholder="Enter your address"
					className="w-full px-3 py-2 border rounded-md 
					dark:bg-background-dark dark:border-gray-700
					text-text-dark dark:text-text-light
					focus:outline-none focus:ring-2 focus:ring-primary-100"
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
					onClick={handleAddressChange}
					className="px-4 py-2 bg-primary-100 text-white rounded-md
					hover:bg-primary-hover active:bg-primary-active"
				>
					Save
				</button>
			</div>
		</Modal>
	);

	const phoneModal = (
		<Modal isOpen={phoneModalVisible} title="Edit Phone Number">
			<div className="mb-4">
				<div className="flex justify-between">
					<label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
						Phone
					</label>
					<button
						type="button"
						onClick={() => setUserData({ ...userData, phone: user.phone })}
						className="text-gray-600 dark:text-gray-300 hover:text-primary-100 dark:hover:text-primary-100 underline text-sm mb-2"
					>
						Reset
					</button>
				</div>
				<input
					id="phoneModal"
					type="text"
					maxLength={10}
					name="phone"
					placeholder="Enter your phone number"
					defaultValue={userData.phone}
					className="w-full px-3 py-2 border rounded-md 
					dark:bg-background-dark dark:border-gray-700
					text-text-dark dark:text-text-light
					focus:outline-none focus:ring-2 focus:ring-primary-100"
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
					onClick={handlePhoneChange}
					className="px-4 py-2 bg-primary-100 text-white rounded-md
					hover:bg-primary-hover active:bg-primary-active"
				>
					Save
				</button>
			</div>
		</Modal>
	);

	return (
		<div className="min-h-screen bg-background-light dark:bg-background-dark">
			{/* Fixed Navbar */}
			<div className="fixed top-0 left-0 right-0 z-40">
				<NavBar
					onMenuClick={handleMenuClick}
					onCartOpen={() => setIsCartOpen(true)}
				/>
			</div>

			{/* Background Dim Overlay */}
			<div
				className={`fixed inset-0 bg-black transition-opacity duration-300 pointer-events-none ${isSideNavOpen ? 'opacity-50' : 'opacity-0'
					}`}
				style={{ zIndex: 20 }}
			/>

			{/* Main Content */}
			<div className="relative pt-16" onClick={() => isSideNavOpen && handleSideNavClose()}>
				<div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 transition-colors duration-300">
					<div className="w-full max-w-4xl rounded-lg shadow-lg bg-white dark:bg-background-secondary-dark">
						{/* Header and progress bar */}
						<div className="px-8 pt-8 pb-6">
							<h1 className="text-text-dark dark:text-text-light text-4xl font-bold text-center">
								Checkout
							</h1>
							<div className="mt-6">
								<div className="grid grid-cols-3 mb-3">
									<span className={`text-sm text-left ${currentStep >= 1 ? "text-primary-100" : "text-text-disabled"}`}>
										Confirm Items
									</span>
									<span className={`text-sm text-center ${currentStep >= 2 ? "text-primary-100" : "text-text-disabled"}`}>
										Payment
									</span>
									<span className={`text-sm text-right ${currentStep >= 3 ? "text-primary-100" : "text-text-disabled"}`}>
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

						{/* Main content */}
						<div className="px-8 pb-6">
							<div className="min-h-[480px]">{renderStep()}</div>

							{/* Navigation buttons */}
							<div className="flex justify-between mt-4">
								{currentStep !== 3 && (
									<button
										onClick={handleBack}
										className="flex items-center px-6 py-2 bg-white dark:bg-background-secondary-dark 
								 text-text-dark dark:text-text-light rounded-md 
								 border border-gray-200 dark:border-gray-700
								 hover:bg-gray-100 dark:hover:bg-gray-700
								 focus:outline-none transition-colors"
										disabled={isLoading}
									>
										<ArrowLeft className="w-4 h-4 mr-2" />
										{currentStep === 1 ? "Cancel" : "Previous"}
									</button>
								)}

								{currentStep === 3 ? (
									<button
										onClick={handleToMyOrder}
										className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
								 hover:bg-primary-hover active:bg-primary-active
								 focus:outline-none transition-colors ml-auto"
									>
										Go to My Orders
										<ArrowRight className="w-4 h-4 ml-2" />
									</button>
								) : (
									<button
										onClick={handleNextStep}
										className="flex items-center px-6 py-2 bg-primary-100 text-white rounded-md
								 hover:bg-primary-hover active:bg-primary-active
								 focus:outline-none transition-colors"
										disabled={isLoading}
									>
										{isLoading ? (
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										) : (
											<>
												{currentStep === 2 ? "Place Order" : "Next"}
												<ArrowRight className="w-4 h-4 ml-2" />
											</>
										)}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* SideNav */}
			<SideNav isOpen={isSideNavOpen} onClose={handleSideNavClose} />

			{/* Cart Modal */}
			<CartModal
				isOpen={isCartOpen}
				onClose={() => setIsCartOpen(false)}
			/>

			{addressModal}
			{phoneModal}
		</div>
	);
}

export default Checkout;