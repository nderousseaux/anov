import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';
import { ChequesCadeauxContent } from '@/components/shared/ChequesCadeauxContent';

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const chequesCadeauxContent = await reader.singletons.chequesCadeaux.read();
  return <ChequesCadeauxContent content={chequesCadeauxContent} />;
}
