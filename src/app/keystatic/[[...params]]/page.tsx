'use client';

import { makePage } from '@keystatic/next/ui/app';
import config from '../../../../keystatic.config';

type KeystaticRouteProps = {
  params: Promise<{ params?: string[] }>;
};

const KeystaticPage = makePage(config);

export default function Page(props: KeystaticRouteProps) {
  return <KeystaticPage {...props} />;
}
