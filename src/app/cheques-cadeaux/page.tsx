import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';
import { ChequesCadeauxContent } from '@/components/shared/ChequesCadeauxContent';

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const chequesCadeauxContent = await reader.singletons.chequesCadeaux.read();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ChequesCadeauxContent content={chequesCadeauxContent as any} />;
}
