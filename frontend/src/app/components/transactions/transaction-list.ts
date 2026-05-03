import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { FinanceService } from '../../services/finance.service';
import { Transaction } from '../../models/transaction.model';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    ButtonModule, 
    TagModule, 
    InputTextModule, 
    CardModule, 
    DialogModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    SelectButtonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Transações</h1>
          <p class="page-subtitle">Gerencie suas entradas e saídas.</p>
        </div>
        <div class="header-actions">
          <p-button label="Nova Transação" icon="pi pi-plus" (onClick)="showDialog()" />
        </div>
      </header>

      <p-card styleClass="shadow-sm">
        <p-table 
          [value]="transactions()" 
          [rows]="10" 
          [paginator]="true" 
          [loading]="loading()"
          [globalFilterFields]="['description']"
          responsiveLayout="scroll"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="date">Data <p-sortIcon field="date" /></th>
              <th pSortableColumn="description">Descrição <p-sortIcon field="description" /></th>
              <th pSortableColumn="category.name">Categoria <p-sortIcon field="category.name" /></th>
              <th pSortableColumn="account.name">Conta <p-sortIcon field="account.name" /></th>
              <th pSortableColumn="type">Tipo <p-sortIcon field="type" /></th>
              <th pSortableColumn="amount" class="text-right">Valor <p-sortIcon field="amount" /></th>
              <th class="text-center">Ações</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-transaction>
            <tr>
              <td>{{ transaction.date | date:'dd/MM/yyyy' }}</td>
              <td class="font-medium">{{ transaction.description }}</td>
              <td>
                <span class="flex items-center gap-2">
                  <i [class]="transaction.category?.icon || 'pi pi-tag'"></i>
                  {{ transaction.category?.name || 'Sem Categoria' }}
                </span>
              </td>
              <td>{{ transaction.account?.name || 'Sem Conta' }}</td>
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
              <td class="text-center">
                <div class="flex justify-center gap-2">
                  <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="secondary" (onClick)="editTransaction(transaction)" />
                  <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(transaction)" />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center p-8 text-gray-500">
                Nenhuma transação encontrada.
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <!-- Dialog de Transação -->
    <p-dialog [header]="editMode ? 'Editar Transação' : 'Nova Transação'" [(visible)]="displayDialog" [modal]="true" [style]="{width: '450px'}">
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <p-selectButton [options]="typeOptions" [(ngModel)]="transaction.type" optionLabel="label" optionValue="value" styleClass="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="description" class="font-semibold text-sm">Descrição</label>
          <input id="description" type="text" pInputText [(ngModel)]="transaction.description" class="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="amount" class="font-semibold text-sm">Valor</label>
          <p-inputNumber id="amount" [(ngModel)]="transaction.amount" mode="currency" currency="BRL" locale="pt-BR" styleClass="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="date" class="font-semibold text-sm">Data</label>
          <p-datepicker id="date" [(ngModel)]="transaction.date" dateFormat="dd/mm/yy" [showIcon]="true" styleClass="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="account" class="font-semibold text-sm">Conta</label>
          <p-select id="account" [options]="finance.accounts()" [(ngModel)]="transaction.accountId" optionLabel="name" optionValue="id" placeholder="Selecione a conta" styleClass="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="category" class="font-semibold text-sm">Categoria</label>
          <p-select id="category" [options]="finance.categories()" [(ngModel)]="transaction.categoryId" optionLabel="name" optionValue="id" placeholder="Selecione a categoria" styleClass="w-full" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="displayDialog = false" />
        <p-button label="Salvar" icon="pi pi-check" (onClick)="saveTransaction()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <p-confirmDialog />
    <p-toast />
  `,
  styles: `
    .page-container {
      padding: 2rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .page-subtitle {
      color: #64748b;
      margin: 0.25rem 0 0 0;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .font-medium { font-weight: 500; }
    .font-bold { font-weight: 700; }
    .w-full { width: 100%; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .gap-4 { gap: 1rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-1 { gap: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
  `
})
export class TransactionListComponent implements OnInit {
  private transactionService = inject(TransactionService);
  finance = inject(FinanceService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  transactions = signal<Transaction[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  displayDialog = false;
  editMode = false;

  transaction: any = {
    type: 'EXPENSE',
    description: '',
    amount: 0,
    date: new Date(),
    accountId: null,
    categoryId: null
  };

  typeOptions = [
    { label: 'Receita', value: 'INCOME' },
    { label: 'Despesa', value: 'EXPENSE' }
  ];

  ngOnInit() {
    this.loadTransactions();
  }

  async loadTransactions() {
    this.loading.set(true);
    try {
      this.transactionService.getAll().subscribe({
        next: (data) => this.transactions.set(data),
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar transações' });
          console.error(err);
        },
        complete: () => this.loading.set(false)
      });
    } catch (err) {
      this.loading.set(false);
    }
  }

  showDialog() {
    this.editMode = false;
    this.transaction = {
      type: 'EXPENSE',
      description: '',
      amount: 0,
      date: new Date(),
      accountId: this.finance.accounts()[0]?.id,
      categoryId: null
    };
    this.displayDialog = true;
  }

  editTransaction(t: Transaction) {
    this.editMode = true;
    this.transaction = { 
      ...t, 
      date: new Date(t.date)
    };
    this.displayDialog = true;
  }

  async saveTransaction() {
    this.saving.set(true);
    try {
      const data = {
        ...this.transaction,
        date: this.transaction.date.toISOString()
      };

      if (this.editMode) {
        this.transactionService.update(this.transaction.id, data).subscribe({
          next: () => this.handleSuccess('Transação atualizada'),
          error: (err) => this.handleError(err)
        });
      } else {
        this.transactionService.create(data).subscribe({
          next: () => this.handleSuccess('Transação criada'),
          error: (err) => this.handleError(err)
        });
      }
    } catch (err) {
      this.saving.set(false);
    }
  }

  confirmDelete(t: Transaction) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a transação "${t.description}"?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.transactionService.delete(t.id).subscribe({
          next: () => this.handleSuccess('Transação excluída'),
          error: (err) => this.handleError(err)
        });
      }
    });
  }

  private handleSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
    this.displayDialog = false;
    this.saving.set(false);
    this.loadTransactions();
    this.finance.refreshData(); // Atualiza dashboard
  }

  private handleError(err: any) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um problema' });
    this.saving.set(false);
    console.error(err);
  }
}
