import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';
import { LegalDocumentRenderer } from '@/components/shared/LegalDocumentRenderer';
import { LegalLanguageNotice } from '@/components/shared/LegalLanguageNotice';

export default async function MentionsLegalesPage() {
  const reader = createReader(process.cwd(), config);
  const content = await reader.singletons.mentionsLegales.read();
  const document = await content?.content();

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <LegalLanguageNotice />
        <h1
          className="text-3xl md:text-4xl text-primary mb-10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {content?.title ?? 'Mentions légales'}
        </h1>
        <div className="pb-16">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {document && <LegalDocumentRenderer document={document as any} />}
        </div>
      </div>
    </div>
  );
}
