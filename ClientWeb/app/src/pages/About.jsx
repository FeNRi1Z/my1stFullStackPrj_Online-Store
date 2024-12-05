import React, { useState, useRef } from "react";
import { useTheme } from "../components/theme/ThemeProvider.jsx";
import NavBar from "../components/layout/Navbar.jsx";
import SideNav from "../components/layout/SideNav.jsx";
import CartModal from "../components/cart/CartModal.jsx";
import { Image } from "antd";

const About = () => {
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const { theme } = useTheme();
	const storeRef = useRef(null);

	const handleMenuClick = () => {
		setIsSideNavOpen(true);
	};

	const handleSideNavClose = () => {
		setIsSideNavOpen(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background-dark dark:to-background-dark">
			{/* Fixed Navbar */}
			<div className="fixed top-0 left-0 right-0 z-40">
				<NavBar onMenuClick={handleMenuClick} onCartOpen={() => setIsCartOpen(true)} />
			</div>

			{/* Background Dim Overlay */}
			<div className={`fixed inset-0 bg-black transition-opacity duration-300 pointer-events-none ${isSideNavOpen ? "opacity-50" : "opacity-0"}`} style={{ zIndex: 20 }} />

			{/* Main Content */}
			<div className="relative" onClick={() => isSideNavOpen && handleSideNavClose()}>
				<section ref={storeRef} className="min-h-screen pt-16 pb-12">
					<div className="min-h-screen flex items-center justify-center px-4">
						<div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-transparent shadow-lg rounded-lg p-8">
							{/* Text Section */}
							<div className="space-y-6 space-x-1">
								<h1 className="text-5xl font-extrabold text-text-dark dark:text-text-light transition-colors duration-300">About Us</h1>
								<h2 className="text-xl font-semibold text-text-dark dark:text-text-light transition-colors duration-200 whitespace-nowrap max-w-2xl">
									"Books aren’t just our business; they’re our passion. Let’s share the love of reading together."
								</h2>
								<div>
									<p className="text-md text-gray-600 dark:text-gray-300 max-w-2xl whitespace-nowrap">
										The "Mod-ed Online Bookstore" project focuses on creating a modern, customer-centric platform for purchasing paperback books.
									</p>
									<p className="text-md text-gray-600 dark:text-gray-300 max-w-2xl whitespace-nowrap">
										In a world where digital content often overshadows traditional reading formats, this bookstore prioritizes the tangible charm and
									</p>
									<p className="text-md text-gray-600 dark:text-gray-300 max-w-2xl whitespace-nowrap">
										and enduring value of physical books. By offering a streamlined and accessible online experience, the "Mod-ed Online Bookstore"
									</p>
									<p className="text-md text-gray-600 dark:text-gray-300 max-w-2xl whitespace-nowrap">
                                        seeks to serve readers who prefer the authenticity of paperbacks while addressing key challenges in the book retail front store.
									</p>
								</div>
							</div>

							{/* Logo Section */}
							<div className="relative flex justify-center">
								<Image preview={false} src="MODED_LOGO512.png" className="w-full max-w-md mx-auto relative z-10 rounded-xl shadow-lg" />
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* SideNav */}
			<SideNav isOpen={isSideNavOpen} onClose={handleSideNavClose} />

			{/* Cart Modal */}
			<CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
		</div>
	);
};

export default About;
