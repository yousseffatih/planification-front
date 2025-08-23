import React, { useState, useEffect, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { User, CreateUserRequest, UpdateUserRequest } from '../../shared/types/user.types';
import { UserService } from '../../application/services/user.service';
import { RoleService } from '../../application/services/role.service';
import { Role } from '../../shared/types/role.types';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nom: '',
    prenom: '',
    roleId: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const userService = new UserService();
  const roleService = new RoleService();

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setTableLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Error loading users:', error);
    } finally {
      setTableLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  // Get unique roles for filter
  const uniqueRoles = useMemo(() => {
    const roleNames = [...new Set(users.map(u => u.role))];
    return roleNames.filter(Boolean).sort();
  }, [users]);

  // Filter users based on search term, status, and role
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
                           user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.statut.toLowerCase() === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Nom d\'utilisateur' },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rôle' },
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

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.nom
  }));

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      nom: '',
      prenom: '',
      roleId: '',
      statut: 'Actif'
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      roleId: roles.find(r => r.nom === user.role)?.id.toString() || '',
      statut: user.statut
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      setTableLoading(true);
      await userService.deleteUser(userToDelete.id);
      await loadUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error('Error deleting user:', error);
    } finally {
      setTableLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingUser) {
        const updateData: UpdateUserRequest = {
          id: editingUser.id,
          username: formData.username,
          email: formData.email,
          nom: formData.nom,
          prenom: formData.prenom,
          roleId: parseInt(formData.roleId),
          statut: formData.statut
        };
        await userService.updateUser(editingUser.id, updateData);
      } else {
        const createData: CreateUserRequest = {
          username: formData.username,
          email: formData.email,
          nom: formData.nom,
          prenom: formData.prenom,
          roleId: parseInt(formData.roleId)
        };
        await userService.createUser(createData);
      }
      
      await loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Erreur lors de l'opération");
      } else {
        setError("Erreur lors de l'opération");
      }
      console.error('Error submitting user:', error);
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

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50 px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-2">Gérez les utilisateurs du système</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter un utilisateur
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
                placeholder="Rechercher par nom, prénom, email ou nom d'utilisateur..."
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

            {/* Role Filter */}
            <div className="sm:w-48">
              <select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-gray-900 text-sm bg-white
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400 focus:shadow-lg"
              >
                <option value="all">Tous les rôles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
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
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
              {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && ` sur ${users.length} total`}
            </span>
            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
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
                {roleFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Rôle: {roleFilter}
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
          data={filteredUsers}
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
                Supprimer l'utilisateur
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
              <span className="font-semibold text-gray-900">
                "{userToDelete?.nom} {userToDelete?.prenom}"
              </span>{' '}
              avec le nom d'utilisateur{' '}
              <span className="font-semibold text-gray-900">
                "{userToDelete?.username}"
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

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
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
        
            <Select
              label="Rôle"
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              options={roleOptions}
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
              {editingUser ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};