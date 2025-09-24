import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Attribute, CreateAttributeRequest, UpdateAttributeRequest } from '../../shared/types/attributs.types';
import { AttributeService } from '../../application/services/attribut.service';



export const Attributes: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<Attribute | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [apiFilter, setApiFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    libelle: '',
    value: '',
    listNameApi: '',
    listLibelle: ''
  });

  const attributeService = new AttributeService();

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      setTableLoading(true);
      const data = await attributeService.getAllAttributes();
      setAttributes(data);
    } catch (error: unknown) {
      setError('Erreur lors du chargement des attributs');
      console.error('Error loading attributes:', error);
    } finally {
      setTableLoading(false);
    }
  };

  // Get unique API names for filter
  const uniqueApiNames = useMemo(() => {
    const apis = [...new Set(attributes.map(a => a.listNameApi))];
    return apis.filter(Boolean).sort();
  }, [attributes]);

  // Filter attributes based on search term and API name
  const filteredAttributes = useMemo(() => {
    return attributes.filter(attribute => {
      const matchesSearch = searchTerm === '' || 
                           attribute.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attribute.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attribute.listNameApi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attribute.listLibelle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesApi = apiFilter === 'all' || attribute.listNameApi === apiFilter;
      return matchesSearch && matchesApi;
    });
  }, [attributes, searchTerm, apiFilter]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'libelle', label: 'Libellé' },
    { key: 'value', label: 'Valeur' },
    { key: 'listNameApi', label: 'Nom API' },
    { key: 'listLibelle', label: 'Libellé Liste' },
    { key: 'dateCreation', label: 'Date de création' }
  ];

  const handleAdd = () => {
    setEditingAttribute(null);
    setFormData({
      libelle: '',
      value: '',
      listNameApi: '',
      listLibelle: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      libelle: attribute.libelle,
      value: attribute.value,
      listNameApi: attribute.listNameApi,
      listLibelle: attribute.listLibelle
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = (attribute: Attribute) => {
    setAttributeToDelete(attribute);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!attributeToDelete) return;
    
    try {
      setTableLoading(true);
      await attributeService.deleteAttribute(attributeToDelete.id);
      await loadAttributes();
      setIsDeleteModalOpen(false);
      setAttributeToDelete(null);
    } catch (error: unknown) {
      setError('Erreur lors de la suppression de l\'attribut');
      console.error('Error deleting attribute:', error);
    } finally {
      setTableLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAttributeToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingAttribute) {
        const updateData: UpdateAttributeRequest = {
          id: editingAttribute.id,
          libelle: formData.libelle,
          value: formData.value,
          listNameApi: formData.listNameApi,
          listLibelle: formData.listLibelle
        };
        await attributeService.updateAttribute(editingAttribute.id, updateData);
      } else {
        const createData: CreateAttributeRequest = {
          libelle: formData.libelle,
          value: formData.value,
          listNameApi: formData.listNameApi,
          listLibelle: formData.listLibelle
        };
        await attributeService.createAttribute(createData);
      }
      
      await loadAttributes();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Erreur lors de l\'opération');
      } else {
        setError('Erreur lors de l\'opération');
      }
      console.error('Error submitting attribute:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApiFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setApiFilter(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setApiFilter('all');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50 px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Attributs</h1>
          <p className="text-gray-600 mt-2">Gérez les attributs et leurs configurations</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter un attribut
        </Button>
      </div>

      {/* Beautiful Search and Filter Bar */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par libellé, valeur, nom API ou libellé liste..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-500 text-gray-900 text-sm
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* API Name Filter */}
            <div className="sm:w-56">
              <select
                value={apiFilter}
                onChange={handleApiFilterChange}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          text-gray-900 text-sm bg-white
                          transition-all duration-200 ease-in-out
                          hover:border-gray-400 focus:shadow-lg"
              >
                <option value="all">Toutes les APIs</option>
                {uniqueApiNames.map(apiName => (
                  <option key={apiName} value={apiName}>
                    {apiName}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || apiFilter !== 'all') && (
              <button
                onClick={clearSearch}
                className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 
                         border border-gray-300 rounded-lg hover:bg-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition-colors duration-200 whitespace-nowrap"
              >
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Search Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredAttributes.length} attribut{filteredAttributes.length !== 1 ? 's' : ''} trouvé{filteredAttributes.length !== 1 ? 's' : ''}
              {(searchTerm || apiFilter !== 'all') && ` sur ${attributes.length} total`}
            </span>
            {(searchTerm || apiFilter !== 'all') && (
              <div className="flex items-center gap-2 text-xs">
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Recherche: "{searchTerm}"
                  </span>
                )}
                {apiFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    API: {apiFilter}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && !isModalOpen && !isDeleteModalOpen && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={filteredAttributes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={tableLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="Confirmer la suppression"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                Supprimer l'attribut
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer l'attribut{' '}
              <span className="font-semibold text-gray-900">
                "{attributeToDelete?.libelle}"
              </span>{' '}
              avec la valeur{' '}
              <span className="font-semibold text-gray-900">
                "{attributeToDelete?.value}"
              </span>{' '}
              ?
            </p>
            {attributeToDelete?.listNameApi && (
              <p className="text-xs text-gray-500 mt-2">
                API: {attributeToDelete.listNameApi}
              </p>
            )}
            {attributeToDelete?.listLibelle && (
              <p className="text-xs text-gray-500">
                Libellé liste: {attributeToDelete.listLibelle}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={cancelDelete}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add/Edit Attribute Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAttribute ? 'Modifier l\'attribut' : 'Ajouter un attribut'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Libellé"
              name="libelle"
              value={formData.libelle}
              onChange={handleChange}
              placeholder="ex: Type plan 02"
              required
            />
            <Input
              label="Valeur"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="ex: type_plan_02"
              required
            />
            <Input
              label="Nom API"
              name="listNameApi"
              value={formData.listNameApi}
              onChange={handleChange}
              placeholder="ex: listTypePlanification"
              required
            />
            <Input
              label="Libellé Liste"
              name="listLibelle"
              value={formData.listLibelle}
              onChange={handleChange}
              placeholder="ex: Planning Type 2"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              {editingAttribute ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};