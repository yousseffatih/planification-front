import React, { useEffect, useState } from 'react';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  UsersIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { PlanificationService } from '../../application/services/planification.service';
import Calendar from '../components/layout/Calendar';

// Mock components - replace with your actual components
type MetricCardProps = {
  title: string;
  value: string | number;
  change: string;
  changeType?: 'positive' | 'negative' | undefined;
  icon: React.ReactNode;
  color: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm ${
          changeType === 'positive' ? 'text-green-600' : 
          changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {change}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  // Define the TotalPagesInfo type according to the expected structure
  type TotalPagesInfo = {
    totalReservation: number;
    reservationAnnuler: number;
    salleDesiponible: number;
    salleIndesponible: number;
    utilisateurActif: number;
  };
  
  const [dashboardData, setDashboardData] = useState<TotalPagesInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const planificationService = new PlanificationService();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await planificationService.getTotalPagesInfo();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Échec du chargement des données du tableau de bord');
        console.error('Erreur lors du chargement des données du tableau de bord:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Generate metrics based on fetched data
  const getMetrics = (): MetricCardProps[] => {
    if (!dashboardData) return [];

    return [
      {
        title: 'Total Réservations',
        value: dashboardData.totalReservation.toLocaleString('fr-FR'),
        change: 'Données en direct',
        changeType: undefined,
        icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
        color: 'bg-blue-500'
      },
      {
        title: 'Réservations Annulées',
        value: dashboardData.reservationAnnuler.toLocaleString('fr-FR'),
        change: `${((dashboardData.reservationAnnuler / dashboardData.totalReservation) * 100).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`,
        changeType: 'negative' as const,
        icon: <CurrencyDollarIcon className="h-6 w-6 text-white" />,
        color: 'bg-red-500'
      },
      {
        title: 'Salles Disponibles',
        value: dashboardData.salleDesiponible.toLocaleString('fr-FR'),
        change: 'Disponibles',
        changeType: 'positive' as const,
        icon: <HomeIcon className="h-6 w-6 text-white" />,
        color: 'bg-green-500'
      },
      {
        title: 'Salles Indisponibles',
        value: dashboardData.salleIndesponible.toLocaleString('fr-FR'),
        change: 'Occupées',
        changeType: 'negative' as const,
        icon: <HomeIcon className="h-6 w-6 text-white" />,
        color: 'bg-orange-500'
      },
      {
        title: 'Utilisateurs Actifs',
        value: dashboardData.utilisateurActif.toLocaleString('fr-FR'),
        change: 'En ligne',
        changeType: 'positive' as const,
        icon: <UsersIcon className="h-6 w-6 text-white" />,
        color: 'bg-purple-500'
      }
    ];
  };

  const metrics = getMetrics();

  if (loading) {
    return (
      <div className="ml-64 min-h-screen bg-gray-50">
        <div className="px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Chargement en cours...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 min-h-screen bg-gray-50">
        <div className="px-6 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600">
            Bienvenue ! Voici un aperçu de l'état actuel de vos réservations et salles.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Calendar Section */}
         <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Planifications</h2>
          <Calendar planificationService={planificationService} />
        </div>
      </div>
    </div>
  );
};