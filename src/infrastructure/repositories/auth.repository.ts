import { apiClient } from '../api/api.client';
import { LoginRequest, LoginResponse, ChangePasswordRequest } from '../../shared/types/auth.types';

export class AuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/signIn', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 451) {
        throw new Error('PASSWORD_CHANGE_REQUIRED');
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.post('/auth/changePassword', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }
}