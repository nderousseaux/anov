import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { OrderDetailContent } from "@/components/admin/OrderDetailContent";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

async function fetchOrderData(id: string) {
  // Verify admin authentication
  const admin = await getAdminFromCookies();
  if (!admin) {
    notFound();
  }

  const order = await prisma.productOrder.findUnique({
    where: { id },
    include: { customerAddress: true },
  });

  if (!order) return null;

  // Format the order for the Client Component
  return {
    id: order.id,
    code: order.code,
    productName: order.productName,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    deliveryMethod: order.deliveryMethod,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress
      ? {
          firstName: order.customerAddress.firstName,
          lastName: order.customerAddress.lastName,
          address: order.customerAddress.address,
          city: order.customerAddress.city,
          zipCode: order.customerAddress.zipCode,
          country: order.customerAddress.country,
          phone: order.customerAddress.phone,
        }
      : undefined,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    stripeSessionId: order.stripeSessionId,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await fetchOrderData(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <AdminNav />
      <div className="max-w-4xl mx-auto p-6 pb-8">
        <Link
          href="/admin/commandes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>{" "}
          Retour aux commandes
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Commande {order.code}
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              order.status === "PENDING_PAYMENT"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "CONFIRMED"
                  ? "bg-orange-100 text-orange-800"
                  : order.status === "PROCESSING"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "SHIPPED"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "READY"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status === "PENDING_PAYMENT"
              ? "En paiement..."
              : order.status === "CONFIRMED"
                ? "En attente..."
                : order.status === "PROCESSING"
                  ? "En préparation"
                  : order.status === "SHIPPED"
                    ? "Envoyée"
                    : order.status === "READY"
                      ? "Prête"
                      : order.status === "COMPLETED"
                        ? "Terminée"
                        : order.status === "CANCELLED"
                          ? "Remboursée"
                          : "Expirée"}
          </span>
        </div>

        <OrderDetailContent order={order} />
      </div>
    </div>
  );
}
