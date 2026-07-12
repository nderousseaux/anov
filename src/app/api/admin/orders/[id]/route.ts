import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;

  try {
    const order = await prisma.productOrder.findUnique({
      where: { id },
      include: { customerAddress: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    const formattedOrder = {
      id: order.id,
      code: order.code,
      productName: order.productName,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      deliveryMethod: order.deliveryMethod,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress || null,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      stripeSessionId: order.stripeSessionId,
      expiresAt: order.expiresAt?.toISOString(),
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('[orders/[id]] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement de la commande' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json({ error: 'Le statut est requis' }, { status: 400 });
  }

  const validStatuses = [
    'PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'READY', 'COMPLETED', 'CANCELLED', 'EXPIRED'
  ];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }

  try {
    const order = await prisma.productOrder.findUnique({
      where: { id },
      include: { customerAddress: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Check if status transition is valid
    const allowedTransitions: Record<string, string[]> = {
      PENDING_PAYMENT: ['CONFIRMED'],
      CONFIRMED: ['PROCESSING'],
      PROCESSING: ['READY', 'SHIPPED'],
      READY: ['COMPLETED'],
      SHIPPED: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
      EXPIRED: [],
    };

    if (status !== order.status && !allowedTransitions[order.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Transition invalide: ${order.status} -> ${status}` },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.productOrder.update({
      where: { id },
      data: { status },
      include: { customerAddress: true },
    });

    const formattedOrder = {
      id: updatedOrder.id,
      code: updatedOrder.code,
      productName: updatedOrder.productName,
      quantity: updatedOrder.quantity,
      totalPrice: updatedOrder.totalPrice,
      deliveryMethod: updatedOrder.deliveryMethod,
      customerName: updatedOrder.customerName,
      customerEmail: updatedOrder.customerEmail,
      customerPhone: updatedOrder.customerPhone,
      customerAddress: updatedOrder.customerAddress,
      status: updatedOrder.status,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
      stripeSessionId: updatedOrder.stripeSessionId,
      expiresAt: updatedOrder.expiresAt?.toISOString(),
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('[orders/[id]] PATCH Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}