import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { AccountService } from './account.service';
import { CategoryService } from './category.service';
import { TransactionService } from './transaction.service';
import { Account } from '../models/account.model';
import { Category } from '../models/category.model';
import { Transaction } from '../models/transaction.model';
import { FinanceGroupService } from './finance-group.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);
  private financeGroupService = inject(FinanceGroupService);

  // Estados Globais (Signals)
  private _accounts = signal<Account[]>([]);
  private _categories = signal<Category[]>([]);
  private _transactions = signal<Transaction[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Exposições Públicas
  accounts = computed(() => this._accounts());
  categories = computed(() => this._categories());
  transactions = computed(() => this._transactions());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  // Métodos de Resumo (Derivados)
  totalBalance = computed(() => 
    this._accounts().reduce((acc, account) => acc + account.balance, 0)
  );

  monthlyIncome = computed(() => 
    this._transactions()
      .filter(t => t.type === 'INCOME' && this.isCurrentMonth(new Date(t.date)))
      .reduce((acc, t) => acc + t.amount, 0)
  );

  monthlyExpense = computed(() => 
    this._transactions()
      .filter(t => t.type === 'EXPENSE' && this.isCurrentMonth(new Date(t.date)))
      .reduce((acc, t) => acc + t.amount, 0)
  );

  constructor() {
    // Reage a mudanças no grupo financeiro ativo
    effect(() => {
      const group = this.financeGroupService.activeFinanceGroup();
      if (group) {
        this.refreshData();
      }
    });
  }

  async refreshData() {
    const groupId = this.financeGroupService.activeFinanceGroup()?.id;
    if (!groupId) return;

    this._loading.set(true);
    this._error.set(null);

    try {
      const [accounts, transactions, categories] = await Promise.all([
        firstValueFrom(this.accountService.getAll(groupId)),
        firstValueFrom(this.transactionService.getAll({}, groupId)),
        firstValueFrom(this.categoryService.getAll(groupId))
      ]);

      this._accounts.set(accounts);
      this._transactions.set(transactions);
      this._categories.set(categories);
    } catch (err) {
      this._error.set('Falha ao carregar dados financeiros.');
      console.error(err);
    } finally {
      this._loading.set(false);
    }
  }

  async saveTransaction(transaction: any) {
    const groupId = this.financeGroupService.activeFinanceGroup()?.id;
    if (!groupId) throw new Error('Nenhum grupo financeiro selecionado');

    try {
      await firstValueFrom(this.transactionService.create(transaction, groupId));
      await this.refreshData();
    } catch (err) {
      this._error.set('Erro ao salvar transação.');
      throw err;
    }
  }

  private isCurrentMonth(date: Date): boolean {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
}
