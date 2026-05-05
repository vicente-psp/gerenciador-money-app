import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceGroupService } from '../../services/finance-group.service';
import { FinanceGroup } from '../../models/finance-group.model';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-finance-group-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    CardModule, 
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    SelectButtonModule,
    CheckboxModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Grupos Financeiros (Workspaces)</h1>
          <p class="page-subtitle">Gerencie seus grupos e áreas de trabalho compartilhadas ou pessoais.</p>
        </div>
        <div class="header-actions">
          <p-button label="Novo Grupo" icon="pi pi-plus" (onClick)="showDialog()" />
        </div>
      </header>

      <div class="grid-container">
        @for (group of financeGroupService.financeGroups(); track group.id) {
          <p-card styleClass="group-card shadow-sm" [class.active-group]="financeGroupService.activeFinanceGroup()?.id === group.id">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-3">
                <div class="group-icon">
                  <i class="pi pi-briefcase text-xl text-blue-500"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="group-name">{{ group.name }}</h3>
                    <p-tag [value]="group.type === 'PERSONAL' ? 'Pessoal' : 'Compartilhado'" 
                           [severity]="group.type === 'PERSONAL' ? 'info' : 'warn'" 
                           styleClass="text-[10px] px-2" [rounded]="true" />
                    @if (group.isDefault) {
                      <p-tag value="Padrão" severity="success" styleClass="text-[10px] px-2" [rounded]="true" icon="pi pi-star-fill" />
                    }
                  </div>
                  <p-tag [severity]="getRoleSeverity(group.role)" [value]="group.role" styleClass="text-xs" />
                </div>
              </div>
              <div class="flex gap-1">
                <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="secondary" (onClick)="editGroup(group)" />
                <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(group)" [disabled]="group.role !== 'OWNER'" />
              </div>
            </div>
            
            <p class="mt-4 text-gray-600 text-sm line-clamp-2 min-h-[3rem]">
              {{ group.description || 'Sem descrição definida para este grupo financeiro.' }}
            </p>

            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              @if (financeGroupService.activeFinanceGroup()?.id === group.id) {
                <span class="text-green-600 text-xs font-bold flex items-center gap-1">
                  <i class="pi pi-check-circle"></i> ATIVO AGORA
                </span>
              } @else {
                <p-button label="Selecionar" [text]="true" size="small" (onClick)="financeGroupService.setActiveFinanceGroup(group)" />
              }
            </div>
          </p-card>
        } @empty {
          <div class="col-span-full p-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
            <i class="pi pi-folder-open text-5xl text-gray-300 mb-3"></i>
            <h3 class="text-lg font-medium text-gray-900">Nenhum grupo financeiro encontrado</h3>
            <p class="text-gray-500 max-w-xs mx-auto mt-2">Crie seu primeiro grupo para começar a organizar suas finanças.</p>
            <p-button label="Criar Primeiro Grupo" icon="pi pi-plus" styleClass="mt-6" (onClick)="showDialog()" />
          </div>
        }
      </div>
    </div>

    <!-- Dialog de Finance Group -->
    <p-dialog [header]="editMode ? 'Editar Grupo' : 'Novo Grupo'" [(visible)]="displayDialog" [modal]="true" [style]="{width: '400px'}">
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-1">
          <label class="font-semibold text-sm">Tipo de Grupo</label>
          <p-selectButton [options]="groupTypeOptions" [(ngModel)]="group.type" optionLabel="label" optionValue="value" styleClass="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="name" class="font-semibold text-sm">Nome</label>
          <input id="name" type="text" pInputText [(ngModel)]="group.name" class="w-full" placeholder="Ex: Pessoal, Empresa..." />
        </div>

        <div class="flex flex-col gap-1">
          <label for="description" class="font-semibold text-sm">Descrição (Opcional)</label>
          <textarea id="description" pInputText [(ngModel)]="group.description" class="w-full" rows="3" placeholder="Para que serve este grupo financeiro?"></textarea>
        </div>

        <div class="flex items-center gap-2 mt-2">
          <p-checkbox [(ngModel)]="group.isDefault" [binary]="true" inputId="isDefault" />
          <label for="isDefault" class="font-semibold text-sm cursor-pointer">Definir como grupo padrão</label>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="displayDialog = false" />
        <p-button label="Salvar" icon="pi pi-check" (onClick)="saveGroup()" [loading]="saving()" />
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
    .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    
    .group-card {
      transition: all 0.2s;
      border: 2px solid transparent;
    }
    .active-group {
      border-color: #3b82f6 !important;
      background-color: #f0f7ff;
    }

    /* Melhora a visibilidade dos botões de ação */
    :host ::ng-deep {
      .group-card .p-button.p-button-secondary.p-button-text {
        color: #475569 !important; /* Slate 600 - Bem visível */
      }
      .group-card .p-button.p-button-danger.p-button-text {
        color: #dc2626 !important; /* Vermelho 600 - Bem visível */
      }
      .group-card .p-button.p-button-text:hover {
        background: rgba(0, 0, 0, 0.04) !important;
      }
    }

    .group-icon {
      width: 3rem;
      height: 3rem;
      background: #eff6ff;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .group-name { font-size: 1.125rem; font-weight: 600; color: #1e293b; margin: 0; }
    
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .justify-between { justify-content: space-between; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .gap-3 { gap: 0.75rem; }
    .gap-1 { gap: 0.25rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .min-h-\\[3rem\\] { min-height: 3rem; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;  
      overflow: hidden;
    }
    .w-full { width: 100%; }
    .pt-4 { padding-top: 1rem; }
    .border-t { border-top-width: 1px; }
  `
})
export class FinanceGroupListComponent implements OnInit {
  financeGroupService = inject(FinanceGroupService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  displayDialog = false;
  editMode = false;

  group: any = {
    name: '',
    description: '',
    type: 'PERSONAL',
    isDefault: false
  };

  groupTypeOptions = [
    { label: 'Pessoal', value: 'PERSONAL' },
    { label: 'Compartilhado', value: 'SHARED' }
  ];

  ngOnInit() {
    this.financeGroupService.loadFinanceGroups().subscribe();
  }

  showDialog() {
    this.editMode = false;
    this.group = {
      name: '',
      description: '',
      type: 'PERSONAL',
      isDefault: false
    };
    this.displayDialog = true;
  }

  editGroup(group: FinanceGroup) {
    this.editMode = true;
    this.group = { ...group };
    this.displayDialog = true;
  }

  saveGroup() {
    this.saving.set(true);
    if (this.editMode) {
      this.financeGroupService.update(this.group.id, this.group).subscribe({
        next: () => this.handleSuccess('Grupo atualizado'),
        error: (err) => this.handleError(err)
      });
    } else {
      this.financeGroupService.create(this.group).subscribe({
        next: () => this.handleSuccess('Grupo criado'),
        error: (err) => this.handleError(err)
      });
    }
  }

  confirmDelete(group: FinanceGroup) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o grupo "${group.name}"? Todos os dados vinculados (contas, categorias, transações) serão removidos.`,
      header: 'Confirmação Crítica',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir Definitivamente',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.financeGroupService.delete(group.id).subscribe({
          next: () => this.handleSuccess('Grupo excluído'),
          error: (err) => this.handleError(err)
        });
      }
    });
  }

  getRoleSeverity(role: string): any {
    switch (role) {
      case 'OWNER': return 'success';
      case 'EDITOR': return 'info';
      case 'VIEWER': return 'secondary';
      default: return 'secondary';
    }
  }

  private handleSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
    this.displayDialog = false;
    this.saving.set(false);
  }

  private handleError(err: any) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um problema ao salvar o grupo' });
    this.saving.set(false);
    console.error(err);
  }
}
