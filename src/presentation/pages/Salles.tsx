import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
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
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleDelete = async (salle: Salle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la salle ${salle.nom} ?`)) {
      try {
        setTableLoading(true);
        await sallesServices.deleteSalle(salle.id);
        await loadSalles(); // Refresh the list
      } catch (err) {
        setError('Erreur lors de la suppression de la salle');
        console.error('Error deleting salle:', err);
      } finally {
        setTableLoading(false);
      }
    }
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

      {error && !isModalOpen && (
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
          data={salles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={tableLoading}
        />
      </div>

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
