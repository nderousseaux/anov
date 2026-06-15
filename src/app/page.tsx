import { createReader } from '@keystatic/core/reader';
import { Hero } from '@/components/Hero';
import { History } from '@/components/History';
import { Gallery } from '@/components/Gallery';
import { Contact } from '@/components/Contact';
import config from '../../keystatic.config';

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const [heroContent, histoireContent, originesContent, galerieContent, contactContent] = await Promise.all([
    reader.singletons.hero.read(),
    reader.singletons.histoire.read(),
    reader.singletons.origines.read(),
    reader.singletons.galerie.read(),
    reader.singletons.contact.read(),
  ]);

  const galerieData = galerieContent ? {
    photos: galerieContent.photos?.map(p => ({
      image: p.image,
      caption_fr: (p as Record<string, unknown>).caption_fr as string ?? undefined,
      caption_en: (p as Record<string, unknown>).caption_en as string ?? undefined,
      caption_de: (p as Record<string, unknown>).caption_de as string ?? undefined,
    })) ?? undefined,
  } : undefined;

  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Hero content={heroContent as any} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <History content={histoireContent as any} originesContent={originesContent as any} />
      <Gallery images={galerieData?.photos} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Contact content={contactContent as any} />
    </div>
  );
}
