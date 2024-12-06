import React from 'react';
import { CheckoutLayout } from '../components/checkout/CheckoutLayout';
import { StepIndicator } from '../components/checkout/StepIndicator';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentSection } from '../components/checkout/PaymentSection';
import { OrderComplete } from '../components/checkout/OrderComplete';
import { CheckoutNavigationButton } from '../components/checkout/CheckoutNavigationButton';
import { EditDialog } from '../components/checkout/EditDialog';
import { useCheckoutState } from '../hooks/checkout/useCheckoutState';
import { useOrderSubmission } from '../hooks/checkout/useOrderSubmission';
import { useContactInfo } from '../hooks/checkout/useContactInfo';

const Checkout = () => {
	const {
		currentStep,
		isSideNavOpen,
		isCartOpen,
		setCurrentStep,
		handleNavigation,
		handleNav
	} = useCheckoutState();

	const {
		isLoading,
		orderData,
		submitOrder,
		calculateTotal,
		cartItems
	} = useOrderSubmission();

	const {
		userData,
		paymentMethod,
		setPaymentMethod,
		modalControls
	} = useContactInfo();

	const handleNext = async () => {
		if (currentStep === 1) {
			setCurrentStep(2);
		} else if (currentStep === 2) {
			const success = await submitOrder(userData, paymentMethod, setCurrentStep);
			if (success) {
				setCurrentStep(3);
			}
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<OrderSummary
						cartItems={cartItems}
						calculateTotal={calculateTotal}
					/>
				);
			case 2:
				return (
					<PaymentSection
						userData={userData}
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
						onEditAddress={modalControls.address.open}
						onEditPhone={modalControls.phone.open}
					/>
				);
			case 3:
				return (
					<OrderComplete
						orderData={orderData}
						paymentMethod={paymentMethod}
						onToStore={handleNavigation.toStore}
						onToOrders={handleNavigation.toOrders}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<CheckoutLayout
			isSideNavOpen={isSideNavOpen}
			isCartOpen={isCartOpen}
			onMenuClick={handleNav.openSideNav}
			onCartClick={handleNav.openCart} 
			onCartClose={handleNav.closeCart}
			onSideNavClose={handleNav.closeSideNav}
		>
			<div className="w-full">
				<StepIndicator currentStep={currentStep} />

				<div className="px-8 pb-8">
					{renderStepContent()}

					<CheckoutNavigationButton
						currentStep={currentStep}
						isLoading={isLoading}
						onBack={handleNavigation.back}
						onNext={handleNext}
					/>
				</div>

				<EditDialog
					isOpen={modalControls.address.isOpen}
					onClose={modalControls.address.close}
					title="Edit Delivery Address"
				>
					<textarea
						id="addressModal"
						className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
						defaultValue={userData.address}
						rows={4}
					/>
					<div className="flex justify-end gap-2 mt-4">
						<button
							onClick={modalControls.address.reset}
							className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
						>
							Reset
						</button>
						<button
							onClick={modalControls.address.handleChange}
							className="px-4 py-2 bg-primary-100 text-white rounded-md hover:bg-primary-hover"
						>
							Save
						</button>
					</div>
				</EditDialog>

				<EditDialog
					isOpen={modalControls.phone.isOpen}
					onClose={modalControls.phone.close}
					title="Edit Phone Number"
				>
					<input
						id="phoneModal"
						type="tel"
						className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
						defaultValue={userData.phone}
					/>
					<div className="flex justify-end gap-2 mt-4">
						<button
							onClick={modalControls.phone.reset}
							className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
						>
							Reset
						</button>
						<button
							onClick={modalControls.phone.handleChange}
							className="px-4 py-2 bg-primary-100 text-white rounded-md hover:bg-primary-hover"
						>
							Save
						</button>
					</div>
				</EditDialog>
			</div>
		</CheckoutLayout>
	);
};

export default Checkout;