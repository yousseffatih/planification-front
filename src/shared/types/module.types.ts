export interface Module {
  id: number;
  nom: string;
  dateCreation: string;
  statut: 'Actif' | 'Inactif';
}

export interface CreateModuleRequest {
  nom: string;
}

export interface UpdateModuleRequest {
  id: number;
  nom: string;
  statut: 'Actif' | 'Inactif';
}