export interface Class {
  id: number;
  nom: string;
  annuerScolaire: string;
  nomberEff: number;
  dateCreation: string | null;
  dateDesactivation : string | null ;
  dateModification : string | null ;
  statut: 'Actif' | 'Inactif';
}

export interface CreateClassRequest {
  nom: string;
  annuerScolaire: string;
  nomberEff: number;
}

export interface UpdateClassRequest {
  id: number;
  nom: string;
  annuerScolaire: string;
  nomberEff: number;
  statut: 'Actif' | 'Inactif';
}