
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-tripti-primary font-heading font-bold text-2xl">TRIPTI</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
