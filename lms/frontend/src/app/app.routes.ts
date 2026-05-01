import { Routes } from '@angular/router';
import { authGuard, employeeGuard, managerGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'employee',
    canActivate: [employeeGuard],
    loadComponent: () => import('./components/sidebar-shell/sidebar-shell.component').then(m => m.SidebarShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent)
      },
      {
        path: 'apply-leave',
        loadComponent: () => import('./components/apply-leave/apply-leave.component').then(m => m.ApplyLeaveComponent)
      },
      {
        path: 'my-leaves',
        loadComponent: () => import('./components/my-leaves/my-leaves.component').then(m => m.MyLeavesComponent)
      },
      {
        path: 'leave-balance',
        loadComponent: () => import('./components/leave-balance/leave-balance.component').then(m => m.LeaveBalanceComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'manager',
    canActivate: [managerGuard],
    loadComponent: () => import('./components/sidebar-shell/sidebar-shell.component').then(m => m.SidebarShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
      },
      {
        path: 'team-leaves',
        loadComponent: () => import('./components/team-leaves/team-leaves.component').then(m => m.TeamLeavesComponent)
      },
      {
        path: 'apply-leave',
        loadComponent: () => import('./components/apply-leave/apply-leave.component').then(m => m.ApplyLeaveComponent)
      },
      {
        path: 'my-leaves',
        loadComponent: () => import('./components/my-leaves/my-leaves.component').then(m => m.MyLeavesComponent)
      },
      {
        path: 'leave-balance',
        loadComponent: () => import('./components/leave-balance/leave-balance.component').then(m => m.LeaveBalanceComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
