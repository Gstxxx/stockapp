import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/sales - Listar todas as vendas
export async function GET(request: NextRequest) {
  try {
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
            price: true,
            priceCard: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Formatar os dados para incluir informações adicionais
    const formattedSales = sales.map((sale) => ({
      ...sale,
      date: sale.date.toISOString(),
      paymentMethod: sale.paymentMethod.toUpperCase(),
      product: {
        ...sale.product,
        price: sale.product.price / 100, // Converter de centavos para reais
        priceCard: sale.product.priceCard ? sale.product.priceCard / 100 : null,
      },
      totalValue: sale.totalValue / 100, // Converter de centavos para reais
    }));

    return NextResponse.json(formattedSales);
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
    const { productId, quantity, paymentMethod } = await request.json();

    // Validação básica
    if (!productId || !quantity || !paymentMethod) {
      return NextResponse.json(
        {
          error:
            "ID do produto, quantidade e método de pagamento são obrigatórios",
        },
        { status: 400 }
      );
    }

    // Validar método de pagamento
    const validPaymentMethods = ["PIX", "CASH", "CARD"];
    if (!validPaymentMethods.includes(paymentMethod.toUpperCase())) {
      return NextResponse.json(
        { error: "Método de pagamento inválido" },
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
    if (product.saleQuantity < quantity) {
      return NextResponse.json(
        { error: "Quantidade insuficiente em estoque" },
        { status: 400 }
      );
    }

    // Calcular o valor total da venda
    const totalValue =
      paymentMethod.toUpperCase() === "CARD" && product.priceCard
        ? product.priceCard * quantity
        : product.price * quantity;

    // Criar a transação para registrar a venda e atualizar o estoque
    const [sale, updatedProduct] = await prisma.$transaction([
      // Registrar a venda
      prisma.sale.create({
        data: {
          productId,
          quantity,
          totalValue,
          paymentMethod: paymentMethod.toUpperCase(),
          date: new Date(),
        },
        include: {
          product: {
            select: {
              name: true,
              price: true,
              priceCard: true,
            },
          },
        },
      }),

      // Atualizar o estoque
      prisma.product.update({
        where: { id: productId },
        data: {
          saleQuantity: {
            decrement: quantity,
          },
        },
      }),
    ]);

    // Formatar a resposta
    const formattedSale = {
      ...sale,
      date: sale.date.toISOString(),
      paymentMethod: sale.paymentMethod.toUpperCase(),
      product: {
        ...sale.product,
        price: sale.product.price / 100,
        priceCard: sale.product.priceCard ? sale.product.priceCard / 100 : null,
      },
      totalValue: sale.totalValue / 100,
    };

    return NextResponse.json(formattedSale, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    return NextResponse.json(
      { error: "Erro ao registrar venda" },
      { status: 500 }
    );
  }
}
