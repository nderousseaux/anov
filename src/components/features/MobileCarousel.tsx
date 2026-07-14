'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';


type PropType = {
  images: Array<{ url: string; caption: string }>;
};

export function MobileCarousel({ images }: PropType) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Gestion de l'autoplay
  useEffect(() => {
    if (!emblaApi) return;

    // Mettre à jour l'index sélectionné quand l'utilisateur scroll manuellement
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    setSelectedIndex(emblaApi.selectedScrollSnap());

    const delay = 3500;

    const autoplay = () => {
      if (!isPlayingRef.current) return;

      const intervalId = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, delay);

      autoPlayIntervalRef.current = intervalId;
    };

    autoplay();

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Arrêter l'autoplay quand l'utilisateur interagit
  const handleInteraction = useCallback(() => {
    isPlayingRef.current = false;
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  }, []);

  // Redémarrer l'autoplay après une pause
  const handleInteractionEnd = useCallback(() => {
    setTimeout(() => {
      isPlayingRef.current = true;
      // Recréer un intervalle si l'autoplay doit reprendre
      if (!autoPlayIntervalRef.current && emblaApi) {
        const delay = 3500;
        const intervalId = setInterval(() => {
          if (emblaApi.canScrollNext()) {
            emblaApi.scrollNext();
          } else {
            emblaApi.scrollTo(0);
          }
        }, delay);
        autoPlayIntervalRef.current = intervalId;
      }
    }, 200);
  }, [emblaApi]);

  return (
    <div
      className="relative"
      onTouchStart={handleInteraction}
      onTouchMove={handleInteraction}
      onTouchEnd={handleInteractionEnd}
      onMouseEnter={handleInteraction}
      onMouseLeave={handleInteractionEnd}
    >
      <div className="relative overflow-hidden rounded-lg border-2 border-primary/30" ref={emblaRef}>
        <div className="embla__container flex" ref={rootRef}>
          {images.map((image, index) => (
            <div className="embla__slide flex-shrink-0 w-full" key={index}>
              <div className="relative h-80">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 pt-12 pb-2 px-2 bg-gradient-to-t from-background via-background/60 to-transparent">
                  <p className="text-foreground text-sm">{image.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points de navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${selectedIndex === i ? 'bg-primary w-4' : 'bg-primary/30 w-1.5'
              }`}
            onClick={() => {
              if (emblaApi) {
                emblaApi.scrollTo(i);
                isPlayingRef.current = false;
                setTimeout(() => { isPlayingRef.current = true; }, 200);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
