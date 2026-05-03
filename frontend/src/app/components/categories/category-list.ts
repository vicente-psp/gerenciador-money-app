import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { FinanceService } from '../../services/finance.service';
import { Category } from '../../models/category.model';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-category-list',
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
    SelectButtonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Categorias</h1>
          <p class="page-subtitle">Organize suas transações por categorias.</p>
        </div>
        <div class="header-actions">
          <p-button label="Nova Categoria" icon="pi pi-plus" (onClick)="showDialog()" />
        </div>
      </header>

      <p-card styleClass="shadow-sm">
        <p-table [value]="categories()" [loading]="loading()" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Ícone</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th class="text-center">Ações</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-category>
            <tr>
              <td>
                <div class="category-icon-circle" [style.backgroundColor]="category.color || '#e2e8f0'">
                  <i [class]="category.icon || 'pi pi-tag'"></i>
                </div>
              </td>
              <td class="font-medium">{{ category.name }}</td>
              <td>
                <p-tag [severity]="category.type === 'INCOME' ? 'success' : 'danger'" 
                       [value]="category.type === 'INCOME' ? 'Receita' : 'Despesa'" 
                       [rounded]="true" />
              </td>
              <td class="text-center">
                <div class="flex justify-center gap-2">
                  <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="secondary" (onClick)="editCategory(category)" />
                  <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(category)" />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="text-center p-8 text-gray-500">
                Nenhuma categoria encontrada.
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <!-- Dialog de Categoria -->
    <p-dialog [header]="editMode ? 'Editar Categoria' : 'Nova Categoria'" [(visible)]="displayDialog" [modal]="true" [style]="{width: '400px'}">
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <p-selectButton [options]="typeOptions" [(ngModel)]="category.type" optionLabel="label" optionValue="value" styleClass="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="name" class="font-semibold text-sm">Nome</label>
          <input id="name" type="text" pInputText [(ngModel)]="category.name" class="w-full" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="icon" class="font-semibold text-sm">Ícone (PrimeIcons)</label>
          <div class="flex gap-2">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search"></i>
              <input id="icon" type="text" pInputText [(ngModel)]="category.icon" class="w-full" placeholder="pi pi-tag" />
            </span>
            <div class="icon-preview">
              <i [class]="category.icon || 'pi pi-tag'"></i>
            </div>
          </div>
          <small class="text-gray-400">Ex: pi-home, pi-shopping-cart, pi-car</small>
        </div>

        <div class="flex flex-col gap-1">
          <label for="color" class="font-semibold text-sm">Cor</label>
          <div class="flex gap-2 items-center">
            <input id="color" type="color" [(ngModel)]="category.color" class="h-10 w-20" />
            <span class="text-xs text-gray-500">{{ category.color }}</span>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="displayDialog = false" />
        <p-button label="Salvar" icon="pi pi-check" (onClick)="saveCategory()" [loading]="saving()" />
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
    .category-icon-circle {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .icon-preview {
      width: 2.5rem;
      height: 2.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
    }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .justify-center { justify-content: center; }
    .gap-4 { gap: 1rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-1 { gap: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .w-full { width: 100%; }
    .font-medium { font-weight: 500; }
    .text-center { text-align: center; }
  `
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private finance = inject(FinanceService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  categories = signal<Category[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  displayDialog = false;
  editMode = false;

  category: any = {
    name: '',
    type: 'EXPENSE',
    icon: 'pi pi-tag',
    color: '#64748b'
  };

  typeOptions = [
    { label: 'Receita', value: 'INCOME' },
    { label: 'Despesa', value: 'EXPENSE' }
  ];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar categorias' });
        console.error(err);
      },
      complete: () => this.loading.set(false)
    });
  }

  showDialog() {
    this.editMode = false;
    this.category = {
      name: '',
      type: 'EXPENSE',
      icon: 'pi pi-tag',
      color: '#64748b'
    };
    this.displayDialog = true;
  }

  editCategory(cat: Category) {
    this.editMode = true;
    this.category = { ...cat };
    this.displayDialog = true;
  }

  saveCategory() {
    this.saving.set(true);
    if (this.editMode) {
      this.categoryService.update(this.category.id, this.category).subscribe({
        next: () => this.handleSuccess('Categoria atualizada'),
        error: (err) => this.handleError(err)
      });
    } else {
      this.categoryService.create(this.category).subscribe({
        next: () => this.handleSuccess('Categoria criada'),
        error: (err) => this.handleError(err)
      });
    }
  }

  confirmDelete(cat: Category) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a categoria "${cat.name}"? Isso pode afetar transações vinculadas.`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.categoryService.delete(cat.id).subscribe({
          next: () => this.handleSuccess('Categoria excluída'),
          error: (err) => this.handleError(err)
        });
      }
    });
  }

  private handleSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
    this.displayDialog = false;
    this.saving.set(false);
    this.loadCategories();
    this.finance.refreshData();
  }

  private handleError(err: any) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um problema' });
    this.saving.set(false);
    console.error(err);
  }
}
