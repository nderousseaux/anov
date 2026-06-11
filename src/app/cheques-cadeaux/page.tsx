import { createReader } from '@keystatic/core/reader';
import config from '../../../keystatic.config';
import { ChequesCadeauxContent } from '@/components/ChequesCadeauxContent';

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const boutiqueContent = await reader.singletons.boutique.read();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ChequesCadeauxContent content={boutiqueContent as any} />;
}
