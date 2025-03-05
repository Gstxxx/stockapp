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
            name: "Energético",
            price: 599, // R$ 5,99
            stockQuantity: 100,
            saleQuantity: 100,
          },
          {
            name: "Pré-Treino",
            price: 7990, // R$ 79,90
            stockQuantity: 30,
            saleQuantity: 30,
          },
          {
            name: "Whey Protein",
            price: 14990, // R$ 149,90
            stockQuantity: 20,
            saleQuantity: 20,
          },
          {
            name: "Creatina",
            price: 4990, // R$ 49,90
            stockQuantity: 50,
            saleQuantity: 50,
          },
          {
            name: "Isotônico", // Gatorade ou similar
            price: 799, // R$ 7,99
            stockQuantity: 80,
            saleQuantity: 80,
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
