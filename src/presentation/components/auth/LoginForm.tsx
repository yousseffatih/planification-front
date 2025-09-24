import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAppDispatch, useAppSelector } from '../../../application/hooks/redux.hooks';
import { loginAsync, clearError } from '../../../application/store/slices/auth.slice';
import logo from '../../../assets/logo.jpeg';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(loginAsync(formData)).unwrap();
    } catch (error: any) {
      if (error === 'PASSWORD_CHANGE_REQUIRED') {
        navigate('/change-password', { state: { username: formData.username } });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="relative">
              <img 
                src={logo} 
                alt="OrgaCours Logo" 
                className="w-20 h-20 rounded-xl object-cover object-center scale-110 shadow-sm border-2 border-gray-100"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">OrgaCours</span>
              <span className="text-sm text-gray-500 font-medium">Planning System</span>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Forgot your password?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};