import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Header: React.FC = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold">Good morning, Admin 👋</h1>
                <p className="text-sm text-gray-500">{currentDate}</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
                <div className="flex items-center space-x-2">
                    {/* <img
                        src="/path-to-profile-pic.jpg"
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    /> */}
                    <span className="text-sm font-medium">Super Admin</span>
                </div>
            </div>
        </header>
    );
};

export default Header;