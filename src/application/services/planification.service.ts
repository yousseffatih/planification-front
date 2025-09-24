import { PlanificationReppsitory } from "../../infrastructure/repositories/planification.repository";
import { CreatePlanificationRequest, FilterRequest, Planification, PlanificationResponse, TotalPagesInfo  } from "../../shared/types/planification.types";
import { ListAttribute } from "../../shared/types/salle.types";

export class PlanificationService {
  private planificationRepository: PlanificationReppsitory;
  
    constructor() {
      this.planificationRepository = new PlanificationReppsitory();
    }

  async getFilteredPlanifications(filters: FilterRequest, pageNo: number = 0, pageSize: number = 5): Promise<PlanificationResponse> {
    const response = await this.planificationRepository.getFilteredPlanifications(filters, pageNo, pageSize);
    return response;
  }

  async createPlanification(data: CreatePlanificationRequest): Promise<Planification> {
   const response = await this.planificationRepository.createPlanification(data);
    return response;
  }

  async updatePlanification(id: number, data: Partial<CreatePlanificationRequest>): Promise<Planification> {
       const response = await this.planificationRepository.updatePlanification(id,data);
    return response;
  }

  async deletePlanification(id: number): Promise<void> {
   const response = await this.planificationRepository.deletePlanification(id);
    return response;
  }

  async getTypePlanifications(): Promise<ListAttribute[]> {  
      const response = await this.planificationRepository.getTypePlanifications();
      return response;
  }

  async getTotalPagesInfo(): Promise<TotalPagesInfo> {
      const response = await this.planificationRepository.getTotalPagesInfo();
      return response;
  }

  async getListPlanifications(dateDebut : string ,dateFin : string): Promise<Planification[]> {
      const response = await this.planificationRepository.getListPlanifications(dateDebut,dateFin);
      return response;
  }

  async getPlanificationById(id: number): Promise<Planification> {
      const response = await this.planificationRepository.getPlanificationById(id);
      return response;
  }
  
}
