import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type NavItem = {
  label: string;
  route: string;
  exact?: boolean;
};

@Component({
  selector: 'app-sidebar-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-slate-100 md:flex">
      <aside class="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:bg-slate-900 md:text-white md:border-r md:border-slate-800">
        <div class="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-900 font-bold text-lg">
            {{ userInitials }}
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Leave MS</p>
            <p class="text-lg font-semibold">{{ roleTitle }}</p>
          </div>
        </div>

        <div class="px-6 py-5 border-b border-slate-800">
          <p class="text-sm font-semibold">{{ user?.name }}</p>
          <p class="text-xs text-slate-400 mt-1">{{ user?.department }} · {{ user?.role }}</p>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="bg-slate-800 text-white shadow-lg shadow-slate-950/20"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
            class="flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            {{ item.label }}
          </a>
        </nav>

        <div class="p-4 border-t border-slate-800">
          <button
            (click)="logout()"
            class="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
          >
            Logout
          </button>
        </div>
      </aside>

      <div class="flex-1 md:ml-72">
        <header class="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:hidden">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Leave MS</p>
            <p class="text-sm font-semibold text-slate-900">{{ roleTitle }}</p>
          </div>
          <button
            (click)="menuOpen = !menuOpen"
            class="rounded-xl border border-slate-200 p-2 text-slate-700"
            aria-label="Toggle sidebar"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </header>

        <div *ngIf="menuOpen" class="fixed inset-0 z-40 bg-slate-950/50 md:hidden" (click)="menuOpen = false"></div>
        <aside
          class="fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-900 text-white transition duration-200 md:hidden"
          [class.-translate-x-full]="!menuOpen"
          [class.translate-x-0]="menuOpen"
        >
          <div class="flex items-center justify-between border-b border-slate-800 px-5 py-5">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Leave MS</p>
              <p class="text-base font-semibold">{{ user?.name }}</p>
            </div>
            <button (click)="menuOpen = false" class="rounded-xl border border-slate-700 p-2 text-slate-300">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <nav class="px-4 py-6 space-y-2">
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.route"
              routerLinkActive="bg-slate-800 text-white"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              (click)="menuOpen = false"
              class="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {{ item.label }}
            </a>
          </nav>

          <div class="px-4 pb-4 pt-2">
            <button
              (click)="logout(); menuOpen = false"
              class="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Logout
            </button>
          </div>
        </aside>

        <main class="px-0 md:px-0">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class SidebarShellComponent {
  private readonly employeeNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/employee/dashboard', exact: true },
    { label: 'Apply Leave', route: '/employee/apply-leave' },
    { label: 'My Leaves', route: '/employee/my-leaves' },
    { label: 'Leave Balance', route: '/employee/leave-balance' }
  ];

  private readonly managerNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/manager/dashboard', exact: true },
    { label: 'Apply Leave', route: '/manager/apply-leave' },
    { label: 'My Leaves', route: '/manager/my-leaves' },
    { label: 'Leave Balance', route: '/manager/leave-balance' },
    { label: 'Team Leaves', route: '/manager/team-leaves' }
  ];

  menuOpen = false;
  readonly user = this.authService.getUser();
  readonly isManager = this.authService.isManager();
  readonly navItems = this.isManager ? this.managerNavItems : this.employeeNavItems;
  readonly roleTitle = this.authService.isHr() ? 'HR Panel' : this.isManager ? 'Manager Panel' : 'Employee Panel';
  readonly userInitials = this.getUserInitials();

  constructor(private authService: AuthService) {}

  private getUserInitials(): string {
    const name = this.user?.name?.trim();
    if (!name) {
      return 'LM';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  logout(): void {
    this.authService.logout();
  }
}
