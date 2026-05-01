export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  // ✅ ADD THIS FIELD
  contactNumber: string;

  role: 'EMPLOYEE' | 'MANAGER' | 'HR';
  department: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;

  contactNumber: string;

  role: 'EMPLOYEE' | 'MANAGER' | 'HR';
  department: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
