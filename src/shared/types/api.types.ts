export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}