# 🧠 AI Context - Gerenciador Money

Este documento serve como a fonte única de verdade (SSoT) para qualquer IA que atue neste projeto. Ele descreve a arquitetura, stack, infraestrutura, modelagem de domínio e o roadmap de evolução.

## 📌 Visão Geral
O **Gerenciador Money** é uma solução Full Stack de gestão financeira. Possui um backend robusto em NestJS e um frontend moderno em Angular (Signals/Standalone). O sistema utiliza Keycloak para autenticação e RBAC, e Terraform para provisionamento na AWS.

## 🏗️ Arquitetura & Stack
- **Backend:** NestJS, PostgreSQL (TypeORM/Prisma), Docker.
- **Frontend:** Angular 19+, TailwindCSS, `keycloak-angular`.
- **Autenticação:** Keycloak (OAuth2/OIDC) com suporte a Workspaces (Multi-tenancy).
- **Infra:** AWS (EC2 + RDS + S3), Terraform.

## 🔐 Regras Mandatórias
1. **Multi-tenancy:** Todas as requisições de dados (GET) devem obrigatoriamente incluir `financeGroupId`.
2. **Segurança:** O frontend nunca armazena segredos; utiliza o fluxo PKCE do Keycloak.
3. **Padrão de Código:** DRY, SOLID e componentes Standalone no Angular.
