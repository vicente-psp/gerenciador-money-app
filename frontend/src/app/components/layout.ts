import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakAuthService } from '../services/auth/keycloak-auth';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, TooltipModule],
  template: `
    <div class="layout-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <i class="pi pi-wallet text-3xl text-blue-500"></i>
            <span class="logo-text">MoneyApp</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item" pTooltip="Dashboard" tooltipPosition="right">
            <i class="pi pi-home"></i>
            <span class="nav-text">Dashboard</span>
          </a>
          <a routerLink="/transactions" routerLinkActive="active" class="nav-item" pTooltip="Transações" tooltipPosition="right">
            <i class="pi pi-list"></i>
            <span class="nav-text">Transações</span>
          </a>
          <a routerLink="/accounts" routerLinkActive="active" class="nav-item" pTooltip="Contas" tooltipPosition="right">
            <i class="pi pi-credit-card"></i>
            <span class="nav-text">Contas</span>
          </a>
          <a routerLink="/categories" routerLinkActive="active" class="nav-item" pTooltip="Categorias" tooltipPosition="right">
            <i class="pi pi-tags"></i>
            <span class="nav-text">Categorias</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          @if (auth.isLoggedIn) {
            <button class="nav-item logout-btn" (click)="auth.logout()" pTooltip="Sair" tooltipPosition="right">
              <i class="pi pi-sign-out"></i>
              <span class="nav-text">Sair</span>
            </button>
          } @else {
            <button class="nav-item login-btn" (click)="auth.login()" pTooltip="Entrar" tooltipPosition="right">
              <i class="pi pi-sign-in"></i>
              <span class="nav-text">Entrar</span>
            </button>
          }
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: #f8fafc;
    }

    .sidebar {
      width: 260px;
      background-color: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      transition: width 0.3s;
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 100;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.025em;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .nav-item i {
      font-size: 1.25rem;
    }

    .nav-item:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }

    .nav-item.active {
      background-color: #eff6ff;
      color: #2563eb;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #f1f5f9;
    }

    .logout-btn:hover {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .main-content {
      flex: 1;
      padding: 0;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }
      .nav-text, .logo-text {
        display: none;
      }
      .sidebar-header, .sidebar-nav, .sidebar-footer {
        align-items: center;
      }
      .nav-item {
        justify-content: center;
        padding: 0.75rem;
      }
    }
  `
})
export class LayoutComponent {
  auth = inject(KeycloakAuthService);
}
