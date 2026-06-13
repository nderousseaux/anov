'use client';

import { GiftCardStatus } from '@prisma/client';
import { RefreshCw, X } from 'lucide-react';

interface GiftCardFiltersProps {
  filters: {
    status: string;
    code: string;
    email: string;
    page: number;
  };
  setFilters: (filters: {
    status: string;
    code: string;
    email: string;
    page: number;
  }) => void;
}

export function GiftCardFilters({ filters, setFilters }: GiftCardFiltersProps) {
  const handleChange = (field: 'status' | 'code' | 'email', value: string) => {
    setFilters({ ...filters, [field]: value, page: 1 });
  };

  const handleReset = () => {
    setFilters({ status: '', code: '', email: '', page: 1 });
  };

  return (
    <div className="bg-card/30 border border-border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Statut
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold text-foreground appearance-none"
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING_PAYMENT">En attente</option>
              <option value="ACTIVE">Actif</option>
              <option value="USED">Utilisé</option>
              <option value="EXPIRED">Expiré</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Code Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Code
          </label>
          <input
            type="text"
            value={filters.code}
            onChange={(e) => handleChange('code', e.target.value)}
            placeholder="Rechercher par code..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold text-foreground placeholder-muted-foreground"
          />
        </div>

        {/* Email Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email destinataire
          </label>
          <input
            type="text"
            value={filters.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Rechercher par email..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold text-foreground placeholder-muted-foreground"
          />
        </div>

        {/* Reset Button - Only show when filters are active */}
        {filters.status || filters.code || filters.email ? (
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors text-foreground text-sm font-medium"
            >
              <RefreshCw className="w-4 h-6" />
              <span>Réinitialiser</span>
            </button>
          </div>
        ) : null}

      </div>
    </div>
  );
}
