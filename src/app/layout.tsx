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

  // Convertir le contenu en type mutable pour le Footer component
  const footerData = footerContent ? {
    description: footerContent.description ?? undefined,
    facebookUrl: footerContent.facebookUrl ?? undefined,
    instagramUrl: footerContent.instagramUrl ?? undefined,
    youtubeUrl: footerContent.youtubeUrl ?? undefined,
    reviews: footerContent.reviews?.map(r => ({
      name: r.name,
      rating: r.rating,
      reviewCount: r.reviewCount
    })) ?? undefined,
    paymentMethods: footerContent.paymentMethods ?? undefined,
  } : undefined;

  return (
    <html lang="fr">
      <body>
        <ClientLayout footerContent={footerData ?? undefined}>{children}</ClientLayout>
      </body>
    </html>
  );
}
