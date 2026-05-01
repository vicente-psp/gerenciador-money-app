# 🎨 Plano de Integração Frontend (Angular)

Este documento define os contratos, regras e a arquitetura necessária para desenvolver o frontend em Angular do projeto Gerenciador Money.

---

## 🏗️ 1. Arquitetura Sugerida (Angular 17+)
*   **Standalone Components:** Utilizar a nova arquitetura do Angular sem NgModules.
*   **Signals:** Gerenciamento de estado reativo para saldos e listas.
*   **Keycloak Angular:** Biblioteca `keycloak-angular` para integração com o Auth Server.
*   **TailwindCSS/Bootstrap:** Para estilização rápida e responsiva.

---

## 🔐 2. Autenticação e Segurança
O frontend deve atuar como um **Public Client** no Keycloak.

### Contrato de Auth:
*   **Provedor:** Keycloak (OAuth2 / OIDC).
*   **Fluxo:** Authorization Code Flow with PKCE.
*   **Interceptor:** Deve anexar o `Authorization: Bearer <token>` em todas as requisições para o backend.
*   **Roles:** O frontend deve ler as roles `ADMIN` e `USER` do token para esconder/mostrar elementos da UI.

---

## 📊 3. Entidades e Contratos (Interfaces)

### Workspace (FinanceGroup)
Tudo no sistema é filtrado por `financeGroupId`.
```typescript
interface Workspace {
  id: string;
  name: string;
  description?: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}
```

### Transação
```typescript
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string; // ISO Date
  categoryId: string;
  accountId: string;
  financeGroupId: string;
}
```

### Categoria e Grupo
```typescript
interface Category {
  id: string;
  name: string;
  groupId: string;
  financeGroupId: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}
```

---

## 📋 4. Regras de Negócio Cruciais para o Front

1.  **Seleção de Workspace:** O usuário deve selecionar um Workspace ativo (ex: "Pessoal") logo após o login. O `id` deste workspace deve ser passado como `QueryParam` (`?financeGroupId=...`) em quase todos os GETs.
2.  **Sincronização de Cadastro:** O primeiro login do usuário via Social/Self-register aciona a criação automática do Workspace Pessoal no backend. O front deve tratar o caso de "lista de workspaces vazia" (embora o backend garanta um).
3.  **Validação de Exclusão:**
    *   Não permitir excluir `FinanceGroup` que possua transações (o backend retornará erro 403).
    *   Não permitir que o usuário tente editar dados de outros usuários (o backend bloqueia via Self-Access).
4.  **Inserção em Lote:** Utilizar o endpoint `POST /categories/bulk` para permitir que o usuário importe um conjunto padrão de categorias ao criar um novo Workspace.

---

## ❓ 5. Perguntas e Dúvidas Pendentes (Para o Usuário)

1.  **Dashboard Inicial:** Quais indicadores são prioritários na home? (Saldo atual, gastos por categoria do mês, ou metas próximas do prazo?)
2.  **Temas:** O sistema deve suportar Dark Mode nativamente?
3.  **Gráficos:** Qual biblioteca de gráficos prefere? (ngx-charts, Chart.js ou ApexCharts?)
4.  **Idiomas:** Planeja suporte a multi-idioma (i18n) desde o início ou apenas Português?
5.  **Offline:** Existe necessidade de PWA (Progressive Web App) para uso offline básico?

---

## 🚀 Próximos Passos
1.  Configurar o projeto Angular com `ng new`.
2.  Instalar e configurar `keycloak-angular`.
3.  Criar o `WorkspaceService` para gerenciar o contexto global do aplicativo.
4.  Desenvolver as telas de CRUD financeiro baseadas nos DTOs do backend.
