

export interface Salle {
  id: number;
  nom: string;
  maxEffective: number;
  idTypeSalle: number;
  libelleTypeSalle : string;
  dateCreation: string;
  statut: 'Actif' | 'Inactif';
}

export interface CreateSalleRequest {
  nom: string;
  maxEffective: number;
  idTypeSalle: number;
}

export interface UpdateSalleRequest {
  id: number;
  nom: string;
  maxEffective: number;
  idTypeSalle: number;
  statut: 'Actif' | 'Inactif';
}