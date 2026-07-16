import { createReader } from "@keystatic/core/reader";
import { Hero } from "@/components/Hero";
import { History } from "@/components/features/History";
import { Gallery } from "@/components/features/Gallery";
import { Contact } from "@/components/features/Contact";
import config from "@/keystatic.config";

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const [heroContent, histoireContent, originesContent, galerieContent, contactContent] =
    await Promise.all([
      reader.singletons.hero.read(),
      reader.singletons.histoire.read(),
      reader.singletons.origines.read(),
      reader.singletons.galerie.read(),
      reader.singletons.contact.read(),
    ]);

  return (
    <div>
      <Hero content={heroContent as Record<string, unknown> | null} />
      <History
        content={histoireContent as Record<string, unknown> | null}
        originesContent={originesContent as Record<string, unknown> | null}
      />
      <Gallery
        images={galerieContent?.photos as Array<{
          image: string | null;
          caption_fr?: string;
          caption_en?: string;
          caption_de?: string;
          caption?: string;
        }> | null}
      />
      <Contact content={contactContent as Record<string, unknown> | null} />
    </div>
  );
}
