import { RoleRepository } from '../../infrastructure/repositories/role.repository';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '../../shared/types/role.types';

export class RoleService {
  private roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.getAll();
  }

  async getRoleById(id: number): Promise<Role> {
    return await this.roleRepository.getById(id);
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    return await this.roleRepository.create(data);
  }

  async updateRole( data: UpdateRoleRequest): Promise<Role> {
    return await this.roleRepository.update(data);
  }

  async deleteRole(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}