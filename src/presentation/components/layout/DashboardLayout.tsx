import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppDispatch } from '../../../application/hooks/redux.hooks';
import { logout } from '../../../application/store/slices/auth.slice';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
};