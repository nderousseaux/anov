import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { sendProductOrderReadyEmail, sendCancellationEmail } from "@/lib/email";
import { stripe } from "@/lib/stripe";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    const order = await prisma.productOrder.findUnique({
      where: { id },
      include: { customerAddress: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 },
      );
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
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error("[orders/[id]] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la commande" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json(
      { error: "Le statut est requis" },
      { status: 400 },
    );
  }

  try {
    const order = await prisma.productOrder.findUnique({
      where: { id },
      include: { customerAddress: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 },
      );
    }

    // Handle special "NEXT" status that adapts to delivery method
    let targetStatus = status;
    if (status === "NEXT") {
      if (order.deliveryMethod === "DELIVERY") {
        targetStatus = "SHIPPED";
      } else {
        targetStatus = "READY";
      }
    }

    const validStatuses = [
      "PENDING_PAYMENT",
      "CONFIRMED",
      "SHIPPED",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(targetStatus)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    // Check if status transition is valid
    const allowedTransitions: Record<string, string[]> = {
      PENDING_PAYMENT: ["CANCELLED"],
      CONFIRMED: ["READY", "SHIPPED", "CANCELLED"],
      READY: ["COMPLETED", "CANCELLED"],
      SHIPPED: ["COMPLETED", "CANCELLED"],
      COMPLETED: ["CANCELLED"],
      CANCELLED: [],
      EXPIRED: ["CANCELLED"],
    };

    if (
      targetStatus !== order.status &&
      !allowedTransitions[order.status]?.includes(targetStatus)
    ) {
      return NextResponse.json(
        { error: `Transition invalide: ${order.status} -> ${targetStatus}` },
        { status: 400 },
      );
    }

    const updatedOrder = await prisma.productOrder.update({
      where: { id },
      data: { status: targetStatus },
      include: { customerAddress: true },
    });

    // Envoyer un email quand la commande devient READY ou SHIPPED
    if (targetStatus === "READY" || targetStatus === "SHIPPED") {
      sendProductOrderReadyEmail({
        to: updatedOrder.customerEmail,
        name: updatedOrder.customerName,
        orderCode: updatedOrder.code,
        productName: updatedOrder.productName,
        quantity: updatedOrder.quantity,
        amount: updatedOrder.totalPrice,
        deliveryMethod: updatedOrder.deliveryMethod,
      }).catch((err) => {
        console.error("[orders/[id]] Erreur lors de l'envoi de l'email:", err);
      });
    }

    // Effectuer un remboursement Stripe si la commande est annulée
    if (targetStatus === "CANCELLED") {
      // Envoyer l'email de confirmation d'annulation
      sendCancellationEmail({
        to: updatedOrder.customerEmail,
        name: updatedOrder.customerName,
        date: updatedOrder.createdAt.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        time: updatedOrder.createdAt.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }).catch((err) => {
        console.error(
          "[orders/[id]] Erreur lors de l'envoi de l'email d'annulation:",
          err,
        );
      });

      // Effectuer un remboursement Stripe si une session de paiement existe
      if (updatedOrder.stripeSessionId) {
        try {
          const session = await stripe.checkout.sessions.retrieve(
            updatedOrder.stripeSessionId,
          );
          const paymentIntentId = session.payment_intent as string;

          if (paymentIntentId) {
            const refund = await stripe.refunds.create({
              payment_intent: paymentIntentId,
              amount: Math.round(updatedOrder.totalPrice * 100),
            });
            console.log(
              `[REFUND] Remboursement de ${updatedOrder.totalPrice}€ créé: ${refund.id}`,
            );
          } else {
            console.warn(
              `[REFUND] Aucun payment_intent trouvé pour la session ${updatedOrder.stripeSessionId}`,
            );
          }
        } catch (refundError) {
          console.error(
            "[REFUND] Erreur lors du remboursement Stripe:",
            refundError,
          );
        }
      }
    }

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
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error("[orders/[id]] PATCH Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 },
    );
  }
}
