import { redirect } from 'next/navigation';

export default async function CmsPage({
  params,
}: {
  params: Promise<{ params?: string[] }>;
}) {
  const { params: segments } = await params;
  if (!segments || segments.length === 0) {
    redirect('/keystatic');
  }
  redirect(`/keystatic/${segments.join('/')}`);
}
