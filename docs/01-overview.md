# 🧠 Overview

Este projeto consiste em um ecossistema financeiro composto por um backend em NestJS e um frontend em Angular, com infraestrutura baseada em Docker e AWS.

## 🎯 Objetivo
- Criar uma plataforma financeira funcional (MVP).
- Interface intuitiva e responsiva em Angular.
- Baixo custo (rodando em instâncias EC2 otimizadas).
- Segurança robusta via Keycloak (RBAC e Isolamento de dados).

## 🧱 Stack
- **Backend:** NestJS (TypeScript)
- **Frontend:** Angular 19+ (Signals, Standalone Components)
- **Banco de Dados:** PostgreSQL (RDS)
- **Autenticação:** Keycloak (OIDC)
- **Infraestrutura:** Docker, Nginx, Terraform (AWS)

## ⚠️ Importante
O foco inicial é a integração do Frontend com o Backend através do Keycloak, garantindo que o multi-tenancy (Workspaces) funcione perfeitamente desde o login.
