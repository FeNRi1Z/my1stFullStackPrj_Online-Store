import React from 'react';
import NavBar from "../layout/Navbar";
import SideNav from "../layout/SideNav";
import CartModal from "../cart/CartModal";

/**
 * CheckoutLayout component
 * serve for layout of multistep form.
 */

export const CheckoutLayout = ({ children, isSideNavOpen, isCartOpen, onMenuClick, onCartClose, onSideNavClose }) => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40">
                <NavBar onMenuClick={onMenuClick} onCartOpen={() => isCartOpen(true)} />
            </div>

            {/* Background Dim Overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 pointer-events-none ${isSideNavOpen ? "opacity-50" : "opacity-0"
                    }`}
                style={{ zIndex: 20 }}
            />

            {/* Main Content */}
            <div className="relative pt-16" onClick={() => isSideNavOpen && onSideNavClose()}>
                <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 transition-colors duration-300">
                    <div className="w-full max-w-4xl rounded-lg shadow-lg bg-white dark:bg-background-secondary-dark">
                        {children}
                    </div>
                </div>
            </div>

            {/* SideNav */}
            <SideNav isOpen={isSideNavOpen} onClose={onSideNavClose} />

            {/* Cart Modal */}
            <CartModal isOpen={isCartOpen} onClose={onCartClose} />
        </div>
    );
};