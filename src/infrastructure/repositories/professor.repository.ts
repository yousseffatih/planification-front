import { apiClient } from '../api/api.client';
import { Professor, CreateProfessorRequest, UpdateProfessorRequest } from '../../shared/types/professor.types';
import { ListAttribute } from '../../shared/types/salle.types';

export class ProfessorRepository {
  private baseUrl = '/professeurs';

  async getAll(): Promise<Professor[]> {
    const response = await apiClient.get<Professor[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<Professor> {
    const response = await apiClient.get<Professor>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateProfessorRequest): Promise<Professor> {
    const response = await apiClient.post<Professor>(this.baseUrl, data);
    return response.data;
  }

  async update(id: number, data: UpdateProfessorRequest): Promise<Professor> {
    const response = await apiClient.put<Professor>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.get(`${this.baseUrl}/delete/${id}`);
  }

  async getListTypeProf(): Promise<ListAttribute[]> {
    const response = await apiClient.get<ListAttribute[]>(`/attributs/listTypeProfesseurs`);
    return response.data;
  }

  async getListProfessor(): Promise<ListAttribute[]> {
      const response = await apiClient.get<ListAttribute[]>(`${this.baseUrl}/listProfesseurs`);
      return response.data;
    }
}