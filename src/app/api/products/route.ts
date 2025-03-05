import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products - Listar todos os produtos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

// POST /api/products - Criar um novo produto
export async function POST(request: NextRequest) {
  try {
    const { name, price, quantity } = await request.json();

    // Validação básica
    if (!name || price === undefined || quantity === undefined) {
      return NextResponse.json(
        { error: "Nome, preço e quantidade são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o produto já existe
    const existingProduct = await prisma.product.findUnique({
      where: { name },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Produto com este nome já existe" },
        { status: 409 }
      );
    }

    // Criar o produto
    const product = await prisma.product.create({
      data: {
        name,
        price,
        stockQuantity: quantity,
        saleQuantity: quantity,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
