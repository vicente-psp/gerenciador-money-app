# 🏗️ Planejamento de Infraestrutura: Gerenciador Money

Este documento descreve a arquitetura de infraestrutura modularizada, implementada para otimização de custos e alta disponibilidade de dados.

## 📌 1. Visão Geral da Arquitetura
A infraestrutura foi dividida em módulos independentes no Terraform. Isso permite que partes da aplicação sejam destruídas (para economizar custos) enquanto dados e configurações de rede permanecem intactos.

### Componentes Implementados:
- **Estado do Terraform:** S3 + DynamoDB (Permanente).
- **Rede (Network):** VPC, 2 Subnets (AZ-A/AZ-B), IGW, Route Tables, Security Groups (RDS, Web, Internal).
- **Dados (Data):** RDS PostgreSQL (`db.t3.micro`) - Persistência garantida.
- **Identidade (Auth):** EC2 (`t3.micro`) dedicada ao Keycloak com 2GB de SWAP.
- **Aplicação (App):** EC2 (`t3.micro`) NestJS + Nginx - Efêmera.
- **Automação:** IAM Roles, ECR com ciclo de vida de imagens.

---

## 🛠️ 2. Estrutura Modular (Terraform)
A infraestrutura foi migrada para módulos:
- `network`: Base de rede e isolamento.
- `database`: RDS provisionado em sub-redes privadas/públicas configuradas.
- `auth`: Instância dedicada com `user_data` para configuração automática de SWAP e Docker.
- `app`: Instância com Certbot para SSL automático.

---

## 🚀 3. Pipeline CI/CD (GitHub Actions)
O deploy agora é inteligente e dinâmico:
- **Descoberta:** O workflow consulta `terraform output` para obter o IP do Auth Server e o endpoint do RDS em tempo real.
- **Estratégia:** O pipeline realiza deploys sequenciais (Auth, Backend e agora Frontend).
- **Frontend:** O artefato do Angular será servido pelo Nginx na instância `app`, ou futuramente via S3/CloudFront para maior escalabilidade.

---

## 🎨 4. Frontend e Acesso Público
O frontend será exposto via Nginx com HTTPS (Certbot).
- **Endpoint:** `https://app.gerenciadormoney.com` (exemplo).
- **Integração:** O Keycloak deve estar configurado para permitir o domínio do frontend como `Web Origin` e `Redirect URI`.

---

## 💰 4. Estratégia de Custo (FinOps)
A arquitetura permite o desligamento da camada de computação:
1. **Dados (RDS):** Mantido online (Free Tier).
2. **App/Auth (EC2):** Pode ser destruída (`terraform destroy -target=module.app -target=module.auth`) fora do horário de testes para zerar o custo de computação.

---
*Atualizado: 27 de Abril de 2026*
