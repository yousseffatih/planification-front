export interface Attribute {
    id: number;
    libelle: string;
    value: string;
    listNameApi: string;
    listLibelle: string;
    dateCreation?: string;
    dateModification?: string;
    statut?: 'actif' | 'inactif';
  }
  
  export interface CreateAttributeRequest {
    libelle: string;
    value: string;
    listNameApi: string;
    listLibelle: string;
    statut?: 'actif' | 'inactif';
  }
  
  export interface UpdateAttributeRequest {
    id: number;
    libelle: string;
    value: string;
    listNameApi: string;
    listLibelle: string;
    statut?: 'actif' | 'inactif';
  }
  
  export interface AttributeSearchParams {
    libelle?: string;
    value?: string;
    listNameApi?: string;
    listLibelle?: string;
    statut?: 'actif' | 'inactif';
    page?: number;
    limit?: number;
    sortBy?: keyof Attribute;
    sortOrder?: 'asc' | 'desc';
  }
  

  