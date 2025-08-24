import { apiClient } from '../api/api.client';
import { User, CreateUserRequest, UpdateUserRequest } from '../../shared/types/user.types';

export class UserRepository {
  private baseUrl = '/users';

  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>(this.baseUrl, data);
    return response.data;
  }

  async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/delete/${id}`);
  }

  async desactivate(id: number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/desactiveUser/${id}`);
  }

  async activate(id: number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/activeUser/${id}`);
  }

  async refrechPassword(id :number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/refrechPassword/${id}`);
  }
}