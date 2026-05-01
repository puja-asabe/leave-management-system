import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  contactNumber = '';

  role: 'EMPLOYEE' | 'MANAGER' | 'HR' = 'EMPLOYEE';
  department = '';
  loading = false;
  error = '';
  success = '';

  departments = ['Engineering', 'Marketing', 'Finance', 'HR', 'Sales', 'Operations', 'Design', 'Legal'];

  constructor(private authService: AuthService, private router: Router) {}

  onContactInput(event: any) {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 12);
    this.contactNumber = digitsOnly;
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword || !this.department || !this.contactNumber) {
      this.error = 'Please fill in all fields.';
      return;
    }

    const normalizedContactNumber = this.normalizeIndianContactNumber(this.contactNumber);
    if (!normalizedContactNumber) {
      this.error = 'Enter a valid Indian mobile number.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      contactNumber: normalizedContactNumber,
      role: this.role,
      department: this.department
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          const defaultRoute = this.authService.getDefaultRoute();

          if (defaultRoute) {
            this.router.navigateByUrl(defaultRoute);
          }
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Cannot reach backend. Start the backend and allow localhost frontend access.';
          return;
        }
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  private normalizeIndianContactNumber(value: string): string | null {
    let digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      digitsOnly = digitsOnly.slice(2);
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
      digitsOnly = digitsOnly.slice(1);
    }

    return /^[6-9]\d{9}$/.test(digitsOnly) ? digitsOnly : null;
  }
}
