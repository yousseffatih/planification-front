import { Attribute, CreateAttributeRequest, UpdateAttributeRequest } from '../../shared/types/attributs.types';
import { apiClient } from '../api/api.client';

export class AttributeRepository {
    private baseUrl = '/attributs';
  
    async getAll(): Promise<Attribute[]> {
      const response = await apiClient.get<Attribute[]>(this.baseUrl);
      return response.data;
    }
  
    async getById(id: number): Promise<Attribute> {
      const response = await apiClient.get<Attribute>(`${this.baseUrl}/${id}`);
      return response.data;
    }
  
    async create(data: CreateAttributeRequest): Promise<Attribute> {
      const response = await apiClient.post<Attribute>(this.baseUrl, data);
      return response.data;
    }
  
    async update(id: number, data: UpdateAttributeRequest): Promise<Attribute> {
      const response = await apiClient.put<Attribute>(`${this.baseUrl}/${id}`, data);
      return response.data;
    }
  
    async delete(id: number): Promise<void> {
      await apiClient.get(`${this.baseUrl}/delete/${id}`);
    }
  
  
    // Get all unique API names for filtering
    async getApiNames(): Promise<string[]> {
      const response = await apiClient.get<string[]>(`${this.baseUrl}/api-names`);
      return response.data;
    }

  }