import React, { useState, useEffect } from 'react';

export function Gallery() {
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1768162125985-1cdc0e091b62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGNvb2tpbmclMjBjaGVmJTIwYWN0aW9ufGVufDF8fHx8MTc3MTUxNDYwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Notre cuisine en action"
    },
    {
      url: "https://images.unsplash.com/photo-1760594308930-06b631dd916b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcGxhdGUlMjBwcmVzZW50YXRpb24lMjBlbGVnYW50fGVufDF8fHx8MTc3MTUxNDYwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "L'art du dressage"
    },
    {
      url: "https://images.unsplash.com/photo-1758612798971-a8adb6cba7eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBhdG1vc3BoZXJlJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzcxNTE0NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Une atmosphère unique"
    },
    {
      url: "https://images.unsplash.com/photo-1640668048966-dc93ac9b95c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwaGFuZHMlMjBwcmVwYXJpbmclMjBmb29kJTIwYXJ0aXNhbnxlbnwxfHx8fDE3NzE1MTQ2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Le geste précis"
    },
    {
      url: "https://images.unsplash.com/photo-1671713682264-ecf27750b276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwYmFyJTIwZHJpbmtzJTIwY29ja3RhaWxzfGVufDF8fHx8MTc3MTUxNDYwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Notre bar à cocktails"
    },
    {
      url: "https://images.unsplash.com/photo-1762631383402-43a5f67d62af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjBnb3VybWV0JTIwc3R5bGluZ3xlbnwxfHx8fDE3NzE1MTQ2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Création culinaire"
    },
    {
      url: "https://images.unsplash.com/photo-1765448856945-481569592cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmUlMjBraXRjaGVuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTU5NDU3NXww&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "La maîtrise du feu"
    },
    {
      url: "https://images.unsplash.com/photo-1657288089316-c0350003ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZhcm0lMjBmcmVzaCUyMHByb2R1Y2V8ZW58MXx8fHwxNzcxNTA3MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Produits frais du marché"
    },
    {
      url: "https://images.unsplash.com/photo-1762113246607-4299ec3f3214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGVhbSUyMHN0YWZmJTIwc2VydmljZXxlbnwxfHx8fDE3NzE1OTQ1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Notre équipe passionnée"
    },
  ];

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    if (selectedImage !== null) {
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.documentElement.classList.remove('overflow-hidden');
    }
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-28 md:py-32 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <h3
            className="text-4xl sm:text-5xl md:text-6xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Galerie
          </h3>
          <p
            className="text-base sm:text-lg text-muted-foreground"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Découvrez l'univers de l’Anøv en images
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-primary/30 hover:border-primary transition-all duration-300"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p
                  className="text-foreground text-base"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-primary hover:text-primary/90 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex items-center justify-center gap-6 max-w-6xl w-full">
            {/* Previous Button */}
            <button
              className="text-primary hover:text-primary/90 transition-colors p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev! - 1));
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="flex flex-col items-center gap-4 flex-1">
              <img
                src={galleryImages[selectedImage].url}
                alt={galleryImages[selectedImage].caption}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
              <p
                className="text-center text-foreground text-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {galleryImages[selectedImage].caption}
              </p>
              <p
                className="text-center text-muted-foreground text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {selectedImage + 1} / {galleryImages.length}
              </p>
            </div>

            {/* Next Button */}
            <button
              className="text-primary hover:text-primary/90 transition-colors p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev! + 1));
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
