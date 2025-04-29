import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  albumTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ albumTitle }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-bold text-primary">
              ФотоГалерея
            </Link>
            
            {albumTitle && (
              <div className="text-gray-500 text-sm ml-2">
                / <span className="font-medium">{albumTitle}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
