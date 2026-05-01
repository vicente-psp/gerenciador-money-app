# 📋 Regras de Negócio e Segurança

Este documento consolida as regras de negócio e restrições de segurança para o Gerenciador Money.

## 1. Controle de Acesso (RBAC)

### Papéis Disponíveis
- `ADMIN`: Acesso total ao sistema, incluindo listagem de todos os usuários.
- `USER`: Acesso restrito aos próprios dados e recursos.

### Restrições por Recurso
| Recurso | Operação | Permissão | Escopo de Visibilidade |
| :--- | :--- | :--- | :--- |
| **Users** | Listar todos | ADMIN | Global |
| **Users** | Criar/Atualizar/Remover | Todos | Próprio |
| **Accounts** | Listar | USER / ADMIN | Apenas do grupo financeiro do usuário |
| **Transactions** | Listar | USER / ADMIN | Apenas do grupo financeiro do usuário |
| **Budgets** | Listar | USER / ADMIN | Apenas do grupo financeiro do usuário |

---

## 2. Multi-tenancy (Isolamento de Dados)

O isolamento é garantido através do campo `sub` (ID do usuário no Keycloak) ou `financeGroupId` (quando aplicável).

1. **Isolamento de Usuário**: Todo recurso criado deve ser vinculado ao `userId` (sub) do usuário autenticado no token.
2. **Isolamento de Grupo**: Operações em transações, contas e orçamentos devem validar se o usuário pertence ao `financeGroupId` solicitado.
3. **Fluxo de Cadastro**: 
   - O auto-cadastro é gerido pelo Keycloak (Provedor de Identidade).
   - A sincronização dos dados no banco local é feita automaticamente via `UserSyncInterceptor` no primeiro acesso.
   - A criação manual de usuários via endpoint `POST /users` é restrita exclusivamente ao papel `ADMIN`.

4. **Grupos Financeiros (Workspaces)**:
   - Podem ser criados, editados e removidos.
   - **Exclusão**: Não é permitida a exclusão de um grupo que possua transações vinculadas, para preservar o histórico financeiro.
   - **Acesso**: Apenas usuários vinculados ao grupo (via `UserFinanceGroup`) podem realizar operações de leitura, edição ou exclusão.

## 3. Perguntas Pendentes

1. **Grupos Financeiros (FinanceGroups)**:
   - Qual a regra para criar um grupo? Qualquer usuário pode criar?
   - Um grupo pode ter vários usuários? Se sim, como funciona a partilha de dados entre eles?
2. **Categorias (Categories)**:
   - As categorias são globais (comuns a todos) ou exclusivas de cada usuário/grupo financeiro?
3. **Orçamentos (Budgets)**:
   - Será utilizado o modelo **Híbrido**: Cada orçamento é vinculado simultaneamente a uma Categoria e a um Grupo Financeiro.
   - Isso permite ao usuário definir, por exemplo, um limite de gasto para "Alimentação" (Categoria) dentro do grupo "Casa" (FinanceGroup).
   - Indispensável o campo `userId` para garantir o isolamento (Multi-tenancy).
