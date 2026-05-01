import { Component, inject } from '@angular/core';
import { KeycloakAuthService } from '../../services/auth/keycloak-auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <header class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-800">Gerenciador Money</h1>
        <div class="flex items-center gap-4">
          @if (auth.isLoggedIn) {
            <span class="text-sm text-gray-600">Bem-vindo!</span>
            <button (click)="auth.logout()" class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
              Sair
            </button>
          } @else {
            <button (click)="auth.login()" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              Entrar
            </button>
          }
        </div>
      </header>

      <main class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="rounded-lg bg-white p-6 shadow-md border-t-4 border-green-500">
          <h2 class="text-lg font-semibold text-gray-700">Saldo Atual</h2>
          <p class="mt-2 text-2xl font-bold text-green-600">R$ 0,00</p>
        </div>
        <div class="rounded-lg bg-white p-6 shadow-md border-t-4 border-blue-500">
          <h2 class="text-lg font-semibold text-gray-700">Receitas (Mês)</h2>
          <p class="mt-2 text-2xl font-bold text-blue-600">R$ 0,00</p>
        </div>
        <div class="rounded-lg bg-white p-6 shadow-md border-t-4 border-red-500">
          <h2 class="text-lg font-semibold text-gray-700">Despesas (Mês)</h2>
          <p class="mt-2 text-2xl font-bold text-red-600">R$ 0,00</p>
        </div>
      </main>
    </div>
  `,
  styles: ``
})
export class HomeComponent {
  auth = inject(KeycloakAuthService);
}
