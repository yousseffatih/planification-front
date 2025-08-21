import { AuthRepository } from '../../infrastructure/repositories/auth.repository';
import { LoginRequest, LoginResponse, ChangePasswordRequest, User } from '../../shared/types/auth.types';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(credentials: LoginRequest): Promise<{ user: User; token: string; refreshToken: string }> {
    const response = await this.authRepository.login(credentials);
    
    const user: User = {
      username: response.username,
      email: response.email,
      nom: response.nom,
      prenom: response.prenom,
      idUser: response.idUser,
      first: response.first,
      roles: response.roles,
    };

    // Save to localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refrechToken);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      user,
      token: response.token,
      refreshToken: response.refrechToken,
    };
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await this.authRepository.changePassword(data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}