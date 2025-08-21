import { ProfessorRepository } from "../../infrastructure/repositories/professor.repository";
import { CreateProfessorRequest, Professor, UpdateProfessorRequest } from "../../shared/types/professor.types";


export class ProfessorService {
  private professorRepository: ProfessorRepository;

  constructor() {
    this.professorRepository = new ProfessorRepository();
  }

  async getAllProfessors(): Promise<Professor[]> {
    try {
      return await this.professorRepository.getAll();
    } catch (error) {
      console.error('Error in ProfessorService.getAllProfessors:', error);
      throw new Error('Erreur lors du chargement des professeurs');
    }
  }

  async getProfessorById(id: number): Promise<Professor> {
    try {
      return await this.professorRepository.getById(id);
    } catch (error) {
      console.error('Error in ProfessorService.getProfessorById:', error);
      throw new Error('Erreur lors du chargement du professeur');
    }
  }

  async createProfessor(professorData: CreateProfessorRequest): Promise<Professor> {
    try {
      // Validation
      this.validateProfessorData(professorData);
      
      return await this.professorRepository.create(professorData);
    } catch (error) {
      console.error('Error in ProfessorService.createProfessor:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur lors de la création du professeur');
    }
  }

  async updateProfessor(id: number, professorData: UpdateProfessorRequest): Promise<Professor> {
    try {
      // Validation
      this.validateProfessorData(professorData);
      
      return await this.professorRepository.update(id, professorData);
    } catch (error) {
      console.error('Error in ProfessorService.updateProfessor:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur lors de la modification du professeur');
    }
  }

  async deleteProfessor(id: number): Promise<void> {
    try {
      await this.professorRepository.delete(id);
    } catch (error) {
      console.error('Error in ProfessorService.deleteProfessor:', error);
      throw new Error('Erreur lors de la suppression du professeur');
    }
  }

  // async getProfessorsByType(typeProfId: number): Promise<Professor[]> {
  //   try {
  //     return await this.professorRepository.getByType(typeProfId);
  //   } catch (error) {
  //     console.error('Error in ProfessorService.getProfessorsByType:', error);
  //     throw new Error('Erreur lors du chargement des professeurs par type');
  //   }
  // }

  // async getActiveProfessors(): Promise<Professor[]> {
  //   try {
  //     return await this.professorRepository.getByStatus('Actif');
  //   } catch (error) {
  //     console.error('Error in ProfessorService.getActiveProfessors:', error);
  //     throw new Error('Erreur lors du chargement des professeurs actifs');
  //   }
  // }

  private validateProfessorData(professorData: CreateProfessorRequest | UpdateProfessorRequest): void {
    if (!professorData.nom || professorData.nom.trim().length === 0) {
      throw new Error('Le nom du professeur est requis');
    }

    if (!professorData.prenom || professorData.prenom.trim().length === 0) {
      throw new Error('Le prénom du professeur est requis');
    }

    if (!professorData.email || professorData.email.trim().length === 0) {
      throw new Error('L\'email est requis');
    }

    if (!this.isValidEmail(professorData.email)) {
      throw new Error('L\'email n\'est pas valide');
    }

    if (!professorData.numeroTele || professorData.numeroTele.trim().length === 0) {
      throw new Error('Le numéro de téléphone est requis');
    }

    if (!this.isValidPhoneNumber(professorData.numeroTele)) {
      throw new Error('Le numéro de téléphone n\'est pas valide');
    }

    if (!professorData.idTypeProf) {
      throw new Error('Le type de professeur est requis');
    }

    if (professorData.nom.length > 50) {
      throw new Error('Le nom ne peut pas dépasser 50 caractères');
    }

    if (professorData.prenom.length > 50) {
      throw new Error('Le prénom ne peut pas dépasser 50 caractères');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation (adjust regex based on your requirements)
    const phoneRegex = /^[+]?[0-9\s\-()]{8,15}$/;
    return phoneRegex.test(phoneNumber);
  }
}