export interface User {
  id: number;
  username: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  dateCreation: string | null;
  dateDesactivation : string | null ;
  dateModification : string | null ;
  statut: 'Actif' | 'Inactif';
}

export interface CreateUserRequest {
  username: string;
  email: string;
  nom: string;
  prenom: string;
  roleId: number;
}

export interface UpdateUserRequest {
  id: number;
  username: string;
  email: string;
  nom: string;
  prenom: string;
  roleId: number;
  statut: 'Actif' | 'Inactif';
}