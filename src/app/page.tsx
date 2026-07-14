import { createReader } from "@keystatic/core/reader";
import { Hero } from "@/components/Hero";
import { History } from "@/components/features/History";
import { Contact } from "@/components/features/Contact";
import config from "@/keystatic.config";

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const [heroContent, histoireContent, originesContent, contactContent] =
    await Promise.all([
      reader.singletons.hero.read(),
      reader.singletons.histoire.read(),
      reader.singletons.origines.read(),
      reader.singletons.contact.read(),
    ]);

  return (
    <div>
      <Hero content={heroContent as Record<string, unknown> | null} />
      <History
        content={histoireContent as Record<string, unknown> | null}
        originesContent={originesContent as Record<string, unknown> | null}
      />
      <Contact content={contactContent as Record<string, unknown> | null} />
    </div>
  );
}
