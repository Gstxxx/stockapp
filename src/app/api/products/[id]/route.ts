import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

// GET /api/products/[id] - Obter um produto específico
export async function GET(request: Request, props: { params: Params }) {
  try {
    const { id } = await props.params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Atualizar um produto
export async function PUT(request: Request, props: { params: Params }) {
  try {
    const { id } = await props.params;
    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const { name, price, priceCard, stockQuantity, saleQuantity, amount } =
      await request.json();

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Se tiver amount, é uma operação de reabastecimento
    if (amount !== undefined) {
      // Validar quantidade
      if (amount <= 0) {
        return NextResponse.json(
          { error: "Quantidade deve ser maior que zero" },
          { status: 400 }
        );
      }

      // Atualizar o produto
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          stockQuantity: existingProduct.stockQuantity + amount,
        },
      });

      return NextResponse.json(updatedProduct);
    }

    // Se não tiver amount, é uma atualização normal
    // Verificar se o novo nome já existe em outro produto
    if (name && name !== existingProduct.name) {
      const productWithSameName = await prisma.product.findUnique({
        where: { name },
      });

      if (productWithSameName && productWithSameName.id !== parseInt(id)) {
        return NextResponse.json(
          { error: "Já existe outro produto com este nome" },
          { status: 409 }
        );
      }
    }

    // Atualizar o produto
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name ?? existingProduct.name,
        price: price ?? existingProduct.price,
        priceCard: priceCard ?? existingProduct.priceCard,
        stockQuantity: stockQuantity ?? existingProduct.stockQuantity,
        saleQuantity: saleQuantity ?? existingProduct.saleQuantity,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id]/restock - Reabastecer estoque de vendas
export async function PATCH(request: Request, props: { params: Params }) {
  try {
    const { id } = await props.params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const { amount } = await request.json();

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Validar quantidade
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Quantidade deve ser maior que zero" },
        { status: 400 }
      );
    }

    if (amount > existingProduct.stockQuantity) {
      return NextResponse.json(
        { error: "Quantidade insuficiente em estoque" },
        { status: 400 }
      );
    }

    // Atualizar o produto
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        stockQuantity: existingProduct.stockQuantity - amount,
        saleQuantity: existingProduct.saleQuantity + amount,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao reabastecer produto:", error);
    return NextResponse.json(
      { error: "Erro ao reabastecer produto" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Excluir um produto
export async function DELETE(request: Request, props: { params: Params }) {
  try {
    const { id } = await props.params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se existem vendas associadas a este produto
    const salesCount = await prisma.sale.count({
      where: { productId: parseInt(id) },
    });

    if (salesCount > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir um produto com vendas associadas" },
        { status: 400 }
      );
    }

    // Excluir o produto
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    );
  }
}
