import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SalleService } from '../../application/services/salle.service';
import { CreateSalleRequest, Salle, UpdateSalleRequest } from '../../shared/types/salle.types';

export const Salles: React.FC = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [salleToDelete, setSalleToDelete] = useState<Salle | null>(null);
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [typeSalleOptions, setTypeSalleOptions] = useState<{ value: number; label: string }[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    maxEffective: '',
    typeSalleId: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  });
  const sallesServices = new SalleService();

  // Fetch data on component mount
  useEffect(() => {
    loadSalles();
    loadTypeSalles();
  }, []);

  const loadSalles = async () => {
    try {
      setTableLoading(true);
      setError(null);
      const data = await sallesServices.getAllSalles();
      setSalles(data);
    } catch (err) {
      setError('Erreur lors du chargement des salles');
      console.error('Error loading salles:', err);
    } finally {
      setTableLoading(false);
    }
  };

  const loadTypeSalles = async () => {
    try {
      // Assuming you have a method to get types de salles
      // If not, you can keep the static data or create a separate API call
      // const types = await sallesServices.getTypeSalles();
      // const options = types.map((type: ListAttribut) => ({
      //   value: type.id,
      //   label: type.nom
      // }));
      // setTypeSalleOptions(options);
      setTypeSalleOptions([
        { value: 1, label: 'Amphithéâtre' },
        { value: 2, label: 'Laboratoire Informatique' },
        { value: 3, label: 'Salle de Cours' },
        { value: 4, label: 'Laboratoire Sciences' },
        { value: 5, label: 'Salle de Conférence' },
        { value: 6, label: 'Bibliothèque' }
      ]);
      
    } catch (err) {
      // Fallback to static data if API call fails
      setTypeSalleOptions([
        { value: 1, label: 'Amphithéâtre' },
        { value: 2, label: 'Laboratoire Informatique' },
        { value: 3, label: 'Salle de Cours' },
        { value: 4, label: 'Laboratoire Sciences' },
        { value: 5, label: 'Salle de Conférence' },
        { value: 6, label: 'Bibliothèque' }
      ]);
      console.warn('Using fallback type salle options:', err);
    }
  };

  // Get unique types for filter
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(salles.map(s => s.libelleTypeSalle))];
    return types.filter(Boolean).sort();
  }, [salles]);

  // Filter salles based on search term, status, type, and capacity
  const filteredSalles = useMemo(() => {
    return salles.filter(salle => {
      const matchesSearch = searchTerm === '' || 
                           salle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           salle.libelleTypeSalle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           salle.maxEffective.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || salle.statut.toLowerCase() === statusFilter;
      const matchesType = typeFilter === 'all' || salle.libelleTypeSalle === typeFilter;
      
      let matchesCapacity = true;
      if (capacityFilter !== 'all') {
        const capacity = salle.maxEffective;
        switch (capacityFilter) {
          case 'small':
            matchesCapacity = capacity <= 30;
            break;
          case 'medium':
            matchesCapacity = capacity > 30 && capacity <= 100;
            break;
          case 'large':
            matchesCapacity = capacity > 100;
            break;
          default:
            matchesCapacity = true;
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesCapacity;
    });
  }, [salles, searchTerm, statusFilter, typeFilter, capacityFilter]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nom', label: 'Nom de la salle' },
    { key: 'maxEffective', label: 'Capacité max' },
    { 
      key: 'libelleTypeSalle', 
      label: 'Type de salle',
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'statut', 
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value == 'actif' ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    { 
      key: 'dateCreation', 
      label: 'Date de création',
    }
  ];

  const handleAdd = () => {
    setEditingSalle(null);
    setFormData({
      nom: '',
      maxEffective: '',
      typeSalleId: '',
      statut: 'Actif'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (salle: Salle) => {
    setEditingSalle(salle);
    setFormData({
      nom: salle.nom,
      maxEffective: salle.maxEffective.toString(),
      typeSalleId: salle.idTypeSalle.toString(),
      statut: salle.statut
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (salle: Salle) => {
    setSalleToDelete(salle);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!salleToDelete) return;
    
    try {
      setTableLoading(true);
      await sallesServices.deleteSalle(salleToDelete.id);
      await loadSalles(); // Refresh the list
      setIsDeleteModalOpen(false);
      setSalleToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression de la salle');
      console.error('Error deleting salle:', err);
    } finally {
      setTableLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSalleToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingSalle) {
        // Update existing salle
        const updateData: UpdateSalleRequest = {
          id: editingSalle.id,
          nom: formData.nom,
          maxEffective: parseInt(formData.maxEffective),
          idTypeSalle: parseInt(formData.typeSalleId),
          statut: formData.statut
        };
        await sallesServices.updateSalle(updateData);
      } else {
        // Create new salle
        const createData: CreateSalleRequest = {
          nom: formData.nom,
          maxEffective: parseInt(formData.maxEffective),
          idTypeSalle: parseInt(formData.typeSalleId)
        };
        await sallesServices.createSalle(createData);
      }
      
      setIsModalOpen(false);
      await loadSalles(); // Refresh the list
    } catch (err) {
      let errorMessage = 'Une erreur est survenue';
      if (err && typeof err === 'object') {
        if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
          errorMessage = (err.response.data as { message?: string }).message || errorMessage;
        } else if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        }
      }
      setError(`Erreur lors de ${editingSalle ? 'la modification' : 'la création'} de la salle: ${errorMessage}`);
      console.error('Error saving salle:', err);
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

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'all' | 'actif' | 'inactif');
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  const handleCapacityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCapacityFilter(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCapacityFilter('all');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  if (tableLoading && salles.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Salles</h1>
          <p className="text-gray-600 mt-2">Gérez les salles et espaces d'enseignement</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter une salle
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
                placeholder="Rechercher par nom, type de salle ou capacité..."
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

            {/* Type Filter */}
            <div className="sm:w-56">
              <select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="all">Tous les types</option>
                {uniqueTypes
                  .filter((type): type is string => type !== null)
                  .map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
              </select>
            </div>

            {/* Capacity Filter */}
            <div className="sm:w-48">
              <select
                value={capacityFilter}
                onChange={handleCapacityFilterChange}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="all">Toutes capacités</option>
                <option value="small">≤ 30 places</option>
                <option value="medium">31-100 places</option>
                <option value="large"> 100 places</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || capacityFilter !== 'all') && (
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
              {filteredSalles.length} salle{filteredSalles.length !== 1 ? 's' : ''} trouvée{filteredSalles.length !== 1 ? 's' : ''}
              {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || capacityFilter !== 'all') && ` sur ${salles.length} total`}
            </span>
            {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || capacityFilter !== 'all') && (
              <div className="flex items-center gap-2 text-xs">
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Recherche: "{searchTerm}"
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Statut: {statusFilter}
                  </span>
                )}
                {typeFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Type: {typeFilter}
                  </span>
                )}
                {capacityFilter !== 'all' && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                    Capacité: {capacityFilter === 'small' ? '≤ 30' : capacityFilter === 'medium' ? '31-100' : '> 100'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && !isModalOpen && !isDeleteModalOpen && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <Button 
            onClick={loadSalles} 
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
          data={filteredSalles}
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
                Supprimer la salle
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer la salle{' '}
              <span className="font-semibold text-gray-900">
                "{salleToDelete?.nom}"
              </span>{' '}
              de type{' '}
              <span className="font-semibold text-gray-900">
                {salleToDelete?.libelleTypeSalle}
              </span>{' '}
              ?
            </p>
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p>Capacité maximale: {salleToDelete?.maxEffective} places</p>
              <p>Statut: {salleToDelete?.statut}</p>
              {salleToDelete?.dateCreation && (
                <p>Date de création: {salleToDelete.dateCreation}</p>
              )}
            </div>
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

      {/* Add/Edit Salle Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSalle ? 'Modifier la salle' : 'Ajouter une salle'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom de la salle"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Amphithéâtre A, Salle TP Info 1..."
              required
              disabled={loading}
            />

            <Input
              label="Capacité maximale"
              name="maxEffective"
              type="number"
              value={formData.maxEffective}
              onChange={handleChange}
              placeholder="Ex: 30, 50, 150..."
              min="1"
              required
              disabled={loading}
            />

            <Select
              label="Type de salle"
              name="typeSalleId"
              value={formData.typeSalleId}
              onChange={handleChange}
              options={typeSalleOptions}
              required
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
              {editingSalle ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};