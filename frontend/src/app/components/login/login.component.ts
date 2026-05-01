import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    const defaultRoute = this.authService.getDefaultRoute();
    if (defaultRoute) {
      this.router.navigateByUrl(defaultRoute);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.redirectUser();
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }

  private redirectUser(): void {
    const defaultRoute = this.authService.getDefaultRoute();

    if (defaultRoute) {
      this.router.navigateByUrl(defaultRoute);
    }
  }
}
