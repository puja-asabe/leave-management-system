import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { LeaveResponse, LeaveStatus } from '../../models/leave.model';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-leaves.component.html'
})
export class MyLeavesComponent implements OnInit {
  leaves: LeaveResponse[] = [];
  filteredLeaves: LeaveResponse[] = [];
  loading = true;
  error = '';
  selectedFilter: 'ALL' | LeaveStatus = 'ALL';
  readonly applyLeaveRoute: string;

  constructor(private leaveService: LeaveService, private authService: AuthService) {
    this.applyLeaveRoute = this.authService.getApplyLeaveRoute();
  }

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading = true;
    this.leaveService.getMyLeaves().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.leaves = res.data;
          this.applyFilter();
        } else {
          this.error = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load leave requests.';
      }
    });
  }

  setFilter(filter: 'ALL' | LeaveStatus): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.selectedFilter === 'ALL') {
      this.filteredLeaves = this.leaves;
    } else {
      this.filteredLeaves = this.leaves.filter(l => l.status === this.selectedFilter);
    }
  }

  countByStatus(status: LeaveStatus): number {
    return this.leaves.filter(l => l.status === status).length;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}
