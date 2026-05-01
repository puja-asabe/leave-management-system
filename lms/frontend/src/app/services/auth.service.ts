import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';
  private readonly TOKEN_KEY = 'lms_token';
  private readonly USER_KEY = 'lms_user';

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, request).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.saveSession(res.data);
        }
      })
    );
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.saveSession(res.data);
        }
      })
    );
  }

  private saveSession(data: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data));
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY)?.trim();
    return token ? token : null;
  }

  getUser(): AuthResponse | null {
    const rawUser = localStorage.getItem(this.USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      const user = JSON.parse(rawUser) as Partial<AuthResponse>;

      if (!user.role || (user.role !== 'EMPLOYEE' && user.role !== 'MANAGER' && user.role !== 'HR')) {
        this.clearSession();
        return null;
      }

      return user as AuthResponse;
    } catch {
      this.clearSession();
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) {
      if (token || localStorage.getItem(this.USER_KEY)) {
        this.clearSession();
      }

      return false;
    }

    return true;
  }

  isEmployee(): boolean {
    return this.getUser()?.role === 'EMPLOYEE';
  }

  isManager(): boolean {
    const role = this.getUser()?.role;
    return role === 'MANAGER' || role === 'HR';
  }

  isHr(): boolean {
    return this.getUser()?.role === 'HR';
  }

  getRoutePrefix(): '/employee' | '/manager' {
    return this.isManager() ? '/manager' : '/employee';
  }

  getDashboardRoute(): string {
    return `${this.getRoutePrefix()}/dashboard`;
  }

  getApplyLeaveRoute(): string {
    return `${this.getRoutePrefix()}/apply-leave`;
  }

  getMyLeavesRoute(): string {
    return `${this.getRoutePrefix()}/my-leaves`;
  }

  getLeaveBalanceRoute(): string {
    return `${this.getRoutePrefix()}/leave-balance`;
  }

  getDefaultRoute(): string | null {
    if (!this.isLoggedIn()) {
      return null;
    }

    const user = this.getUser();

    if (!user) {
      return null;
    }

    return this.getDashboardRoute();
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/login');
  }
}
