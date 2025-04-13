
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { getCurrentUser, isLoggedIn } from '@/utils/authUtils';

const Header = () => {
  const currentUser = getCurrentUser();
  const isUserLoggedIn = isLoggedIn();
  
  const getRedirectPath = () => {
    if (!isUserLoggedIn) return '/';
    return currentUser?.role === 'student' ? '/token' : '/student-data';
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to={getRedirectPath()} className="flex items-center gap-2">
          <Home className="h-5 w-5 text-tripti-primary" />
          <span className="text-tripti-primary font-heading font-bold text-2xl">TRIPTI</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
