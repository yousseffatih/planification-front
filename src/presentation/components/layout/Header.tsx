import React from 'react';
import { useAppSelector } from '../../../application/hooks/redux.hooks';

export const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  console.log('User in Header:', user);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          
        </div>

        <div className="flex items-center gap-4">
          {/* <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
          </button> */}

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user ? `${user.prenom} ${user.nom}` : 'User'}
              </p>
              <p className="text-xs text-gray-500">{user ? 
              `${user.role}` : 'USER'}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {user ? user.prenom.charAt(0) : 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};