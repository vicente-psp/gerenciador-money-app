# 🔄 Fluxo de Desenvolvimento (Development Flow)

Este documento define os padrões de ramificação (branching) e o processo de tarefas do ecossistema Gerenciador Money.

## 🌿 Padrões de Branches

Todas as novas ramificações devem seguir os prefixos abaixo, baseados no tipo de tarefa:

| Prefixo | Descrição | Exemplo |
| :--- | :--- | :--- |
| `feature/` | Novas funcionalidades ou melhorias | `feature/dashboard-charts` |
| `fix/` | Correções de bugs ou problemas técnicos | `fix/auth-cors-issue` |
| `docs/` | Atualizações apenas em documentação | `docs/update-readme` |
| `refactor/` | Refatoração de código sem mudança de comportamento | `refactor/finance-service` |

## 🚀 Ciclo de Vida da Tarefa

1.  **Criação:** Partir sempre da branch `develop`.
2.  **Desenvolvimento:** Realizar commits atômicos e descritivos.
3.  **Validação:** Garantir que o build (`npm run build`) está passando antes de finalizar.
4.  **Merge:** As branches de feature/fix devem ser integradas na `develop` via Pull Request ou Merge após validação.
5.  **Produção:** A branch `main` reflete apenas o código estável em produção.

## 📝 Padrão de Commits

Seguimos o padrão de [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` (novas funcionalidades)
- `fix:` (correções)
- `docs:` (documentação)
- `style:` (formatação, CSS, etc)
- `refactor:` (refatoração)
- `chore:` (atualização de dependências, builds, etc)
