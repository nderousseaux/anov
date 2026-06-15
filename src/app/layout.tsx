import type { Metadata } from 'next';
import '@/styles/index.css';
import ClientLayout from './ClientLayout';
import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';

export const metadata: Metadata = {
  title: "l'Anøv",
  icons: { icon: '/favicon.ico' },
  alternates: {
    languages: {
      'fr': '/?lang=fr',
      'en': '/?lang=en',
      'de': '/?lang=de',
      'x-default': '/',
    },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const reader = createReader(process.cwd(), config);
  const footerContent = await reader.singletons.footer.read();

  return (
    <html lang="fr">
      <body>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ClientLayout footerContent={footerContent as any}>{children}</ClientLayout>
      </body>
    </html>
  );
}
