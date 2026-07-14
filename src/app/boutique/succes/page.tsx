import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';
import { BoutiqueSectionClient } from '@/components/features/Boutique/BoutiqueSectionClient';

export const dynamic = 'force-dynamic';

export default async function BoutiqueSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  const reader = createReader(process.cwd(), config);
  const content = await reader.singletons.boutique.read();

  return (
    <div className="min-h-screen bg-background pt-20">
      <BoutiqueSectionClient
        content={content ?? { image: undefined, products: [] }}
        products={[]}
        chequesCadeauxContent={null}
        isSuccess={true}
        sessionId={session_id || undefined}
      />
    </div>
  );
}