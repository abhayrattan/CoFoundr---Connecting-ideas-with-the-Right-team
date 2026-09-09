import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import Avatar from './ui/Avatar';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 h-16 flex items-center px-4 sm:px-6 shadow-sm">
      <div className="flex-1 flex justify-between items-center">
        
        {/* Left side */}
        <div className="flex items-center">
          {user && (
            <button
              onClick={onMenuClick}
              className="mr-4 lg:hidden p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {!user && (
            <Link to="/" className="flex items-center space-x-2 mr-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-glow">C</div>
              <span className="font-bold text-xl tracking-tight text-slate-900">CoFoundr</span>
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <NotificationDropdown />
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <Link to="/profile" className="flex items-center space-x-2 hover:bg-slate-50 py-1.5 px-3 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                <Avatar name={user.name} size="sm" />
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.name.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-slate-500 hover:text-rose-600 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-rose-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">Log in</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
