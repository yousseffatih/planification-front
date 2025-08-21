import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Module, CreateModuleRequest, UpdateModuleRequest } from '../../shared/types/module.types';
import { ModuleService } from '../../application/services/module.service';

export const Modules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [formData, setFormData] = useState({
    nom: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const modelService = new ModuleService();

  // Fetch modules on component mount
  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setTableLoading(true);
      setError(null);
      const data = await modelService.getAllModules();
      setModules(data);
    } catch (err) {
      setError('Erreur lors du chargement des modules');
      console.error('Error loading modules:', err);
    } finally {
      setTableLoading(false);
    }
  };

  // Filter modules based on search term (nom only) and status
  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const matchesSearch = searchTerm === '' || 
                           module.nom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || module.statut.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [modules, searchTerm, statusFilter]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nom', label: 'Nom du module' },
    { 
      key: 'statut', 
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'dateCreation', 
      label: 'Date de création',
    }
  ];

  const handleAdd = () => {
    setEditingModule(null);
    setFormData({
      nom: '',
      statut: 'Actif'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      nom: module.nom,
      statut: module.statut
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (module: Module) => {
    setModuleToDelete(module);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!moduleToDelete) return;
    
    try {
      setTableLoading(true);
      await modelService.deleteModule(moduleToDelete.id);
      await loadModules(); // Refresh the list
      setIsDeleteModalOpen(false);
      setModuleToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression du module');
      console.error('Error deleting module:', err);
    } finally {
      setTableLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setModuleToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingModule) {
        // Update existing module
        const updateData: UpdateModuleRequest = {
          id: editingModule.id,
          nom: formData.nom,
          statut: formData.statut
        };
        console.log('this is status issuer', formData.statut);
        await modelService.updateModule(updateData);
      } else {
        // Create new module
        const createData: CreateModuleRequest = {
          nom: formData.nom
        };
        await modelService.createModule(createData);
      }
      
      setIsModalOpen(false);
      await loadModules(); // Refresh the list
    } catch (err) {
      // Try to extract a meaningful error message if possible
      let errorMessage = 'Une erreur est survenue';
      if (err && typeof err === 'object') {
        // @ts-expect-error: err may have response property
        errorMessage = err?.response?.data?.message || err?.message || errorMessage;
      }
      setError(`Erreur lors de ${editingModule ? 'la modification' : 'la création'} du module: ${errorMessage}`);
      console.error('Error saving module:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'all' | 'actif' | 'inactif');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  if (tableLoading && modules.length === 0) {
    return (
      <div className="ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-50 px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Modules</h1>
          <p className="text-gray-600 mt-2">Gérez les modules d'enseignement</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter un module
        </Button>
      </div>

      {/* Beautiful Search Bar */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom de module..."
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

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== 'all') && (
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
              {filteredModules.length} module{filteredModules.length !== 1 ? 's' : ''} trouvé{filteredModules.length !== 1 ? 's' : ''}
              {(searchTerm || statusFilter !== 'all') && ` sur ${modules.length} total`}
            </span>
            {(searchTerm || statusFilter !== 'all') && (
              <div className="flex items-center gap-2 text-xs">
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Nom: "{searchTerm}"
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Statut: {statusFilter}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <Button 
            onClick={loadModules} 
            variant="outline" 
            className="mt-2"
            size="sm"
          >
            Réessayer
          </Button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={filteredModules}
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
                Supprimer le module
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer le module{' '}
              <span className="font-semibold text-gray-900">
                "{moduleToDelete?.nom}"
              </span>{' '}
              ? Cette action ne peut pas être annulée.
            </p>
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

      {/* Add/Edit Module Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingModule ? 'Modifier le module' : 'Ajouter un module'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Nom du module"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Entrez le nom du module"
              disabled={loading}
            />

            <Select
              label="Statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              options={[
                { value: 'actif', label: 'Actif' },
                { value: 'inActif', label: 'Inactif' }
              ]}
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              {editingModule ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};