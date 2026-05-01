import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction.model';
import { Category } from '../models/category.model';
import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signals para o estado
  private _transactions = signal<Transaction[]>([]);
  private _accounts = signal<Account[]>([]);
  private _categories = signal<Category[]>([]);
  
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed signals para o Dashboard
  transactions = computed(() => this._transactions());
  accounts = computed(() => this._accounts());
  
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
    this.refreshData();
  }

  async refreshData() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const [accounts, transactions] = await Promise.all([
        firstValueFrom(this.http.get<Account[]>(`${this.apiUrl}/accounts`)),
        firstValueFrom(this.http.get<Transaction[]>(`${this.apiUrl}/transactions`))
      ]);
      
      this._accounts.set(accounts);
      this._transactions.set(transactions);
    } catch (err) {
      console.error('Erro ao carregar dados financeiros:', err);
      this.error.set('Falha ao sincronizar dados com o servidor.');
      
      // Fallback para manter o dashboard "vivo" em desenvolvimento se a API falhar
      if (!environment.production) {
        this.loadMockData();
      }
    } finally {
      this.loading.set(false);
    }
  }

  private loadMockData() {
    const mockAccounts: Account[] = [
      { id: '1', name: 'Conta Corrente (Mock)', type: 'CHECKING', balance: 2500.50, color: '#22c55e' },
      { id: '2', name: 'Investimentos (Mock)', type: 'INVESTMENT', balance: 12000.00, color: '#3b82f6' }
    ];

    const mockTransactions: Transaction[] = [
      { id: '1', description: 'Salário', amount: 5000, date: new Date().toISOString(), type: 'INCOME', categoryId: 'c1', accountId: '1' },
      { id: '2', description: 'Aluguel', amount: 1500, date: new Date().toISOString(), type: 'EXPENSE', categoryId: 'c2', accountId: '1' },
      { id: '3', description: 'Supermercado', amount: 450.20, date: new Date().toISOString(), type: 'EXPENSE', categoryId: 'c3', accountId: '1' }
    ];

    this._accounts.set(mockAccounts);
    this._transactions.set(mockTransactions);
  }
}
