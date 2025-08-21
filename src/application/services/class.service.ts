import { ClassRepository } from "../../infrastructure/repositories/class.repository";
import { Class, CreateClassRequest, UpdateClassRequest } from "../../shared/types/class.types";

export class ClassService {
  private classRepository: ClassRepository;

  constructor() {
    this.classRepository = new ClassRepository();
  }

  async getAllClasses(): Promise<Class[]> {
    try {
      return await this.classRepository.getAll();
    } catch (error) {
      console.error('Error in ClassService.getAllClasses:', error);
      throw new Error('Erreur lors du chargement des classes');
    }
  }

  async getClassById(id: number): Promise<Class> {
    try {
      return await this.classRepository.getById(id);
    } catch (error) {
      console.error('Error in ClassService.getClassById:', error);
      throw new Error('Erreur lors du chargement de la classe');
    }
  }

  async createClass(classData: CreateClassRequest): Promise<Class> {
    try {
      // Validation
      this.validateClassData(classData);
      
      return await this.classRepository.create(classData);
    } catch (error) {
      console.error('Error in ClassService.createClass:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur lors de la création de la classe');
    }
  }

  async updateClass(id: number, classData: UpdateClassRequest): Promise<Class> {
    try {
      // Validation
      this.validateClassData(classData);
      
      return await this.classRepository.update(id, classData);
    } catch (error) {
      console.error('Error in ClassService.updateClass:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur lors de la modification de la classe');
    }
  }

  async deleteClass(id: number): Promise<void> {
    try {
      await this.classRepository.delete(id);
    } catch (error) {
      console.error('Error in ClassService.deleteClass:', error);
      throw new Error('Erreur lors de la suppression de la classe');
    }
  }

  private validateClassData(classData: CreateClassRequest | UpdateClassRequest): void {
    if (!classData.nom || classData.nom.trim().length === 0) {
      throw new Error('Le nom de la classe est requis');
    }

    if (!classData.annuerScolaire) {
      throw new Error("L'annee scolaire est requis");
    }

    if (!classData.nomberEff || classData.nomberEff <= 0) {
      throw new Error('La capacité doit être supérieure à 0');
    }

    // if (classData.capacite > 100) {
    //   throw new Error('La capacité ne peut pas dépasser 100 étudiants');
    // }
  }
}