# StockApp - Sistema de Gerenciamento de Estoque e Vendas

Bem-vindo ao StockApp, uma aplicação web desenvolvida para facilitar o gerenciamento diário de estoque e vendas de uma empresa. Este sistema registra o estoque atual de produtos, seus valores, a quantidade vendida ao final do dia e gera estatísticas de vendas (diárias, semanais, mensais e anuais). Construído com Next.js, o StockApp é rápido, intuitivo e escalável.

## Funcionalidades

Cadastro e edição de produtos (nome, preço, quantidade em estoque).

Registro diário da quantidade vendida por produto.

Atualização automática do estoque com base nas vendas.

Relatórios de vendas com filtros: diário, semanal, mensal e anual.

Interface amigável e responsiva.

### Tecnologias Utilizadas

Frontend: Next.js 15 (React), Tailwind CSS.

Backend: Next.js API Routes.

Banco de Dados: SQLite (via Prisma ORM) - expansível para PostgreSQL.

Gráficos: Chart.js.

Outras: TypeScript, ESLint, Prettier.

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:
Node.js (versão 18 ou superior)

npm ou yarn

Um editor de código como VSCode

### Instalação

Siga os passos abaixo para configurar o projeto localmente:
Clone o repositório:
bash

git clone https://github.com/gstxxx/stockapp.git
cd stockapp

Instale as dependências:
bash

npm install

# ou

yarn install

Configure o banco de dados:
Crie um arquivo .env na raiz do projeto com a seguinte variável:

DATABASE_URL="file:./dev.db"

Inicialize o Prisma:
bash

npx prisma init
npx prisma migrate dev --name init

Inicie o servidor de desenvolvimento:
bash

npm run dev

# ou

yarn dev

A aplicação estará disponível em http://localhost:3000.

### Uso

Acesse a aplicação:
Abra o navegador em http://localhost:3000.

Dashboard:
Veja o resumo do estoque atual e vendas recentes.

Gerenciamento de Produtos:
Vá até a seção "Produtos" para adicionar, editar ou excluir itens.

Registro de Vendas:
Ao final do dia, insira a quantidade vendida na seção correspondente.

Estatísticas:
Acesse "Estatísticas" para visualizar relatórios com filtros de período.

### Estrutura do Projeto

stockapp/
├── /app # Páginas e rotas da API
├── /components # Componentes React reutilizáveis
├── /lib # Configurações (ex.: Prisma)
├── /public # Arquivos estáticos
├── /prisma # Schema e migrações do banco de dados
├── README.md # Este arquivo
├── package.json # Dependências e scripts

### Scripts Disponíveis

npm run dev: Inicia o servidor de desenvolvimento.

npm run build: Gera a versão otimizada para produção.

npm run start: Inicia o servidor de produção.

npm run lint: Verifica o código com ESLint.

### Contribuição

Se você deseja contribuir:
Faça um fork do repositório.

Crie uma branch para sua feature (git checkout -b feature/nova-funcionalidade).

Commit suas mudanças (git commit -m "Adiciona nova funcionalidade").

Envie para o repositório remoto (git push origin feature/nova-funcionalidade).

Abra um Pull Request.

[Licença](LICENSE.md)

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0.0-blue)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC)](https://tailwindcss.com/)
