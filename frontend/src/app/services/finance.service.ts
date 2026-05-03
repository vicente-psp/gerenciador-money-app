import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { Category } from '../models/category.model';
import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AccountService } from './account.service';
import { CategoryService } from './category.service';
import { TransactionService } from './transaction.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);
  private workspaceService = inject(WorkspaceService);

  // Signals para o estado
  private _transactions = signal<Transaction[]>([]);
  private _accounts = signal<Account[]>([]);
  private _categories = signal<Category[]>([]);
  
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed signals para o Dashboard
  transactions = computed(() => this._transactions());
  accounts = computed(() => this._accounts());
  categories = computed(() => this._categories());
  
  totalBalance = computed(() => 
    this._accounts().reduce((acc, curr) => acc + curr.balance, 0)
  );

  monthlyIncome = computed(() => 
    this._transactions()
      .filter(t => t.type === 'INCOME')
      .reduce((acc, curr) => acc + curr.amount, 0)
  );

  monthlyExpense = computed(() => 
    this._transactions()
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.amount, 0)
  );

  constructor() {
    // Reage a mudanças no workspace ativo
    effect(() => {
      const workspace = this.workspaceService.activeWorkspace();
      if (workspace) {
        this.refreshData();
      } else {
        this._accounts.set([]);
        this._transactions.set([]);
        this._categories.set([]);
      }
    });
  }

  async refreshData() {
    const workspaceId = this.workspaceService.activeWorkspace()?.id;
    if (!workspaceId) return;

    this.loading.set(true);
    this.error.set(null);
    try {
      const [accounts, transactions, categories] = await Promise.all([
        firstValueFrom(this.accountService.getAll(workspaceId)),
        firstValueFrom(this.transactionService.getAll({}, workspaceId)),
        firstValueFrom(this.categoryService.getAll(workspaceId))
      ]);
      
      this._accounts.set(accounts);
      this._transactions.set(transactions);
      this._categories.set(categories);
    } catch (err) {
      console.error('Erro ao carregar dados financeiros:', err);
      this.error.set('Falha ao sincronizar dados com o servidor.');
      
      if (!environment.production) {
        this.loadMockData();
      }
    } finally {
      this.loading.set(false);
    }
  }

  async saveTransaction(transaction: Partial<Transaction>) {
    const workspaceId = this.workspaceService.activeWorkspace()?.id;
    this.loading.set(true);
    try {
      await firstValueFrom(this.transactionService.create(transaction, workspaceId));
      await this.refreshData();
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  private loadMockData() {
    const mockCategories: Category[] = [
      { id: 'c1', name: 'Salário', type: 'INCOME', icon: 'pi pi-money-bill', financeGroupId: 'w1' },
      { id: 'c2', name: 'Moradia', type: 'EXPENSE', icon: 'pi pi-home', financeGroupId: 'w1' },
      { id: 'c3', name: 'Alimentação', type: 'EXPENSE', icon: 'pi pi-shopping-cart', financeGroupId: 'w1' }
    ];

    const mockAccounts: Account[] = [
      { id: '1', name: 'Conta Corrente (Mock)', type: 'CHECKING', balance: 2500.50, color: '#22c55e' },
      { id: '2', name: 'Investimentos (Mock)', type: 'INVESTMENT', balance: 12000.00, color: '#3b82f6' }
    ];

    const mockTransactions: Transaction[] = [
      { id: '1', description: 'Salário', amount: 5000, date: new Date().toISOString(), type: 'INCOME', categoryId: 'c1', accountId: '1', financeGroupId: 'w1' },
      { id: '2', description: 'Aluguel', amount: 1500, date: new Date().toISOString(), type: 'EXPENSE', categoryId: 'c2', accountId: '1', financeGroupId: 'w1' },
      { id: '3', description: 'Supermercado', amount: 450.20, date: new Date().toISOString(), type: 'EXPENSE', categoryId: 'c3', accountId: '1', financeGroupId: 'w1' }
    ];

    this._accounts.set(mockAccounts);
    this._transactions.set(mockTransactions);
    this._categories.set(mockCategories);
  }
}
