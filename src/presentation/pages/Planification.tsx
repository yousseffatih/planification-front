import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../application/hooks/redux.hooks';
import { CreatePlanificationRequest, FilterRequest, Planification } from "../../shared/types/planification.types";
import { PlusIcon } from 'lucide-react';
import { Table } from '../components/common/Table';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import XMarkIcon from '@heroicons/react/24/solid/esm/XMarkIcon';
import {
  fetchPlanifications,
  fetchPlanificationById, // Add this import
  fetchDropdownOptions,
  createPlanification,
  updatePlanification,
  deletePlanification,
  openModal,
  closeModal,
  openDeleteModal,
  closeDeleteModal,
  setFormData,
  setEditingPlanification,
  addClass,
  removeClass,
  setFilter,
  clearFilters,
  setCurrentPage,
  setPageSize,
  clearError
} from '../../application/store/slices/planification.slice';

export const Planifications: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const { user } = useAppSelector((state) => state.auth);
  const {
    planifications,
    loading,
    tableLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    filters,
    isModalOpen,
    isDeleteModalOpen,
    editingPlanification,
    planificationToDelete,
    formData,
    salles,
    modules,
    professeurs,
    typePlanifications,
    classes
  } = useAppSelector((state) => state.planifications);

  // Load data on component mount and when pagination changes
  useEffect(() => {
    dispatch(fetchPlanifications({ filters, page: currentPage, size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Load planifications when filters change
  useEffect(() => {
    dispatch(fetchPlanifications({ filters, page: currentPage, size: pageSize }));
  }, [dispatch, filters, currentPage, pageSize]);

  // Load dropdown options on mount
  useEffect(() => {
    dispatch(fetchDropdownOptions());
  }, [dispatch]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nom', label: 'Nom' },
    { key: 'datePlanification', label: 'Date' },
    { key: 'timeDebut', label: 'Heure début' },
    { key: 'timeFin', label: 'Heure fin' },
    { key: 'libelleProfeseur', label: 'Professeur' },
    { key: 'libelleModule', label: 'Module' },
    { key: 'libelleSalle', label: 'Salle' },
    { key: 'liblleTypePlanification', label: 'Type' },
    { 
      key: 'statut', 
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 'actif' ? 'Actif' : 'Inactif'}
        </span>
      )
    }
  ];

  const handleAdd = () => {
    // Initialize form with proper default values
    dispatch(setFormData({
      nom: '',
      datePlanification: '',
      timeDebut: '',
      timeFin: '',
      idSalle: 0,
      idModule: 0,
      idProfesseur: 0,
      idTypePlanification: 0,
      description: '',
      idUser: 0,
      idsClasses: []
    }));
    dispatch(setEditingPlanification(null));
    dispatch(openModal());
  };

  const handleEdit = async (planification: Planification) => {
    try {
      // First fetch the detailed planification data
      const detailedPlanification = await dispatch(fetchPlanificationById(planification.id)).unwrap();
      
      // Set the editing planification
      dispatch(setEditingPlanification(detailedPlanification));
      
      // Populate the form with the fetched data
      dispatch(setFormData({
        nom: detailedPlanification.nom || '',
        datePlanification: detailedPlanification.datePlanification || '',
        timeDebut: detailedPlanification.timeDebut ? detailedPlanification.timeDebut.split(' ')[1] || detailedPlanification.timeDebut : '',
        timeFin: detailedPlanification.timeFin ? detailedPlanification.timeFin.split(' ')[1] || detailedPlanification.timeFin : '',
        idSalle: detailedPlanification.idSalle ,
        idModule: detailedPlanification.idModule,
        idProfesseur: detailedPlanification.idProfesseur,
        idTypePlanification: detailedPlanification.idTypePlanification,
        description: detailedPlanification.description || '',
        idUser: detailedPlanification.idUser,
        idsClasses: detailedPlanification.idsClasses || []
      }));
      
      // Open the modal
      dispatch(openModal());
    } catch (error) {
      console.error('Error fetching planification details:', error);
      // Optionally show an error message to the user
    }
  };

  const handleDelete = (planification: Planification) => {
    dispatch(openDeleteModal(planification));
  };

  const confirmDelete = async () => {
    if (!planificationToDelete) return;
    
    try {
      await dispatch(deletePlanification(planificationToDelete.id)).unwrap();
      await dispatch(fetchPlanifications({ filters, page: currentPage, size: pageSize }));
    } catch (error: unknown) {
      // Error will be handled by Redux slice and shown in the UI
      console.error('Error deleting planification:', error);
    }
  };

  const cancelDelete = () => {
    dispatch(closeDeleteModal());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearError());

    try {
      if (editingPlanification) {
        // For update, prepare the data with proper format
        const updateData = {
          nom: formData.nom,
          datePlanification: formData.datePlanification,
          timeDebut: formData.timeDebut.includes(' ') ? formData.timeDebut : `${formData.datePlanification} ${formData.timeDebut}`,
          timeFin: formData.timeFin.includes(' ') ? formData.timeFin : `${formData.datePlanification} ${formData.timeFin}`,
          idModule: formData.idModule,
          idSalle: formData.idSalle,
          idUser: formData.idUser,
          idsClasses: formData.idsClasses,
          description: formData.description,
          idTypePlanification: formData.idTypePlanification,
          idProfesseur: formData.idProfesseur
        };
        
        await dispatch(updatePlanification({ 
          id: editingPlanification.id, 
          data: updateData 
        })).unwrap();
      } else {
        // Format times to include date as per API requirement
        const formatDateTime = (date: string, time: string) => {
          return `${date} ${time}`;
        };

        const createData: CreatePlanificationRequest = {
          datePlanification: formData.datePlanification,
          timeDebut: formatDateTime(formData.datePlanification, formData.timeDebut),
          timeFin: formatDateTime(formData.datePlanification, formData.timeFin),
          idModule: formData.idModule,
          idSalle: formData.idSalle,
          idUser: user?.idUser || 0, // Use current user's ID
          idsClasses: formData.idsClasses ?? [],
          nom: formData.nom,
          description: formData.description,
          idTypePlanification: formData.idTypePlanification,
          idProfesseur: formData.idProfesseur
        };
        await dispatch(createPlanification(createData)).unwrap();
      }
      
      await dispatch(fetchPlanifications({ filters, page: currentPage, size: pageSize }));
    } catch (error: unknown) {
      console.error('Error submitting planification:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  const handleAddClass = (classeId: number) => {
    dispatch(addClass(classeId));
  };

  const handleRemoveClass = (classeId: number) => {
    dispatch(removeClass(classeId));
  };

  const getSelectedClasses = () => {
    return classes.filter(classe => formData.idsClasses.includes(classe.id));
  };

  const getAvailableClasses = () => {
    return classes.filter(classe => !formData.idsClasses.includes(classe.id));
  };

  const handleFilterChange = (name: keyof FilterRequest, value: string | number | null) => {
    dispatch(setFilter({ key: name, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleCloseModal = () => {
    // Clear form data when closing modal
    dispatch(setFormData({
      nom: '',
      datePlanification: '',
      timeDebut: '',
      timeFin: '',
      idSalle: 0,
      idModule: 0,
      idProfesseur: 0,
      idTypePlanification: 0,
      description: '',
      idUser: 0,
      idsClasses: []
    }));
    dispatch(setEditingPlanification(null));
    dispatch(closeModal());
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize));
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.idSalle !== null || 
           filters.idModule !== null || 
           filters.idType !== null || 
           filters.idClasse !== null || 
           filters.idProf !== null ||
           filters.dateDebut !== '01/08/2025' ||
           filters.dateFin !== '31/08/2025';
  }, [filters]);

  return (
    <div className="ml-64 min-h-screen bg-gray-50 px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Planifications</h1>
          <p className="text-gray-600 mt-2">Gérez les planifications et leurs informations</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter une planification
        </Button>
      </div>

      {/* Beautiful Filter Bar */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Date Début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date début
              </label>
              <input
                type="date"
                value={filters.dateDebut?.split('/').reverse().join('-') || ''}
                onChange={(e) => {
                  const date = e.target.value ? e.target.value.split('-').reverse().join('/') : '';
                  handleFilterChange('dateDebut', date);
                }}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              />
            </div>

            {/* Date Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date fin
              </label>
              <input
                type="date"
                value={filters.dateFin?.split('/').reverse().join('-') || ''}
                onChange={(e) => {
                  const date = e.target.value ? e.target.value.split('-').reverse().join('/') : '';
                  handleFilterChange('dateFin', date);
                }}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              />
            </div>

            {/* Salle Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salle
              </label>
              <select
                value={filters.idSalle || ''}
                onChange={(e) => handleFilterChange('idSalle', e.target.value ? parseInt(e.target.value) : null)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="">Toutes les salles</option>
                {salles.map(salle => (
                  <option key={salle.id} value={salle.id}>
                    {salle.libelle}
                  </option>
                ))}
              </select>
            </div>

            {/* Module Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module
              </label>
              <select
                value={filters.idModule || ''}
                onChange={(e) => handleFilterChange('idModule', e.target.value ? parseInt(e.target.value) : null)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="">Tous les modules</option>
                {modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.libelle}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.idType || ''}
                onChange={(e) => handleFilterChange('idType', e.target.value ? parseInt(e.target.value) : null)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="">Tous les types</option>
                {typePlanifications.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.libelle}
                  </option>
                ))}
              </select>
            </div>

            {/* Classe Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe
              </label>
              <select
                value={filters.idClasse || ''}
                onChange={(e) => handleFilterChange('idClasse', e.target.value ? parseInt(e.target.value) : null)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="">Toutes les classes</option>
                {classes.map(classe => (
                  <option key={classe.id} value={classe.id}>
                    {classe.libelle}
                  </option>
                ))}
              </select>
            </div>

            {/* Professeur Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professeur
              </label>
              <select
                value={filters.idProf || ''}
                onChange={(e) => handleFilterChange('idProf', e.target.value ? parseInt(e.target.value) : null)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="">Tous les professeurs</option>
                {professeurs.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.libelle}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 
                           border border-gray-300 rounded-lg hover:bg-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           transition-colors duration-200"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>

          {/* Filter Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              {totalElements} planification{totalElements !== 1 ? 's' : ''} trouvée{totalElements !== 1 ? 's' : ''}
              {hasActiveFilters && ' (filtré)'}
            </span>
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-xs">
                {filters.idSalle && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Salle: {salles.find(s => s.id === filters.idSalle)?.libelle}
                  </span>
                )}
                {filters.idModule && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Module: {modules.find(m => m.id === filters.idModule)?.libelle}
                  </span>
                )}
                {filters.idProf && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Prof: {professeurs.find(p => p.id === filters.idProf)?.libelle}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && !isModalOpen && !isDeleteModalOpen && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={planifications}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={tableLoading}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Page {currentPage + 1} sur {totalPages}
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={5}>5 par page</option>
                  <option value={10}>10 par page</option>
                  <option value={20}>20 par page</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-sm"
                >
                  Précédent
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "primary" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className="px-3 py-1 text-sm"
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 text-sm"
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        )}
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
                Supprimer la planification
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer la planification{' '}
              <span className="font-semibold text-gray-900">
                "{planificationToDelete?.nom}"
              </span>{' '}
              du{' '}
              <span className="font-semibold text-gray-900">
                {planificationToDelete?.datePlanification}
              </span>{' '}
              ?
            </p>
            {planificationToDelete?.libelleProfeseur && (
              <p className="text-xs text-gray-500 mt-2">
                Professeur: {planificationToDelete.libelleProfeseur}
              </p>
            )}
            {planificationToDelete?.libelleModule && (
              <p className="text-xs text-gray-500">
                Module: {planificationToDelete.libelleModule}
              </p>
            )}
            {planificationToDelete?.libelleSalle && (
              <p className="text-xs text-gray-500">
                Salle: {planificationToDelete.libelleSalle}
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

      {/* Add/Edit Planification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPlanification ? 'Modifier la planification' : 'Ajouter une planification'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className='md:col-span-2'>
                <Input
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                />
            </div>
            <Input
              label="Date de planification"
              name="datePlanification"
              type="date"
              value={formData.datePlanification?.split('/').reverse().join('-') || ''}
              onChange={(e) => {
                const date = e.target.value ? e.target.value.split('-').reverse().join('/') : '';
                dispatch(setFormData({ datePlanification: date }));
              }}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Heure début"
                name="timeDebut"
                type="time"
                value={formData.timeDebut}
                onChange={handleChange}
                required
              />
              <Input
                label="Heure fin"
                name="timeFin"
                type="time"
                value={formData.timeFin}
                onChange={handleChange}
                required
              />
            </div>

            <Select
              label="Salle"
              name="idSalle"
              value={formData.idSalle}
              onChange={handleChange}
              options={salles.map(salle => ({ value: salle.id, label: salle.libelle }))}
              required
            />

            <Select
              label="Module"
              name="idModule"
              value={formData.idModule}
              onChange={handleChange}
              options={modules.map(module => ({ value: module.id, label: module.libelle }))}
              required
            />

            <Select
              label="Professeur"
              name="idProfesseur"
              value={formData.idProfesseur}
              onChange={handleChange}
              options={professeurs.map(prof => ({ 
                value: prof.id, 
                label: `${prof.libelle}` 
              }))}
              required
            />

            <Select
              label="Type de planification"
              name="idTypePlanification"
              value={formData.idTypePlanification}
              onChange={handleChange}
              options={typePlanifications.map(type => ({ 
                value: type.id, 
                label: type.libelle 
              }))}
              required
            />

            {/* Classes Selection with Visual Display */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classes <span className="text-red-500">*</span>
              </label>
              
              {/* Available Classes Dropdown */}
              <div className="space-y-3">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddClass(parseInt(e.target.value));
                      e.target.value = ""; // Reset selection
                    }
                  }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-gray-900 text-sm
                           transition-all duration-200 ease-in-out
                           hover:border-gray-400 focus:shadow-lg"
                  disabled={getAvailableClasses().length === 0}
                >
                  <option value="">
                    {getAvailableClasses().length === 0 
                      ? "Toutes les classes sont sélectionnées" 
                      : "Sélectionner une classe à ajouter..."}
                  </option>
                  {getAvailableClasses().map(classe => (
                    <option key={classe.id} value={classe.id}>
                      {classe.libelle}
                    </option>
                  ))}
                </select>

                {/* Selected Classes Display */}
                {formData.idsClasses.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Classes sélectionnées ({formData.idsClasses.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[3rem]">
                      {getSelectedClasses().map(classe => (
                        <div
                          key={classe.id}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 
                                   rounded-full text-sm font-medium border border-blue-200
                                   hover:bg-blue-200 transition-colors duration-200"
                        >
                          <span>{classe.libelle}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveClass(classe.id)}
                            className="ml-1 inline-flex items-center justify-center w-4 h-4 
                                     text-blue-600 hover:text-blue-800 hover:bg-blue-300 
                                     rounded-full transition-colors duration-200"
                            title="Supprimer cette classe"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Classes Selected Message */}
                {formData.idsClasses.length === 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Aucune classe sélectionnée. Veuillez sélectionner au moins une classe.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
                placeholder="Description de la planification..."
              />
            </div>
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
            <Button 
              type="submit" 
              loading={loading}
              disabled={formData.idsClasses.length === 0}
            >
              {editingPlanification ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};