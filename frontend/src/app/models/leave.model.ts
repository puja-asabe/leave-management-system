export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'CASUAL' | 'SICK' | 'ANNUAL' | 'MATERNITY' | 'PATERNITY' | 'EMERGENCY' | 'UNPAID';

export interface LeaveApplyRequest {
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
}

export interface LeaveResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  department: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  reviewedByName: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  // Employee
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  // Manager
  totalRequests: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}
