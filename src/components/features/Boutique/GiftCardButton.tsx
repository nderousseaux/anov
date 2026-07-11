'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function GiftCardButton() {
  return (
    <Button
      size="lg"
      className="px-8 py-6 text-lg gap-2"
      onClick={() => window.location.href = '/cheques-cadeaux'}
    >
      Acheter un chèque cadeau
      <ArrowRight className="w-5 h-5" />
    </Button>
  );
}