import React, { useState } from "react";
import { Menu, ShoppingBag, Moon, Sun, User } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";
import { useCart } from "../cart/CartProvider";
import { useAuth } from "../auth/AuthProvider";
import SideNav from "./SideNav";
import ProfileDropdown from "../profile/ProfileDropdown";
import { Image } from "antd";
import config from "../../config";

const ThemeToggleButton = ({ children, onClick, showThemeToggle }) =>
	showThemeToggle && (
		<button
			onClick={onClick}
			className="w-10 h-10 rounded-full transition-all duration-300 ease-in-out 
                hover:bg-gray-200 dark:hover:bg-gray-700 
                flex items-center justify-center"
			aria-label="Toggle theme">
			{children}
		</button>
	);

const NavLink = ({ to, children }) => (
	<Link
		to={to}
		className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white
             transition-colors px-4 py-2">
		{children}
	</Link>
);

const NavBar = ({ onCartOpen, showThemeToggle = true, onViewChange }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { theme, toggleTheme } = useTheme();
	const { cartCount } = useCart();
	const { user, isAuthenticated } = useAuth();
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

	const handleProfileClick = () => {
		if (isAuthenticated) {
			setIsProfileDropdownOpen(!isProfileDropdownOpen);
		} else {
			navigate("/signin", { state: { from: location } });
		}
	};

	// Check if current path is checkout
	const isCheckoutPage = location.pathname === '/checkout';

	return (
		<>
			<nav className="w-full bg-white dark:bg-background-dark shadow-sm transition-all duration-300 ease-in-out">
				<div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-2 w-[95%] 2xl:w-[95%]">
					<div className="flex justify-between items-center py-4">
						{/* Left side - Menu button and Navigation links */}
						<div className="flex items-center">
							<button
								onClick={() => setIsSideNavOpen(true)}
								className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-background-secondary-dark 
                       transition-colors md:hidden"
								aria-label="Open menu">
								<Menu className="h-6 w-6 text-text-dark dark:text-text-light" />
							</button>

							<div className="hidden md:flex items-center space-x-4 ml-4">
								<NavLink to="/">Home</NavLink>
								<NavLink to="/store">Store</NavLink>
								<NavLink to="/about">About</NavLink>
							</div>
						</div>

						{/* Right side - Icons group */}
						<div className="flex items-center gap-4">
							{/* Cart Button - Only show if not on checkout page */}
							{!isCheckoutPage && (
								<button
									onClick={onCartOpen}
									className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-background-secondary-dark 
                         transition-colors"
									aria-label="Shopping cart">
									<ShoppingBag className="h-6 w-6 text-text-dark dark:text-text-light hover:text-primary-100 dark:hover:text-primary-100" />
									{cartCount > 0 && (
										<span
											className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center 
                             justify-center bg-primary-100 text-white rounded-full">
											{cartCount}
										</span>
									)}
								</button>
							)}

							{/* Theme Toggle */}
							<ThemeToggleButton onClick={toggleTheme} showThemeToggle={showThemeToggle}>
								{theme === "light" ? <Moon className="h-6 w-6 text-text-dark hover:text-primary-100" /> : <Sun className="h-6 w-6 text-text-light hover:text-primary-100" />}
							</ThemeToggleButton>

							{/* Profile Button/Avatar with Dropdown */}
							<div className="relative">
								{isAuthenticated ? (
									<button
										onClick={handleProfileClick}
										className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 hover:ring-2 hover:ring-primary-100 transition-all duration-200 flex items-center justify-center overflow-hidden"
										aria-label="Profile menu">
										{user.profile && user.profile !== "noIMGFile" ? (
											<Image src={config.apiPath + "/uploads/user_img/" + user.profile} className="img-circle elevation-2" preview={false} />
										) : (
											<span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name.charAt(0).toUpperCase()}</span>
										)}
									</button>
								) : (
									<button
										onClick={handleProfileClick}
										className="group inline-flex items-center px-6 py-3 bg-primary-100 text-white text-base font-medium rounded-md hover:text-white hover:bg-primary-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
										aria-label="Sign in">
										Sign in
									</button>
								)}

								{isAuthenticated && (
									<ProfileDropdown
										isOpen={isProfileDropdownOpen}
										onClose={() => setIsProfileDropdownOpen(false)}
										onViewChange={onViewChange}
									/>
								)}

							</div>
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile SideNav */}
			<SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} isAuthenticated={isAuthenticated} user={user} />
		</>
	);
};

export default NavBar;