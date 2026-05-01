import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { LeaveResponse, LeaveStatus } from '../../models/leave.model';

@Component({
  selector: 'app-team-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-leaves.component.html'
})
export class TeamLeavesComponent implements OnInit {
  leaves: LeaveResponse[] = [];
  filteredLeaves: LeaveResponse[] = [];
  loading = true;
  actionLoading: number | null = null;
  error = '';
  successMsg = '';
  selectedFilter: 'ALL' | LeaveStatus = 'ALL';
  searchQuery = '';

  showRejectModal = false;
  rejectingId: number | null = null;
  rejectionReason = '';

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading = true;
    this.leaveService.getTeamLeaves().subscribe({
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
        this.error = 'Failed to load team leave requests.';
      }
    });
  }

  setFilter(filter: 'ALL' | LeaveStatus): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  onSearch(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    let result = this.leaves;
    if (this.selectedFilter !== 'ALL') {
      result = result.filter(l => l.status === this.selectedFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(l =>
        l.employeeName.toLowerCase().includes(q) ||
        l.department.toLowerCase().includes(q) ||
        l.leaveType.toLowerCase().includes(q)
      );
    }
    this.filteredLeaves = result;
  }

  approve(id: number): void {
    if (this.actionLoading) return;
    this.actionLoading = id;
    this.successMsg = '';
    this.error = '';
    this.leaveService.approveLeave(id).subscribe({
      next: (res) => {
        this.actionLoading = null;
        if (res.success) {
          this.successMsg = `Leave request #${id} approved successfully.`;
          this.loadLeaves();
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.actionLoading = null;
        this.error = err.error?.message || 'Failed to approve leave.';
      }
    });
  }

  openRejectModal(id: number): void {
    this.rejectingId = id;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectingId = null;
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (!this.rejectingId) return;
    const id = this.rejectingId;
    this.actionLoading = id;
    this.successMsg = '';
    this.error = '';
    this.closeRejectModal();

    this.leaveService.rejectLeave(id, this.rejectionReason || undefined).subscribe({
      next: (res) => {
        this.actionLoading = null;
        if (res.success) {
          this.successMsg = `Leave request #${id} rejected.`;
          this.loadLeaves();
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.actionLoading = null;
        this.error = err.error?.message || 'Failed to reject leave.';
      }
    });
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
