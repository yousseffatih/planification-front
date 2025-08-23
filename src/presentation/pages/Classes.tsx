import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Class, CreateClassRequest, UpdateClassRequest } from '../../shared/types/class.types';
import { ClassService } from '../../application/services/class.service';

//import { ProfessorService } from '../../application/services/professor.service';
// import { Professor } from '../../shared/types/professor.types';

export const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  //const [professors, setProfessors] = useState<Professor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [anneeFilter, setAnneeFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    nom: '',
    annuerScolaire: "",
    nomberEff: 0,
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const classService = new ClassService();
  //const professorService = new ProfessorService();

  useEffect(() => {
    loadClasses();
    //loadProfessors();
  }, []);

  const loadClasses = async () => {
    try {
      setTableLoading(true);
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (error: unknown) {
      setError('Erreur lors du chargement des classes');
      console.error('Error loading classes:', error);
    } finally {
      setTableLoading(false);
    }
  };

  // Get unique school years for filter
  const uniqueAnnees = useMemo(() => {
    const annees = [...new Set(classes.map(c => c.annuerScolaire))];
    return annees.filter(Boolean).sort();
  }, [classes]);

  // Filter classes based on search term, status, and school year
  const filteredClasses = useMemo(() => {
    return classes.filter(classItem => {
      const matchesSearch = searchTerm === '' || 
                           classItem.nom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || classItem.statut.toLowerCase() === statusFilter;
      const matchesAnnee = anneeFilter === 'all' || classItem.annuerScolaire === anneeFilter;
      return matchesSearch && matchesStatus && matchesAnnee;
    });
  }, [classes, searchTerm, statusFilter, anneeFilter]);

  // const loadProfessors = async () => {
  //   try {
  //     const data = await professorService.getAllProfessors();
  //     setProfessors(data);
  //   } catch (error: unknown) {
  //     console.error('Error loading professors:', error);
  //   }
  // };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nom', label: 'Nom de la classe' },
    { key: 'annuerScolaire', label: 'Annee scolaire' },
    { key: 'nomberEff', label: 'Capacité' },
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
    { key: 'dateCreation', label: 'Date de création' }
  ];

  // const professeurOptions = professors.map(professor => ({
  //   value: professor.id,
  //   label: `${professor.prenom} ${professor.nom}`
  // }));

  // const niveauOptions = [
  //   { value: 'Licence 1', label: 'Licence 1' },
  //   { value: 'Licence 2', label: 'Licence 2' },
  //   { value: 'Licence 3', label: 'Licence 3' },
  //   { value: 'Master 1', label: 'Master 1' },
  //   { value: 'Master 2', label: 'Master 2' }
  // ];

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({
      nom: '',
      annuerScolaire: '',
      nomberEff: 0,
      statut: 'Actif'
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      nom: classItem.nom,
      annuerScolaire: classItem.annuerScolaire,
      nomberEff: classItem.nomberEff,
      statut: classItem.statut
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = (classItem: Class) => {
    setClassToDelete(classItem);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!classToDelete) return;
    
    try {
      setTableLoading(true);
      await classService.deleteClass(classToDelete.id);
      await loadClasses();
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
    } catch (error: unknown) {
      setError('Erreur lors de la suppression de la classe');
      console.error('Error deleting class:', error);
    } finally {
      setTableLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setClassToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingClass) {
        const updateData: UpdateClassRequest = {
          id: editingClass.id,
          nom: formData.nom,
          annuerScolaire: formData.annuerScolaire,
          nomberEff: formData.nomberEff,
          
          statut: formData.statut
        };
        await classService.updateClass(editingClass.id, updateData);
      } else {
        const createData: CreateClassRequest = {
          nom: formData.nom,
          nomberEff: formData.nomberEff,
          annuerScolaire: formData.annuerScolaire,
        };
        await classService.createClass(createData);
      }
      
      await loadClasses();
      setIsModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Erreur lors de l\'opération');
      } else {
        setError('Erreur lors de l\'opération');
      }
      console.error('Error submitting class:', error);
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

  const handleAnneeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnneeFilter(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAnneeFilter('all');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50 px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Classes</h1>
          <p className="text-gray-600 mt-2">Gérez les classes et cours</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter une classe
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
                placeholder="Rechercher par nom de classe..."
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

            {/* School Year Filter */}
            <div className="sm:w-48">
              <select
                value={anneeFilter}
                onChange={handleAnneeFilterChange}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="all">Toutes les années</option>
                {uniqueAnnees.map(annee => (
                  <option key={annee} value={annee}>{annee}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== 'all' || anneeFilter !== 'all') && (
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
              {filteredClasses.length} classe{filteredClasses.length !== 1 ? 's' : ''} trouvée{filteredClasses.length !== 1 ? 's' : ''}
              {(searchTerm || statusFilter !== 'all' || anneeFilter !== 'all') && ` sur ${classes.length} total`}
            </span>
            {(searchTerm || statusFilter !== 'all' || anneeFilter !== 'all') && (
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
                {anneeFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Année: {anneeFilter}
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
          data={filteredClasses}
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
                Supprimer la classe
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer la classe{' '}
              <span className="font-semibold text-gray-900">
                "{classToDelete?.nom}"
              </span>{' '}
              de l'année scolaire{' '}
              <span className="font-semibold text-gray-900">
                {classToDelete?.annuerScolaire}
              </span>{' '}
              ?
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

      {/* Add/Edit Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClass ? 'Modifier la classe' : 'Ajouter une classe'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom de la classe"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
            <Input
              label="Annee scolaire"
              name="annuerScolaire"
              value={formData.annuerScolaire}
              onChange={handleChange}
              required
            />
            {/* <Select
              label="Niveau"
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              options={niveauOptions}
              required
            /> */}
            <Input
              label="Capacité"
              name="nomberEff"
              type="number"
              value={formData.nomberEff}
              onChange={handleChange}
              required
              //min="1"
              //max="100"
            />
            {/* <Select
              label="Professeur"
              name="professeurId"
              value={formData.professeurId}
              onChange={handleChange}
              options={professeurOptions}
              required
            /> */}
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
          
          {/* <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-colors duration-200"
              placeholder="Description de la classe..."
              required
            />
          </div> */}

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
              {editingClass ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};