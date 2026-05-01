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

registerLocaleData(localePt);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    TableModule, 
    TagModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 md:p-8">
      <!-- Header -->
      <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Dashboard Financeiro</h1>
          <p class="text-slate-500">Bem-vindo de volta ao seu controle de gastos.</p>
        </div>
        <div class="flex items-center gap-3">
          @if (auth.isLoggedIn) {
            <div class="flex flex-col text-right hidden md:block">
              <span class="text-sm font-semibold text-slate-700">Usuário Autenticado</span>
              <span class="text-xs text-slate-500">Workspace Padrão</span>
            </div>
            <p-button label="Sair" icon="pi pi-sign-out" severity="danger" [outlined]="true" (onClick)="auth.logout()" />
          } @else {
            <p-button label="Entrar" icon="pi pi-sign-in" severity="primary" (onClick)="auth.login()" />
          }
        </div>
      </header>

      <!-- Resumo de Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <p-card header="Saldo Total" styleClass="border-t-4 border-blue-500 shadow-sm">
          <p class="text-3xl font-bold text-slate-900">
            {{ finance.totalBalance() | currency:'BRL' }}
          </p>
          <p class="text-sm text-slate-500 mt-2">Soma de todas as suas contas</p>
        </p-card>

        <p-card header="Receitas (Mês)" styleClass="border-t-4 border-green-500 shadow-sm">
          <p class="text-3xl font-bold text-green-600">
            {{ finance.monthlyIncome() | currency:'BRL' }}
          </p>
          <div class="flex items-center gap-1 mt-2 text-green-600">
            <i class="pi pi-arrow-up text-xs"></i>
            <span class="text-sm">Entradas registradas</span>
          </div>
        </p-card>

        <p-card header="Despesas (Mês)" styleClass="border-t-4 border-red-500 shadow-sm">
          <p class="text-3xl font-bold text-red-600">
            {{ finance.monthlyExpense() | currency:'BRL' }}
          </p>
          <div class="flex items-center gap-1 mt-2 text-red-600">
            <i class="pi pi-arrow-down text-xs"></i>
            <span class="text-sm">Saídas registradas</span>
          </div>
        </p-card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Últimas Transações -->
        <div class="xl:col-span-2">
          <p-card header="Últimas Transações" styleClass="shadow-sm">
            <p-table [value]="finance.transactions()" [rows]="5" responsiveLayout="scroll">
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
                  <td class="text-right font-bold" [ngClass]="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
                    {{ transaction.amount | currency:'BRL' }}
                  </td>
                </tr>
              </ng-template>
            </p-table>
            <div class="mt-4 flex justify-end">
              <p-button label="Ver Todas" variant="text" size="small" icon="pi pi-chevron-right" iconPos="right" />
            </div>
          </p-card>
        </div>

        <!-- Contas -->
        <div>
          <p-card header="Minhas Contas" styleClass="shadow-sm">
            <div class="flex flex-col gap-4">
              @for (account of finance.accounts(); track account.id) {
                <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-8 rounded-full" [style.background-color]="account.color"></div>
                    <div>
                      <p class="font-semibold text-slate-800">{{ account.name }}</p>
                      <p class="text-xs text-slate-500 uppercase">{{ account.type }}</p>
                    </div>
                  </div>
                  <p class="font-bold text-slate-900">{{ account.balance | currency:'BRL' }}</p>
                </div>
              }
            </div>
            <div class="mt-6">
              <p-button label="Nova Conta" icon="pi pi-plus" styleClass="w-full" severity="secondary" [outlined]="true" />
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host ::ng-deep {
      .p-card-header {
        font-size: 1.1rem;
        font-weight: 600;
        color: #334155;
      }
      .p-card-content {
        padding-top: 0;
      }
    }
  `
})
export class HomeComponent {
  auth = inject(KeycloakAuthService);
  finance = inject(FinanceService);
}
