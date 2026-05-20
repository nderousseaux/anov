import type { Metadata } from 'next';
import '@/styles/index.css';
import ClientLayout from './ClientLayout';
import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';

export const metadata: Metadata = {
  title: "l'Anøv",
  icons: { icon: '/favicon.ico' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const reader = createReader(process.cwd(), config);
  const footerContent = await reader.singletons.footer.read();

  return (
    <html lang="fr">
      <body>
        <ClientLayout footerContent={footerContent ?? undefined}>{children}</ClientLayout>
      </body>
    </html>
  );
}
