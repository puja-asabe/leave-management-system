import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.model';
import { DashboardStats, LeaveApplyRequest, LeaveResponse } from '../models/leave.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private apiUrl = '/api/leaves';

  constructor(private http: HttpClient) {}

  applyLeave(request: LeaveApplyRequest): Observable<ApiResponse<LeaveResponse>> {
    return this.http.post<ApiResponse<LeaveResponse>>(`${this.apiUrl}/apply`, request);
  }

  getMyLeaves(): Observable<ApiResponse<LeaveResponse[]>> {
    return this.http.get<ApiResponse<LeaveResponse[]>>(`${this.apiUrl}/my`);
  }

  getTeamLeaves(): Observable<ApiResponse<LeaveResponse[]>> {
    return this.http.get<ApiResponse<LeaveResponse[]>>(`${this.apiUrl}/team`);
  }

  approveLeave(id: number): Observable<ApiResponse<LeaveResponse>> {
    return this.http.put<ApiResponse<LeaveResponse>>(`${this.apiUrl}/approve/${id}`, {});
  }

  rejectLeave(id: number, rejectionReason?: string): Observable<ApiResponse<LeaveResponse>> {
    return this.http.put<ApiResponse<LeaveResponse>>(`${this.apiUrl}/reject/${id}`, { rejectionReason });
  }

  getEmployeeDashboard(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard/employee`);
  }

  getManagerDashboard(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard/manager`);
  }

  getLeaveBalance(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/balance`);
  }
}
