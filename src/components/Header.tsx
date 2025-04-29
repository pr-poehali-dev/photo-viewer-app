import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

interface HeaderProps {
  albumTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ albumTitle }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-bold text-primary">
              ФотоГалерея
            </Link>
            
            {!isHomePage && (
              <div className="flex items-center text-gray-500 text-sm">
                <ChevronRight size={16} />
                <div className="flex items-center">
                  <Link to="/" className="hover:text-primary transition-colors flex items-center">
                    <Home size={14} className="mr-1" />
                    <span>Главная</span>
                  </Link>
                  
                  {albumTitle && (
                    <>
                      <ChevronRight size={14} className="mx-1" />
                      <span className="font-medium truncate max-w-[200px]">
                        {albumTitle}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
