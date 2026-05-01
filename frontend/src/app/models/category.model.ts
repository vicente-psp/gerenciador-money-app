export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  type: 'INCOME' | 'EXPENSE';
}
