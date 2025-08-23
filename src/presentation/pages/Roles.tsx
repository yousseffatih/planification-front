import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '../../shared/types/role.types';
import { RoleService } from '../../application/services/role.service';

export const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'recent' | 'older'>('all');
  const [formData, setFormData] = useState({
    nom: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const roleService = new RoleService();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setTableLoading(true);
      setError(null);
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (err) {
      setError('Erreur lors du chargement des rôles');
      console.error('Error loading roles:', err);
    } finally {
      setTableLoading(false);
    }
  };

  // Filter roles based on search term, status, and date
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesSearch = searchTerm === '' || 
                           role.nom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || role.statut.toLowerCase() === statusFilter;
      
      let matchesDate = true;
      if (dateFilter === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const roleDate = role.dateCreation ? new Date(role.dateCreation) : null;
        matchesDate = roleDate ? roleDate >= thirtyDaysAgo : false;
      } else if (dateFilter === 'older') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const roleDate = role.dateCreation ? new Date(role.dateCreation) : null;
        matchesDate = roleDate ? roleDate < thirtyDaysAgo : true;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [roles, searchTerm, statusFilter, dateFilter]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nom', label: 'Nom du rôle' },
    { 
      key: 'statut', 
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value == 'actif' ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    { 
      key: 'dateCreation', 
      label: 'Date de création',
      render: (value: string | null) => value || '-'
    },
    { 
      key: 'dateModification', 
      label: 'Date de modification',
      render: (value: string | null) => value || '-'
    },
    { 
      key: 'dateDesactivation', 
      label: 'Date de désactivation',
      render: (value: string | null) => value || '-'
    }
  ];

  const handleAdd = () => {
    setEditingRole(null);
    setFormData({
      nom: '',
      statut: 'Actif'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      nom: role.nom,
      statut: role.statut
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    
    try {
      setTableLoading(true);
      await roleService.deleteRole(roleToDelete.id);
      await loadRoles();
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression du rôle');
      console.error('Error deleting role:', err);
    } finally {
      setTableLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingRole) {
        const updateData: UpdateRoleRequest = {
          id: editingRole.id,
          nom: formData.nom,
          statut: formData.statut
        };
        await roleService.updateRole(updateData);
      } else {
        const createData: CreateRoleRequest = {
          nom: formData.nom
        };
        await roleService.createRole(createData);
      }
      
      setIsModalOpen(false);
      await loadRoles();
    } catch (err) {
      setError(`Erreur lors de ${editingRole ? 'la modification' : 'la création'} du rôle`);
      console.error('Error saving role:', err);
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

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value as 'all' | 'recent' | 'older');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  if (tableLoading && roles.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Rôles</h1>
          <p className="text-gray-600 mt-2">Gérez les rôles et permissions</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter un rôle
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
                placeholder="Rechercher par nom de rôle..."
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

            {/* Date Filter */}
            <div className="sm:w-48">
              <select
                value={dateFilter}
                onChange={handleDateFilterChange}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="all">Toutes les dates</option>
                <option value="recent">Récents (30 jours)</option>
                <option value="older">Plus anciens</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
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
              {filteredRoles.length} rôle{filteredRoles.length !== 1 ? 's' : ''} trouvé{filteredRoles.length !== 1 ? 's' : ''}
              {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && ` sur ${roles.length} total`}
            </span>
            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
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
                {dateFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Date: {dateFilter === 'recent' ? 'Récents' : 'Plus anciens'}
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
            onClick={loadRoles} 
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
          data={filteredRoles}
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
                Supprimer le rôle
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer le rôle{' '}
              <span className="font-semibold text-gray-900">
                "{roleToDelete?.nom}"
              </span>{' '}
              avec le statut{' '}
              <span className="font-semibold text-gray-900">
                {roleToDelete?.statut}
              </span>{' '}
              ?
            </p>
            {roleToDelete?.dateCreation && (
              <p className="text-xs text-gray-500 mt-2">
                Créé le: {new Date(roleToDelete.dateCreation).toLocaleDateString('fr-FR')}
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

      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRole ? 'Modifier le rôle' : 'Ajouter un rôle'}
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
              label="Nom du rôle"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Entrez le nom du rôle"
            />

            <Select
              label="Statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              options={[
                { value: 'Actif', label: 'Actif' },
                { value: 'Inactif', label: 'Inactif' }
              ]}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              {editingRole ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};