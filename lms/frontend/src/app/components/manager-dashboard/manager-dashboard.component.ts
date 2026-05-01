import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStats } from '../../models/leave.model';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manager-dashboard.component.html'
})
export class ManagerDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';
  userName = '';

  constructor(private leaveService: LeaveService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUser()?.name || 'Manager';
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.leaveService.getManagerDashboard().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.stats = res.data;
        else this.error = res.message;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load dashboard.';
      }
    });
  }

  getApprovalRate(): number {
    if (!this.stats || this.stats.totalRequests === 0) return 0;
    return Math.round((this.stats.totalApproved / this.stats.totalRequests) * 100);
  }

  logout(): void {
    this.authService.logout();
  }
}
