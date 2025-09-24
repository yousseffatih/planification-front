import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Event emitter for logout events
class LogoutEventEmitter {
  private listeners: (() => void)[] = [];

  addListener(callback: () => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: () => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  emit() {
    this.listeners.forEach(listener => listener());
  }
}

export const logoutEventEmitter = new LogoutEventEmitter();

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Don't automatically logout - let the error propagate to the component
          // The component can handle the 401 error appropriately
          console.warn('Unauthorized request - token may be expired or invalid');
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url);
  }

  public async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data);
  }

  public async put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data);
  }

  public async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url);
  }

  // Method to handle logout properly
  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    logoutEventEmitter.emit();
    window.location.href = '/login';
  }
}

export const apiClient = new ApiClient();