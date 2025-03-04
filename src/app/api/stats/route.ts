import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats - Obter estatísticas de vendas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "daily"; // daily, weekly, monthly, yearly
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Definir datas de início e fim
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // Se não houver datas específicas, definir período padrão
    if (!startDate) {
      switch (period) {
        case "daily":
          // Hoje
          start.setHours(0, 0, 0, 0);
          break;
        case "weekly":
          // Últimos 7 dias
          start.setDate(start.getDate() - 7);
          break;
        case "monthly":
          // Último mês
          start.setMonth(start.getMonth() - 1);
          break;
        case "yearly":
          // Último ano
          start.setFullYear(start.getFullYear() - 1);
          break;
      }
    }

    // Buscar vendas no período
    const sales = await prisma.sale.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calcular estatísticas
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalValue, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    // Agrupar vendas por produto
    const productSales = sales.reduce((acc, sale) => {
      const productId = sale.productId;

      if (!acc[productId]) {
        acc[productId] = {
          productId,
          productName: sale.product.name,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }

      acc[productId].totalQuantity += sale.quantity;
      acc[productId].totalRevenue += sale.totalValue;

      return acc;
    }, {} as Record<number, { productId: number; productName: string; totalQuantity: number; totalRevenue: number }>);

    // Agrupar vendas por período
    let timeGroupedSales;

    switch (period) {
      case "daily":
        // Agrupar por hora
        timeGroupedSales = groupSalesByTimeUnit(sales, "hour");
        break;
      case "weekly":
        // Agrupar por dia
        timeGroupedSales = groupSalesByTimeUnit(sales, "day");
        break;
      case "monthly":
        // Agrupar por dia
        timeGroupedSales = groupSalesByTimeUnit(sales, "day");
        break;
      case "yearly":
        // Agrupar por mês
        timeGroupedSales = groupSalesByTimeUnit(sales, "month");
        break;
      default:
        timeGroupedSales = groupSalesByTimeUnit(sales, "day");
    }

    return NextResponse.json({
      period,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      summary: {
        totalSales,
        totalRevenue,
        totalQuantity,
      },
      productSales: Object.values(productSales),
      timeGroupedSales,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

// Função auxiliar para agrupar vendas por unidade de tempo
function groupSalesByTimeUnit(
  sales: any[],
  timeUnit: "hour" | "day" | "month"
) {
  const grouped = sales.reduce((acc, sale) => {
    const date = new Date(sale.date);
    let key: string;

    switch (timeUnit) {
      case "hour":
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date
          .getDate()
          .toString()
          .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:00`;
        break;
      case "day":
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        break;
      case "month":
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        break;
      default:
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    }

    if (!acc[key]) {
      acc[key] = {
        period: key,
        totalQuantity: 0,
        totalRevenue: 0,
        sales: 0,
      };
    }

    acc[key].totalQuantity += sale.quantity;
    acc[key].totalRevenue += sale.totalValue;
    acc[key].sales += 1;

    return acc;
  }, {} as Record<string, { period: string; totalQuantity: number; totalRevenue: number; sales: number }>);

  return Object.values(grouped);
}
