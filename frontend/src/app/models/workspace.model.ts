export interface Workspace {
  id: string;
  name: string;
  description?: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface FinanceGroup extends Workspace {}
