import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats - Obter estatísticas de vendas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "daily";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Definir datas de início e fim
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // Se não houver datas específicas, definir período padrão
    if (!startDate) {
      switch (period) {
        case "daily":
          start.setHours(0, 0, 0, 0);
          break;
        case "weekly":
          start.setDate(start.getDate() - 7);
          break;
        case "monthly":
          start.setMonth(start.getMonth() - 1);
          break;
        case "yearly":
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
            priceCard: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calcular estatísticas gerais
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalValue, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    // Calcular estatísticas por método de pagamento
    const paymentMethods = sales.reduce((acc, sale) => {
      const method = sale.paymentMethod.toUpperCase();
      if (!acc[method]) {
        acc[method] = {
          total: 0,
          count: 0,
        };
      }
      acc[method].total += sale.totalValue;
      acc[method].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    // Agrupar vendas por produto
    const productSales = sales.reduce(
      (acc, sale) => {
        const productId = sale.productId;

        if (!acc[productId]) {
          acc[productId] = {
            productId,
            productName: sale.product.name,
            totalQuantity: 0,
            totalRevenue: 0,
            lastSaleTime: sale.date.toISOString(),
            paymentMethods: {} as Record<
              string,
              { total: number; count: number }
            >,
          };
        }

        acc[productId].totalQuantity += sale.quantity;
        acc[productId].totalRevenue += sale.totalValue;

        // Agrupar por método de pagamento para cada produto
        const method = sale.paymentMethod.toUpperCase();
        if (!acc[productId].paymentMethods[method]) {
          acc[productId].paymentMethods[method] = {
            total: 0,
            count: 0,
          };
        }
        acc[productId].paymentMethods[method].total += sale.totalValue;
        acc[productId].paymentMethods[method].count += 1;

        // Atualizar última venda se for mais recente
        if (new Date(sale.date) > new Date(acc[productId].lastSaleTime)) {
          acc[productId].lastSaleTime = sale.date.toISOString();
        }

        return acc;
      },
      {} as Record<
        number,
        {
          productId: number;
          productName: string;
          totalQuantity: number;
          totalRevenue: number;
          lastSaleTime: string;
          paymentMethods: Record<string, { total: number; count: number }>;
        }
      >
    );

    // Agrupar vendas por período
    let timeGroupedSales;

    switch (period) {
      case "daily":
        timeGroupedSales = groupSalesByTimeUnit(sales, "hour");
        break;
      case "weekly":
      case "monthly":
        timeGroupedSales = groupSalesByTimeUnit(sales, "day");
        break;
      case "yearly":
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
        paymentMethods,
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
  const grouped = sales.reduce(
    (acc, sale) => {
      const date = new Date(sale.date);
      let key: string;

      switch (timeUnit) {
        case "hour":
          key = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:00`;
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
          paymentMethods: {} as Record<
            string,
            { total: number; count: number }
          >,
        };
      }

      acc[key].totalQuantity += sale.quantity;
      acc[key].totalRevenue += sale.totalValue;
      acc[key].sales += 1;

      // Agrupar por método de pagamento para cada período
      const method = sale.paymentMethod.toUpperCase();
      if (!acc[key].paymentMethods[method]) {
        acc[key].paymentMethods[method] = {
          total: 0,
          count: 0,
        };
      }
      acc[key].paymentMethods[method].total += sale.totalValue;
      acc[key].paymentMethods[method].count += 1;

      return acc;
    },
    {} as Record<
      string,
      {
        period: string;
        totalQuantity: number;
        totalRevenue: number;
        sales: number;
        paymentMethods: Record<string, { total: number; count: number }>;
      }
    >
  );

  return Object.values(grouped);
}
