import { createReader } from '@keystatic/core/reader';
import config from '../../../keystatic.config';
import { BoutiqueContent } from '@/components/BoutiqueContent';

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const boutiqueContent = await reader.singletons.boutique.read();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BoutiqueContent content={boutiqueContent as any} />;
}
