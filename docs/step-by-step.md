# 🗺️ Planejamento Step-by-Step: Gerenciador Money

Este documento detalha o plano de execução para o desenvolvimento do ecossistema Gerenciador Money.

---

## 🏗️ Fase 1: Infraestrutura e Backend (Concluído/Externo)
- Setup do Terraform (VPC, RDS, EC2).
- Configuração do Keycloak Server.
- Backend NestJS rodando via Docker.

## 🎨 Fase 2: Frontend Angular - Core & Auth (Concluído)
- [x] Inicialização do projeto Angular 19 (Standalone).
- [x] Setup do TailwindCSS v4.
- [x] Instalação e configuração do **PrimeNG v19**.
- [x] Integração com `keycloak-angular` e `keycloak-js`.

- [x] Implementação do `KeycloakAuthService`.
- [x] Configuração de Interceptors e Environments.
- [x] Definição de Modelos de Dados (Interfaces).

## 🔗 Fase 3: Integração & Funcionalidades Financeiras (Próximo passo)
- [ ] Implementação de Serviços para comunicação com Backend Docker.
- [ ] Dashboard: Resumo de saldo e últimos lançamentos.
- [ ] Gestão de Contas e Categorias (CRUDs).
- [ ] Transações: Inclusão, edição e filtros por Workspace.

## 🚀 Fase 4: Deploy & Polimento
- [ ] Provisionamento de Infra via Terraform (S3 Bucket + CloudFront).
- [ ] Pipeline de Deploy do Frontend para S3.
- [ ] Ajustes de UX/UI (Feedback visual de carregamento e erros).
- [ ] Testes de ponta a ponta (E2E).
