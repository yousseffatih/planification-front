export interface Role {
  id: number;
  nom: string;
  dateCreation: string | null;
  dateDesactivation : string | null ;
  dateModification : string | null ;
  statut: 'Actif' | 'Inactif';
}

export interface CreateRoleRequest {
  nom: string;
}

export interface UpdateRoleRequest {
  id: number;
  nom: string;
  statut: 'Actif' | 'Inactif';
}