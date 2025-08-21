import { apiClient } from '../api/api.client';
import { Salle, CreateSalleRequest, UpdateSalleRequest } from '../../shared/types/salle.types';

export class SalleRepository {
  private baseUrl = '/salles';

  async getAll(): Promise<Salle[]> {
    const response = await apiClient.get<Salle[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<Salle> {
    const response = await apiClient.get<Salle>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateSalleRequest): Promise<Salle> {
    const response = await apiClient.post<Salle>(this.baseUrl, data);
    return response.data;
  }

  async update(id: number, data: UpdateSalleRequest): Promise<Salle> {
    const response = await apiClient.put<Salle>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/delete/${id}`);
  }
}