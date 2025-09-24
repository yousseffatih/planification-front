import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProfessorRepository } from "../../../infrastructure/repositories/professor.repository";
import { CreatePlanificationRequest, FilterRequest, Planification } from "../../../shared/types/planification.types";
import { ListAttribute } from "../../../shared/types/salle.types";
import { ClassService } from "../../services/class.service";
import { ModuleService } from "../../services/module.service";
import { PlanificationService } from "../../services/planification.service";
import { SalleService } from "../../services/salle.service";

// Interfaces

interface PlanificationState {
  planifications: Planification[];
  currentPlanification: Planification | null; // Add this for single planification
  loading: boolean;
  tableLoading: boolean;
  planificationLoading: boolean; // Add this for single planification loading
  error: string | null;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  
  // Filters
  filters: FilterRequest;
  
  // Modal states
  isModalOpen: boolean;
  isDeleteModalOpen: boolean;
  editingPlanification: Planification | null;
  planificationToDelete: Planification | null;
  
  // Form data
  formData: {
    nom: string;
    description: string;
    timeDebut: string;
    timeFin: string;
    idSalle: number;
    idModule: number;
    idProfesseur: number;
    idTypePlanification: number;
    datePlanification: string;
    idUser: number;
    idsClasses: number[];
  };
  
  // Dropdown options
  salles: ListAttribute[];
  modules: ListAttribute[];
  professeurs: ListAttribute[];
  typePlanifications: ListAttribute[];
  classes: ListAttribute[];
  dropdownsLoading: boolean;
}

const initialFormData = {
  nom: '',
  description: '',
  timeDebut: '',
  timeFin: '',
  idSalle: 0,
  idModule: 0,
  idProfesseur: 0,
  idTypePlanification: 0,
  datePlanification: '',
  idUser: 1,
  idsClasses: [] as number[]
};

const initialFilters: FilterRequest = {
  idSalle: null,
  idModule: null,
  idType: null,
  dateDebut: '01/08/2025',
  dateFin: '31/08/2025',
  idClasse: null,
  idProf: null
};

const initialState: PlanificationState = {
  planifications: [],
  currentPlanification: null, // Add this
  loading: false,
  tableLoading: false,
  planificationLoading: false, // Add this
  error: null,
  
  // Pagination
  currentPage: 0,
  pageSize: 5,
  totalPages: 0,
  totalElements: 0,
  
  // Filters
  filters: initialFilters,
  
  // Modal states
  isModalOpen: false,
  isDeleteModalOpen: false,
  editingPlanification: null,
  planificationToDelete: null,
  
  // Form data
  formData: initialFormData,
  
  // Dropdown options
  salles: [],
  modules: [],
  professeurs: [],
  typePlanifications: [],
  classes: [],
  dropdownsLoading: false
};

// Services instances
const planificationService = new PlanificationService();
const salleService = new SalleService();
const moduleService = new ModuleService();
const classService = new ClassService();
const professeurService = new ProfessorRepository();

// Async Thunks
export const fetchPlanifications = createAsyncThunk(
  'planifications/fetchPlanifications',
  async ({ filters, page, size }: { filters: FilterRequest; page: number; size: number }) => {
    const response = await planificationService.getFilteredPlanifications(filters, page, size);
    return response;
  }
);

// Add this new async thunk for getting planification by ID
export const fetchPlanificationById = createAsyncThunk(
  'planifications/fetchPlanificationById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await planificationService.getPlanificationById(id);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
      
      // Handle different types of errors
      if (err?.response?.status === 401) {
        return rejectWithValue('Session expirée. Veuillez vous reconnecter.');
      }
      
      const errorMessage = err?.response?.data?.message ||
                           err?.response?.data?.error ||
                           err?.message ||
                           'Erreur lors du chargement de la planification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDropdownOptions = createAsyncThunk(
  'planifications/fetchDropdownOptions',
  async () => {
    const [sallesData, modulesData, professeursData, typesData, classesData] = await Promise.all([
      salleService.getListSalles(),
      moduleService.getListModules(),
      professeurService.getListProfessor(),
      planificationService.getTypePlanifications(),
      classService.getListClass(),
    ]);

    return {
      salles: sallesData,
      modules: modulesData,
      professeurs: professeursData,
      typePlanifications: typesData,
      classes: classesData
    };
  }
);

