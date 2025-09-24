import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/logo.jpeg';
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TagIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: HomeIcon },
    { name: 'Planification', href: '/planification', icon: CalendarIcon },
    { name: 'Utilisateurs', href: '/users', icon: UsersIcon },
    { name: 'Classes', href: '/classes', icon: AcademicCapIcon },
    { name: 'Rôles', href: '/roles', icon: ShieldCheckIcon },
    { name: 'Professeurs', href: '/professors', icon: UserGroupIcon },
    { name: 'Modules', href: '/modules', icon: BookOpenIcon },
    { name: 'Salles', href: '/salles', icon: BuildingOfficeIcon },
    { name: 'Attributs', href: '/attributs', icon: TagIcon }
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={logo} 
              alt="OrgaCours Logo" 
              className="w-14 h-14 rounded-xl object-cover object-center scale-110 shadow-sm border-2 border-gray-100"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">OrgaCours</span>
            <span className="text-xs text-gray-500 font-medium">Planning System</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
            {/* {item.badge && (
              <span className="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {item.badge}
              </span>
            )} */}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};