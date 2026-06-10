'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { pickField } from '@/lib/langs';

interface OriginsMapProps {
  content?: Record<string, unknown> | null;
}

interface PointData {
  label?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  title_fr?: string;
  title_en?: string;
  title_de?: string;
  description_fr?: string;
  description_en?: string;
  description_de?: string;
  url?: string;
}

interface HoveredPoint {
  id: string;
  label: string;
  image?: string;
  title?: string;
  description?: string;
  url?: string;
  x: number;
  y: number;
}

export function OriginsMap({ content }: OriginsMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rayMapRef = useRef<Map<string, d3.Selection<SVGLineElement, unknown, null, undefined>>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const { locale, t } = useLanguage();

  const c = content ?? {};
  const p = (key: string) => pickField(c, key, locale);

  // Memoize content values to prevent unnecessary re-renders of the map
  // Use JSON.stringify for deep comparison of points array
  const mapData = useMemo(() => {
    return {
      points: c.points as Array<PointData> | undefined,
      besanconLabel: c.besanconLabel as string | undefined,
      besanconImage: c.besanconImage as string | undefined,
      besanconUrl: c.besanconUrl as string | undefined,
    };
  }, [JSON.stringify(c.points), c.besanconLabel, c.besanconImage, c.besanconUrl]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!hoveredPoint) return;
    
    // Only follow mouse on desktop
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    const xOffset = 16;
    const yOffset = 16;

    const x = e.clientX + xOffset;
    const y = e.clientY + yOffset;

    setTooltipPos({ x, y });
  }, [hoveredPoint]);

  // Close tooltip on scroll or click outside
  useEffect(() => {
    if (hoveredPoint) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Don't close if clicking on a map point or the tooltip itself
        if (!target.closest('[data-origins-map]') && !target.closest('[data-origins-tooltip]')) {
          setHoveredPoint(null);
          // Reset all rays
          rayMapRef.current.forEach(ray => {
            ray.attr('opacity', 0.5).attr('stroke-width', 0.5);
          });
        }
      };

      const handleScroll = () => {
        setHoveredPoint(null);
        // Reset all rays when scrolling
        rayMapRef.current.forEach(ray => {
          ray.attr('opacity', 0.5).attr('stroke-width', 0.5);
        });
      };

      // Small delay to avoid immediate close on open
      const timeoutId = setTimeout(() => {
        window.addEventListener('click', handleClickOutside, true);
        window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
      }, 150);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('click', handleClickOutside, true);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [hoveredPoint]);

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = Math.min(800, width * 0.8);
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Render map
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const isMobile = width < 768;

    // Besançon coordinates
    const besanconLon = 6.0244;
    const besanconLat = 47.2378;

    // Projection centrée sur Besançon
    const projection = d3.geoMercator()
      .center([besanconLon, besanconLat])
      .scale(width * 2.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create radial gradient mask for fade effect (only on desktop for performance)
    const defs = svg.append('defs');

    let maskId = '';
    if (!isMobile) {
      const radialGradient = defs.append('radialGradient')
        .attr('id', 'fade-gradient')
        .attr('cx', '40%')
        .attr('cy', '60%')
        .attr('r', '90%');

      radialGradient.append('stop')
        .attr('offset', '10%')
        .attr('stop-color', 'white')
        .attr('stop-opacity', 1);

      radialGradient.append('stop')
        .attr('offset', '95%')
        .attr('stop-color', 'white')
        .attr('stop-opacity', 0);

      const mask = defs.append('mask')
        .attr('id', 'fade-mask');

      mask.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'url(#fade-gradient)');

      maskId = 'url(#fade-mask)';
    }

    // Group for map elements with optional mask (borders and lines)
    const gMasked = svg.append('g')
      .attr('mask', maskId);

    // Group for text elements without mask (always visible)
    const gText = svg.append('g');

    // Load Europe GeoJSON
    d3.json('/europe.geojson').then((europeData) => {
      if (europeData) {
        // Draw all countries with gold borders
        gMasked.append('g')
          .selectAll('path')
          .data((europeData as GeoJSON.FeatureCollection).features)
          .join('path')
          .attr('d', path as unknown as string)
          .attr('fill', 'none')
          .attr('stroke', 'var(--color-gold)')
          .attr('stroke-width', 1)
          .attr('opacity', 0.8);
      }

      // Besançon coordinates for rays
      const besanconCoords = projection([besanconLon, besanconLat]);

      // Clear and reset ray map
      rayMapRef.current.clear();

      // Add custom points from Keystatic
      const points = mapData.points ?? [];
      points.forEach((point, index) => {
        if (point.latitude && point.longitude && point.label) {
          const coords = projection([point.longitude, point.latitude]);
          if (coords && besanconCoords) {
            const pointId = `point-${index}`;

            // Draw light ray from point to Besançon
            const ray = gMasked.append('line')
              .attr('x1', coords[0])
              .attr('y1', coords[1])
              .attr('x2', besanconCoords[0])
              .attr('y2', besanconCoords[1])
              .attr('stroke', 'var(--color-gold)')
              .attr('stroke-width', 0.5)
              .attr('opacity', 0.5)
              .attr('stroke-dasharray', '3,3')
              .attr('class', `ray-${pointId}`);

            rayMapRef.current.set(pointId, ray);

            // Small outer glow
            gMasked.append('circle')
              .attr('cx', coords[0])
              .attr('cy', coords[1])
              .attr('r', 5)
              .attr('fill', 'var(--color-gold)')
              .attr('opacity', 0.2);

            // Small dot
            gMasked.append('circle')
              .attr('cx', coords[0])
              .attr('cy', coords[1])
              .attr('r', 2.5)
              .attr('fill', 'var(--color-gold)')
              .attr('stroke', 'var(--color-cream)')
              .attr('stroke-width', 1);

            // Label (in text group, not masked)
            gText.append('text')
              .attr('x', coords[0])
              .attr('y', coords[1] - (isMobile ? 6 : 10))
              .attr('text-anchor', 'middle')
              .attr('fill', 'var(--color-light-gold)')
              .attr('font-size', isMobile ? '9px' : '15px')
              .attr('font-weight', '400')
              .attr('opacity', 0.9)
              .text(point.label);

            // Interactive hitbox (larger invisible circle)
            const hitbox = svg.append('circle')
              .attr('cx', coords[0])
              .attr('cy', coords[1])
              .attr('r', 20)
              .attr('fill', 'transparent')
              .attr('cursor', 'pointer')
              .attr('data-origins-map', '')
              .on('mouseenter', function () {
                // Only use mouseenter on desktop
                if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                  ray.attr('opacity', 0.8).attr('stroke-width', 1.5);
                  // Get localized title and description
                  const pointTitle = pickField(point as Record<string, unknown>, 'title', locale);
                  const pointDescription = pickField(point as Record<string, unknown>, 'description', locale);
                  // Only show tooltip if there's content to display
                  if (point.image || pointTitle || pointDescription || point.url) {
                    setHoveredPoint({
                      id: pointId,
                      label: point.label!,
                      image: point.image,
                      title: pointTitle,
                      description: pointDescription,
                      url: point.url,
                      x: coords[0],
                      y: coords[1],
                    });
                  }
                }
              })
              .on('mouseleave', function () {
                // Only use mouseleave on desktop
                if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                  ray.attr('opacity', 0.5).attr('stroke-width', 0.5);
                  setHoveredPoint(null);
                }
              })
              .on('click', function (event) {
                event.stopPropagation();
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

                if (isMobile) {
                  // On mobile: reset all rays first, then highlight current
                  rayMapRef.current.forEach(r => {
                    r.attr('opacity', 0.5).attr('stroke-width', 0.5);
                  });
                  ray.attr('opacity', 0.8).attr('stroke-width', 1.5);

                  const pointTitle = pickField(point as Record<string, unknown>, 'title', locale);
                  const pointDescription = pickField(point as Record<string, unknown>, 'description', locale);
                  const hasContent = !!(point.image || pointTitle || pointDescription || point.url);

                  if (hasContent) {
                    // Position tooltip near the clicked point on mobile
                    const tooltipWidth = 256;
                    const tooltipHeight = 320;
                    const rect = (event.target as SVGElement).getBoundingClientRect();
                    const clickX = rect.left + rect.width / 2;
                    const clickY = rect.top + rect.height / 2;
                    
                    // Position below and to the right of the click, but keep it on screen
                    let x = clickX + 16;
                    let y = clickY + 16;
                    
                    // Adjust if too far right
                    if (x + tooltipWidth > window.innerWidth - 16) {
                      x = window.innerWidth - tooltipWidth - 16;
                    }
                    // Adjust if too far down
                    if (y + tooltipHeight > window.innerHeight - 16) {
                      y = clickY - tooltipHeight - 16;
                    }
                    // Adjust if too far left
                    if (x < 16) {
                      x = 16;
                    }
                    // Adjust if too far up
                    if (y < 16) {
                      y = 16;
                    }
                    
                    setTooltipPos({ x, y });

                    setHoveredPoint({
                      id: pointId,
                      label: point.label!,
                      image: point.image,
                      title: pointTitle,
                      description: pointDescription,
                      url: point.url,
                      x: coords[0],
                      y: coords[1],
                    });
                  } else {
                    // No content: close any existing tooltip
                    setHoveredPoint(null);
                  }
                } else if (point.url) {
                  // On desktop: open link directly
                  window.open(point.url, '_blank', 'noopener,noreferrer');
                }
              });
          }
        }
      });

      // Add Besançon marker (prominent)
      if (besanconCoords) {
        const besanconId = 'besancon-center';

        // Outer glow
        gMasked.append('circle')
          .attr('cx', besanconCoords[0])
          .attr('cy', besanconCoords[1])
          .attr('r', 8)
          .attr('fill', 'var(--color-gold)')
          .attr('opacity', 0.3);

        // Inner dot
        gMasked.append('circle')
          .attr('cx', besanconCoords[0])
          .attr('cy', besanconCoords[1])
          .attr('r', 4)
          .attr('fill', 'var(--color-gold)')
          .attr('stroke', 'var(--color-cream)')
          .attr('stroke-width', 1.5);

        // Label (in text group, not masked)
        const besanconLabel = mapData.besanconLabel || 'Besançon';
        gText.append('text')
          .attr('x', besanconCoords[0])
          .attr('y', besanconCoords[1] - (isMobile ? 10 : 15))
          .attr('text-anchor', 'middle')
          .attr('fill', 'var(--color-gold)')
          .attr('font-size', isMobile ? '11px' : '18px')
          .attr('font-weight', '500')
          .text(besanconLabel);

        // Interactive hitbox for Besançon
        const besanconUrl = mapData.besanconUrl;
        svg.append('circle')
          .attr('cx', besanconCoords[0])
          .attr('cy', besanconCoords[1])
          .attr('r', 25)
          .attr('fill', 'transparent')
          .attr('cursor', 'pointer')
          .attr('data-origins-map', '')
          .on('mouseenter', function () {
            // Only use mouseenter on desktop
            if (typeof window !== 'undefined' && window.innerWidth >= 768) {
              // Highlight all rays
              rayMapRef.current.forEach(ray => {
                ray.attr('opacity', 0.8).attr('stroke-width', 1.5);
              });
              // Get localized title and description for Besançon
              const besanconTitle = p('besanconTitle');
              const besanconDescription = p('besanconDescription');
              // Only show tooltip if there's content to display
              const hasContent = mapData.besanconImage || besanconTitle || besanconDescription || besanconUrl;
              if (hasContent) {
                setHoveredPoint({
                  id: besanconId,
                  label: besanconLabel,
                  image: mapData.besanconImage,
                  title: besanconTitle,
                  description: besanconDescription,
                  url: besanconUrl,
                  x: besanconCoords[0],
                  y: besanconCoords[1],
                });
              }
            }
          })
          .on('mouseleave', function () {
            // Only use mouseleave on desktop
            if (typeof window !== 'undefined' && window.innerWidth >= 768) {
              // Reset all rays
              rayMapRef.current.forEach(ray => {
                ray.attr('opacity', 0.5).attr('stroke-width', 0.5);
              });
              setHoveredPoint(null);
            }
          })
          .on('click', function (event) {
            event.stopPropagation();
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

            if (isMobile) {
              // On mobile: reset all rays first, then highlight all
              rayMapRef.current.forEach(ray => {
                ray.attr('opacity', 0.5).attr('stroke-width', 0.5);
              });
              rayMapRef.current.forEach(ray => {
                ray.attr('opacity', 0.8).attr('stroke-width', 1.5);
              });

              const besanconTitle = p('besanconTitle');
              const besanconDescription = p('besanconDescription');
              const hasContent = !!(mapData.besanconImage || besanconTitle || besanconDescription || besanconUrl);

              if (hasContent) {
                // Position tooltip near the clicked point on mobile
                const tooltipWidth = 256;
                const tooltipHeight = 320;
                const rect = (event.target as SVGElement).getBoundingClientRect();
                const clickX = rect.left + rect.width / 2;
                const clickY = rect.top + rect.height / 2;
                
                // Position below and to the right of the click, but keep it on screen
                let x = clickX + 16;
                let y = clickY + 16;
                
                // Adjust if too far right
                if (x + tooltipWidth > window.innerWidth - 16) {
                  x = window.innerWidth - tooltipWidth - 16;
                }
                // Adjust if too far down
                if (y + tooltipHeight > window.innerHeight - 16) {
                  y = clickY - tooltipHeight - 16;
                }
                // Adjust if too far left
                if (x < 16) {
                  x = 16;
                }
                // Adjust if too far up
                if (y < 16) {
                  y = 16;
                }
                
                setTooltipPos({ x, y });

                setHoveredPoint({
                  id: besanconId,
                  label: besanconLabel,
                  image: mapData.besanconImage,
                  title: besanconTitle,
                  description: besanconDescription,
                  url: besanconUrl,
                  x: besanconCoords[0],
                  y: besanconCoords[1],
                });
              } else {
                // No content: close any existing tooltip
                setHoveredPoint(null);
              }
            } else if (besanconUrl) {
              // On desktop: open link directly
              window.open(besanconUrl, '_blank', 'noopener,noreferrer');
            }
          });
      }
    }).catch(err => {
      console.error('Error loading GeoJSON:', err);
    });
  }, [dimensions, mapData, locale]);

  return (
    <section id="origins" className="bg-card py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {p('title') || 'Nos Origines'}
          </h2>
          <p className="text-base sm:text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
            {p('description') || 'Située au cœur de la Franche-Comté, notre cuisine puise son inspiration dans les richesses du terroir local et des régions voisines.'}
          </p>
        </div>

        {/* Map Container */}
        <div
          ref={containerRef}
          className="w-full"
          onMouseMove={handleMouseMove}
          style={{
            transform: 'translateZ(0)',
            willChange: 'auto',
          }}
        >
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="mx-auto"
            style={{
              maxWidth: '100%',
              willChange: 'auto',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* Legend or additional info */}
        <div className="mt-12 text-center">
          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {p('subtitle') || 'De la Suisse à la Bourgogne, en passant par le Jura, nous sélectionnons les meilleurs produits pour vous offrir une expérience gastronomique unique.'}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredPoint && typeof document !== 'undefined' && createPortal(
        <div
          data-origins-tooltip
          className={hoveredPoint.url ? "pointer-events-auto fixed z-[9999] w-64 overflow-hidden rounded-lg border border-primary/30 bg-card shadow-2xl cursor-pointer" : "pointer-events-none fixed z-[9999] w-64 overflow-hidden rounded-lg border border-primary/30 bg-card shadow-2xl"}
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          onClick={(e) => {
            if (hoveredPoint.url) {
              e.stopPropagation();
              window.open(hoveredPoint.url, '_blank', 'noopener,noreferrer');
              setHoveredPoint(null);
            }
          }}
        >
          {hoveredPoint.image && (
            <img
              src={hoveredPoint.image}
              alt={hoveredPoint.title || hoveredPoint.label}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            {hoveredPoint.title && (
              <h4
                className="text-lg text-primary mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {hoveredPoint.title}
              </h4>
            )}
            {hoveredPoint.description && (
              <p className="text-sm text-foreground mb-2">
                {hoveredPoint.description}
              </p>
            )}
            {hoveredPoint.url && (
              <p className="text-xs text-primary/70 uppercase tracking-wide transition-colors block mt-3 pt-3 border-t border-primary/20 -mx-4 px-4 -mb-4 pb-4">
                {t.origins.clickToLearnMore}
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
