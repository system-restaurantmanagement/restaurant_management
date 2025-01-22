import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">
              Restaurant Management System
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Back to Menu
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
