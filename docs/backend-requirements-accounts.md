# 📋 Requisitos para o Backend - Entidade: Accounts

Este documento detalha as propriedades necessárias para a entidade **Accounts** no backend, visando compatibilidade com o frontend atual e suporte a multi-tenancy.

## 🗄️ Modelo de Dados Sugerido (DTO)

Para evitar erros de validação (400 Bad Request), o backend deve permitir o recebimento dos seguintes campos no momento da criação e atualização de contas:

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| **name** | `string` | Sim | Nome da conta (ex: "Nubank", "Carteira"). |
| **balance** | `number` | Sim | Saldo atual/inicial da conta. |
| **type** | `enum` | Sim | Tipo da conta. Valores aceitos: `CHECKING`, `SAVINGS`, `INVESTMENT`, `CASH`. |
| **color** | `string` | Não | Código hexadecimal da cor (ex: `#3b82f6`). |
| **financeGroupId** | `UUID` | Sim | ID do Workspace (Finance Group) ao qual a conta pertence. |

---

## 🛠️ Exemplos de JSON

### Request (POST /accounts)
```json
{
  "name": "Conta Corrente Principal",
  "balance": 1500.50,
  "type": "CHECKING",
  "color": "#22c55e",
  "financeGroupId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Resposta Esperada (201 Created)
```json
{
  "id": "uuid-gerado-pelo-banco",
  "name": "Conta Corrente Principal",
  "balance": 1500.50,
  "type": "CHECKING",
  "color": "#22c55e",
  "financeGroupId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-05-03T10:00:00Z"
}
```

---

## 🚦 Regras de Negócio Associadas
1. **Isolamento**: O campo `financeGroupId` deve ser indexado para garantir que a listagem de contas de um usuário não traga dados de outros grupos.
2. **Validação de Enum**: O campo `type` deve ser validado no backend para aceitar apenas os valores definidos, garantindo a integridade visual do frontend.
