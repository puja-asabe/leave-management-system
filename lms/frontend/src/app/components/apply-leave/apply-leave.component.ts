import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { LeaveType } from '../../models/leave.model';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './apply-leave.component.html'
})
export class ApplyLeaveComponent {
  startDate = '';
  endDate = '';
  leaveType: LeaveType = 'CASUAL';
  reason = '';
  loading = false;
  success = '';
  error = '';

  // ✅ NEW (for min date)
  today: string = new Date().toISOString().split('T')[0];

  // ✅ NEW (store days)
  numberOfDays: number = 0;

  leaveTypes: LeaveType[] = ['CASUAL', 'SICK', 'ANNUAL', 'MATERNITY', 'PATERNITY', 'EMERGENCY', 'UNPAID'];
  readonly dashboardRoute: string;
  readonly myLeavesRoute: string;

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private router: Router
  ) {
    this.dashboardRoute = this.authService.getDashboardRoute();
    this.myLeavesRoute = this.authService.getMyLeavesRoute();
  }

  // ✅ NEW FUNCTION (auto calculate days)
  calculateDays(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      this.numberOfDays = diffDays > 0 ? diffDays : 0;
    }
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.startDate || !this.endDate || !this.leaveType || !this.reason.trim()) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    // ✅ validation
    if (new Date(this.endDate) < new Date(this.startDate)) {
      this.error = 'End date cannot be before start date.';
      return;
    }

    this.loading = true;

    this.leaveService.applyLeave({
      startDate: this.startDate,
      endDate: this.endDate,
      leaveType: this.leaveType,
      reason: this.reason
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.success = 'Leave application submitted successfully!';
          this.resetForm();
          setTimeout(() => this.router.navigateByUrl(this.myLeavesRoute), 1500);
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to submit leave application.';
      }
    });
  }

  resetForm(): void {
    this.startDate = '';
    this.endDate = '';
    this.leaveType = 'CASUAL';
    this.reason = '';
    this.numberOfDays = 0;
  }
}
