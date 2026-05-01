import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStats } from '../../models/leave.model';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-dashboard.component.html'
})
export class EmployeeDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';
  userName = '';

  constructor(private leaveService: LeaveService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUser()?.name || 'Employee';
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.leaveService.getEmployeeDashboard().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.stats = res.data;
        else this.error = res.message;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load dashboard data.';
      }
    });
  }

  getUsagePercent(): number {
    if (!this.stats || this.stats.totalLeaves === 0) return 0;
    return Math.round((this.stats.usedLeaves / this.stats.totalLeaves) * 100);
  }

  logout(): void {
    this.authService.logout();
  }
}
