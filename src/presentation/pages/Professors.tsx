import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Professor, CreateProfessorRequest, UpdateProfessorRequest } from '../../shared/types/professor.types';
import { ProfessorService } from '../../application/services/professor.service';

export const Professors: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState<Professor | null>(null);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numeroTele: '',
    idTypeProf: 0,
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const professorService = new ProfessorService();

  useEffect(() => {
    loadProfessors();
  }, []);

  const loadProfessors = async () => {
    try {
      setTableLoading(true);
      const data = await professorService.getAllProfessors();
      setProfessors(data);
    } catch (error: unknown) {
      setError('Erreur lors du chargement des professeurs');
      console.error('Error loading professors:', error);
    } finally {
      setTableLoading(false);
    }
  };

  // Get unique professor types for filter
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(professors.map(p => p.libelleTypeProf))];
    return types.filter(Boolean).sort();
  }, [professors]);

  // Filter professors based on search term, status, and type
  const filteredProfessors = useMemo(() => {
    return professors.filter(professor => {
      const matchesSearch = searchTerm === '' || 
                           professor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professor.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professor.numeroTele.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || professor.statut.toLowerCase() === statusFilter;
      const matchesType = typeFilter === 'all' || professor.libelleTypeProf === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [professors, searchTerm, statusFilter, typeFilter]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'numeroTele', label: 'Téléphone' },
    { 
      key: 'libelleTypeProf', 
      label: 'Type de professeur',
    },
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
    { key: 'dateCreation', label: 'Date de création' }
  ];

  const typeProfOptions = [
    { value: 1, label: 'Professeur Titulaire' },
    { value: 2, label: 'Maître de Conférences' },
    { value: 3, label: 'Professeur Associé' },
    { value: 4, label: 'Chargé de Cours' },
    { value: 5, label: 'Assistant' },
    { value: 6, label: 'Professeur Invité' }
  ];

  const handleAdd = () => {
    setEditingProfessor(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      numeroTele: '',
      idTypeProf: 0,
      statut: 'Actif'
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor);
    setFormData({
      nom: professor.nom,
      prenom: professor.prenom,
      email: professor.email,
      numeroTele: professor.numeroTele,
      idTypeProf: professor.idTypeProf,
      statut: professor.statut
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = (professor: Professor) => {
    setProfessorToDelete(professor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!professorToDelete) return;
    
    try {
      setTableLoading(true);
      await professorService.deleteProfessor(professorToDelete.id);
      await loadProfessors();
      setIsDeleteModalOpen(false);
      setProfessorToDelete(null);
    } catch (error: unknown) {
      setError('Erreur lors de la suppression du professeur');
      console.error('Error deleting professor:', error);
    } finally {
      setTableLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProfessorToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingProfessor) {
        const updateData: UpdateProfessorRequest = {
          id: editingProfessor.id,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          numeroTele: formData.numeroTele,
          idTypeProf: formData.idTypeProf,
          statut: formData.statut
        };
        await professorService.updateProfessor(editingProfessor.id, updateData);
      } else {
        const createData: CreateProfessorRequest = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          numeroTele: formData.numeroTele,
          idTypeProf: formData.idTypeProf
        };
        await professorService.createProfessor(createData);
      }
      
      await loadProfessors();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Erreur lors de l\'opération');
      } else {
        setError('Erreur lors de l\'opération');
      }
      console.error('Error submitting professor:', error);
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

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50 px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Professeurs</h1>
          <p className="text-gray-600 mt-2">Gérez les professeurs et leur informations</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter un professeur
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
                placeholder="Rechercher par nom, prénom, email ou téléphone..."
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

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
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
              {filteredProfessors.length} professeur{filteredProfessors.length !== 1 ? 's' : ''} trouvé{filteredProfessors.length !== 1 ? 's' : ''}
              {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && ` sur ${professors.length} total`}
            </span>
            {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
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
          data={filteredProfessors}
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
                Supprimer le professeur
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer le professeur{' '}
              <span className="font-semibold text-gray-900">
                "{professorToDelete?.prenom} {professorToDelete?.nom}"
              </span>{' '}
              de type{' '}
              <span className="font-semibold text-gray-900">
                {professorToDelete?.libelleTypeProf}
              </span>{' '}
              ?
            </p>
            {professorToDelete?.email && (
              <p className="text-xs text-gray-500 mt-2">
                Email: {professorToDelete.email}
              </p>
            )}
            {professorToDelete?.numeroTele && (
              <p className="text-xs text-gray-500">
                Téléphone: {professorToDelete.numeroTele}
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

      {/* Add/Edit Professor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProfessor ? 'Modifier le professeur' : 'Ajouter un professeur'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
            <Input
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Téléphone"
              name="numeroTele"
              value={formData.numeroTele}
              onChange={handleChange}
              required
            />
            <Select
              label="Type de professeur"
              name="idTypeProf"
              value={formData.idTypeProf}
              onChange={handleChange}
              options={typeProfOptions}
              required
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
              {editingProfessor ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};