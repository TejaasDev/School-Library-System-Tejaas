
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookPlus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center space-x-3 px-6 py-4 rounded-xl font-bold transition-all ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`
        }
    >
        <Icon size={24} />
        <span className="text-lg">{children}</span>
    </NavLink>
);

const Navbar = () => {
    return (
        <nav className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 p-8 flex flex-col">
            <div className="flex items-center space-x-3 mb-16 px-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <BookPlus size={24} />
                </div>
                <span className="text-2xl font-black tracking-tight text-gray-900">LibSys</span>
            </div>

            <div className="flex-1 space-y-4">
                <NavItem to="/" icon={LayoutDashboard}>Dashboard</NavItem>
                <NavItem to="/issue" icon={ArrowUpRight}>Issue Book</NavItem>
                <NavItem to="/return" icon={ArrowDownLeft}>Return Book</NavItem>
                <NavItem to="/add" icon={BookPlus}>Add Books</NavItem>
            </div>

            <div className="mt-auto border-t border-gray-100 pt-8">
                <div className="flex items-center space-x-4 px-4 py-2 hover:bg-red-50 rounded-xl cursor-pointer group transition">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-red-100 group-hover:text-red-600">
                        <span className="font-bold">L</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 group-hover:text-red-700">Librarian</p>
                        <p className="text-sm text-gray-500 font-medium group-hover:text-red-600">Logout</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
