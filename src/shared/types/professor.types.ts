
export interface Professor {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numeroTele: string;
  idTypeProf: number;
  libelleTypeProf : string | null;
  dateCreation: string;
  statut: 'Actif' | 'Inactif';
}

export interface CreateProfessorRequest {
  nom: string;
  prenom: string;
  email: string;
  numeroTele: string;
  idTypeProf: number;
}

export interface UpdateProfessorRequest {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numeroTele: string;
  idTypeProf: number;
  statut: 'Actif' | 'Inactif';
}