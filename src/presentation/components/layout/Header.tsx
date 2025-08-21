import React from 'react';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '../../../application/hooks/redux.hooks';

export const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tap to search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user ? `${user.prenom} ${user.nom}` : 'User'}
              </p>
              <p className="text-xs text-gray-500">Sales Admin</p>
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