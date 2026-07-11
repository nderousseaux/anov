'use client';

import { makePage } from '@keystatic/next/ui/app';
import config from '@/keystatic.config';

const KeystaticPage = makePage(config);

// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement

export default function Page(props: any) {
  return <KeystaticPage {...props} />;
}
