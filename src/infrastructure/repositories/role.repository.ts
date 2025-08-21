import { apiClient } from '../api/api.client';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '../../shared/types/role.types';

export class RoleRepository {
  private baseUrl = '/roles';

  async getAll(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<Role> {
    const response = await apiClient.get<Role>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.post<Role>(this.baseUrl, data);
    return response.data;
  }

  async update( data: UpdateRoleRequest): Promise<Role> {
    const response = await apiClient.put<Role>(`${this.baseUrl}/${data.id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/delete/${id}`);
  }
}