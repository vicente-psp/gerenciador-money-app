import { Component, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { KeycloakAuthService } from '../../services/auth/keycloak-auth';
import { FinanceService } from '../../services/finance.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

registerLocaleData(localePt);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    TableModule, 
    TagModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Dashboard Financeiro</h1>
          <p class="dashboard-subtitle">Bem-vindo de volta ao seu controle de gastos.</p>
        </div>
        <div class="header-actions">
          <p-button icon="pi pi-refresh" [rounded]="true" [text]="true" (onClick)="finance.refreshData()" [loading]="finance.loading()" />
          @if (auth.isLoggedIn) {
            <div class="user-info">
              <span class="user-name">Usuário Autenticado</span>
              <span class="user-workspace">Workspace Padrão</span>
            </div>
            <p-button label="Sair" icon="pi pi-sign-out" severity="danger" [outlined]="true" (onClick)="auth.logout()" />
          } @else {
            <p-button label="Entrar" icon="pi pi-sign-in" severity="primary" (onClick)="auth.login()" />
          }
        </div>
      </header>

      @if (finance.error()) {
        <div class="error-container">
          <p-message severity="error" [text]="finance.error()!" styleClass="w-full" />
        </div>
      }

      <!-- Resumo de Cards -->
      <div class="summary-cards">
        <p-card header="Saldo Total" styleClass="card-balance shadow-sm">
          <p class="amount-text balance-color">
            {{ finance.totalBalance() | currency:'BRL' }}
          </p>
          <p class="amount-subtitle">Soma de todas as suas contas</p>
        </p-card>

        <p-card header="Receitas (Mês)" styleClass="card-income shadow-sm">
          <p class="amount-text income-color">
            {{ finance.monthlyIncome() | currency:'BRL' }}
          </p>
          <div class="amount-trend income-color">
            <i class="pi pi-arrow-up"></i>
            <span>Entradas registradas</span>
          </div>
        </p-card>

        <p-card header="Despesas (Mês)" styleClass="card-expense shadow-sm">
          <p class="amount-text expense-color">
            {{ finance.monthlyExpense() | currency:'BRL' }}
          </p>
          <div class="amount-trend expense-color">
            <i class="pi pi-arrow-down"></i>
            <span>Saídas registradas</span>
          </div>
        </p-card>
      </div>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Últimas Transações -->
        <div class="transactions-container">
          <p-card header="Últimas Transações" styleClass="shadow-sm">
            <p-table [value]="finance.transactions()" [rows]="5" responsiveLayout="scroll" [loading]="finance.loading()">
              <ng-template pTemplate="header">
                <tr>
                  <th>Descrição</th>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th class="text-right">Valor</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-transaction>
                <tr>
                  <td class="font-medium">{{ transaction.description }}</td>
                  <td>{{ transaction.date | date:'shortDate':'':'pt-BR' }}</td>
                  <td>
                    <p-tag [severity]="transaction.type === 'INCOME' ? 'success' : 'danger'" 
                           [value]="transaction.type === 'INCOME' ? 'Receita' : 'Despesa'" 
                           [rounded]="true" />
                  </td>
                  <td class="text-right font-bold">
                    <span [style.color]="transaction.type === 'INCOME' ? '#16a34a' : '#dc2626'">
                      {{ transaction.amount | currency:'BRL' }}
                    </span>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="4" class="empty-text">Nenhuma transação encontrada.</td>
                </tr>
              </ng-template>
            </p-table>
            <div class="table-footer">
              <p-button label="Ver Todas" [text]="true" size="small" icon="pi pi-chevron-right" iconPos="right" />
            </div>
          </p-card>
        </div>

        <!-- Contas -->
        <div class="accounts-container">
          <p-card header="Minhas Contas" styleClass="shadow-sm">
            <div class="accounts-list">
              @if (finance.loading() && finance.accounts().length === 0) {
                <div class="loading-spinner">
                  <p-progressSpinner styleClass="w-8 h-8" strokeWidth="4" />
                </div>
              }
              @for (account of finance.accounts(); track account.id) {
                <div class="account-item">
                  <div class="account-info">
                    <div class="account-indicator" [style.backgroundColor]="account.color"></div>
                    <div>
                      <p class="account-name">{{ account.name }}</p>
                      <p class="account-type">{{ account.type }}</p>
                    </div>
                  </div>
                  <p class="account-balance">{{ account.balance | currency:'BRL' }}</p>
                </div>
              } @empty {
                @if (!finance.loading()) {
                  <p class="empty-text">Nenhuma conta cadastrada.</p>
                }
              }
            </div>
            <div class="account-actions">
              <p-button label="Nova Conta" icon="pi pi-plus" styleClass="w-full" severity="secondary" [outlined]="true" />
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dashboard-container {
      background-color: #f8fafc;
      min-height: 100vh;
      padding: 2rem;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }
    .dashboard-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .dashboard-subtitle {
      color: #64748b;
      margin: 0.25rem 0 0 0;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      text-align: right;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
    }
    .user-workspace {
      font-size: 0.75rem;
      color: #64748b;
    }
    .error-container {
      margin-bottom: 1.5rem;
    }
    .summary-cards {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .amount-text {
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0;
    }
    .amount-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.5rem;
    }
    .amount-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }
    .amount-trend i {
      font-size: 0.75rem;
    }
    .balance-color { color: #0f172a; }
    .income-color { color: #16a34a; }
    .expense-color { color: #dc2626; }

    .card-balance { flex: 1; min-width: 250px; border-top: 4px solid #3b82f6; }
    .card-income { flex: 1; min-width: 250px; border-top: 4px solid #22c55e; }
    .card-expense { flex: 1; min-width: 250px; border-top: 4px solid #ef4444; }

    .main-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .transactions-container {
      grid-column: span 2;
    }
    .text-right { text-align: right; }
    .font-medium { font-weight: 500; }
    .font-bold { font-weight: 700; }
    .empty-text {
      text-align: center;
      padding: 1rem;
      color: #64748b;
    }
    .table-footer {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
    }
    .accounts-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .account-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      transition: background-color 0.2s;
    }
    .account-item:hover {
      background-color: #f8fafc;
    }
    .account-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .account-indicator {
      width: 0.5rem;
      height: 2rem;
      border-radius: 1rem;
    }
    .account-name {
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    .account-type {
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      margin: 0;
    }
    .account-balance {
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .account-actions {
      margin-top: 1.5rem;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }

    :host ::ng-deep {
      .p-card {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .p-card-header {
        font-size: 1.1rem;
        font-weight: 600;
        color: #334155;
      }
      .p-card-content {
        padding-top: 0;
        flex-grow: 1;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container { padding: 1rem; }
      .dashboard-header { flex-direction: column; align-items: flex-start; }
      .transactions-container { grid-column: span 1; }
    }
  `
})
export class HomeComponent {
  auth = inject(KeycloakAuthService);
  finance = inject(FinanceService);
}
