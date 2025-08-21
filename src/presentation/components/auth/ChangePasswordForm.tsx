import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAppDispatch, useAppSelector } from '../../../application/hooks/redux.hooks';
import { changePasswordAsync, clearError } from '../../../application/store/slices/auth.slice';

export const ChangePasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (location.state?.username) {
      setFormData(prev => ({
        ...prev,
        username: location.state.username
      }));
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setValidationError('New password must be at least 6 characters long');
      return;
    }

    try {
      await dispatch(changePasswordAsync({
        username: formData.username,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })).unwrap();

      navigate('/login', { 
        state: { 
          message: 'Password changed successfully. Please login with your new password.' 
        } 
      });
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-gray-600 mt-2">You need to update your password to continue</p>
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
            label="Current Password"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            required
          />

          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter your new password"
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            required
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            required
          />

          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error || validationError}
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Change Password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};