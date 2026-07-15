"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Truck, Store, Loader2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: string;
  title_fr: string;
  title_en: string;
  title_de: string;
  price: number | null;
  maxOrder: number | null;
  isDeliverable: boolean;
  image?: string;
}

interface OrderFormProps {
  product: Product;
  onClose: () => void;
}

export function OrderForm({ product, onClose }: OrderFormProps) {
  const { locale } = useLanguage();
  const title = product[`title_${locale}` as keyof Product] || product.title_fr;
  const isDeliverable = product.isDeliverable;

  const [step, setStep] = useState<
    "form" | "summary" | "processing" | "success"
  >("form");
  const [deliveryMethod, setDeliveryMethod] = useState<"PICKUP" | "DELIVERY">(
    "PICKUP",
  );
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "France",
  });

  // Load stored form data from sessionStorage (when returning from Stripe)
  // Use pageshow event to handle back/forward cache (bfcache)
  useEffect(() => {
    const loadFromSessionStorage = () => {
      if (typeof window !== 'undefined') {
        const storedData = sessionStorage.getItem('productOrderFormData');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setFormData({
              customerName: parsedData.customerName || "",
              customerEmail: parsedData.customerEmail || "",
              customerPhone: parsedData.customerPhone || "",
              address: parsedData.address || "",
              city: parsedData.city || "",
              zipCode: parsedData.zipCode || "",
              country: parsedData.country || "France",
            });
            if (parsedData.deliveryMethod) {
              setDeliveryMethod(parsedData.deliveryMethod);
            }
            if (parsedData.quantity) {
              setQuantity(parsedData.quantity);
            }
            // Don't clear sessionStorage - keep data for potential modifications
          } catch {
            // Invalid JSON, ignore
          }
        }
      }
    };

    // Load immediately on mount
    loadFromSessionStorage();

    // Also listen for pageshow event (fired when page is restored from bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        loadFromSessionStorage();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const formRef = useRef<HTMLFormElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxOrder = product.maxOrder ?? 10;
    const value = Math.max(
      1,
      Math.min(maxOrder, parseInt(e.target.value) || 1),
    );
    setQuantity(value);
  };

  const validateForm = (): boolean => {
    if (!formData.customerName.trim()) return false;
    if (
      !formData.customerEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)
    )
      return false;
    if (!formData.customerPhone.trim()) return false;
    if (deliveryMethod === "DELIVERY") {
      if (
        !formData.address.trim() ||
        !formData.city.trim() ||
        !formData.zipCode.trim()
      )
        return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setStep("processing");

    try {
      const response = await fetch("/api/boutique/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName:
            product[`title_${locale}` as keyof Product] || product.title_fr,
          productImage: product.image,
          quantity,
          totalPrice: (product.price ?? 0) * quantity,
          deliveryMethod,
          address: deliveryMethod === "DELIVERY" ? formData : undefined,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur lors de la création de la commande",
        );
      }

      // Stocker les données du formulaire dans sessionStorage pour persistance
      // après le paiement Stripe
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('productOrderFormData', JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          deliveryMethod,
          quantity,
        }));
      }

      // Redirect to Stripe URL returned by API
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("URL de paiement non reçue");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      alert(errorMessage);
      setStep("form");
    }
  };

  const totalAmount = (product.price ?? 0) * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
          aria-label="Fermer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Form Steps */}
        {step === "form" && (
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6" autoComplete="shipping">
            <div className="text-center mb-6">
              <h2
                className="text-2xl font-bold text-foreground mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Commander {title}
              </h2>
              <p className="text-muted-foreground">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(totalAmount)}
              </p>
            </div>

            {/* Product Summary */}
            <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center shrink-0">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">
                  {quantity} x{" "}
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(product.price ?? 0)}{" "}
                  ={" "}
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalAmount)}
                </p>
              </div>
            </div>

            {isDeliverable && (
              <>
                {/* Delivery Method */}
                <div className="space-y-3">
                  <Label className="text-foreground">Mode de livraison</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        deliveryMethod === "PICKUP"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setDeliveryMethod("PICKUP")}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${deliveryMethod === "PICKUP" ? "border-primary" : "border-border"}`}
                        >
                          {deliveryMethod === "PICKUP" && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                          )}
                        </div>
                        <Store className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">
                          Retrait au restaurant
                        </span>
                      </div>
                      {deliveryMethod === "PICKUP" && (
                        <p className="mt-3 text-xs text-muted-foreground pl-8">
                          {process.env.RESTAURANT_ADDRESS ||
                            "12 Rue de la République, 25000 Besançon"}
                        </p>
                      )}
                    </div>

                    <div
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        deliveryMethod === "DELIVERY"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setDeliveryMethod("DELIVERY")}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${deliveryMethod === "DELIVERY" ? "border-primary" : "border-border"}`}
                        >
                          {deliveryMethod === "DELIVERY" && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                          )}
                        </div>
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">
                          Livraison à domicile
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isDeliverable && (
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <Store className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Ce produit est à chercher au restaurant uniquement
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Informations du client
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nom complet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="Jean Dupont"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                    placeholder="jean@example.com"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Téléphone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerPhone: e.target.value,
                      })
                    }
                    placeholder="+33 6 12 34 56 78"
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address (only for delivery method) */}
            {deliveryMethod === "DELIVERY" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  Adresse de livraison
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Adresse <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    autoComplete="address-line1"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Rue de la Bouteille"
                    className="bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      Ville <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Paris"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">
                      Code postal <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      autoComplete="postal-code"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      placeholder="75001"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      name="country"
                      autoComplete="country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder="France"
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantité <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={product.maxOrder ?? 10}
                value={quantity}
                onChange={handleQuantityChange}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Maximum : {product.maxOrder ?? 10} unités
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {quantity > 1
                  ? `Valider ${quantity} produits`
                  : "Valider la commande"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {step === "processing" && (
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Traitement de la commande...
            </h3>
            <p className="text-muted-foreground">
              Veuillez ne pas fermer cette fenêtre
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Commande confirmée !
            </h3>
            <p className="text-muted-foreground mb-6">
              Votre commande a été prise en compte. Vous allez être redirigé
              vers Stripe pour le paiement.
            </p>
            <Button
              onClick={() => {
                // Redirect to Stripe
                window.location.href = "#";
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continuer vers le paiement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
