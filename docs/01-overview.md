# 🧠 Overview

Este projeto consiste em um ecossistema financeiro composto por um backend em NestJS e um frontend em Angular, com infraestrutura baseada em Docker e AWS.

## 🎯 Objetivo
- Criar uma plataforma financeira funcional (MVP).
- Interface intuitiva e responsiva em Angular.
- Deploy otimizado via **AWS S3 + CloudFront**.
- Segurança robusta via Keycloak (RBAC e Isolamento de dados).

## 🧱 Stack
- **Frontend:** Angular 19+ (Signals, Standalone Components)
- **Estilização:** PrimeNG v19 + TailwindCSS 4
- **Autenticação:** Keycloak (OIDC)
- **Backend:** API REST (acessível via Docker/Nginx)
- **Infraestrutura:** Terraform (AWS S3, CloudFront)


## ⚠️ Importante
O foco inicial é a integração do Frontend com a API através do Keycloak, garantindo que o multi-tenancy (Workspaces) funcione perfeitamente desde o login.

