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
      <Hero content={heroContent as Record<string, unknown> | null} />
      <History content={histoireContent as Record<string, unknown> | null} originesContent={originesContent as Record<string, unknown> | null} />
      <Contact content={contactContent as Record<string, unknown> | null} />
    </div>
  );
}
