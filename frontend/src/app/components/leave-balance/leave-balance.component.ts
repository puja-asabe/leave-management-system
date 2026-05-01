import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStats } from '../../models/leave.model';

@Component({
  selector: 'app-leave-balance',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leave-balance.component.html'
})
export class LeaveBalanceComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';
  userName = '';
  department = '';
  applyLeaveRoute = '';
  myLeavesRoute = '';

  leaveTypes = [
    { name: 'Casual Leave', allocated: 7, color: 'blue' },
    { name: 'Sick Leave', allocated: 7, color: 'red' },
    { name: 'Annual Leave', allocated: 6, color: 'green' },
  ];

  constructor(private leaveService: LeaveService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user?.name || '';
    this.department = user?.department || '';
    this.applyLeaveRoute = this.authService.getApplyLeaveRoute();
    this.myLeavesRoute = this.authService.getMyLeavesRoute();
    this.loadBalance();
  }

  loadBalance(): void {
    this.loading = true;
    this.leaveService.getLeaveBalance().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.stats = res.data;
        else this.error = res.message;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load leave balance.';
      }
    });
  }

  getPercent(used: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  }
}
