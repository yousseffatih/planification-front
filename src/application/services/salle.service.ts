import { SalleRepository } from '../../infrastructure/repositories/salle.repository';
import { Salle, CreateSalleRequest, UpdateSalleRequest, ListAttribute } from '../../shared/types/salle.types';

export class SalleService {
  private salleRepository: SalleRepository;

  constructor() {
    this.salleRepository = new SalleRepository();
  }

  async getAllSalles(): Promise<Salle[]> {
    return await this.salleRepository.getAll();
  }

  async getSalleById(id: number): Promise<Salle> {
    return await this.salleRepository.getById(id);
  }

  async createSalle(data: CreateSalleRequest): Promise<Salle> {
    return await this.salleRepository.create(data);
  }

  async updateSalle(data: UpdateSalleRequest): Promise<Salle> {
    return await this.salleRepository.update(data.id, data);
  }

  async deleteSalle(id: number): Promise<void> {
    await this.salleRepository.delete(id);
  }

  async getListeTypeSalles(): Promise<ListAttribute[]> {
    return await this.salleRepository.getListeTypeSalles();
  }

  async getListSalles(): Promise<ListAttribute[]> {
    return await this.salleRepository.getListSalles();
  }
}