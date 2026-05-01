# 🗺️ Planejamento Step-by-Step: Gerenciador Money

Este documento detalha o plano de execução para o desenvolvimento do ecossistema Gerenciador Money.

---

## 🏗️ Fase 1: Infraestrutura e Automação (Concluído/Em progresso)
- Setup do Terraform (VPC, RDS, EC2).
- Configuração do Keycloak Server.
- Pipeline de CI/CD para o Backend.

## 🎨 Fase 2: Frontend Angular - Core & Auth
- [ ] Inicialização do projeto Angular 19 (Standalone).
- [ ] Setup do TailwindCSS e biblioteca de componentes.
- [ ] Integração com `keycloak-angular` (Login/Logout/Tokens).
- [ ] Implementação do `WorkspaceService` para gestão do contexto de grupo financeiro.

## 🔗 Fase 3: Integração & Funcionalidades Financeiras
- [ ] Dashboard: Resumo de saldo e últimos lançamentos.
- [ ] Gestão de Contas e Categorias (CRUDs).
- [ ] Transações: Inclusão, edição e filtros por Workspace.
- [ ] Importação de categorias em lote (Bulk).

## 🚀 Fase 4: Deploy & Polimento
- [ ] Deploy do Frontend (S3/CloudFront ou Nginx na EC2).
- [ ] Ajustes de UX/UI (Feedback visual de carregamento e erros).
- [ ] Testes de ponta a ponta (E2E).
