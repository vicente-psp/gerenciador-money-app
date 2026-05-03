import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { FinanceService } from '../../services/finance.service';
import { Account } from '../../models/account.model';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    CardModule, 
    DialogModule,
    InputNumberModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Contas</h1>
          <p class="page-subtitle">Gerencie suas contas bancárias e carteiras.</p>
        </div>
        <div class="header-actions">
          <p-button label="Nova Conta" icon="pi pi-plus" (onClick)="showDialog()" />
        </div>
      </header>

      <div class="grid-container">
        @for (account of accounts(); track account.id) {
          <p-card styleClass="account-card shadow-sm" [style]="{'border-left': '6px solid ' + (account.color || '#3b82f6')}">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="account-name">{{ account.name }}</h3>
                <span class="account-type text-sm text-gray-500 uppercase">{{ account.type }}</span>
              </div>
              <div class="flex gap-1">
                <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="secondary" (onClick)="editAccount(account)" />
                <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(account)" />
              </div>
            </div>
            <div class="mt-4">
              <span class="text-2xl font-bold" [class.text-red-500]="account.balance < 0">
                {{ account.balance | currency:'BRL' }}
              </span>
              <p class="text-xs text-gray-400 mt-1">Saldo atual</p>
            </div>
          </p-card>
        } @empty {
          <div class="col-span-full p-8 text-center bg-white rounded-lg border border-dashed border-gray-300">
            <i class="pi pi-wallet text-4xl text-gray-300 mb-2"></i>
            <p class="text-gray-500">Nenhuma conta cadastrada.</p>
          </div>
        }
      </div>
    </div>

    <!-- Dialog de Conta -->
    <p-dialog [header]="editMode ? 'Editar Conta' : 'Nova Conta'" [(visible)]="displayDialog" [modal]="true" [style]="{width: '400px'}">
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-1">
          <label for="name" class="font-semibold text-sm">Nome da Conta</label>
          <input id="name" type="text" pInputText [(ngModel)]="account.name" class="w-full" placeholder="Ex: Nubank, Carteira..." />
        </div>

        <div class="flex flex-col gap-1">
          <label for="type" class="font-semibold text-sm">Tipo</label>
          <p-select id="type" [options]="typeOptions" [(ngModel)]="account.type" optionLabel="label" optionValue="value" placeholder="Selecione o tipo" styleClass="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="balance" class="font-semibold text-sm">Saldo Inicial</label>
          <p-inputNumber id="balance" [(ngModel)]="account.balance" mode="currency" currency="BRL" locale="pt-BR" styleClass="w-full" [disabled]="editMode" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="color" class="font-semibold text-sm">Cor Identificadora</label>
          <div class="flex gap-2 items-center">
            <input id="color" type="color" [(ngModel)]="account.color" class="h-10 w-20" />
            <span class="text-xs text-gray-500">{{ account.color }}</span>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="displayDialog = false" />
        <p-button label="Salvar" icon="pi pi-check" (onClick)="saveAccount()" [loading]="saving()" />
      </ng-template>
    </p-dialog>

    <p-confirmDialog />
    <p-toast />
  `,
  styles: `
    .page-container { padding: 2rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-title { font-size: 1.875rem; font-weight: 700; color: #0f172a; margin: 0; }
    .page-subtitle { color: #64748b; margin: 0.25rem 0 0 0; }
    .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .account-name { font-size: 1.25rem; font-weight: 600; color: #1e293b; margin: 0; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }
    .justify-between { justify-content: space-between; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .gap-4 { gap: 1rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-1 { gap: 0.25rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-1 { margin-top: 0.25rem; }
    .w-full { width: 100%; }
    .text-2xl { font-size: 1.5rem; }
    .font-bold { font-weight: 700; }
  `
})
export class AccountListComponent implements OnInit {
  private accountService = inject(AccountService);
  private finance = inject(FinanceService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  accounts = signal<Account[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  displayDialog = false;
  editMode = false;

  account: any = {
    name: '',
    type: 'CHECKING',
    balance: 0,
    color: '#3b82f6'
  };

  typeOptions = [
    { label: 'Conta Corrente', value: 'CHECKING' },
    { label: 'Poupança', value: 'SAVINGS' },
    { label: 'Investimento', value: 'INVESTMENT' },
    { label: 'Dinheiro', value: 'CASH' }
  ];

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading.set(true);
    this.accountService.getAll().subscribe({
      next: (data) => this.accounts.set(data),
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar contas' });
        console.error(err);
      },
      complete: () => this.loading.set(false)
    });
  }

  showDialog() {
    this.editMode = false;
    this.account = {
      name: '',
      type: 'CHECKING',
      balance: 0,
      color: '#3b82f6'
    };
    this.displayDialog = true;
  }

  editAccount(acc: Account) {
    this.editMode = true;
    this.account = { ...acc };
    this.displayDialog = true;
  }

  saveAccount() {
    this.saving.set(true);
    if (this.editMode) {
      this.accountService.update(this.account.id, this.account).subscribe({
        next: () => this.handleSuccess('Conta atualizada'),
        error: (err) => this.handleError(err)
      });
    } else {
      this.accountService.create(this.account).subscribe({
        next: () => this.handleSuccess('Conta criada'),
        error: (err) => this.handleError(err)
      });
    }
  }

  confirmDelete(acc: Account) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a conta "${acc.name}"? Isso pode afetar transações vinculadas.`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.accountService.delete(acc.id).subscribe({
          next: () => this.handleSuccess('Conta excluída'),
          error: (err) => this.handleError(err)
        });
      }
    });
  }

  private handleSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
    this.displayDialog = false;
    this.saving.set(false);
    this.loadAccounts();
    this.finance.refreshData();
  }

  private handleError(err: any) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um problema' });
    this.saving.set(false);
    console.error(err);
  }
}
