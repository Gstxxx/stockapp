import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar se já existe um usuário admin
    const existingUser = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (!existingUser) {
      // Criar usuário admin
      const admin = await prisma.user.create({
        data: {
          username: "admin",
          password: "admin123", // Em produção, use bcrypt para hash da senha
        },
      });

      console.log("Usuário admin criado com sucesso:", admin);
    } else {
      console.log("Usuário admin já existe");
    }

    // Criar alguns produtos de exemplo se não existirem
    const productsCount = await prisma.product.count();

    if (productsCount === 0) {
      const products = await prisma.product.createMany({
        data: [
          {
            name: "Camiseta",
            price: 2990, // R$ 29,90
            quantity: 50,
          },
          {
            name: "Calça Jeans",
            price: 8990, // R$ 89,90
            quantity: 30,
          },
          {
            name: "Tênis",
            price: 12990, // R$ 129,90
            quantity: 20,
          },
          {
            name: "Boné",
            price: 1990, // R$ 19,90
            quantity: 40,
          },
          {
            name: "Meia",
            price: 990, // R$ 9,90
            quantity: 100,
          },
        ],
      });

      console.log(`${products.count} produtos criados com sucesso`);
    } else {
      console.log("Produtos já existem no banco de dados");
    }

    console.log("Seed concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao executar seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
