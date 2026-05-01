# 🧠 AI Context - Gerenciador Money

Este documento serve como a fonte única de verdade (SSoT) para qualquer IA que atue neste projeto. Ele descreve a arquitetura, stack, infraestrutura, modelagem de domínio e o roadmap de evolução.

## 📌 Visão Geral
O **Gerenciador Money** é uma solução de gestão financeira com um frontend moderno em Angular (Signals/Standalone). O sistema utiliza Keycloak para autenticação e RBAC, integrando-se a um backend via API REST.


## 🏗️ Arquitetura & Stack
- **Frontend:** Angular 19+, TailwindCSS, `keycloak-angular`.
- **Autenticação:** Keycloak (OAuth2/OIDC) com suporte a Workspaces (Multi-tenancy).
- **Integração:** Consumo de API REST via HttpClient.

## 🔐 Regras Mandatórias
1. **Multi-tenancy:** Todas as requisições de dados (GET) devem obrigatoriamente incluir `financeGroupId`.
2. **Segurança:** O frontend nunca armazena segredos; utiliza o fluxo PKCE do Keycloak.
3. **Padrão de Código:** DRY, SOLID e componentes Standalone no Angular.

