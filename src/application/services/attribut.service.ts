
import { AttributeRepository } from '../../infrastructure/repositories/attributs.repository';
import { Attribute, CreateAttributeRequest, UpdateAttributeRequest } from '../../shared/types/attributs.types';

export class AttributeService {
  private attributeRepository: AttributeRepository;

  constructor() {
    this.attributeRepository = new AttributeRepository();
  }

  async getAllAttributes(): Promise<Attribute[]> {
    try {
      return await this.attributeRepository.getAll();
    } catch (error) {
      console.error('Error in AttributeService.getAllAttributes:', error);
      throw new Error('Erreur lors du chargement des attributs');
    }
  }

  async getAttributeById(id: number): Promise<Attribute> {
    try {
      return await this.attributeRepository.getById(id);
    } catch (error) {
      console.error('Error in AttributeService.getAttributeById:', error);
      throw new Error('Erreur lors du chargement de l\'attribut');
    }
  }

  async createAttribute(attributeData: CreateAttributeRequest): Promise<Attribute> {
    try {
      // Validation
      this.validateAttributeData(attributeData);
      
      return await this.attributeRepository.create(attributeData);
    } catch (error) {
      console.error('Error in AttributeService.createAttribute:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur lors de la création de l\'attribut');
    }
  }

  async updateAttribute(id: number, attributeData: UpdateAttributeRequest): Promise<Attribute> {
    try {
      // Validation
      this.validateAttributeData(attributeData);
      
      return await this.attributeRepository.update(id, attributeData);
    } catch (error) {
      console.error('Error in AttributeService.updateAttribute:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur lors de la modification de l\'attribut');
    }
  }

  async deleteAttribute(id: number): Promise<void> {
    try {
      await this.attributeRepository.delete(id);
    } catch (error) {
      console.error('Error in AttributeService.deleteAttribute:', error);
      throw new Error('Erreur lors de la suppression de l\'attribut');
    }
  }



  async getApiNames(): Promise<string[]> {
    try {
      return await this.attributeRepository.getApiNames();
    } catch (error) {
      console.error('Error in AttributeService.getApiNames:', error);
      throw new Error('Erreur lors du chargement des noms d\'API');
    }
  }






  private validateAttributeData(attributeData: CreateAttributeRequest | UpdateAttributeRequest): void {
    if (!attributeData.libelle || attributeData.libelle.trim().length === 0) {
      throw new Error('Le libellé de l\'attribut est requis');
    }

    if (!attributeData.value || attributeData.value.trim().length === 0) {
      throw new Error('La valeur est requise');
    }

    if (!attributeData.listNameApi || attributeData.listNameApi.trim().length === 0) {
      throw new Error('Le nom d\'API est requis');
    }

    if (!attributeData.listLibelle || attributeData.listLibelle.trim().length === 0) {
      throw new Error('Le libellé de liste est requis');
    }

    if (!this.isValidValue(attributeData.value)) {
      throw new Error('La valeur n\'est pas valide. Utilisez uniquement des lettres, chiffres et underscores');
    }

    if (!this.isValidApiName(attributeData.listNameApi)) {
      throw new Error('Le nom d\'API n\'est pas valide. Utilisez le format camelCase');
    }

    if (attributeData.libelle.length > 255) {
      throw new Error('Le libellé ne peut pas dépasser 255 caractères');
    }

    if (attributeData.value.length > 100) {
      throw new Error('La valeur ne peut pas dépasser 100 caractères');
    }

    if (attributeData.listNameApi.length > 100) {
      throw new Error('Le nom d\'API ne peut pas dépasser 100 caractères');
    }

    if (attributeData.listLibelle.length > 255) {
      throw new Error('Le libellé de liste ne peut pas dépasser 255 caractères');
    }
  }

  private isValidValue(value: string): boolean {
    // Value should start with letter and contain only letters, numbers, and underscores
    const valueRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    return valueRegex.test(value);
  }

  private isValidApiName(apiName: string): boolean {
    // API name should be in camelCase format
    const apiNameRegex = /^[a-z][a-zA-Z0-9]*$/;
    return apiNameRegex.test(apiName);
  }
}