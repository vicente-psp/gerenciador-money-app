import { Injectable, signal, computed } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { Category } from '../models/category.model';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  // Signals para o estado
  private _transactions = signal<Transaction[]>([]);
  private _accounts = signal<Account[]>([]);
  private _categories = signal<Category[]>([]);

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
    this.loadMockData();
  }

  private loadMockData() {
    // Dados fakes para visualização inicial do Dashboard
    const mockAccounts: Account[] = [
      { id: '1', name: 'Conta Corrente', type: 'CHECKING', balance: 2500.50, color: '#22c55e' },
      { id: '2', name: 'Investimentos', type: 'INVESTMENT', balance: 12000.00, color: '#3b82f6' }
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
