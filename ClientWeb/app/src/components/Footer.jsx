import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-primary-100 text-gray-950 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-xl font-bold">Mod-Ed Company</h1>
                        <p className="text-sm">© 2024 Mod-Ed Company. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="/" className="text-gray-950 hover:text-gray-200">Home</a>
                        <a href="#" className="text-gray-950 hover:text-gray-200">Store</a>
                        <a href="#" className="text-gray-950 hover:text-gray-200">About</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;