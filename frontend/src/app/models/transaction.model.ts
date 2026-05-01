import { Category } from './category.model';
import { Account } from './account.model';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  category?: Category;
  accountId: string;
  account?: Account;
  notes?: string;
}
