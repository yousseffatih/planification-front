import { ModuleRepository } from '../../infrastructure/repositories/module.repository';
import { Module, CreateModuleRequest, UpdateModuleRequest } from '../../shared/types/module.types';

export class ModuleService {
  private moduleRepository: ModuleRepository;

  constructor() {
    this.moduleRepository = new ModuleRepository();
  }

  async getAllModules(): Promise<Module[]> {
    return await this.moduleRepository.getAll();
  }

  async getModuleById(id: number): Promise<Module> {
    return await this.moduleRepository.getById(id);
  }

  async createModule(data: CreateModuleRequest): Promise<Module> {
    return await this.moduleRepository.create(data);
  }

  async updateModule( data: UpdateModuleRequest): Promise<Module> {
    return await this.moduleRepository.update(data.id, data);
  }

  async deleteModule(id: number): Promise<void> {
    await this.moduleRepository.delete(id);
  }
}