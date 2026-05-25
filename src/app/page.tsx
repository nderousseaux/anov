import { createReader } from '@keystatic/core/reader';
import { Hero } from '@/components/Hero';
import { History } from '@/components/History';
import { Gallery } from '@/components/Gallery';
import { Contact } from '@/components/Contact';
import config from '../../keystatic.config';

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const [heroContent, histoireContent, galerieContent, contactContent] = await Promise.all([
    reader.singletons.hero.read(),
    reader.singletons.histoire.read(),
    reader.singletons.galerie.read(),
    reader.singletons.contact.read(),
  ]);

  return (
    <div>
      <Hero subtitle={heroContent?.subtitle ?? undefined} image={heroContent?.image ?? undefined} />
      <History content={histoireContent ?? undefined} />
      <Gallery images={galerieContent?.photos ?? undefined} />
      <Contact content={contactContent ?? undefined} />
    </div>
  );
}
