import type { Metadata } from 'next';
import '@/styles/index.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: "l'Anøv",
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
