import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { 
        path: 'transactions', 
        loadComponent: () => import('./components/transactions/transaction-list').then(m => m.TransactionListComponent) 
      },
      { 
        path: 'accounts', 
        loadComponent: () => import('./components/accounts/account-list').then(m => m.AccountListComponent) 
      },
      { 
        path: 'categories', 
        loadComponent: () => import('./components/categories/category-list').then(m => m.CategoryListComponent) 
      },
      {
        path: 'workspaces',
        loadComponent: () => import('./components/workspaces/workspace-list').then(m => m.WorkspaceListComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
