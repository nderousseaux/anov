import { createReader } from '@keystatic/core/reader';
import config from '../../../keystatic.config';
import { MenuContent } from '@/components/MenuContent';

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const menuContent = await reader.singletons.menu.read();
  return <MenuContent content={menuContent as Parameters<typeof MenuContent>[0]['content']} />;
}
