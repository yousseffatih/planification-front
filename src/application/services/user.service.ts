import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { User, CreateUserRequest, UpdateUserRequest } from '../../shared/types/user.types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.getById(id);
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    return await this.userRepository.create(data);
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    return await this.userRepository.update(id, data);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}