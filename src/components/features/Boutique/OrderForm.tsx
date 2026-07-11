'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingBag, Truck, Store, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: string;
  title_fr: string;
  title_en: string;
  title_de: string;
  price: number;
  maxOrder: number;
}

interface OrderFormProps {
  product: Product;
  onClose: () => void;
  onSuccess: (orderCode: string) => void;
}

export function OrderForm({ product, onClose, onSuccess }: OrderFormProps) {
  const { locale } = useLanguage();
  const title = product[`title_${locale}` as keyof Product] || product.title_fr;

  const [step, setStep] = useState<'form' | 'summary' | 'processing' | 'success'>('form');
  const [deliveryMethod, setDeliveryMethod] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'France',
  });

  const formRef = useRef<HTMLFormElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(product.maxOrder, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  const validateForm = (): boolean => {
    if (!formData.customerName.trim()) return false;
    if (!formData.customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) return false;
    if (!formData.customerPhone.trim()) return false;
    if (deliveryMethod === 'DELIVERY') {
      if (!formData.address.trim() || !formData.city.trim() || !formData.zipCode.trim()) return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setStep('processing');

    try {
      const response = await fetch('/api/boutique/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          deliveryMethod,
          address: deliveryMethod === 'DELIVERY' ? formData : undefined,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la commande');
      }

      setStep('success');
      onSuccess(data.sessionId);
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue');
      setStep('form');
    }
  };

  const totalAmount = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Form Steps */}
        {step === 'form' && (
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Commander {title}
              </h2>
              <p className="text-muted-foreground">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}
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
                  {quantity} x {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)} = {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}
                </p>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="space-y-3">
              <Label className="text-foreground">Mode de livraison</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                    deliveryMethod === 'PICKUP'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setDeliveryMethod('PICKUP')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${deliveryMethod === 'PICKUP' ? 'border-primary' : 'border-border'}`}>
                      {deliveryMethod === 'PICKUP' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <Store className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Retrait au restaurant</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 ml-8">Pickup au restaurant - Gratuit</p>
                </div>

                <div
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                    deliveryMethod === 'DELIVERY'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setDeliveryMethod('DELIVERY')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${deliveryMethod === 'DELIVERY' ? 'border-primary' : 'border-border'}`}>
                      {deliveryMethod === 'DELIVERY' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Livraison à domicile</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 ml-8">Livraison par transporteur - Calculée à la confirmation</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informations du client
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Jean Dupont"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="jean@example.com"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address (only for delivery method) */}
            {deliveryMethod === 'DELIVERY' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  Adresse de livraison
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Rue de la Bouteille"
                    className="min-h-[80px] bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville <span className="text-red-500">*</span></Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Paris"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Code postal <span className="text-red-500">*</span></Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="75001"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="France"
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité <span className="text-red-500">*</span></Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={product.maxOrder}
                value={quantity}
                onChange={handleQuantityChange}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Maximum : {product.maxOrder} unités
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                {quantity > 1 ? `Valider ${quantity} produits` : 'Valider la commande'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {step === 'processing' && (
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

        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Commande confirmée !
            </h3>
            <p className="text-muted-foreground mb-6">
              Votre commande a été prise en compte. Vous allez être redirigé vers Stripe pour le paiement.
            </p>
            <Button
              onClick={() => {
                // Redirect to Stripe
                window.location.href = '#';
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