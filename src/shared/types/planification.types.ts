export interface Planification {
  id: number;
  description: string | null;
  timeDebut: string;
  timeFin: string;
  idSalle: number;
  idModule: number;
  statut: string;
  idUser: number;
  prof: any;
  libelleUser: string;
  nom: string;
  idProfesseur: number;
  idTypePlanification: number;
  datePlanification: string;
  libelleProfeseur: string;
  libelleModule: string;
  libelleSalle: string;
  liblleTypePlanification: string;
  idsClasses: number[];
}


export interface PlanificationResponse {
  content: Planification[];
  pageNo: number;
  pageSize: number;
  totalElement: number;
  totlaPages: number;
  last: boolean;
}

export interface CreatePlanificationRequest {
  datePlanification: string;
  timeDebut: string;
  timeFin: string;
  idModule: number;
  idSalle: number;
  idUser: number;
  idsClasses: number[];
  nom: string;
  description?: string;
  idTypePlanification: number;
  idProfesseur: number;
}

export interface FilterRequest {
  idSalle: number | null;
  idModule: number | null;
  idType: number | null;
  dateDebut: string;
  dateFin: string;
  idClasse: number | null;
  idProf: number | null;
}

export interface TotalPagesInfo {
  totalReservation: number;
  reservationAnnuler: number;
  salleDesiponible: number;
  salleIndesponible: number;
  utilisateurActif: number;
}
