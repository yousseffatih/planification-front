import { CreatePlanificationRequest, FilterRequest, Planification, PlanificationResponse, TotalPagesInfo } from "../../shared/types/planification.types";
import { ListAttribute } from "../../shared/types/salle.types";
import { apiClient } from "../api/api.client";

export class PlanificationReppsitory {
    private baseUrl = '/planification';

  

    async getFilteredPlanifications(data: FilterRequest, pageNo: number = 0, pageSize: number = 5): Promise<PlanificationResponse> {
        const response = await apiClient.post<PlanificationResponse>(`${this.baseUrl}/filtred?pageNo=${pageNo}&pageSize=${pageSize}`, data);
        return response.data;
    }

    async createPlanification(data: Partial<CreatePlanificationRequest>): Promise<Planification> {
        const response = await apiClient.post<Planification>(this.baseUrl, data);
        return response.data;
    }

    async updatePlanification(id: number, data: Partial<CreatePlanificationRequest>): Promise<Planification> {
        const response = await apiClient.put<Planification>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    async deletePlanification(id: number): Promise<void> {
        await apiClient.get(`${this.baseUrl}/delete/${id}`);
    }
    async getTypePlanifications(): Promise<ListAttribute[]> {
        const response = await apiClient.get<ListAttribute[]>(`/attributs/listTypePlanification`);
        return response.data;
    }

    async getTotalPagesInfo(): Promise<TotalPagesInfo> {
        const response = await apiClient.get<TotalPagesInfo>(`${this.baseUrl}/tableauBordInfo`);
        return response.data;
    }

    async getListPlanifications(dateDebut : string ,dateFin : string): Promise<Planification[]> {
        console.log("date debut and date Fin :",dateDebut,dateFin);
        const response = await apiClient.get<Planification[]>(`${this.baseUrl}?dateDebut=${dateDebut}&dateFin=${dateFin}`);
        return response.data;
    }

    async getPlanificationById(id: number): Promise<Planification> {
        const response = await apiClient.get<Planification>(`${this.baseUrl}/${id}`);
        return response.data;
    }

}