export const createPlanification = createAsyncThunk(
  'planifications/createPlanification',
  async (data: CreatePlanificationRequest, { rejectWithValue }) => {
    try {
      await planificationService.createPlanification(data);
    } catch (error: unknown) {
      // Handle different types of errors
      const err = error as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
      if (err?.response?.status === 401) {
        return rejectWithValue('Session expirée. Veuillez vous reconnecter.');
      }
      
      // Handle API error response
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.error || 
                          err?.message || 
                          'Erreur lors de la création de la planification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePlanification = createAsyncThunk(
  'planifications/updatePlanification',
  async ({ id, data }: { id: number; data: Partial<CreatePlanificationRequest> }, { rejectWithValue }) => {
    try {
      await planificationService.updatePlanification(id, data);
    } catch (error: unknown) {
      // Handle different types of errors
      const err = error as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
      if (err?.response?.status === 401) {
        return rejectWithValue('Session expirée. Veuillez vous reconnecter.');
      }
      
      // Handle API error response
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.error || 
                          err?.message || 
                          'Erreur lors de la modification de la planification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deletePlanification = createAsyncThunk(
  'planifications/deletePlanification',
  async (id: number, { rejectWithValue }) => {
    try {
      await planificationService.deletePlanification(id);
    } catch (error: unknown) {
      // Handle different types of errors
      const err = error as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
      if (err?.response?.status === 401) {
        return rejectWithValue('Session expirée. Veuillez vous reconnecter.');
      }
      
      // Handle API error response
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.error || 
                          err?.message || 
                          'Erreur lors de la suppression de la planification';
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const planificationSlice = createSlice({
  name: 'planifications',
  initialState,
  reducers: {
    // Modal actions
    openModal: (state) => {
      state.isModalOpen = true;
      state.error = null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingPlanification = null;
      state.formData = initialFormData;
      state.error = null;
    },
    openDeleteModal: (state, action: PayloadAction<Planification>) => {
      state.isDeleteModalOpen = true;
      state.planificationToDelete = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.planificationToDelete = null;
    },
    
    // Form actions
    setFormData: (state, action: PayloadAction<Partial<typeof initialFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData: (state) => {
      state.formData = initialFormData;
    },
    setEditingPlanification: (state, action: PayloadAction<Planification | null>) => {
      state.editingPlanification = action.payload;
      state.formData = {
        nom: action.payload?.nom || '' ,
        description: action.payload?.description || '',
        timeDebut: action.payload?.timeDebut || '',
        timeFin: action.payload?.timeFin || '',
        idSalle: action.payload?.idSalle || 0,
        idModule: action.payload?.idModule || 0,
        idProfesseur: action.payload?.idProfesseur || 0,
        idTypePlanification: action.payload?.idTypePlanification || 0,
        datePlanification: action.payload?.datePlanification || '',
        idUser: action.payload?.idUser || 0,
        idsClasses: action.payload?.idsClasses || []
      };
    },
    
    // Add action to clear current planification
    clearCurrentPlanification: (state) => {
      state.currentPlanification = null;
    },
    
    // Classes management
    addClass: (state, action: PayloadAction<number>) => {
      if (!state.formData.idsClasses.includes(action.payload)) {
        state.formData.idsClasses.push(action.payload);
      }
    },
    removeClass: (state, action: PayloadAction<number>) => {
      state.formData.idsClasses = state.formData.idsClasses.filter(id => id !== action.payload);
    },
    
    // Filter actions
    setFilter: (state, action: PayloadAction<{ key: keyof FilterRequest; value: string | number | null }>) => {
      state.filters = { ...state.filters, [action.payload.key]: action.payload.value };
      state.currentPage = 0; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialFilters;
      state.currentPage = 0;
    },
    
    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 0;
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch planifications
    builder
      .addCase(fetchPlanifications.pending, (state) => {
        state.tableLoading = true;
        state.error = null;
      })
      .addCase(fetchPlanifications.fulfilled, (state, action) => {
        state.tableLoading = false;
        console.log("this is planification",action.payload);
        state.planifications = action.payload.content;
        state.totalPages = action.payload.totlaPages;
        state.totalElements = action.payload.totalElement;
      })
      .addCase(fetchPlanifications.rejected, (state, action) => {
        state.tableLoading = false;
        state.error = action.error.message || 'Erreur lors du chargement des planifications';
      });

    // Add cases for fetchPlanificationById
    builder
      .addCase(fetchPlanificationById.pending, (state) => {
        state.planificationLoading = true;
        state.error = null;
        state.currentPlanification = null;
      })
      .addCase(fetchPlanificationById.fulfilled, (state, action) => {
        state.planificationLoading = false;
        state.currentPlanification = action.payload;
        state.error = null;
      })
      .addCase(fetchPlanificationById.rejected, (state, action) => {
        state.planificationLoading = false;
        state.currentPlanification = null;
        state.error = action.payload as string || action.error.message || 'Erreur lors du chargement de la planification';
      });
    
    // Fetch dropdown options
    builder
      .addCase(fetchDropdownOptions.pending, (state) => {
        state.dropdownsLoading = true;
      })
      .addCase(fetchDropdownOptions.fulfilled, (state, action) => {
        state.dropdownsLoading = false;
        state.salles = action.payload.salles;
        state.modules = action.payload.modules;
        state.professeurs = action.payload.professeurs;
        state.typePlanifications = action.payload.typePlanifications;
        state.classes = action.payload.classes;
      })
      .addCase(fetchDropdownOptions.rejected, (state, action) => {
        state.dropdownsLoading = false;
        state.error = action.error.message || 'Erreur lors du chargement des options';
      });
    
    // Create planification
    builder
      .addCase(createPlanification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlanification.fulfilled, (state) => {
        state.loading = false;
        state.isModalOpen = false;
        state.formData = initialFormData;
        state.editingPlanification = null;
        state.error = null;
      })
      .addCase(createPlanification.rejected, (state, action) => {
        state.loading = false;
        // Use the rejectWithValue message if available, otherwise fallback
        state.error = action.payload as string || action.error.message || 'Erreur lors de la création de la planification';
      });
    
    // Update planification
    builder
      .addCase(updatePlanification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlanification.fulfilled, (state) => {
        state.loading = false;
        state.isModalOpen = false;
        state.formData = initialFormData;
        state.editingPlanification = null;
        state.error = null;
      })
      .addCase(updatePlanification.rejected, (state, action) => {
        state.loading = false;
        // Use the rejectWithValue message if available, otherwise fallback
        state.error = action.payload as string || action.error.message || 'Erreur lors de la modification de la planification';
      });
    
    // Delete planification
    builder
      .addCase(deletePlanification.pending, (state) => {
        state.tableLoading = true;
        state.error = null;
      })
      .addCase(deletePlanification.fulfilled, (state) => {
        state.tableLoading = false;
        state.isDeleteModalOpen = false;
        state.planificationToDelete = null;
        state.error = null;
      })
      .addCase(deletePlanification.rejected, (state, action) => {
        state.tableLoading = false;
        state.isDeleteModalOpen = false;
        state.planificationToDelete = null;
        // Use the rejectWithValue message if available, otherwise fallback
        state.error = action.payload as string || action.error.message || 'Erreur lors de la suppression de la planification';
      });
  }
});

export const {
  openModal,
  closeModal,
  openDeleteModal,
  closeDeleteModal,
  setFormData,
  resetFormData,
  setEditingPlanification,
  clearCurrentPlanification, // Add this export
  addClass,
  removeClass,
  setFilter,
  clearFilters,
  setCurrentPage,
  setPageSize,
  clearError,
  setError
} = planificationSlice.actions;

export default planificationSlice.reducer;