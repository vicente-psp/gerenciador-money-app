import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakAuthService } from '../services/auth/keycloak-auth';
import { WorkspaceService } from '../services/workspace.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    ButtonModule, 
    TooltipModule, 
    SelectModule, 
    FormsModule,
    DividerModule
  ],
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

        <!-- Seletor de Workspace -->
        <div class="workspace-selector px-4 py-3">
          <label class="text-xs font-bold text-gray-400 uppercase mb-2 block nav-text">Workspace</label>
          <p-select 
            [options]="workspaceService.workspaces()" 
            [ngModel]="workspaceService.activeWorkspace()"
            (ngModelChange)="workspaceService.setActiveWorkspace($event)"
            optionLabel="name" 
            placeholder="Selecione"
            styleClass="w-full workspace-dropdown"
          >
            <ng-template pTemplate="selectedItem" let-selectedOption>
              <div class="flex items-center gap-2">
                <i class="pi pi-briefcase text-blue-500"></i>
                <span class="nav-text truncate">{{ selectedOption?.name }}</span>
              </div>
            </ng-template>
            <ng-template pTemplate="item" let-item>
              <div class="flex items-center gap-2">
                <i class="pi pi-briefcase"></i>
                <span>{{ item.name }}</span>
              </div>
            </ng-template>
          </p-select>
        </div>

        <p-divider styleClass="my-0 mx-4" />

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
            <div class="user-profile mb-3 px-2 nav-text">
              <span class="block text-sm font-semibold text-gray-700 truncate">Usuário Logado</span>
              <span class="block text-xs text-gray-400">Plano Pro</span>
            </div>
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

    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .my-0 { margin-top: 0; margin-bottom: 0; }
    .mx-4 { margin-left: 1rem; margin-right: 1rem; }
    .block { display: block; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    :host ::ng-deep {
      .workspace-dropdown {
        border: 1px solid #e2e8f0 !important;
        background: #f8fafc !important;
        box-shadow: none !important;
      }
      .workspace-dropdown:hover {
        border-color: #cbd5e1 !important;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }
      .nav-text, .logo-text, .workspace-selector label {
        display: none;
      }
      .sidebar-header, .sidebar-nav, .sidebar-footer {
        align-items: center;
      }
      .nav-item {
        justify-content: center;
        padding: 0.75rem;
      }
      .workspace-selector {
        padding: 0.75rem;
      }
    }
  `
})
export class LayoutComponent {
  auth = inject(KeycloakAuthService);
  workspaceService = inject(WorkspaceService);
}
