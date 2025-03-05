# StockApp - Sistema de Gerenciamento de Estoque e Vendas

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0.0-blue)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC)](https://tailwindcss.com/)

Bem-vindo ao StockApp, uma aplicação web desenvolvida para facilitar o gerenciamento diário de estoque e vendas de uma empresa. Este sistema registra o estoque atual de produtos, seus valores, a quantidade vendida ao final do dia e gera estatísticas de vendas (diárias, semanais, mensais e anuais). Construído com Next.js, o StockApp é rápido, intuitivo e escalável.

## Funcionalidades

- Cadastro e edição de produtos (nome, preço, quantidade em estoque)
- Registro diário da quantidade vendida por produto
- Atualização automática do estoque com base nas vendas
- Relatórios de vendas com filtros: diário, semanal, mensal e anual
- Interface amigável e responsiva

## Tecnologias Utilizadas

- **Frontend**: Next.js 15 (React), Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: SQLite (via Prisma ORM) - expansível para PostgreSQL
- **Gráficos**: Chart.js
- **Outras**: TypeScript, ESLint, Prettier

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- npm ou yarn
- Um editor de código como VSCode

## Instalação

Siga os passos abaixo para configurar o projeto localmente:

1. Clone o repositório:
