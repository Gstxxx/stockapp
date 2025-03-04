import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/sales - Listar todas as vendas
export async function GET(request: NextRequest) {
  try {
    // Parâmetros de consulta para filtrar por data
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    } else if (startDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
        },
      };
    } else if (endDate) {
      dateFilter = {
        date: {
          lte: new Date(endDate),
        },
      };
    }

    const sales = await prisma.sale.findMany({
      where: dateFilter,
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vendas" },
      { status: 500 }
    );
  }
}

// POST /api/sales - Registrar uma nova venda
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, date } = await request.json();

    // Validação básica
    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "ID do produto e quantidade são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se há estoque suficiente
    if (product.quantity < quantity) {
      return NextResponse.json(
        { error: "Quantidade insuficiente em estoque" },
        { status: 400 }
      );
    }

    // Calcular o valor total da venda
    const totalValue = product.price * quantity;

    // Criar a transação para registrar a venda e atualizar o estoque
    const [sale, _] = await prisma.$transaction([
      // Registrar a venda
      prisma.sale.create({
        data: {
          productId,
          quantity,
          totalValue,
          date: date ? new Date(date) : new Date(),
        },
      }),

      // Atualizar o estoque
      prisma.product.update({
        where: { id: productId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      }),
    ]);

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    return NextResponse.json(
      { error: "Erro ao registrar venda" },
      { status: 500 }
    );
  }
}
