'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Loader2, Filter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  title_fr: string;
  title_en: string;
  title_de: string;
  description_fr?: string;
  description_en?: string;
  description_de?: string;
  price: number;
  maxOrder: number;
  isDeliverable: boolean;
  image: string;
  alt_fr?: string;
  alt_en?: string;
  alt_de?: string;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const { locale, t } = useLanguage();

  // Simulate loading
  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    let result = products;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title_fr.toLowerCase().includes(term) ||
          p.title_en.toLowerCase().includes(term) ||
          p.title_de.toLowerCase().includes(term)
      );
    }

    // Filter by category (isDeliverable)
    if (category === 'deliverable') {
      result = result.filter((p) => p.isDeliverable);
    } else if (category === 'pickup') {
      result = result.filter((p) => !p.isDeliverable);
    }

    setFilteredProducts(result);
  }, [searchTerm, category, products]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.boutique.searchPlaceholder || 'Rechercher un produit...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === 'all' ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {t.boutique.all || 'Tous'}
          </button>
          <button
            onClick={() => setCategory('deliverable')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === 'deliverable' ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {t.boutique.deliverable || 'Livrable'}
          </button>
          <button
            onClick={() => setCategory('pickup')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === 'pickup' ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {t.boutique.pickup || 'Pickup'}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            {t.boutique.noProducts || 'Aucun produit trouvé.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground">
        {filteredProducts.length} {t.boutique.productsCount || 'produit'}{filteredProducts.length > 1 ? (t.boutique.productsPlural || 's') : ''} {t.boutique.shown || 'affiché'}{filteredProducts.length > 1 ? (t.boutique.shownPlural || 's') : ''}
      </div>
    </div>
  );
}