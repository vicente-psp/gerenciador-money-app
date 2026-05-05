export interface FinanceGroup {
  id: string;
  name: string;
  description?: string;
  type: 'PERSONAL' | 'SHARED';
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  isDefault?: boolean;
}
