export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refrechToken: string;
  username: string;
  email: string;
  nom: string;
  prenom: string;
  idUser: number;
  first: string;
  roles: string[];
}

export interface ChangePasswordRequest {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export interface User {
  username: string;
  email: string;
  nom: string;
  prenom: string;
  idUser: number;
  first: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}