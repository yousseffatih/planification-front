import { apiClient } from '../api/api.client';
import { Module, CreateModuleRequest, UpdateModuleRequest } from '../../shared/types/module.types';
import { ListAttribute } from '../../shared/types/salle.types';

export class ModuleRepository {
  private baseUrl = '/modules';

  async getAll(): Promise<Module[]> {
    const response = await apiClient.get<Module[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<Module> {
    const response = await apiClient.get<Module>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateModuleRequest): Promise<Module> {
    const response = await apiClient.post<Module>(this.baseUrl, data);
    return response.data;
  }

  async update(id: number, data: UpdateModuleRequest): Promise<Module> {
    const response = await apiClient.put<Module>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/delete/${id}`);
  }

  async getListModules(): Promise<ListAttribute[]> {
    const response = await apiClient.get<ListAttribute[]>(`${this.baseUrl}/listModules`);
    return response.data;
  }
}