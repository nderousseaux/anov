'use client';

import { type ReactNode, useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { pickField } from '@/lib/langs';

type Dish = {
  name: string;
  description: string;
  price: string;
  outline: string;
  allergens: string;
  image: string | null;
};

type Category = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  image: string | null;
  dishes: readonly Dish[];
};

type Tab = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  categories: readonly Category[];
  image: string | null;
  infoBlockPrice: string;
};

type MenuData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  heroImage: string;
  tabs: readonly Tab[];
};

const DishCard = ({ name, description, price, outline, allergens, image }: Dish & { allergens_label?: string }) => {
  const { t } = useLanguage();
  const hasPopover = !!(allergens || image);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const xOffset = 16;
    const yOffset = 16;
    const tooltipWidth = 256; // w-64
    const tooltipHeight = 240; // approx h-40 + padding + allergens section

    let x = e.clientX + xOffset;
    let y = e.clientY + yOffset;

    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        x = e.clientX - tooltipWidth / 2;
        y = e.clientY - tooltipHeight / 2;
        x = Math.max(16, Math.min(x, window.innerWidth - tooltipWidth - 16));
        y = Math.max(16, Math.min(y, window.innerHeight - tooltipHeight - 16));
      } else {
        setPos({ x, y });
        return;
      }
    }

    setPos({ x, y });
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (visible) {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dish-card]')) {
        setVisible(false);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const handleScroll = () => setVisible(false);
      
      window.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
      return () => {
        window.removeEventListener('click', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [visible, handleClickOutside]);

  return (
    <div
      data-dish-card
      className="bg-secondary/50 backdrop-blur-sm rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300 overflow-hidden cursor-default"
      onMouseMove={hasPopover ? handleMouseMove : undefined}
      onMouseEnter={hasPopover ? () => setVisible(true) : undefined}
      onMouseLeave={hasPopover ? () => setVisible(false) : undefined}
    >
      <div className="p-6">
        {outline && (
          <p className="text-xs text-primary/70 uppercase tracking-wide mb-2">{outline}</p>
        )}
        <div className="flex justify-between items-start mb-3 gap-4">
          <h3 className="text-lg text-primary" style={{ fontFamily: 'var(--font-display)' }}>{name}</h3>
          {price && <span className="text-base text-primary/90 shrink-0">{price}</span>}
        </div>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>

      {hasPopover && visible && typeof document !== 'undefined' && createPortal(
        <div
          className="pointer-events-none fixed z-[9999] w-64 overflow-hidden rounded-lg border border-primary/30 bg-card shadow-2xl"
          style={{ left: pos.x + 16, top: pos.y + 16 }}
        >
          {image && (
            <img src={image} alt={name} className="w-full h-40 object-cover" />
          )}
          {allergens && (
            <div className="p-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wide mb-1">{t.menu.allergens}</p>
              <p className="text-sm text-foreground">{allergens}</p>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-2xl text-primary mb-5 pb-2 border-b border-primary/20" style={{ fontFamily: 'var(--font-display)' }}>
    {children}
  </h3>
);

const InfoBlock = ({ title, text, outline, price }: { title: string; text: string; outline: string; price: string }) => {
  if (!title && !text && !outline && !price) return null;
  return (
    <div className="bg-secondary p-8 rounded-lg border border-primary/30 text-center">
      {title && (
        <h3 className="text-2xl text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
      )}
      {text && <p className="text-foreground mb-2">{text}</p>}
      {outline && <p className="text-muted-foreground mb-6 text-sm">{outline}</p>}
      {price && (
        <span className="text-3xl text-primary/90" style={{ fontFamily: 'var(--font-display)' }}>{price}</span>
      )}
    </div>
  );
};

export function MenuContent({ content }: { content: MenuData | null }) {
  const { locale } = useLanguage();
  const c = content ?? ({} as MenuData);
  const tabs = c.tabs ?? [];
  const defaultTab = (tabs[0] ? pickField(tabs[0], 'name', locale) : '') || '';

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <div className="relative h-[36vh] sm:h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={c.heroImage ?? ''}
            alt="Carte gastronomique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-card" />
        </div>
        <div className="relative z-10 text-center sm:px-4 sm:pt-0 pt-16">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {pickField(c, 'heroTitle', locale) || 'Nos Cartes'}
          </h1>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {pickField(c, 'heroSubtitle', locale)}
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <section className="py-16 md:py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 mb-10 bg-secondary border border-primary/30 p-1">
              {tabs.map((tab) => {
                const tabName = pickField(tab, 'name', locale) || tab.name_fr || '';
                return (
                  <TabsTrigger
                    key={tab.name_fr || tabName}
                    value={tabName}
                    className="flex-1 basis-[calc(50%-0.25rem)] sm:basis-[calc(20%-0.25rem)] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
                  >
                    {tabName}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabs.map((tab) => {
              const tabName = pickField(tab, 'name', locale) || tab.name_fr || '';
              const tabOutline = pickField(tab, 'outline', locale);
              return (
                <TabsContent key={tab.name_fr || tabName} value={tabName}>
                  {tabOutline && (
                    <p className="text-muted-foreground text-sm text-center mb-10">{tabOutline}</p>
                  )}

                  {(tab.categories ?? []).map((category: Category, ci: number) => {
                    const categoryTitle = pickField(category, 'title', locale);
                    return (
                      <div key={ci} className="mb-14">
                        {categoryTitle && <SectionTitle>{categoryTitle}</SectionTitle>}
                        <div className={category.image ? 'relative' : undefined}>
                          <div className={category.image ? 'relative z-10 flex flex-col gap-4 sm:pr-[28%]' : 'flex flex-col gap-4'}>
                            {(category.dishes ?? []).map((dish: Dish, di: number) => (
                              <DishCard key={di} {...dish} />
                            ))}
                          </div>
                          {category.image && (
                            <div className="absolute inset-[-2rem] right-0 pointer-events-none z-0 translate-x-[10%]">
                              <img
                                src={category.image}
                                alt={categoryTitle}
                                className="absolute right-0 top-0 h-full w-[40%] sm:w-[42%] object-cover opacity-80 brightness-150"
                              />
                              <div className="absolute right-0 top-0 h-full w-[40%] sm:w-[42%] bg-gradient-to-r from-card via-card/30 to-card" />
                              <div className="absolute right-0 top-0 h-full w-[40%] sm:w-[42%] bg-gradient-to-b from-card via-transparent to-card" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {tab.image && (
                    <div className="relative group overflow-hidden rounded-lg border-2 border-primary/30 hover:border-primary transition-all duration-300 mb-8">
                      <img
                        src={tab.image}
                        alt={tabName}
                        className="w-full h-[360px] object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <InfoBlock
                    title={pickField(tab, 'infoBlockTitle', locale) ?? ''}
                    text={pickField(tab, 'infoBlockText', locale) ?? ''}
                    outline={pickField(tab, 'infoBlockOutline', locale) ?? ''}
                    price={tab.infoBlockPrice ?? ''}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>
    </div>
  );
}
