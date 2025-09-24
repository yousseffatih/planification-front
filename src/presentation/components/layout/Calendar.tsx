import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  HomeIcon,
  XMarkIcon,

} from '@heroicons/react/24/outline';
import { Planification } from '../../../shared/types/planification.types';



interface CalendarProps {
  planificationService: {
    getListPlanifications: (dateDebut: string, dateFin: string) => Promise<Planification[]>;
  };
}

type ViewType = 'monthly' | 'weekly';

const Calendar: React.FC<CalendarProps> = ({ planificationService }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [planifications, setPlanifications] = useState<Planification[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlanification, setSelectedPlanification] = useState<Planification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  // Helper function to format date to DD/MM/YYYY
  const formatDateForAPI = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  // Get month calendar data
  const getMonthCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return { days, firstDay, lastDay };
  };

  // Get week calendar data
  const getWeekCalendarData = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const days = [];
    const currentDay = new Date(startOfWeek);
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return { days, firstDay: startOfWeek, lastDay: endOfWeek };
  };

  // Get calendar data based on view type
  const getCalendarData = () => {
    return viewType === 'monthly' ? getMonthCalendarData() : getWeekCalendarData();
  };

  // Load planifications for current month
  const loadPlanifications = useCallback(async () => {
    try {
      setLoading(true);
      const { firstDay, lastDay } = viewType === 'monthly' ? getMonthCalendarData() : getWeekCalendarData();
      const dateDebut = formatDateForAPI(firstDay);
      const dateFin = formatDateForAPI(lastDay);
      
      const data = await planificationService.getListPlanifications(dateDebut, dateFin);
      setPlanifications(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des planifications:', error);
      setPlanifications([]);
    } finally {
      setLoading(false);
    }
  }, [currentDate, viewType, planificationService]);

  useEffect(() => {
    loadPlanifications();
  }, [loadPlanifications]);

  // Get planifications for a specific date
  const getPlanificationsForDate = (date: Date): Planification[] => {
    const dateString = formatDateForAPI(date);
    return planifications.filter(p => p.datePlanification === dateString);
  };

  // Navigation functions
  const goToPrevious = () => {
    if (viewType === 'monthly') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };




  // Get color for planification based on type or status
  const getPlanificationColor = (planification: Planification): string => {
    const colors: Record<string, string> = {
      'actif':'bg-green-100 text-green-800 border-l-green-400',
      'inActif':'bg-red-100 text-red-800 border-l-red-400',
    };
    
    return colors[planification.statut] || 'bg-gray-100 text-gray-800 border-l-gray-400';
  };

  const { days } = getCalendarData();
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNames = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];

  const openModal = (planification: Planification) => {
    setSelectedPlanification(planification);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPlanification(null);
    setShowModal(false);
  };

  const openDayModal = (day: Date) => {
    setSelectedDay(day);
    setShowDayModal(true);
  };

  const closeDayModal = () => {
    setSelectedDay(null);
    setShowDayModal(false);
  };

  const handlePlanificationClick = (planification: Planification) => {
    closeDayModal();
    openModal(planification);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {viewType === 'monthly' 
              ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : `Semaine du ${formatDateForAPI(getCalendarData().firstDay)} au ${formatDateForAPI(getCalendarData().lastDay)}`
            }
          </h2>
          <div className="flex items-center space-x-1">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
           
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle Buttons */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('monthly')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewType === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={loading}
            >
              Mensuel
            </button>
            <button
              onClick={() => setViewType('weekly')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewType === 'weekly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={loading}
            >
              Hebdomadaire
            </button>
          </div>
          
        
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden mb-1">
        {dayNames.map((day) => (
          <div key={day} className="bg-gray-50 px-3 py-3 text-center">
            <span className="text-sm font-medium text-gray-700">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-b-lg overflow-hidden">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const dayPlanifications = getPlanificationsForDate(day);
          const maxItems = viewType === 'weekly' ? 5 : 3;
          
          return (
            <div
              key={index}
              className={`bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                viewType === 'weekly' 
                  ? 'min-h-[200px]' 
                  : 'min-h-[120px]'
              } ${
                !isCurrentMonth && viewType === 'monthly' ? 'text-gray-400 bg-gray-50' : ''
              }`}
              onClick={() => openDayModal(day)}
            >
              <div className={`text-sm font-medium mb-2 ${
                isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-900'
              }`}>
                {day.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayPlanifications.slice(0, maxItems).map((planification) => (
                  <div
                    key={planification.id}
                    className={`text-xs p-2 rounded border-l-2 cursor-pointer hover:shadow-sm transition-shadow ${getPlanificationColor(planification)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(planification);
                    }}
                  >
                    <div className="font-medium truncate">
                      {planification.timeDebut} - {planification.libelleModule}
                    </div>
                    <div className="truncate opacity-75">
                      {planification.libelleSalle}
                    </div>
                  </div>
                ))}
                
                {dayPlanifications.length > maxItems && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{dayPlanifications.length - maxItems} autres
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Chargement...</span>
          </div>
        </div>
      )}

      {/* Modal for Planification Details */}
      {showModal && selectedPlanification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails de la Planification
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <BookOpenIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Module</div>
                  <div className="font-medium">{selectedPlanification.libelleModule}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm text-gray-500">Professeur</div>
                  <div className="font-medium">{selectedPlanification.libelleProfeseur}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HomeIcon className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-sm text-gray-500">Salle</div>
                  <div className="font-medium">{selectedPlanification.libelleSalle}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium">{selectedPlanification.datePlanification}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-sm text-gray-500">Horaire</div>
                  <div className="font-medium">
                    {selectedPlanification.timeDebut} - {selectedPlanification.timeFin}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Type</div>
                <div className="font-medium">{selectedPlanification.liblleTypePlanification}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Statut</div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedPlanification.statut === 'actif' 
                    ? 'bg-green-100 text-green-800'
                    : selectedPlanification.statut === 'inActif'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedPlanification.statut}
                </span>
              </div>

              {selectedPlanification.description && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Description</div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedPlanification.description}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
             
            </div>
          </div>
        </div>
      )}

      {/* Day Modal for Planifications List */}
      {showDayModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Planifications du {formatDateForAPI(selectedDay)}
              </h3>
              <button
                onClick={closeDayModal}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {getPlanificationsForDate(selectedDay).length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucune planification pour ce jour</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getPlanificationsForDate(selectedDay).map((planification) => (
                    <div
                      key={planification.id}
                      className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getPlanificationColor(planification)}`}
                      onClick={() => handlePlanificationClick(planification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <ClockIcon className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-sm">
                              {planification.timeDebut} - {planification.timeFin}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <BookOpenIcon className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{planification.libelleModule}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <UserIcon className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{planification.libelleProfeseur}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <HomeIcon className="h-4 w-4 text-purple-600" />
                              <span className="text-sm">{planification.libelleSalle}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                                {planification.liblleTypePlanification}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                planification.statut === 'actif' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {planification.statut}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 ml-4">
                          Cliquer pour voir les détails
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeDayModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;