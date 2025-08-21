import { apiClient } from '../api/api.client';
import { Class, CreateClassRequest, UpdateClassRequest } from '../../shared/types/class.types';

export class ClassRepository {
  private baseUrl = '/classes';

  async getAll(): Promise<Class[]> {
    const response = await apiClient.get<Class[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<Class> {
    const response = await apiClient.get<Class>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateClassRequest): Promise<Class> {
    const response = await apiClient.post<Class>(this.baseUrl, data);
    return response.data;
  }

  async update(id: number, data: UpdateClassRequest): Promise<Class> {
    const response = await apiClient.put<Class>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/delete/${id}`);
  }
}